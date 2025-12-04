import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Type, FileText, Send } from "lucide-react";
import { postService } from "../services/api";
import { Layout } from "../components/Layout/Layout";
import { postSchema, PostFormData } from "../lib/validation";

export function CreatePostPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      published: false,
    },
  });

  const mutation = useMutation({
    mutationFn: postService.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/dashboard");
    },
  });

  const onSubmit = async (data: PostFormData) => {
    mutation.mutate(data);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-indigo-600 mb-6 group transition duration-150 ease-in-out"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              Create New Post
            </h1>
            <p className="text-lg text-gray-600">
              Share your thoughts, ideas, and stories with the world.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Type className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Post Title</h2>
                <p className="text-gray-600">
                  Catchy titles attract more readers
                </p>
              </div>
            </div>

            <input
              {...register("title")}
              type="text"
              className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out placeholder-gray-500"
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
                <p className="text-gray-600">
                  Write your story here. Be authentic and engaging.
                </p>
              </div>
            </div>

            <textarea
              {...register("content")}
              rows={16}
              className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out placeholder-gray-500 resize-none"
              placeholder="Start writing your amazing content here..."
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
                <p className="text-gray-600">
                  Choose when to share your post with readers
                </p>
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
                  Publish immediately
                </label>
                <p className="text-gray-600 mt-1">
                  Your post will be visible to all readers as soon as you save
                  it.
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
              onClick={() => navigate("/dashboard")}
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
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Publish Post</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
