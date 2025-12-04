// User types
export interface User {
  _id: string;
  email: string;
  name: string;
  role: "author" | "reader";
  createdAt: string;
  updatedAt: string;
}

export interface UserInput {
  email: string;
  password: string;
  name: string;
  role: "author" | "reader";
}

export type UserWithoutPassword = Omit<User, "password">;

// Post types
export interface Post {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostInput {
  title: string;
  content: string;
  published?: boolean;
}

export interface PostUpdate extends Partial<PostInput> {}

export type PostResponse = {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  role: "author" | "reader";
}

export interface AuthResponse {
  user: UserWithoutPassword;
  token: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  posts: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// API handler types
export interface ApiHandlerResponse {
  statusCode: number;
  body: string;
  headers?: Record<string, string>;
}

export interface AuthContext {
  userId: string;
  role: string;
  email: string;
  name: string;
}
