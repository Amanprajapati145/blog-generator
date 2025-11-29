import { Router } from "express";
import { validateData } from "../middleware/validation.middleware.js";
import { loginUserSchema, registerUserSchema } from "../schema/user.schema.js";
import {
  getProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { authenticateMiddleware } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/register", validateData(registerUserSchema), registerUser);

router.post("/login", validateData(loginUserSchema), loginUser);

router.post("/logout", authenticateMiddleware, logoutUser);

router.get("/profile", authenticateMiddleware, getProfile);

export default router;
