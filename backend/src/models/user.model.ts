import mongoose, { Document, Schema } from "mongoose";

// TypeScript Interface
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  plan: "free" | "pro" | "enterprise";
  apiUsage: {
    blogsGenerated: number;
    wordsGenerated: number;
    lastReset: Date;
  };
  preferences: {
    defaultTone: "professional" | "casual" | "technical" | "creative";
    defaultLength: number;
    darkMode: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },
    apiUsage: {
      blogsGenerated: {
        type: Number,
        default: 0,
      },
      wordsGenerated: {
        type: Number,
        default: 0,
      },
      lastReset: {
        type: Date,
        default: Date.now,
      },
    },
    preferences: {
      defaultTone: {
        type: String,
        enum: ["professional", "casual", "technical", "creative"],
        default: "professional",
      },
      defaultLength: {
        type: Number,
        default: 1000,
        min: 500,
        max: 3000,
      },
      darkMode: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ plan: 1 });

const User = mongoose.model<IUser>("User", userSchema);

export default User;
