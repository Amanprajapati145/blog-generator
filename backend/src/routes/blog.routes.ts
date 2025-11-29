import { Router } from "express";
import { authenticateMiddleware } from "../middleware/auth.middleware";
import {
  deleteBlogs,
  generateBlog,
  getBlogById,
  getBlogs,
  searchBlog,
  updateBlogs,
} from "../controllers/blog.controller";

const router = Router();

router.post(
  "/generate",
  authenticateMiddleware,
  generateBlog
);

router.get("/search", authenticateMiddleware, searchBlog);

router.get("/", authenticateMiddleware, getBlogs);

router.delete("/:id", authenticateMiddleware, deleteBlogs);

router.put("/:id", authenticateMiddleware, updateBlogs);

router.get("/:id", authenticateMiddleware, getBlogById);

export default router;
