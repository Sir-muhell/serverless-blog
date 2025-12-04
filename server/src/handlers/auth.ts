import { APIGatewayProxyEvent } from "aws-lambda";
import { connectToDatabase } from "../config/database";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";
import { loginSchema, registerSchema } from "../utils/validation";
import { successResponse, errorResponse } from "../utils/response";
import { User } from "../types/user";
import { ApiResponse } from "../types/api";
import { parseBody } from "../utils/parseBody";

const COLLECTION_NAME = "users" as const;

export async function registerHandler(event: any) {
  console.log("=== REGISTER HANDLER START ===");
  console.log("Event type:", typeof event);
  console.log("Event keys:", Object.keys(event));
  console.log("Event body type:", typeof event.body);
  console.log("Event body:", event.body);

  try {
    let input;
    if (typeof event.body === "string") {
      console.log("Parsing string body");
      input = JSON.parse(event.body);
    } else {
      console.log("Using object body directly");
      input = event.body || {};
    }

    console.log("Parsed input:", input);

    // validate
    console.log("Validating input...");
    const validationResult = registerSchema.safeParse(input);

    if (!validationResult.success) {
      console.log("Validation failed:", validationResult.error.errors);
      return errorResponse(
        validationResult.error.errors[0]?.message || "Invalid input",
        400
      );
    }

    console.log("Validation passed");

    // Connect to database
    console.log("Connecting to database...");
    const { db } = await connectToDatabase();
    console.log("Database connected successfully");

    const usersCollection = db.collection("users");
    console.log("Got users collection");

    // Check existing user
    console.log("Checking for existing user with email:", input.email);
    const existingUser = await usersCollection.findOne({ email: input.email });
    console.log("Existing user result:", existingUser);

    if (existingUser) {
      console.log("User exists, returning error");
      return errorResponse("User already exists", 400);
    }

    console.log("Hashing password...");
    const hashedPassword = await hashPassword(input.password);
    console.log("Password hashed");

    const user = {
      email: input.email,
      password: hashedPassword,
      name: input.name,
      role: input.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("Inserting user:", user);
    const result = await usersCollection.insertOne(user);
    console.log("Insert result:", result);

    const userWithoutPassword = {
      _id: result.insertedId.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    console.log("Generating token...");
    const token = generateToken(userWithoutPassword);
    console.log("Token generated");

    console.log("=== REGISTER HANDLER SUCCESS ===");
    return successResponse(
      {
        user: userWithoutPassword,
        token,
      },
      201
    );
  } catch (error: any) {
    console.error("=== REGISTER HANDLER ERROR ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // Check if it's a MongoDB error
    if (error.name === "MongoServerError") {
      console.error("MongoDB error code:", error.code);
    }

    return errorResponse("Internal server error", 500);
  }
}
export async function loginHandler(
  event: APIGatewayProxyEvent
): Promise<ApiResponse> {
  try {
    if (!event.body) {
      return errorResponse("Request body is required", 400);
    }

    const input = parseBody(event);
    const validationResult = loginSchema.safeParse(input);

    if (!validationResult.success) {
      return errorResponse(
        validationResult.error.errors[0]?.message || "Invalid input",
        400
      );
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection<User>(COLLECTION_NAME);

    const user = await usersCollection.findOne({ email: input.email });

    if (!user) {
      return errorResponse("Invalid credentials", 401);
    }

    const isPasswordValid = await comparePassword(
      input.password,
      user.password
    );
    if (!isPasswordValid) {
      return errorResponse("Invalid credentials", 401);
    }

    const userWithoutPassword = {
      _id: user._id?.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const token = generateToken(userWithoutPassword);

    return successResponse({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Internal server error", 500);
  }
}
