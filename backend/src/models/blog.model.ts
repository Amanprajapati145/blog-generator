import mongoose, { Document, Schema } from "mongoose";

// TypeScript Interface
export interface IBlog extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  topic: string;
  tone: "professional" | "casual" | "technical" | "creative";
  wordCount: number;
  readingTime: number;
  metaDescription?: string;
  tags: string[];
  seoScore?: number;
  exportFormats: {
    markdown?: string;
    html?: string;
    pdfUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema
const blogSchema = new Schema<IBlog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
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
        validator: function (tags: string[]) {
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
  },
  {
    timestamps: true,
  }
);

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

const Blog = mongoose.model<IBlog>("Blog", blogSchema);
export default Blog;
