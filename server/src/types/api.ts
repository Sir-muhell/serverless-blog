import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export interface ApiResponse {
  statusCode: number;
  body: string;
  headers?: Record<string, string>;
}

export type LambdaHandler = (
  event: APIGatewayProxyEvent
) => Promise<APIGatewayProxyResult>;

export interface AuthContext {
  userId: string;
  role: string;
  email: string;
}
