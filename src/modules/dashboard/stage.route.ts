// src/routes/stage.routes.ts
import { Router } from "express";
import { StageController } from "./stage.controller.js";

const router = Router();
const controller = new StageController();

// Public routes (no authentication required)
router.get("/", controller.getAll);
router.get("/active", controller.getActiveStages);
router.get("/order/:order", controller.getByOrder);
router.get("/tag/:tag", controller.getByTag);
router.get("/:id", controller.getById);

// Admin/Protected routes (add your auth middleware)
router.post("/", controller.create);
router.put("/reorder", controller.reorderStages);
router.put("/:id", controller.update);
router.patch("/:id/toggle", controller.toggleActive);
router.delete("/:id", controller.delete);

export default router;