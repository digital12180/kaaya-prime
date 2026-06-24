import { Router } from 'express';
import { ReportController } from './report.controller.js';
// import {
//   validateCreateReport,
//   validateUpdateReport,
//   validateReportQuery,
// } from '';

const router = Router();
const reportController = new ReportController();

// Create a new report
router.post(
  '/reports',
//   validateCreateReport,
  reportController.createReport.bind(reportController)
);

// Get all reports with filtering and pagination
router.get(
  '/reports',
//   validateReportQuery,
  reportController.getAllReports.bind(reportController)
);

// Get report statistics
router.get(
  '/reports/stats',
  reportController.getReportStats.bind(reportController)
);

// Get reports by type
router.get(
  '/reports/type/:type',
  reportController.getReportsByType.bind(reportController)
);

// Get report by ID
router.get(
  '/reports/:id',
  reportController.getReportById.bind(reportController)
);

// Get report by slug
router.get(
  '/reports/slug/:slug',
  reportController.getReportBySlug.bind(reportController)
);

// Update report
router.put(
  '/reports/:id',
//   validateUpdateReport,
  reportController.updateReport.bind(reportController)
);

// Delete report
router.delete(
  '/reports/:id',
  reportController.deleteReport.bind(reportController)
);

export default router;