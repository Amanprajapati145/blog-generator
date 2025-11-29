"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_js_1 = __importDefault(require("../models/user.model.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await user_model_js_1.default.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ success: false, message: "user already exist" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await user_model_js_1.default.create({ name, email, password: hashedPassword });
        return res
            .status(201)
            .json({ success: true, message: "user created successfully", user });
    }
    catch (error) {
        console.log("Error in registerUser: ", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log("Request body:", req.body);
        const user = await user_model_js_1.default.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "user not found" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid credentials" });
        }
        //generate the token
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        const isProd = process.env.NODE_ENV === "production";
        const secureCookie = process.env.COOKIE_SECURE
            ? process.env.COOKIE_SECURE === "true"
            : isProd;
        const sameSite = secureCookie ? "none" : "lax";
        // Set the cookie. For cross-site cookies (frontend and backend on different origins)
        // SameSite must be 'none' and secure must be true. In development we use 'lax'.
        res.cookie("token", token, {
            httpOnly: true,
            secure: secureCookie,
            sameSite,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user,
        });
    }
    catch (error) {
        console.log("Error in login user controller: ", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};
exports.loginUser = loginUser;
const logoutUser = async (req, res) => {
    try {
        // Clear the cookie using matching attributes
        const isProd = process.env.NODE_ENV === "production";
        const secureCookie = process.env.COOKIE_SECURE
            ? process.env.COOKIE_SECURE === "true"
            : isProd;
        const sameSite = secureCookie ? "none" : "lax";
        res.clearCookie("token", {
            httpOnly: true,
            secure: secureCookie,
            sameSite,
            path: "/",
        });
        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        console.log("error in logout controller", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" }); // Fixed: changed success to false for error case
    }
};
exports.logoutUser = logoutUser;
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await user_model_js_1.default.findById(userId).select("-password"); // exclude password
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.error("Error in getProfile:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getProfile = getProfile;
