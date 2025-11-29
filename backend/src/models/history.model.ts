import mongoose, { Document, Schema } from 'mongoose';

// TypeScript Interface
export interface IGenerationHistory extends Document {
  userId: mongoose.Types.ObjectId;
  blogId: mongoose.Types.ObjectId;
  prompt: string;
  tokensUsed: number;
  cost: number;
  duration: number;
  createdAt: Date;
}

// Mongoose Schema
const generationHistorySchema = new Schema<IGenerationHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: [true, 'Blog ID is required'],
      index: true,
    },
    prompt: {
      type: String,
      required: [true, 'Prompt is required'],
    },
    tokensUsed: {
      type: Number,
      required: [true, 'Tokens used is required'],
      min: 0,
    },
    cost: {
      type: Number,
      required: [true, 'Cost is required'],
      min: 0,
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: 0,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only track creation time
  }
);

// Indexes
generationHistorySchema.index({ userId: 1, createdAt: -1 });
generationHistorySchema.index({ blogId: 1 });
generationHistorySchema.index({ createdAt: -1 }); // For analytics queries

// TTL Index - Auto-delete records older than 90 days (optional)
generationHistorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

const GenerationHistory = mongoose.model<IGenerationHistory>(
  'GenerationHistory',
  generationHistorySchema
);

export default GenerationHistory;