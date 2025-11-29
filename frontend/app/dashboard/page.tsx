"use client";

import ProtectedRoute from "@/components/Protected";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBlogStore } from "@/store/blogStore";
import { useUserStore } from "@/store/userStore";
import { FileText, Sparkles, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Dashboard = () => {
  const { user } = useUserStore();
  const { blogs, getBlogs, blog } = useBlogStore();

  const router = useRouter();

  useEffect(() => {
    getBlogs();
  }, [getBlogs]);

  const totalWords = blogs.reduce((acc, b) => acc + b.wordCount, 0);
  const avgSeo =
    blogs.length > 0
      ? Math.round(blogs.reduce((acc, b) => acc + b.seoScore, 0) / blogs.length)
      : 0;

  return (
    <ProtectedRoute>
      <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, {user?.name?.split(" ")[0] || "User"} 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Here’s a quick summary of your activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          {/* Blogs Created */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Blogs Created
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {blogs.length}
                </p>
              </div>
              <div className="p-3 bg-violet-100 dark:bg-violet-500/10 rounded-xl">
                <FileText className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
            </div>
          </div>

          {/* Avg SEO Score */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Avg SEO Score
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {avgSeo}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl">
                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Total Words */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Total Words
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {totalWords.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-xl">
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Token Usage */}
        <div className="mt-10 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            Monthly Token Usage
          </h3>
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              6,500 / 10,000
            </p>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              65% used
            </span>
          </div>
          <Input
            type="range"
            min={0}
            max={10000}
            value={6500}
            readOnly
            className="accent-blue-600 w-full"
          />
          <div className="mt-4 flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Upgrade Plan
            </Button>
          </div>
        </div>

        {/* Recent Blogs */}
        <div className="mt-10 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Recent Blogs
          </h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm">
                <th className="py-2 px-3">Title</th>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.slice(0, 5).map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition"
                >
                  <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                    {b.title}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/history/${b.id}`)}
                      size="sm"
                      className="text-blue-600 border-blue-200 dark:border-blue-400/30 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-4 text-center text-slate-500 dark:text-slate-400"
                  >
                    No blogs created yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
