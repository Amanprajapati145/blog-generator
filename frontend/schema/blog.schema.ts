import { z } from "zod";

// Schema for blog generation form
export const blogGenerationSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters"),
  topic: z.string().min(1, "Topic is required"),
  tone: z.enum(["professional", "casual", "technical", "creative"]),
  tags: z
    .string()
    .min(1, "Tags are required")
    .transform((val) => val.split(",").map((tag) => tag.trim()).filter(Boolean))
    .pipe(z.array(z.string()).min(1, "At least one tag is required")),
  metaDescription: z
    .string()
    .max(160, "Meta description cannot exceed 160 characters")
    .optional(),
});

export type blogGenerationType = z.infer<typeof blogGenerationSchema>;

// Full blog schema including server-generated fields
export const blogSchema = z.object({
  userId: z.string(),
  title: z.string(),
  topic: z.string(),
  tone: z.enum(["professional", "casual", "technical", "creative"]),
  tags: z.array(z.string()),
  metaDescription: z.string().optional(),
  seoScore: z.number().optional(),
});

export type BlogType = z.infer<typeof blogSchema>;