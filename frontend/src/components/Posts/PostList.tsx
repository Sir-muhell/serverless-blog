import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Calendar, User, Eye, Edit, Plus } from "lucide-react";
import { format } from "date-fns";
import { postService } from "../../services/api";
import { useAuthStore } from "../../stores/authStore";

export function PostList() {
  const { user } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: () => postService.getPosts(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-lg text-gray-600">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 border border-red-200 rounded-xl max-w-lg mx-auto">
        <p className="text-red-700 font-medium">
          Error: Failed to load posts. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-6">
      {/* 2. Enhanced Header */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Latest Content
        </h2>
        {user?.role === "author" && (
          <Link
            to="/posts/new"
            className="bg-indigo-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-indigo-700 transition duration-150 ease-in-out shadow-md shadow-indigo-200 flex items-center space-x-2 text-base"
          >
            <Plus className="h-5 w-5" />
            <span>New Post</span>
          </Link>
        )}
      </div>

      {data?.posts.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl shadow-inner">
          <p className="text-xl text-gray-500 font-medium">
            No posts yet. Time to create some great content!
          </p>
          {user?.role === "author" && (
            <Link
              to="/posts/new"
              className="mt-6 inline-block text-indigo-600 hover:text-indigo-800 font-semibold underline"
            >
              Start Writing Now
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data?.posts.map((post) => (
            <div
              key={post._id}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-between h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug">
                      <Link
                        to={`/posts/${post._id}`}
                        className="hover:text-indigo-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <User className="h-4 w-4 text-indigo-400" />
                        <span className="font-medium">{post.authorName}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-indigo-400" />
                        <span>
                          {format(new Date(post.createdAt), "MMM d, yyyy")}
                        </span>
                      </span>
                    </div>
                  </div>

                  {!post.published && (
                    <span className="px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full border border-yellow-300 shadow-sm whitespace-nowrap">
                      Draft
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mb-6 line-clamp-3 text-base">
                  {post.content.substring(0, 150)}...
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <Link
                  to={`/posts/${post._id}`}
                  className="flex items-center space-x-1 text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>Read Post</span>
                </Link>

                {user?._id === post.authorId && (
                  <Link
                    to={`/posts/${post._id}/edit`}
                    className="text-sm text-gray-500 hover:text-indigo-600 flex items-center space-x-1 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {data && data.pagination.pages > 1 && (
        <div className="flex justify-center space-x-2 pt-6">
          {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-150 ease-in-out ${
                  data.pagination.page === page
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
