"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Mongoose Schema
const blogSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
        index: true,
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [200, "Title cannot exceed 200 characters"],
    },
    topic: {
        type: String,
        required: [true, "Topic is required"],
        trim: true,
    },
    tone: {
        type: String,
        enum: ["professional", "casual", "technical", "creative"],
        required: true,
    },
    wordCount: {
        type: Number,
        required: true,
        min: 0,
    },
    readingTime: {
        type: Number,
        required: true,
        min: 0,
    },
    metaDescription: {
        type: String,
        maxlength: [160, "Meta description cannot exceed 160 characters"],
    },
    tags: {
        type: [String],
        default: [],
        validate: {
            validator: function (tags) {
                return tags.length <= 10;
            },
            message: "Cannot have more than 10 tags",
        },
    },
    seoScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    exportFormats: {
        markdown: { type: String },
        html: { type: String },
        pdfUrl: { type: String },
    },
}, {
    timestamps: true,
});
// Indexes
blogSchema.index({ userId: 1, createdAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ topic: 1 });
// Virtual for calculating reading time
blogSchema.pre("save", function (next) {
    if (this.wordCount) {
        this.readingTime = Math.ceil(this.wordCount / 200); // Average reading speed
    }
    next();
});
const Blog = mongoose_1.default.model("Blog", blogSchema);
exports.default = Blog;
