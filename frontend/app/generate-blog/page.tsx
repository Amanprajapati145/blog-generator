"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Download, Sparkle, Edit } from "lucide-react"; // Added Edit icon
import { useForm } from "react-hook-form";
import { blogGenerationSchema, blogGenerationType } from "@/schema/blog.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBlogStore } from "@/store/blogStore";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/Protected";

const GenerateBlog = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(blogGenerationSchema),
    defaultValues: {
      tone: "professional",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  const { blog, generateBlog, loading, updateBlog } = useBlogStore();
  const [copiedCodeBlocks, setCopiedCodeBlocks] = useState<Set<number>>(
    new Set()
  );

  // Initialize editedContent when blog changes
  useEffect(() => {
    if (blog) {
      setEditedContent(blog?.content || blog?.exportFormats?.markdown || "");
    }
  }, [blog]);

  const handleSave = async () => {
    if (!blog?.id) return;

    const toastId = toast.loading("Updating blog...");
    try {
      await updateBlog(blog.id, {
        content: editedContent,
      });
      toast.success("Blog updated successfully!", { id: toastId });
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update blog", { id: toastId });
    }
  };

  const onSubmit = async (data: blogGenerationType) => {
    const toastId = toast.loading("Generating blog...");
    try {
      await generateBlog(data);
      toast.success("Blog Generated Successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to generate blog", { id: toastId });
    }
  };

  const handleCopy = () => {
    const content = blog?.content || blog?.exportFormats?.markdown;
    if (content) {
      navigator.clipboard.writeText(content);
      toast.success("Content copied to clipboard!");
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

  const copyCodeToClipboard = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeBlocks((prev) => {
      const newSet = new Set(prev);
      newSet.add(index);
      setTimeout(() => {
        setCopiedCodeBlocks((prev) => {
          const updatedSet = new Set(prev);
          updatedSet.delete(index);
          return updatedSet;
        });
      }, 2000);
      return newSet;
    });
    toast.success("Code copied to clipboard!");
  };

  const blogContent = blog?.content || blog?.exportFormats?.markdown;

  // Custom components for ReactMarkdown to handle code blocks
  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      const code = String(children).replace(/\n$/, "");
      const language = match ? match[1] : "";
      const index = Math.random();

      if (!inline && language) {
        return (
          <div className="relative my-4 rounded-lg overflow-hidden border border-gray-700">
            <div className="flex justify-between items-center bg-gray-800 px-4 py-2">
              <span className="text-xs text-gray-300 uppercase font-medium">
                {language}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs hover:bg-gray-100"
                onClick={() => copyCodeToClipboard(code, index)}
              >
                {copiedCodeBlocks.has(index) ? (
                  "✓ Copied!"
                ) : (
                  <Copy className="w-3 h-3 mr-1" />
                )}
              </Button>
            </div>
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={language}
              PreTag="div"
              className="m-0! rounded-none!"
              customStyle={{
                margin: 0,
                borderRadius: 0,
                background: "#1e1e1e",
                fontSize: "14px",
              }}
              {...props}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        );
      }

      return (
        <code
          className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
          {...props}
        >
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
      <h2 className="text-2xl font-bold mt-6 mb-3 text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold mt-4 mb-2 text-foreground">
        {children}
      </h3>
    ),
    p: ({ children }: any) => (
      <p className="mb-4 leading-7 text-foreground">{children}</p>
    ),
    ul: ({ children }: any) => (
      <ul className="mb-4 ml-6 list-disc space-y-2 text-foreground">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2 text-foreground">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="leading-7 text-foreground">{children}</li>
    ),
    strong: ({ children }: any) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 italic bg-muted/30 text-foreground">
        {children}
      </blockquote>
    ),
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create Blog Post</h1>
          <p className="text-muted-foreground">
            Generate AI-powered blog content
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>Blog Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    {...register("title")}
                    placeholder="Enter blog title"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Textarea
                    {...register("topic")}
                    placeholder="Describe the blog topic..."
                    className="min-h-[100px]"
                  />
                  {errors.topic && (
                    <p className="text-sm text-red-500">
                      {errors.topic.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tone</Label>
                    <Select
                      onValueChange={(
                        value:
                          | "professional"
                          | "casual"
                          | "technical"
                          | "creative"
                      ) => setValue("tone", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.tone && (
                      <p className="text-sm text-red-500">
                        {errors.tone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <Input {...register("tags")} placeholder="tech, ai, web" />
                    {errors.tags && (
                      <p className="text-sm text-red-500">
                        {errors.tags.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Input
                    {...register("metaDescription")}
                    placeholder="SEO description..."
                  />
                  {errors.metaDescription && (
                    <p className="text-sm text-red-500">
                      {errors.metaDescription.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  <Sparkle className="w-4 h-4 mr-2" />
                  {loading ? "Generating..." : "Generate Blog"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Generated Content</CardTitle>
              {blog && (
                <div className="flex gap-2">
                  {!isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setIsEditing(true);
                          setEditedContent(blogContent || "");
                        }}
                        title="Edit Content"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopy}
                      >
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
                      <Button variant="default" size="sm" onClick={handleSave}>
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditing(false);
                          setEditedContent(blogContent || "");
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              )}
            </CardHeader>

            <CardContent className="flex-1 overflow-auto max-h-[80vh]">
              {blog ? (
                <div className="space-y-6">
                  {/* Blog Metadata */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground p-4 bg-muted/20 rounded-lg">
                    {blog.wordCount && <span>📝 {blog.wordCount} words</span>}
                    {blog.readingTime && (
                      <span>⏱️ {blog.readingTime} min read</span>
                    )}
                    {blog.tone && <span>🎭 {blog.tone}</span>}
                    {blog.seoScore && <span>🚀 SEO: {blog.seoScore}/100</span>}
                  </div>

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Content */}
                  <div
                    className="prose prose-lg max-w-none dark:prose-invert 
                  prose-headings:text-foreground 
                  prose-p:text-foreground 
                  prose-strong:text-foreground 
                  prose-em:text-foreground
                  prose-ul:text-foreground 
                  prose-ol:text-foreground 
                  prose-li:text-foreground
                  prose-blockquote:text-foreground
                  prose-code:text-foreground"
                  >
                    {isEditing ? (
                      <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="min-h-[400px] font-mono text-sm"
                        placeholder="Edit your blog content here..."
                      />
                    ) : (
                      <ReactMarkdown components={components}>
                        {blogContent || "No content available"}
                      </ReactMarkdown>
                    )}
                  </div>

                  {/* Meta Description */}
                  {blog.metaDescription && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium mb-1 text-foreground">
                        Meta Description:
                      </p>
                      <p className="text-sm text-muted-foreground italic">
                        {blog.metaDescription}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  Generated blog will appear here
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default GenerateBlog;
