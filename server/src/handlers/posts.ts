import { APIGatewayProxyEvent } from "aws-lambda";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../config/database";
import { postSchema } from "../utils/validation";
import { successResponse, errorResponse } from "../utils/response";
import { Post } from "../types/post";
import { verifyToken } from "../utils/auth";
import { ApiResponse } from "../types/api";
import { parseBody } from "../utils/parseBody";

const COLLECTION_NAME = "posts" as const;

interface AuthContext {
  userId: string;
  role: string;
  email: string;
  name: string;
}

function getAuthHeader(event: APIGatewayProxyEvent): string | null {
  const authHeader = event.headers.Authorization || event.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

export async function createPostHandler(
  event: APIGatewayProxyEvent
): Promise<ApiResponse> {
  try {
    const token = getAuthHeader(event);
    if (!token) {
      return errorResponse("Authentication required", 401);
    }

    const decoded = verifyToken(token) as AuthContext;
    if (decoded.role !== "author") {
      return errorResponse("Only authors can create posts", 403);
    }

    if (!event.body) {
      return errorResponse("Request body is required", 400);
    }

    const input = parseBody(event);
    const validationResult = postSchema.safeParse(input);

    if (!validationResult.success) {
      return errorResponse(
        validationResult.error.errors[0]?.message || "Invalid input",
        400
      );
    }

    const { db } = await connectToDatabase();
    const postsCollection = db.collection<Post>(COLLECTION_NAME);

    const post: Post = {
      title: input.title,
      content: input.content,
      authorId: decoded.userId,
      authorName: decoded.name,
      published: input.published || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await postsCollection.insertOne(post);

    return successResponse(
      {
        _id: result.insertedId.toString(),
        ...post,
      },
      201
    );
  } catch (error) {
    console.error("Create post error:", error);
    return errorResponse("Internal server error", 500);
  }
}

export async function getPostsHandler(
  event: APIGatewayProxyEvent
): Promise<ApiResponse> {
  try {
    const { db } = await connectToDatabase();
    const postsCollection = db.collection<Post>(COLLECTION_NAME);

    const token = getAuthHeader(event);
    const decoded = token ? (verifyToken(token) as AuthContext) : null;

    let query: Record<string, unknown> = { published: true };

    // If user is authenticated and is an author, show their unpublished posts too
    if (decoded && decoded.role === "author") {
      query = {
        $or: [
          { published: true },
          { authorId: decoded.userId, published: false },
        ],
      };
    }

    const page = parseInt(event.queryStringParameters?.page || "1");
    const limit = parseInt(event.queryStringParameters?.limit || "10");
    const skip = (page - 1) * limit;

    const posts = await postsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await postsCollection.countDocuments(query);

    return successResponse({
      posts: posts.map((post) => ({
        ...post,
        _id: post._id?.toString(),
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    return errorResponse("Internal server error", 500);
  }
}

export async function getPostHandler(
  event: APIGatewayProxyEvent
): Promise<ApiResponse> {
  try {
    const { id } = event.pathParameters || {};
    if (!id) {
      return errorResponse("Post ID is required", 400);
    }

    const { db } = await connectToDatabase();
    const postsCollection = db.collection<Post>(COLLECTION_NAME);

    const token = getAuthHeader(event);
    const decoded = token ? (verifyToken(token) as AuthContext) : null;

    const post = await postsCollection.findOne({ _id: new ObjectId(id) });

    if (!post) {
      return errorResponse("Post not found", 404);
    }

    // check permissions
    if (!post.published && (!decoded || post.authorId !== decoded.userId)) {
      return errorResponse("Post not found", 404);
    }

    return successResponse({
      ...post,
      _id: post._id?.toString(),
    });
  } catch (error) {
    console.error("Get post error:", error);
    return errorResponse("Internal server error", 500);
  }
}

export async function updatePostHandler(
  event: APIGatewayProxyEvent
): Promise<ApiResponse> {
  try {
    const token = getAuthHeader(event);
    if (!token) {
      return errorResponse("Authentication required", 401);
    }

    const decoded = verifyToken(token) as AuthContext;
    if (decoded.role !== "author") {
      return errorResponse("Only authors can update posts", 403);
    }

    const { id } = event.pathParameters || {};
    if (!id) {
      return errorResponse("Post ID is required", 400);
    }

    if (!event.body) {
      return errorResponse("Request body is required", 400);
    }

    const input = parseBody(event);

    // Partial validation for updates
    const updateSchema = postSchema.partial();
    const validationResult = updateSchema.safeParse(input);

    if (!validationResult.success) {
      return errorResponse(
        validationResult.error.errors[0]?.message || "Invalid input",
        400
      );
    }

    const { db } = await connectToDatabase();
    const postsCollection = db.collection<Post>(COLLECTION_NAME);

    // Check if post exists and belongs to user
    const existingPost = await postsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!existingPost) {
      return errorResponse("Post not found", 404);
    }

    if (existingPost.authorId !== decoded.userId) {
      return errorResponse("You can only update your own posts", 403);
    }

    const updateData = {
      ...input,
      updatedAt: new Date(),
    };

    const result = await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return errorResponse("Post not found or no changes made", 404);
    }

    const updatedPost = await postsCollection.findOne({
      _id: new ObjectId(id),
    });

    return successResponse({
      ...updatedPost,
      _id: updatedPost?._id?.toString(),
    });
  } catch (error) {
    console.error("Update post error:", error);
    return errorResponse("Internal server error", 500);
  }
}

export async function deletePostHandler(
  event: APIGatewayProxyEvent
): Promise<ApiResponse> {
  try {
    const token = getAuthHeader(event);
    if (!token) {
      return errorResponse("Authentication required", 401);
    }

    const decoded = verifyToken(token) as AuthContext;
    if (decoded.role !== "author") {
      return errorResponse("Only authors can delete posts", 403);
    }

    const { id } = event.pathParameters || {};
    if (!id) {
      return errorResponse("Post ID is required", 400);
    }

    const { db } = await connectToDatabase();
    const postsCollection = db.collection<Post>(COLLECTION_NAME);

    // Check if post exists and belongs to user
    const existingPost = await postsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!existingPost) {
      return errorResponse("Post not found", 404);
    }

    if (existingPost.authorId !== decoded.userId) {
      return errorResponse("You can only delete your own posts", 403);
    }

    const result = await postsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return errorResponse("Post not found", 404);
    }

    return successResponse({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    return errorResponse("Internal server error", 500);
  }
}
