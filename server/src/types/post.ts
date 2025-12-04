import { ObjectId } from "mongodb";

export interface Post {
  _id?: ObjectId | string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostInput {
  title: string;
  content: string;
  published?: boolean;
}

export interface PostUpdate extends Partial<PostInput> {}
