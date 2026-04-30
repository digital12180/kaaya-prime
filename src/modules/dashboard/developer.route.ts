// src/routes/developer-score.routes.ts
import { Router } from "express";
import { DeveloperScoreController } from "./developer.controller.js";

const router = Router();
const controller = new DeveloperScoreController();

// Public routes (no authentication required)
router.get("/", controller.getAll);
router.get("/quarters", controller.getQuarters);
router.get("/developers", controller.getDevelopers);
router.get("/:id", controller.getById);
router.get("/developer/:developer/quarter/:quarter?", controller.getByDeveloperAndQuarter);

// Admin/Protected routes (add your auth middleware)
router.post("/", controller.create);
router.post("/bulk", controller.bulkCreate);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);
router.delete("/developer/:developer/quarter/:quarter?", controller.deleteByDeveloperAndQuarter);

export default router;