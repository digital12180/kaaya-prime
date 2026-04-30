// src/routes/insight.routes.ts
import express from "express";
import { InsightController } from "./dashboard.controller.js";

const router = express.Router();
const controller = new InsightController();

// Public routes
router.post("/create", controller.create);
router.get("/all", controller.getAll);
router.get("/dashboard", controller.dashboard);
router.get("/entity/:entity", controller.getByEntity);
router.get("/:id", controller.getOne);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;