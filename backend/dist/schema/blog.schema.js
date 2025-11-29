"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogSchema = void 0;
const zod_1 = require("zod");
exports.blogSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, "User ID is required"),
    title: zod_1.z
        .string()
        .min(1, "Title is required")
        .max(200, "Title cannot exceed 200 characters"),
    topic: zod_1.z.string().min(1, "Topic is required"),
    tone: zod_1.z.enum(["professional", "casual", "technical", "creative"]),
    wordCount: zod_1.z.number().min(0).optional(),
    readingTime: zod_1.z.number().min(0).optional(),
    metaDescription: zod_1.z
        .string()
        .max(160, "Meta description cannot exceed 160 characters")
        .optional(),
    tags: zod_1.z.array(zod_1.z.string()).max(10, "Cannot have more than 10 tags").optional(),
    seoScore: zod_1.z.number().min(0).max(100).optional(),
    exportFormats: zod_1.z
        .object({
        markdown: zod_1.z.string().optional(),
        html: zod_1.z.string().optional(),
        pdfUrl: zod_1.z.string().url().optional(),
    })
        .optional(),
});
