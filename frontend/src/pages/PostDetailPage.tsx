import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  User,
  Edit,
  Trash2,
  ArrowLeft,
  Eye,
  EyeOff,
  Share2,
  Bookmark,
  Heart,
} from "lucide-react";
import { format } from "date-fns";
import { Layout } from "../components/Layout/Layout";
import { postService } from "../services/api";
import { useAuthStore } from "../stores/authStore";

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => postService.getPost(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => postService.deletePost(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/");
    },
  });

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      deleteMutation.mutate();
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-red-200">
            <h2 className="text-3xl font-bold text-red-600 mb-6">
              Post Not Found
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              The post you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-3 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition duration-150 ease-in-out shadow-lg shadow-indigo-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const canEdit = user?._id === post.authorId;
  const isAuthor = user?.role === "author";
  const isPublished = post.published;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-indigo-600 mb-8 group transition duration-150 ease-in-out"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Posts</span>
        </Link>

        {/* Post header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {isPublished ? (
                  <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    <Eye className="h-4 w-4 mr-2" />
                    Published
                  </span>
                ) : (
                  <span className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                    <EyeOff className="h-4 w-4 mr-2" />
                    Draft
                  </span>
                )}
                <span className="text-gray-500">•</span>
                <span className="inline-flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(new Date(post.createdAt), "MMMM d, yyyy")}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {post.authorName}
                    </p>
                    <p className="text-sm text-gray-600">Author</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center px-5 py-3 bg-gray-100 text-gray-800 rounded-xl font-medium hover:bg-gray-200 transition duration-150 ease-in-out"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </button>

              {canEdit && (
                <>
                  <Link
                    to={`/posts/${post._id}/edit`}
                    className="inline-flex items-center justify-center px-5 py-3 bg-blue-100 text-blue-800 rounded-xl font-medium hover:bg-blue-200 transition duration-150 ease-in-out"
                  >
                    <Edit className="h-5 w-5 mr-2" />
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="inline-flex items-center justify-center px-5 py-3 bg-red-100 text-red-800 rounded-xl font-medium hover:bg-red-200 transition duration-150 ease-in-out disabled:opacity-50"
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Status alerts */}
          {!isPublished && isAuthor && !canEdit && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-yellow-800 font-medium">
                ⚠️ This is an unpublished draft. Only the author can see it.
              </p>
            </div>
          )}

          {!isPublished && !isAuthor && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-800 font-medium">
                🔒 This post is not published yet. Check back later!
              </p>
            </div>
          )}
        </div>

        {/* Post content */}
        <div className="bg-white rounded-3xl shadow-xl p-10 mb-8 border border-gray-200">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          {/* Engagement buttons */}
          <div className="flex items-center justify-between mt-10 pt-8 border-t border-gray-100">
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition duration-150 ease-in-out">
                <Heart className="h-5 w-5" />
                <span className="font-medium">Like</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out">
                <Bookmark className="h-5 w-5" />
                <span className="font-medium">Save</span>
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {format(new Date(post.updatedAt), "PPP")}
            </div>
          </div>
        </div>

        {/* Author info card */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 mb-8 border border-indigo-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            About the Author
          </h3>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <User className="h-10 w-10 text-indigo-600" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                {post.authorName}
              </h4>
              <p className="text-gray-600 mb-4">
                Passionate writer sharing insights and stories with the
                community.
              </p>
              <div className="flex gap-3">
                <span className="px-3 py-1 bg-white text-indigo-600 rounded-full text-sm font-medium">
                  {post.published ? "Published Author" : "Writer"}
                </span>
                <span className="px-3 py-1 bg-white text-indigo-600 rounded-full text-sm font-medium">
                  {format(new Date(post.createdAt), "MMMM yyyy")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
