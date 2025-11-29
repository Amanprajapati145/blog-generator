import { z } from "zod";

export const blogSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters"),
  topic: z.string().min(1, "Topic is required"),
  tone: z.enum(["professional", "casual", "technical", "creative"]),
  wordCount: z.number().min(0).optional(),
  readingTime: z.number().min(0).optional(),
  metaDescription: z
    .string()
    .max(160, "Meta description cannot exceed 160 characters")
    .optional(),
  tags: z.array(z.string()).max(10, "Cannot have more than 10 tags").optional(),
  seoScore: z.number().min(0).max(100).optional(),
  exportFormats: z
    .object({
      markdown: z.string().optional(),
      html: z.string().optional(),
      pdfUrl: z.string().url().optional(),
    })
    .optional(),
});
