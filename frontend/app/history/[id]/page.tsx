"use client";

import { useBlogStore } from "@/store/blogStore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, Edit } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/Protected";

const BlogDetails = () => {
  const { id } = useParams();
  const { getById, blog, loading, error, updateBlog } = useBlogStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [copiedBlocks, setCopiedBlocks] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (id) getById(id as string);
  }, [id, getById]);

  useEffect(() => {
    if (blog) {
      setEditedContent(blog?.content || blog?.exportFormats?.markdown || "");
    }
  }, [blog]);

  const handleCopy = () => {
    const content = blog?.content || blog?.exportFormats?.markdown;
    if (content) {
      navigator.clipboard.writeText(content);
      toast.success("Blog content copied!");
    }
  };

  const handleDownload = () => {
    const content = blog?.content || blog?.exportFormats?.markdown;
    if (content && blog?.title) {
      const blob = new Blob([content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${blog.title.replace(/\s+/g, "-").toLowerCase()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Blog downloaded!");
    }
  };

  const handleSave = async () => {
    if (!blog?.id) return;
    const toastId = toast.loading("Saving...");
    try {
      await updateBlog(blog.id, { content: editedContent });
      toast.success("Blog updated!", { id: toastId });
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update blog", { id: toastId });
    }
  };

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedBlocks((prev) => {
      const newSet = new Set(prev);
      newSet.add(index);
      setTimeout(() => {
        setCopiedBlocks((prev2) => {
          const updated = new Set(prev2);
          updated.delete(index);
          return updated;
        });
      }, 2000);
      return newSet;
    });
    toast.success("Code copied!");
  };

  const blogContent = blog?.exportFormats?.markdown;

  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      const code = String(children).replace(/\n$/, "");
      const lang = match ? match[1] : "";
      const index = Math.random();

      if (!inline && lang) {
        return (
          <div className="relative my-4 rounded-lg overflow-hidden border border-gray-700">
            <div className="flex justify-between items-center bg-gray-800 px-4 py-2">
              <span className="text-xs text-gray-300 uppercase font-medium">
                {lang}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs hover:bg-gray-100"
                onClick={() => copyCode(code, index)}
              >
                {copiedBlocks.has(index) ? (
                  "✓ Copied!"
                ) : (
                  <Copy className="w-3 h-3 mr-1" />
                )}
              </Button>
            </div>
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={lang}
              PreTag="div"
              customStyle={{
                margin: 0,
                background: "#1e1e1e",
                fontSize: "14px",
                borderRadius: 0,
              }}
              {...props}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        );
      }

      return (
        <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      );
    },
    pre: ({ children }: any) => <>{children}</>,
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">
        {children}
      </h2>
    ),
    p: ({ children }: any) => (
      <p className="mb-4 leading-7 text-foreground">{children}</p>
    ),
    ul: ({ children }: any) => (
      <ul className="mb-4 ml-6 list-disc space-y-2 text-foreground">
        {children}
      </ul>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 italic bg-muted/30 text-foreground">
        {children}
      </blockquote>
    ),
  };

  if (loading) return <p className="text-center">Loading blog...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!blog) return <p className="text-center">No blog found.</p>;

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-10 space-y-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold">{blog.title}</CardTitle>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleCopy}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDownload}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleSave}>Save</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardHeader>

          <CardContent className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">{blog.topic}</p>

            {isEditing ? (
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
            ) : (
              <ReactMarkdown components={components}>
                {blogContent || "No content available"}
              </ReactMarkdown>
            )}

            {blog.metaDescription && (
              <div className="pt-4 border-t mt-6">
                <p className="text-sm font-medium mb-1 text-foreground">
                  Meta Description:
                </p>
                <p className="text-sm text-muted-foreground italic">
                  {blog.metaDescription}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default BlogDetails;
