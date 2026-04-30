import { Router } from "express";
import { dashboardController } from "./dashboard.controller.js";
import { verifyToken, adminOnly } from "../../common/middleware/auth.middleware.js";
const router = Router();
const controller = new dashboardController();

router.post('/', verifyToken, adminOnly, controller.storeMetrics);

router.get('/market-intelligence', controller.getMarketIntelligence);

router.get('/volume', controller.getWithAED); 

export default router;