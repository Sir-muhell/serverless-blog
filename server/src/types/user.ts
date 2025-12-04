import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  role: "author" | "reader";
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInput {
  email: string;
  password: string;
  name: string;
  role: "author" | "reader";
}

export type UserWithoutPassword = {
  _id?: string;
  email: string;
  name: string;
  role: "author" | "reader";
  createdAt: Date;
  updatedAt: Date;
};
