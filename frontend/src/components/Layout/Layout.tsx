import { ReactNode } from "react";

import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Simple Blog
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Share your story with the world
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} Simple Blog. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Built with React, TypeScript, and Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
