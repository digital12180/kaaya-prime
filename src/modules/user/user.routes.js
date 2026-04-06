// routes/user.routes.ts
import { Router } from "express";
import { UserController } from "./user.controller.js";
import { verifyToken } from "../../common/middleware/auth.middleware.js";
const router = Router();
const userController = new UserController();
// User routes (only the requested APIs)
router.post("/create", verifyToken, userController.createUser);
router.get("/get-all", verifyToken, userController.getAllUsers);
router.get("/search/name", verifyToken, userController.searchUsers);
router.get("/statistics", verifyToken, userController.getUserStatistics);
router.get("/:id", verifyToken, userController.getUserById);
router.patch("/:id/role", verifyToken, userController.updateUserRole);
router.delete("/:id", verifyToken, userController.deleteUser);
router.put("/:id", verifyToken, userController.updateUserRole);
export default router;
//# sourceMappingURL=user.routes.js.map