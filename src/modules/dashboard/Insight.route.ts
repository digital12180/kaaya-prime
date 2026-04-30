// src/routes/insight.routes.ts
import express from "express";
import { InsightController } from "./dashboard.controller.js";
import { verifyToken, adminOnly } from "../../common/middleware/auth.middleware.js";

const router = express.Router();
const controller = new InsightController();

// Public routes
router.post("/create", verifyToken, adminOnly, controller.create);
router.get("/all", controller.getAll);
router.get("/dashboard", controller.dashboard);
router.get("/entity/:entity", controller.getByEntity);
router.get("/:id", controller.getOne);
router.put("/:id", verifyToken, adminOnly, controller.update);
router.delete("/:id", verifyToken, adminOnly, controller.delete);

export default router;