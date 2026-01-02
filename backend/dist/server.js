"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_js_1 = require("./config/db.js");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
//routes imports
const blog_routes_js_1 = __importDefault(require("./routes/blog.routes.js"));
const user_routes_js_1 = __importDefault(require("./routes/user.routes.js"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const defaultOrigins = [
    "https://blog-generator-jet.vercel.app",
    "https://blog-generator-g5r8.vercel.app",
    "http://localhost:3000",
];
const envOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];
// Enhanced CORS configuration
app.use((req, res, next) => {
    const origin = req.headers.origin || '';
    if (allowedOrigins.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin || '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// Connect to MongoDB
(0, db_js_1.connectDB)();
// Health check route
app.get("/", (req, res) => {
    res.json({
        message: "Blog Generator API is running",
        status: "healthy",
    });
});
// API Routes
app.use("/api/blog", blog_routes_js_1.default);
app.use("/api/user", user_routes_js_1.default);
// Start server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
