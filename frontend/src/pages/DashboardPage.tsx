import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  FileText,
  Eye,
  EyeOff,
  Calendar,
  TrendingUp,
  BarChart,
} from "lucide-react";
import { format } from "date-fns";
import { Layout } from "../components/Layout/Layout";
import { postService } from "../services/api";
import { useAuthStore } from "../stores/authStore";

export function DashboardPage() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["posts", "dashboard"],
    queryFn: () => postService.getPosts(1, 50),
  });

  if (!user || user.role !== "author") {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-red-200">
            <h2 className="text-3xl font-bold text-red-600 mb-6">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Only authors can access the dashboard.
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-3 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition duration-150 ease-in-out shadow-lg shadow-indigo-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const userPosts =
    data?.posts.filter((post) => post.authorId === user._id) || [];
  const publishedPosts = userPosts.filter((post) => post.published);
  const draftPosts = userPosts.filter((post) => !post.published);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Author Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Manage your content and track your impact
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {userPosts.length}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">Your journey as a writer</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {publishedPosts.length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">Posts visible to readers</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {draftPosts.length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <EyeOff className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">Posts in progress</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {publishedPosts.length * 5}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">Estimated reads</p>
            </div>
          </div>
        </div>

        {/* Create new post button */}
        <div className="mb-10">
          <Link
            to="/posts/new"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-5 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-150 ease-in-out shadow-lg shadow-indigo-200"
          >
            <PlusCircle className="h-6 w-6" />
            <span>Create New Post</span>
          </Link>
        </div>

        {/* Posts table */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Posts</h2>
              <p className="text-gray-600 mt-2">
                Manage and edit all your writings
              </p>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <BarChart className="h-5 w-5" />
              <span className="font-medium">{userPosts.length} posts</span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : userPosts.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                No posts yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start your writing journey by creating your first post. Share
                your thoughts with the world!
              </p>
              <Link
                to="/posts/new"
                className="inline-flex items-center space-x-3 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition duration-150 ease-in-out shadow-lg shadow-indigo-200"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Create Your First Post</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">
                        Title
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">
                        Created
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {userPosts.map((post) => (
                      <tr
                        key={post._id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-8 py-5">
                          <Link
                            to={`/posts/${post._id}`}
                            className="text-gray-900 hover:text-indigo-600 font-medium text-lg transition-colors duration-150"
                          >
                            {post.title}
                          </Link>
                        </td>
                        <td className="px-8 py-5">
                          {post.published ? (
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
                        </td>
                        <td className="px-8 py-5 text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {format(new Date(post.createdAt), "MMM d, yyyy")}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center space-x-4">
                            <Link
                              to={`/posts/${post._id}`}
                              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                            >
                              View
                            </Link>
                            <Link
                              to={`/posts/${post._id}/edit`}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
