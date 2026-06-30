import { Router } from 'express';
import { ReportController } from './report.controller.js';
import { upload } from '../../common/middleware/multer.middleware.js';
import { verifyToken, adminOnly } from "../../common/middleware/auth.middleware.js";

// import {
//   validateCreateReport,
//   validateUpdateReport,
//   validateReportQuery,
// } from '';

const router = Router();
const reportController = new ReportController();

// Create a new report
router.post(
  '/create',
  //   validateCreateReport,
  verifyToken,
  adminOnly,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "file",
      maxCount: 1,
    },
  ]),
  reportController.createReport.bind(reportController)
);

// Get all reports with filtering and pagination
router.get(
  '/get-all',
  //   validateReportQuery,
  reportController.getAllReports.bind(reportController)
);

// Get report statistics
router.get(
  '/stats',
  reportController.getReportStats.bind(reportController)
);

// Get reports by type
router.get(
  '/type/:type',
  reportController.getReportsByType.bind(reportController)
);

// Get report by ID
router.get(
  '/:id',
  reportController.getReportById.bind(reportController)
);

// Get report by slug
router.get(
  '/slug/:slug',
  reportController.getReportBySlug.bind(reportController)
);

// Update report
router.put(
  '/:id',
  verifyToken,
  adminOnly,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "file",
      maxCount: 1,
    },
  ]),
  //   validateUpdateReport,
  reportController.updateReport.bind(reportController)
);

// Delete report
router.delete(
  '/:id',
  verifyToken,
  adminOnly,
  reportController.deleteReport.bind(reportController)
);

export default router;