import { APIGatewayProxyResult } from "aws-lambda";
import { registerHandler, loginHandler } from "./handlers/auth";
import {
  createPostHandler,
  getPostsHandler,
  getPostHandler,
  updatePostHandler,
  deletePostHandler,
} from "./handlers/posts";
import { getProfileHandler } from "./handlers/users";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Content-Type": "application/json",
};

export async function handler(event: any): Promise<APIGatewayProxyResult> {
  console.log("=== EVENT RECEIVED ===");
  console.log("Event keys:", Object.keys(event));
  console.log("Event version:", event.version);
  console.log("Raw event:", JSON.stringify(event));

  // Extract method and path
  let httpMethod = "GET";
  let rawPath = "/";

  // Try different event formats
  if (event.requestContext?.http) {
    // HTTP API v2
    httpMethod = event.requestContext.http.method || "GET";
    rawPath = event.requestContext.http.path || "/";
    console.log(`HTTP API v2 format: ${httpMethod} ${rawPath}`);
  } else if (event.httpMethod) {
    // REST API v1
    httpMethod = event.httpMethod;
    rawPath = event.path || "/";
    console.log(`REST API v1 format: ${httpMethod} ${rawPath}`);
  } else if (event.requestContext?.httpMethod) {
    // Another format
    httpMethod = event.requestContext.httpMethod;
    rawPath = event.requestContext.path || "/";
    console.log(`Other format: ${httpMethod} ${rawPath}`);
  }

  console.log(`Final: ${httpMethod} ${rawPath}`);

  // Handle ALL OPTIONS requests - return 200 with CORS
  if (httpMethod === "OPTIONS") {
    console.log("Returning 200 for OPTIONS preflight");
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  // Debug endpoint - always respond
  if (rawPath === "/debug") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Debug endpoint",
        event: {
          rawPath,
          httpMethod,
          version: event.version,
          hasRequestContext: !!event.requestContext,
          hasHttpContext: !!event.requestContext?.http,
        },
      }),
    };
  }

  // Parse body if needed
  const body = event.body
    ? typeof event.body === "string"
      ? JSON.parse(event.body)
      : event.body
    : {};

  // Route handlers
  try {
    if (rawPath === "/auth/register" && httpMethod === "POST") {
      const response = await registerHandler({
        ...event,
        body: JSON.stringify(body),
      });
      return { ...response, headers: { ...corsHeaders, ...response.headers } };
    }

    if (rawPath === "/auth/login" && httpMethod === "POST") {
      const response = await loginHandler({
        ...event,
        body: JSON.stringify(body),
      });
      return { ...response, headers: { ...corsHeaders, ...response.headers } };
    }

    if (rawPath === "/posts" && httpMethod === "GET") {
      const response = await getPostsHandler(event);
      return { ...response, headers: { ...corsHeaders, ...response.headers } };
    }

    if (rawPath === "/posts" && httpMethod === "POST") {
      const response = await createPostHandler({
        ...event,
        body: JSON.stringify(body),
      });
      return { ...response, headers: { ...corsHeaders, ...response.headers } };
    }

    if (rawPath.startsWith("/posts/") && rawPath.split("/").length === 3) {
      const postId = rawPath.split("/")[2];
      const modifiedEvent = { ...event, pathParameters: { id: postId } };

      if (httpMethod === "GET") {
        const response = await getPostHandler(modifiedEvent);
        return {
          ...response,
          headers: { ...corsHeaders, ...response.headers },
        };
      }

      if (httpMethod === "PUT" || httpMethod === "PATCH") {
        const response = await updatePostHandler({
          ...modifiedEvent,
          body: JSON.stringify(body),
        });
        return {
          ...response,
          headers: { ...corsHeaders, ...response.headers },
        };
      }

      if (httpMethod === "DELETE") {
        const response = await deletePostHandler(modifiedEvent);
        return {
          ...response,
          headers: { ...corsHeaders, ...response.headers },
        };
      }
    }

    if (rawPath === "/profile" && httpMethod === "GET") {
      const response = await getProfileHandler(event);
      return { ...response, headers: { ...corsHeaders, ...response.headers } };
    }

    if (rawPath === "/health" && httpMethod === "GET") {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, message: "Healthy" }),
      };
    }

    // Not found
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: "Not found",
        details: {
          rawPath,
          httpMethod,
          eventKeys: Object.keys(event),
          bodyKeys: Object.keys(body),
        },
      }),
    };
  } catch (error: any) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: "Internal server error",
        message: error.message,
      }),
    };
  }
}
