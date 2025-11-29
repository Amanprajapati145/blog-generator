"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Eye, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useBlogStore } from "@/store/blogStore";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/Protected";
import toast from "react-hot-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";

const History = () => {
  const { blogs, getBlogs, loading, deleteBlog } = useBlogStore();

  const router = useRouter();

  useEffect(() => {
    getBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteBlog(id);
    toast.success("blog deleted successfully!");
  };

  const getSEOColor = (score: number) => {
    if (score >= 90)
      return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    if (score >= 80) return "bg-blue-500/10 text-blue-700 border-blue-500/20";
    return "bg-amber-500/10 text-amber-700 border-amber-500/20";
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedBlogs = blogs.slice(startIndex, endIndex);

  const totalPages = Math.ceil(blogs.length / itemsPerPage);

  if (loading)
    return (
      <div className="flex items-center justify-center h-full py-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-linear-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg shadow-violet-500/20">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Content Library
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Your complete archive of AI-generated blog posts
                </p>
              </div>
            </div>
          </div>

          {/* Blog History Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {paginatedBlogs.map((blog) => (
              <Card
                key={blog.id}
                className="group hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-500 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:scale-[1.02] overflow-hidden rounded-2xl"
              >
                <div className="h-2 bg-linear-to-r from-violet-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge
                      variant="secondary"
                      className="text-xs font-medium px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full"
                    >
                      {blog.tone}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${getSEOColor(
                        blog.seoScore
                      )}`}
                    >
                      SEO {blog.seoScore}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors leading-tight">
                    {blog.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    {blog.topic}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.slice(0, 3).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                      >
                        #{tag}
                      </Badge>
                    ))}
                    {blog.tags.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400"
                      >
                        +{blog.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <FileText size={14} />
                      </div>
                      <span className="font-medium">
                        {blog.wordCount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar size={14} />
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => router.push(`/history/${blog.id}`)}
                        variant="ghost"
                        size="sm"
                        className="h-9 cursor-pointer px-4 text-xs font-medium rounded-lg hover:bg-violet-100 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
                      >
                        <Eye size={14} className="mr-1.5" />
                        View
                      </Button>
                      <Button
                        onClick={() => handleDelete(blog.id)}
                        variant="ghost"
                        size="sm"
                        className="h-9 px-4 cursor-pointer text-xs font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                      >
                        <Trash2 size={14} className="text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          {/* Pagination */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* Empty State */}
          {blogs.length === 0 && (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-linear-to-br from-violet-100 to-purple-100 dark:from-violet-500/10 dark:to-purple-500/10 rounded-3xl flex items-center justify-center">
                  <FileText className="w-10 h-10 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  No content yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  Start your content journey by generating your first AI-powered
                  blog post. It only takes a few clicks!
                </p>
                <Button
                  onClick={() => router.push("/generate-blog")}
                  className="bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-6 h-auto rounded-xl shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30"
                >
                  <Sparkles size={18} className="mr-2" />
                  Create Your First Blog
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default History;
