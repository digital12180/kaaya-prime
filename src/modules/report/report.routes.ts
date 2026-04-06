// routes/report.routes.ts
import { Router } from "express";
import { ReportController } from "./report.controller.js";
import { verifyToken } from "../../common/middleware/auth.middleware.js";

const router = Router();
const reportController = new ReportController();

// Report routes
router.post("/create",verifyToken, reportController.createReport);
router.get("/get-all",verifyToken, reportController.getAllReports);
router.get("/published",verifyToken, reportController.getPublishedReports);
router.get("/statistics",verifyToken, reportController.getReportStatistics);
router.get("/search/title",verifyToken, reportController.searchReportsByTitle);
router.get("/status/:status",verifyToken, reportController.getReportsByStatus);
router.get("/:id",verifyToken, reportController.getReportById);
router.put("/:id",verifyToken, reportController.updateReport);
router.patch("/:id/status",verifyToken, reportController.updateReportStatus);
router.delete("/:id",verifyToken, reportController.deleteReport);
router.post("/bulk-delete",verifyToken, reportController.bulkDeleteReports);

export default router;