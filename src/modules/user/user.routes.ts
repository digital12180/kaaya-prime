// routes/user.routes.ts
import { Router } from "express";
import { UserController } from "./user.controller.js";
import { verifyToken,adminOnly } from "../../common/middleware/auth.middleware.js";

const router = Router();
const userController = new UserController();

// User routes (only the requested APIs)
router.post("/create", verifyToken,adminOnly, userController.createUser);
router.get("/get-all", verifyToken,adminOnly, userController.getAllUsers);
router.get("/search/name", verifyToken,adminOnly, userController.searchUsers);
router.get("/statistics", verifyToken,adminOnly, userController.getUserStatistics);
router.get("/:id", verifyToken,adminOnly, userController.getUserById);
router.patch("/:id/role", verifyToken,adminOnly, userController.updateUserRole);
router.delete("/:id", verifyToken,adminOnly, userController.deleteUser);
router.put("/:id", verifyToken,adminOnly, userController.updateUser);


export default router;