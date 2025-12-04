import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Save,
  Loader2,
  ArrowLeft,
  Type,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Layout } from "../components/Layout/Layout";
import { postService } from "../services/api";
import { postSchema, PostFormData } from "../lib/validation";
import { useAuthStore } from "../stores/authStore";

export function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => postService.getPost(id!),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      published: false,
    },
  });

  // FIX: Use useEffect to prevent infinite re-renders
  useEffect(() => {
    if (post && !isLoading) {
      reset({
        title: post.title,
        content: post.content,
        published: post.published,
      });
    }
  }, [post, isLoading, reset]);

  const mutation = useMutation({
    mutationFn: (data: PostFormData) => postService.updatePost(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate(`/posts/${id}`);
    },
  });

  const onSubmit = async (data: PostFormData) => {
    mutation.mutate(data);
  };

  // Handle loading state first
  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-red-600 mb-6">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              You can only edit your own posts.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center space-x-3 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition duration-150 ease-in-out shadow-lg shadow-indigo-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Then check for authorization
  if (post && user?._id !== post.authorId) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-red-600 mb-6">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              You can only edit your own posts.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center space-x-3 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition duration-150 ease-in-out shadow-lg shadow-indigo-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate(`/posts/${id}`)}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-indigo-600 mb-6 group transition duration-150 ease-in-out"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Post</span>
          </button>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              Edit Post
            </h1>
            <p className="text-lg text-gray-600">
              Refine and improve your content
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Title section */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Type className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Post Title</h2>
                <p className="text-gray-600">Update your post title</p>
              </div>
            </div>

            <input
              {...register("title")}
              type="text"
              className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              placeholder="Enter a compelling title for your post..."
            />
            {errors.title && (
              <p className="mt-3 text-red-600 font-medium px-2">
                ⚠️ {errors.title.message}
              </p>
            )}
          </div>

          {/* Content section */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Post Content
                </h2>
                <p className="text-gray-600">Edit and improve your content</p>
              </div>
            </div>

            <textarea
              {...register("content")}
              rows={16}
              className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-none"
              placeholder="Write your post content here..."
            />
            {errors.content && (
              <p className="mt-3 text-red-600 font-medium px-2">
                ⚠️ {errors.content.message}
              </p>
            )}
          </div>

          {/* Publish options */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Publish Settings
                </h2>
                <p className="text-gray-600">Update your post visibility</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <input
                {...register("published")}
                type="checkbox"
                id="published"
                className="h-6 w-6 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <div className="flex-1">
                <label
                  htmlFor="published"
                  className="block text-lg font-medium text-gray-900"
                >
                  Make this post public
                </label>
                <p className="text-gray-600 mt-1">
                  When checked, your post will be visible to all readers.
                </p>
              </div>
            </div>
          </div>

          {/* Error display */}
          {mutation.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
              <p className="font-bold text-lg mb-2">Error</p>
              <p>{mutation.error.message}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate(`/posts/${id}`)}
              className="px-8 py-4 bg-gray-100 text-gray-800 rounded-xl font-bold text-lg hover:bg-gray-200 transition duration-150 ease-in-out"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-150 ease-in-out shadow-lg shadow-indigo-200 disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Update Post</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
