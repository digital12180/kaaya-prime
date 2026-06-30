import { Router } from "express";
import { DashboardController } from "./dashboard.controller.js";
import { verifyToken, adminOnly } from "../../common/middleware/auth.middleware.js";

const router = Router();

router.get("/",
    // verifyToken, adminOnly,
    DashboardController.getDashboard);

export default router;