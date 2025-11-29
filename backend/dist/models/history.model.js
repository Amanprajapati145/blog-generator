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
const generationHistorySchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true,
    },
    blogId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: { createdAt: true, updatedAt: false }, // Only track creation time
});
// Indexes
generationHistorySchema.index({ userId: 1, createdAt: -1 });
generationHistorySchema.index({ blogId: 1 });
generationHistorySchema.index({ createdAt: -1 }); // For analytics queries
// TTL Index - Auto-delete records older than 90 days (optional)
generationHistorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days
const GenerationHistory = mongoose_1.default.model('GenerationHistory', generationHistorySchema);
exports.default = GenerationHistory;
