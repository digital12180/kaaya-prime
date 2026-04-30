import { Router } from "express";
import { dashboardController } from "./dashboard.controller.js";
import { verifyToken, adminOnly } from "../../common/middleware/auth.middleware.js";
const router = Router();
const controller = new dashboardController();

router.post('/', verifyToken, adminOnly, controller.storeMetrics);


router.get('/market-intelligence', controller.getMarketIntelligence);

router.get('/volume', controller.getWithAED); 
router.get('/top-performers', controller.getTopPerformers);
router.get('/all', controller.getAllMetrics);
router.get('t/:quarter', controller.getMetricsByQuarter);

// Admin only routes (require authentication and admin role)
router.put('/:quarter', verifyToken, adminOnly, controller.updateMetrics);
router.patch('/:quarter', verifyToken, adminOnly, controller.patchMetrics);
router.delete('/:quarter', verifyToken, adminOnly, controller.deleteMetrics);

export default router;