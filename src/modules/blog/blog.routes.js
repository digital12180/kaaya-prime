// routes/blog.routes.ts
import { Router } from "express";
import { BlogController } from "./blog.controller.js";
import { verifyToken } from "../../common/middleware/auth.middleware.js";
const router = Router();
const blogController = new BlogController();
// Blog routes
router.post("/create", verifyToken, blogController.createBlog);
router.get("/get-all", verifyToken, blogController.getAllBlogs);
router.get("/published", verifyToken, blogController.getPublishedBlogs);
router.get("/statistics", verifyToken, blogController.getBlogStatistics);
router.get("/search/title", verifyToken, blogController.searchBlogsByTitle);
router.get("/slug/:slug", verifyToken, blogController.getBlogBySlug);
router.get("/:id", verifyToken, blogController.getBlogById);
router.put("/:id", verifyToken, blogController.updateBlog);
router.delete("/:id", verifyToken, blogController.deleteBlog);
export default router;
//# sourceMappingURL=blog.routes.js.map