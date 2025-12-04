import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Calendar,
  User,
  Eye,
  Edit,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { postService } from "../../services/api";
import { useAuthStore } from "../../stores/authStore";
import type { Post, PaginatedResponse } from "../../types";

export function PostList() {
  const { user } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // Use placeholderData instead of keepPreviousData (newer React Query versions)
  const { data, isLoading, error, refetch, isFetching } = useQuery<
    PaginatedResponse<Post>,
    Error
  >({
    queryKey: ["posts", currentPage],
    queryFn: () => postService.getPosts(currentPage, postsPerPage),
    placeholderData: (previousData) => previousData, // Smooth transitions between pages
  });

  const handlePageChange = (page: number) => {
    if (page < 1 || page > (data?.pagination.pages || 1)) return;
    setCurrentPage(page);
  };

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
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Type-safe destructuring with defaults
  const posts = data?.posts || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: postsPerPage,
    total: 0,
    pages: 1,
  };

  return (
    <div className="space-y-10 py-6">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Latest Content
          </h2>
          {pagination.total > 0 && (
            <p className="text-gray-600 mt-2">
              Showing {posts.length} of {pagination.total} posts
            </p>
          )}
        </div>
        {user?.role === "author" && (
          <Link
            to="/posts/new"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-5 rounded-xl font-bold hover:shadow-xl transition-all duration-200 shadow-lg shadow-indigo-200 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Post</span>
          </Link>
        )}
      </div>

      {/* Loading indicator when fetching new page */}
      {isFetching && (
        <div className="fixed top-20 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading page {currentPage}...</span>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl shadow-inner border border-gray-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
            <Calendar className="h-10 w-10 text-gray-400" />
          </div>
          <p className="text-2xl text-gray-700 font-medium mb-3">
            No posts yet
          </p>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            Be the first to share your thoughts and start the conversation.
          </p>
          {user?.role === "author" && (
            <Link
              to="/posts/new"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-200 shadow-lg shadow-indigo-200"
            >
              <Plus className="h-5 w-5" />
              <span>Start Writing Now</span>
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Posts Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: Post) => (
              <div
                key={post._id}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-between h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug line-clamp-2">
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
                    className="flex items-center space-x-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors group"
                  >
                    <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Read Post</span>
                  </Link>

                  {user?._id === post.authorId && (
                    <Link
                      to={`/posts/${post._id}/edit`}
                      className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors group"
                    >
                      <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Edit</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200">
              {/* Page info */}
              <div className="text-sm text-gray-600">
                Page{" "}
                <span className="font-bold text-indigo-600">
                  {pagination.page}
                </span>{" "}
                of <span className="font-bold">{pagination.pages}</span>
              </div>

              {/* Page numbers */}
              <div className="flex items-center space-x-2">
                {/* Previous button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isFetching}
                  className="flex items-center space-x-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {/* Show first page */}
                  {currentPage > 3 && (
                    <>
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={isFetching}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        1
                      </button>
                      {currentPage > 4 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                    </>
                  )}

                  {/* Show pages around current */}
                  {Array.from(
                    { length: Math.min(5, pagination.pages) },
                    (_, i) => {
                      let pageNum;
                      if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      if (pageNum < 1 || pageNum > pagination.pages)
                        return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={isFetching}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors disabled:opacity-50 ${
                            currentPage === pageNum
                              ? "bg-indigo-600 text-white shadow-md"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  ).filter(Boolean)}

                  {/* Show last page */}
                  {currentPage < pagination.pages - 2 && (
                    <>
                      {currentPage < pagination.pages - 3 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(pagination.pages)}
                        disabled={isFetching}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        {pagination.pages}
                      </button>
                    </>
                  )}
                </div>

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages || isFetching}
                  className="flex items-center space-x-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Posts per page info */}
              <div className="text-sm text-gray-600">
                {postsPerPage} posts per page
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
