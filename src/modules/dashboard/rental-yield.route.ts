// src/routes/rental-yield.routes.ts
import { Router } from "express";
import { RentalYieldController } from "./rental-yield.controller.js";

const router = Router();
const controller = new RentalYieldController();

// Public routes
router.get("/", controller.getAll);
router.get("/quarters", controller.getQuarters);
router.get("/:id", controller.getById);
router.get("/area/:area/quarter/:quarter", controller.getByAreaAndQuarter);

// Admin/Protected routes (add your auth middleware)
router.post("/", controller.create);
router.post("/bulk", controller.bulkCreate);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);
router.delete("/area/:area/quarter/:quarter", controller.deleteByAreaAndQuarter);

export default router;