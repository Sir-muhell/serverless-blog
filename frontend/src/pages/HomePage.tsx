import { PostList } from "../components/Posts/PostList";
import { Layout } from "../components/Layout/Layout";
import { PenSquare, Sparkles, Users } from "lucide-react";

export function HomePage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16 py-12 px-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Welcome to <span className="text-indigo-600">Simple Blog</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            A beautifully crafted platform where authors share insights and
            readers discover amazing content.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <PenSquare className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Write & Publish</h3>
              <p className="text-gray-600">
                Share your thoughts with the world through beautifully formatted
                posts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <Sparkles className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Clean Design</h3>
              <p className="text-gray-600">
                Enjoy a distraction-free reading experience with modern, clean
                design.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Community</h3>
              <p className="text-gray-600">
                Join a community of passionate writers and curious readers.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Posts
              </h2>
              <p className="text-gray-600 mt-2">
                Discover the latest stories from our community
              </p>
            </div>
          </div>
          <PostList />
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl mb-8 text-indigo-100 max-w-2xl mx-auto">
            Join our community of writers and start sharing your ideas with
            readers around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition duration-150 ease-in-out shadow-lg"
            >
              Start Writing
            </a>
            <a
              href="/posts"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition duration-150 ease-in-out"
            >
              Browse Posts
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
