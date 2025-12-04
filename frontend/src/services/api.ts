import axios from "axios";
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  Post,
  AuthResponse,
  ApiResponse,
  PaginatedResponse,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      credentials
    );
    return response.data.data!;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      credentials
    );
    return response.data.data!;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>("/profile");
    return response.data.data!;
  },
};

export const postService = {
  getPosts: async (page = 1, limit = 10): Promise<PaginatedResponse<Post>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Post>>>(
      `/posts?page=${page}&limit=${limit}`
    );
    return response.data.data!;
  },

  getPost: async (id: string): Promise<Post> => {
    const response = await api.get<ApiResponse<Post>>(`/posts/${id}`);
    return response.data.data!;
  },

  createPost: async (
    post: Omit<
      Post,
      "_id" | "authorId" | "authorName" | "createdAt" | "updatedAt"
    >
  ): Promise<Post> => {
    const response = await api.post<ApiResponse<Post>>("/posts", post);
    return response.data.data!;
  },

  updatePost: async (id: string, post: Partial<Post>): Promise<Post> => {
    const response = await api.put<ApiResponse<Post>>(`/posts/${id}`, post);
    return response.data.data!;
  },

  deletePost: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};

export default api;
