"use client";

import { Sparkle, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { Badge } from "./ui/badge";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const items = [
    { id: 1, name: "Dashboard", path: "/dashboard" },
    { id: 2, name: "About", path: "/about" },
    { id: 4, name: "History", path: "/history" },
  ];

  const { user, loading, logout } = useUserStore();
  const router = useRouter();

  if (loading) <p>Loading...</p>;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-full blur-sm group-hover:blur-md transition-all duration-300 opacity-70"></div>
                <Sparkle className="relative text-blue-600" size={28} />
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                BlogGenius
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                  className="relative group text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {user && (
                <Badge
                  variant="secondary"
                  className="px-3 py-1.5 text-sm font-medium bg-linear-to-r from-blue-50 to-purple-50 text-gray-700 border border-gray-200"
                >
                  👋 {user.name}
                </Badge>
              )}

              {user ? (
                <Button
                  onClick={() => logout()}
                  variant="outline"
                  className="h-9 px-4 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={() => router.push("/login")}
                  variant="outline"
                  className="h-9 px-4 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Log In
                </Button>
              )}

              <Button
                onClick={() => router.push("/generate-blog")}
                className="h-9 px-6 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <Sparkle size={16} className="mr-2" />
                Generate Blog
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl">
            <div className="px-4 pt-2 pb-4 space-y-3">
              {/* Mobile Navigation Links */}
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile User Info */}
              {user && (
                <div className="px-4 py-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600">Welcome back,</p>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                </div>
              )}

              {/* Mobile Buttons */}
              <div className="px-4 pt-2 space-y-3 border-t border-gray-100">
                {user ? (
                  <Button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full justify-center h-11 border-gray-300 text-gray-700"
                  >
                    Logout
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      router.push("/login");
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full justify-center h-11 border-gray-300 text-gray-700"
                  >
                    Log In
                  </Button>
                )}

                <Button
                  onClick={() => {
                    router.push("/generate-blog");
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-center h-11 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <Sparkle size={16} className="mr-2" />
                  Generate Blog
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
