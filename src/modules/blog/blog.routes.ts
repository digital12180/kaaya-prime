// routes/blog.routes.ts
import { Router } from "express";
import { BlogController } from "./blog.controller.js";
import { verifyToken,EditorAndadmin } from "../../common/middleware/auth.middleware.js";

const router = Router();
const blogController = new BlogController();

// Blog routes
router.post("/create",verifyToken,EditorAndadmin, blogController.createBlog);
router.get("/get-all", blogController.getAllBlogs);
router.get("/published",verifyToken,EditorAndadmin, blogController.getPublishedBlogs);
router.get("/statistics",verifyToken,EditorAndadmin, blogController.getBlogStatistics);
router.get("/search/title", blogController.searchBlogsByTitle);
router.get("/slug/:slug",verifyToken,EditorAndadmin, blogController.getBlogBySlug);
router.get("/:id", blogController.getBlogById);
router.put("/:id",verifyToken,EditorAndadmin, blogController.updateBlog);
router.delete("/:id",verifyToken,EditorAndadmin, blogController.deleteBlog);

export default router;