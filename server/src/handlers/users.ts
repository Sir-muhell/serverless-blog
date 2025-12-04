import { APIGatewayProxyEvent } from "aws-lambda";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../config/database";
import { successResponse, errorResponse } from "../utils/response";
import { User } from "../types/user";
import { verifyToken } from "../utils/auth";

export async function getProfileHandler(event: APIGatewayProxyEvent) {
  try {
    const authHeader =
      event.headers.Authorization || event.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse("Authentication required", 401);
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token) as any;

    const { db } = await connectToDatabase();
    const usersCollection = db.collection<User>("users");

    const user = await usersCollection.findOne({
      _id: new ObjectId(String(decoded.userId)),
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    const userWithoutPassword = {
      _id: user._id?.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return successResponse(userWithoutPassword);
  } catch (error) {
    console.error("Get profile error:", error);
    return errorResponse("Internal server error", 500);
  }
}
