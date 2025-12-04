import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  BookOpen,
  Home,
  FileText,
  LayoutDashboard,
  LogIn,
  UserPlus,
  PenSquare,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

export function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:shadow-xl transition-all duration-300">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Simple Blog
              </h1>
              <p className="text-xs text-gray-500">Share your story</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 group"
            >
              <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Home</span>
            </Link>

            <Link
              to="/posts"
              className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 group"
            >
              <FileText className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Posts</span>
            </Link>

            {user ? (
              <>
                {user.role === "author" && (
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 group"
                  >
                    <LayoutDashboard className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span>Dashboard</span>
                  </Link>
                )}
              </>
            ) : null}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-6">
                {/* User info */}
                <div className="hidden lg:flex items-center space-x-3 bg-gray-50 rounded-2xl px-4 py-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600 flex items-center">
                      <span
                        className={`w-2 h-2 rounded-full mr-2 ${
                          user.role === "author"
                            ? "bg-purple-500"
                            : "bg-blue-500"
                        }`}
                      ></span>
                      {user.role === "author" ? "Author" : "Reader"}
                    </p>
                  </div>
                </div>

                {/* Create Post Button (for authors) */}
                {user.role === "author" && (
                  <Link
                    to="/posts/new"
                    className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-200 shadow-lg shadow-indigo-200"
                  >
                    <PenSquare className="h-5 w-5" />
                    <span>New Post</span>
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center group-hover:bg-red-100 transition-colors">
                    <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    <LogIn className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="hidden lg:inline">Login</span>
                </Link>

                <Link
                  to="/register"
                  className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-200 shadow-lg shadow-indigo-200"
                >
                  <UserPlus className="h-5 w-5" />
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Join</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between py-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">Home</span>
            </Link>

            <Link
              to="/posts"
              className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span className="text-xs mt-1">Posts</span>
            </Link>

            {user && user.role === "author" && (
              <Link
                to="/dashboard"
                className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="text-xs mt-1">Dashboard</span>
              </Link>
            )}
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user.name.split(" ")[0]}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
