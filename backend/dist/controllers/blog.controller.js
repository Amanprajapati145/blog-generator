"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchBlog = exports.getBlogById = exports.updateBlogs = exports.deleteBlogs = exports.getBlogs = exports.generateBlog = void 0;
const prompts_1 = require("@langchain/core/prompts");
const google_genai_1 = require("@langchain/google-genai");
const blog_model_1 = __importDefault(require("../models/blog.model"));
const blog_schema_1 = require("../schema/blog.schema");
const history_model_1 = __importDefault(require("../models/history.model"));
const generateBlog = async (req, res) => {
    try {
        //  Step 1: Get authenticated user
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }
        console.log(user);
        const userId = user._id || user.id;
        // Step 2: Validate blog data
        const parsedData = await blog_schema_1.blogSchema
            .omit({ userId: true })
            .parseAsync(req.body);
        const { title, topic, tone, tags, metaDescription } = parsedData;
        //  Step 3: Generate prompt
        const template = `
      You are an expert SEO blog writer.
      Write a detailed and SEO-optimized blog post based on the following details.

      Title: {title}
      Topic: {topic}
      Tone: {tone}

      Requirements:
      - Maintain a {tone} writing style.
      - Add introduction, main sections, and conclusion.
      - Include headings, bullet points, and examples if relevant.
      - Optimize naturally for search engines (SEO).
      - Keep it engaging, human-like, and easy to read.
      - If user asks for any technical topic like JWT authentication, include code examples.

      Output only the final blog content in Markdown format.
    `;
        const prompt = new prompts_1.PromptTemplate({
            template,
            inputVariables: ["title", "topic", "tone", "content"],
        });
        const formattedPrompt = await prompt.format({
            title,
            topic,
            tone,
            content: undefined,
        });
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({
                success: false,
                message: "Gemini API key missing on server",
            });
        }
        // Determine desired and fallback models. Use Gemini models available for your key.
        const desiredModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
        const fallbackModel = process.env.GEMINI_MODEL_FALLBACK || "gemini-flash-latest";
        const createModel = (modelName) => new google_genai_1.ChatGoogleGenerativeAI({ model: modelName, temperature: 0.7, apiKey });
        let response;
        const startTime = Date.now();
        try {
            const model = createModel(desiredModel);
            console.log(`Using model: ${desiredModel}`);
            response = await model.invoke(formattedPrompt);
        }
        catch (err) {
            // If configured model is not available for the API/version, try fallback once.
            const isModelNotFound = err?.status === 404 ||
                err?.response?.status === 404 ||
                (err?.message && String(err.message).includes("is not found"));
            if (isModelNotFound && desiredModel !== fallbackModel) {
                console.warn(`Model ${desiredModel} not available for generateContent. Retrying with fallback model ${fallbackModel}...`);
                const fallback = createModel(fallbackModel);
                response = await fallback.invoke(formattedPrompt);
            }
            else {
                throw err;
            }
        }
        const endTime = Date.now();
        const generatedContent = typeof response.content === "string"
            ? response.content
            : response.content?.[0]?.text ?? JSON.stringify(response.content);
        //  Step 5: Word count & reading time
        const contentStr = typeof generatedContent === "string" ? generatedContent : "";
        const wordCount = contentStr.split(/\s+/).filter(Boolean).length;
        const readingTime = Math.ceil(wordCount / 200);
        //  Step 6: Save Blog
        const newBlog = await blog_model_1.default.create({
            userId,
            title,
            topic,
            tone,
            content: generatedContent,
            wordCount,
            readingTime,
            metaDescription,
            tags,
            seoScore: parsedData.seoScore ?? Math.floor(Math.random() * 20) + 80,
            exportFormats: { markdown: generatedContent },
        });
        //  Step 7: Log generation history
        await history_model_1.default.create({
            userId,
            blogId: newBlog._id,
            prompt: formattedPrompt,
            tokensUsed: response.usage_metadata?.total_tokens ?? 0,
            cost: ((response.usage_metadata?.total_tokens ?? 0) * 0.00002).toFixed(4),
            duration: (endTime - startTime) / 1000,
        });
        //  Step 8: Update user's API usage
        user.apiUsage.blogsGenerated += 1;
        user.apiUsage.wordsGenerated += wordCount;
        await user.save();
        //  Step 9: Respond
        return res.status(201).json({
            success: true,
            message: "Blog generated successfully",
            blog: newBlog,
            usage: {
                blogsGenerated: user.apiUsage.blogsGenerated,
                wordsGenerated: user.apiUsage.wordsGenerated,
            },
        });
    }
    catch (error) {
        console.error("❌ Error generating blog:", error?.response?.data || error);
        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.errors,
            });
        }
        const status = error?.response?.status || 500;
        const message = error?.response?.data?.error?.message ||
            error?.message ||
            "Failed to generate blog";
        return res.status(status).json({
            success: false,
            message,
        });
    }
};
exports.generateBlog = generateBlog;
//get users blog
const getBlogs = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "unauthorize" });
        }
        const rawBlogs = await blog_model_1.default.find({ userId })
            .sort({ createdAt: -1 })
            .select("-__v");
        let count = rawBlogs.length;
        // total word count (sum of all blog.wordCount)
        const totalWords = rawBlogs.reduce((sum, blog) => {
            const words = blog.wordCount || 0;
            return sum + words;
        }, 0);
        const blogs = rawBlogs.map((blog) => ({
            id: blog._id,
            title: blog.title,
            topic: blog.topic,
            tone: blog.tone,
            wordCount: blog.wordCount,
            tags: blog.tags,
            metaDescription: blog.metaDescription,
            seoScore: blog.seoScore,
            createdAt: blog.createdAt,
            updatedAt: blog.updatedAt,
            markdown: blog.exportFormats?.markdown || "",
            html: blog.exportFormats?.html || "",
            pdfUrl: blog.exportFormats?.pdfUrl || "",
        }));
        return res.status(200).json({
            success: true,
            message: "blogs fetched successfully",
            totalWords,
            count,
            blogs,
        });
    }
    catch (error) {
        console.log("Errir in get blogs controller", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};
exports.getBlogs = getBlogs;
const deleteBlogs = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res
                .status(404)
                .json({ success: false, message: "blog not found" });
        }
        await blog_model_1.default.findByIdAndDelete(id);
        return res
            .status(200)
            .json({ success: false, message: "blog deleted successfully" });
    }
    catch (error) {
        console.log("Error in delete blogs controller", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};
exports.deleteBlogs = deleteBlogs;
const updateBlogs = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const blog = await blog_model_1.default.findOne({ _id: id, userId });
        if (!blog) {
            return res
                .status(404)
                .json({ success: false, message: "Blog not found" });
        }
        const { title, topic, tone, tags, metaDescription, content } = req.body;
        // Apply update only if provided
        if (title)
            blog.title = title;
        if (topic)
            blog.topic = topic;
        if (tone)
            blog.tone = tone;
        if (tags)
            blog.tags = tags;
        if (metaDescription)
            blog.metaDescription = metaDescription;
        if (content) {
            // Use bracket notation to avoid TypeScript errors
            blog.content = content;
            blog.wordCount = content.split(/\s+/).length;
            blog.readingTime = Math.ceil(blog.wordCount / 200);
            // Also update exportFormats.markdown if you use it
            if (blog.exportFormats) {
                blog.exportFormats.markdown = content;
            }
        }
        await blog.save();
        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog,
        });
    }
    catch (error) {
        console.log("Error in update blogs controller", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};
exports.updateBlogs = updateBlogs;
const getBlogById = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res
                .status(401)
                .json({ success: false, message: "you are not authorize" });
        }
        const { id } = req.params;
        const blog = await blog_model_1.default.findById(id);
        return res.status(200).json({
            success: true,
            message: "blog by id fetched successfully",
            blog,
        });
    }
    catch (error) {
        console.log("Error in get blog by id controller", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};
exports.getBlogById = getBlogById;
const searchBlog = async (req, res) => {
    try {
        const { q: searchQuery, field = "title" } = req.query;
        if (!searchQuery || typeof searchQuery !== "string") {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }
        // Option 1: Search across multiple fields
        const blogs = await blog_model_1.default.find({
            $or: [
                { title: { $regex: searchQuery, $options: "i" } },
                { content: { $regex: searchQuery, $options: "i" } },
                { topic: { $regex: searchQuery, $options: "i" } },
            ],
        });
        if (blogs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No blogs found matching your search",
            });
        }
        return res.status(200).json({
            success: true,
            count: blogs.length,
            blogs,
        });
    }
    catch (error) {
        console.log("Error in search blog controller", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.searchBlog = searchBlog;
