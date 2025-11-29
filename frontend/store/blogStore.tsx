import { create } from "zustand";
import api from "@/lib/backendUrl";
import { blogGenerationType } from "@/schema/blog.schema";

interface Blog {
  id: string;
  title: string;
  topic: string;
  tone: string;
  content: string;
  wordCount: number;
  readingTime: number;
  tags: string[];
  metaDescription?: string;
  seoScore: number;
  exportFormats: {
    markdown: string;
    html?: string;
    pdfUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UpdateBlogData {
  title?: string;
  topic?: string;
  tone?: string;
  content?: string;
  tags?: string[];
  metaDescription?: string;
}

interface BlogState {
  blog: Blog | null;
  blogs: Blog[] | [];
  loading: boolean;
  searchResult: Blog[] | [];
  error: string | null;

  generateBlog: (data: blogGenerationType) => Promise<void>;
  searchBlog: (query: string) => Promise<void>;
  getBlogs: () => Promise<void>;
  getById: (id: string) => Promise<void>;
  updateBlog: (id: string, data: UpdateBlogData) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  clearBlog: () => void;
  clearSearch: () => void;
}

export const useBlogStore = create<BlogState>((set) => ({
  blog: null,
  loading: false,
  blogs: [],
  error: null,
  searchResult: [],

  generateBlog: async (data: blogGenerationType) => {
    try {
      set({ loading: true, error: null });

      const tagsInput = data.tags as unknown as string | string[] | undefined;
      const formattedTags = Array.isArray(tagsInput)
        ? tagsInput
        : typeof tagsInput === "string"
        ? tagsInput
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      const requestData = {
        ...data,
        tags: formattedTags,
      };

      const response = await api.post("/api/blog/generate", requestData);

      if (response.data.success && response.data.blog) {
        const blogData = response.data.blog;

        const blog: Blog = {
          id: blogData._id || blogData.id,
          title: blogData.title,
          topic: blogData.topic,
          tone: blogData.tone,
          content: blogData.content,
          wordCount: blogData.wordCount,
          readingTime: blogData.readingTime,
          tags: blogData.tags || [],
          metaDescription: blogData.metaDescription,
          seoScore: blogData.seoScore,
          exportFormats: {
            markdown: blogData.exportFormats?.markdown || blogData.content,
            html: blogData.exportFormats?.html || "",
            pdfUrl: blogData.exportFormats?.pdfUrl || "",
          },
          createdAt: blogData.createdAt,
          updatedAt: blogData.updatedAt,
        };

        set({ blog, loading: false, error: null });
      } else {
        throw new Error(response.data.message || "Failed to generate blog");
      }
    } catch (error: any) {
      console.error("Error generating blog:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to generate blog";

      set({
        error: errorMessage,
        loading: false,
        blog: null,
      });
    }
  },

  searchBlog: async (query) => {
    try {
      set({ loading: true, error: null });

      const res = await api.get(
        `/api/blog/search?q=${encodeURIComponent(query)}`
      );

      set({searchBlog: res.data.blogs , loading: false})
    } catch (error: any) {
      console.log("error in search blog", error);
      set({ error: error, loading: false });
    }
  },

  getBlogs: async () => {
    try {
      set({ loading: true, error: null });
      const res = await api.get(`/api/blog`);
      set({ blogs: res.data.blogs, loading: false });
    } catch (error: any) {
      console.log("Error in get blog store", error);
      set({ error: error, loading: false });
    }
  },

  updateBlog: async (id, data: UpdateBlogData) => {
    try {
      set({ loading: true, error: null });
      const res = await api.put(`/api/blog/${id}`, data);

      if (res.data.success && res.data.blog) {
        const updatedBlog = res.data.blog;

        //transform interface to match the blog interface
        const transformBlog: Blog = {
          id: updatedBlog._id || updatedBlog.id,
          title: updatedBlog.title,
          topic: updatedBlog.topic,
          tone: updatedBlog.tone,
          content: updatedBlog.content,
          wordCount: updatedBlog.wordCount,
          readingTime: updatedBlog.readingTime,
          tags: updatedBlog.tags || [],
          metaDescription: updatedBlog.metaDescription,
          seoScore: updatedBlog.seoScore,
          exportFormats: {
            markdown:
              updatedBlog.exportFormats?.markdown || updatedBlog.content,
            html: updatedBlog.exportFormats?.html || "",
            pdfUrl: updatedBlog.exportFormats?.pdfUrl || "",
          },
          createdAt: updatedBlog.createdAt,
          updatedAt: updatedBlog.updatedAt,
        };

        set((state) => ({
          blog: state.blog?.id === id ? transformBlog : state.blog,
          blogs: state.blogs.map((blog) =>
            blog.id === id ? transformBlog : blog
          ),
          loading: false,
          error: null,
        }));
      } else {
        throw new Error(res.data.message || "Failed to update blog");
      }
    } catch (error: any) {
      console.log("Error in update blog store", error);
      set({ error: error, loading: false });
    }
  },

  getById: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await api.get(`/api/blog/${id}`);

      if (res.data.success && res.data.blog) {
        const blogData = res.data.blog;

        const blog: Blog = {
          id: blogData._id || blogData.id,
          title: blogData.title,
          topic: blogData.topic,
          tone: blogData.tone,
          content: blogData.content,
          wordCount: blogData.wordCount,
          readingTime: blogData.readingTime,
          tags: blogData.tags || [],
          metaDescription: blogData.metaDescription,
          seoScore: blogData.seoScore,
          exportFormats: {
            markdown: blogData.exportFormats?.markdown || blogData.content,
            html: blogData.exportFormats?.html || "",
            pdfUrl: blogData.exportFormats?.pdfUrl || "",
          },
          createdAt: blogData.createdAt,
          updatedAt: blogData.updatedAt,
        };

        set({ blog, loading: false, error: null });
      } else {
        throw new Error(res.data.message || "Failed to fetch blog by ID");
      }
    } catch (error: any) {
      console.error("Error in get blog by id:", error);
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  deleteBlog: async (id) => {
    try {
      set({ loading: true, error: null });
      await api.delete(`/api/blog/${id}`);
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog.id !== id),
        blog: state.blog?.id === id ? null : state.blog,
        loading: false,
      }));
    } catch (error: any) {
      console.log("Error in delete blog store", error);
      set({ error: error, loading: false });
    }
  },

  clearSearch: () => set({searchResult: [] , error: null}),

  clearBlog: () => set({ blog: null, error: null }),
}));
