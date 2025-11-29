import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";

//routes imports
import blogRoutes from "./routes/blog.routes.js";
import userRoutes from "./routes/user.routes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const defaultOrigins = [
  "https://blog-generator-jet.vercel.app",
  "http://localhost:3000",
];

const envOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : [];

const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(cookieParser());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Blog Generator API is running",
    status: "healthy",
  });
});

// API Routes
app.use("/api/blog", blogRoutes);
app.use("/api/user", userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

