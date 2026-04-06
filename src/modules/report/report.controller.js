import { ReportService } from "./report.service.js";
import { validateCreateReport, validateUpdateReport, validateUpdateStatus } from "./report.dto.js";
export class ReportController {
    reportService;
    constructor() {
        this.reportService = new ReportService();
    }
    // Create report
    createReport = async (req, res) => {
        try {
            // Validate request data
            const validationErrors = validateCreateReport(req.body);
            if (validationErrors.length > 0) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: validationErrors
                });
                return;
            }
            const report = await this.reportService.createReport(req.body);
            res.status(201).json({
                success: true,
                message: "Report created successfully",
                data: report
            });
        }
        catch (error) {
            const status = error.message.includes("already exists") ? 409 : 400;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to create report",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Get all reports with pagination
    getAllReports = async (req, res) => {
        try {
            const paginationDto = {
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 10,
                search: req.query.search,
                status: req.query.status,
                sortBy: req.query.sortBy,
                sortOrder: req.query.sortOrder || 'desc'
            };
            // Validate pagination params
            if (paginationDto.page && (isNaN(paginationDto.page) || paginationDto.page < 1)) {
                res.status(400).json({
                    success: false,
                    message: "Page must be a positive number"
                });
                return;
            }
            if (paginationDto.limit && (isNaN(paginationDto.limit) || paginationDto.limit < 1 || paginationDto.limit > 100)) {
                res.status(400).json({
                    success: false,
                    message: "Limit must be between 1 and 100"
                });
                return;
            }
            // Validate status
            if (paginationDto.status && !['PUBLISHED', 'DRAFT', 'ARCHIVED'].includes(paginationDto.status)) {
                res.status(400).json({
                    success: false,
                    message: "Status must be either 'PUBLISHED', 'DRAFT', or 'ARCHIVED'"
                });
                return;
            }
            const result = await this.reportService.getAllReports(paginationDto);
            res.status(200).json({
                success: true,
                message: "Reports retrieved successfully",
                data: result.reports,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: result.totalPages
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve reports",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Get report by ID
    getReportById = async (req, res) => {
        try {
            const { id } = req.params;
            const report = await this.reportService.getReportById(id);
            res.status(200).json({
                success: true,
                message: "Report retrieved successfully",
                data: report
            });
        }
        catch (error) {
            const status = error.message === "Invalid report ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to retrieve report",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Search reports by title
    searchReportsByTitle = async (req, res) => {
        try {
            const { title } = req.query;
            if (!title || typeof title !== 'string') {
                res.status(400).json({
                    success: false,
                    message: "Search title parameter is required"
                });
                return;
            }
            const paginationDto = {
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 10,
                status: req.query.status
            };
            const result = await this.reportService.searchReportsByTitle(title, paginationDto);
            res.status(200).json({
                success: true,
                message: `Reports matching "${title}" retrieved successfully`,
                data: result.reports,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: result.totalPages
                }
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || "Failed to search reports",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Update report
    updateReport = async (req, res) => {
        try {
            const { id } = req.params;
            // Validate update data
            const validationErrors = validateUpdateReport(req.body);
            if (validationErrors.length > 0) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: validationErrors
                });
                return;
            }
            const report = await this.reportService.updateReport(id, req.body);
            res.status(200).json({
                success: true,
                message: "Report updated successfully",
                data: report
            });
        }
        catch (error) {
            const status = error.message === "Invalid report ID format" ? 400 :
                error.message.includes("already exists") ? 409 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to update report",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Update report status only
    updateReportStatus = async (req, res) => {
        try {
            const { id } = req.params;
            // Validate status data
            const validationErrors = validateUpdateStatus(req.body);
            if (validationErrors.length > 0) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: validationErrors
                });
                return;
            }
            const report = await this.reportService.updateReportStatus(id, req.body);
            res.status(200).json({
                success: true,
                message: `Report status updated to ${req.body.status} successfully`,
                data: report
            });
        }
        catch (error) {
            const status = error.message === "Invalid report ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to update report status",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Delete report
    deleteReport = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await this.reportService.deleteReport(id);
            res.status(200).json({
                success: true,
                message: result.message,
                data: { deletedId: result.deletedId }
            });
        }
        catch (error) {
            const status = error.message === "Invalid report ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to delete report",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Get reports by status
    getReportsByStatus = async (req, res) => {
        try {
            const { status } = req.params;
            const reports = await this.reportService.getReportsByStatus(status);
            res.status(200).json({
                success: true,
                message: `Reports with status '${status}' retrieved successfully`,
                data: reports,
                count: reports.length
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || "Failed to retrieve reports by status",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Get published reports (public endpoint)
    getPublishedReports = async (req, res) => {
        try {
            const paginationDto = {
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 10,
                search: req.query.search,
                sortBy: req.query.sortBy,
                sortOrder: req.query.sortOrder || 'desc'
            };
            const result = await this.reportService.getPublishedReports(paginationDto);
            res.status(200).json({
                success: true,
                message: "Published reports retrieved successfully",
                data: result.reports,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: result.totalPages
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve published reports",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Get report statistics
    getReportStatistics = async (req, res) => {
        try {
            const statistics = await this.reportService.getReportStatistics();
            res.status(200).json({
                success: true,
                message: "Statistics retrieved successfully",
                data: statistics
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve statistics",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Bulk delete reports
    bulkDeleteReports = async (req, res) => {
        try {
            const { ids } = req.body;
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                res.status(400).json({
                    success: false,
                    message: "Please provide an array of report IDs to delete"
                });
                return;
            }
            const result = await this.reportService.bulkDeleteReports(ids);
            res.status(200).json({
                success: true,
                message: `${result.deletedCount} reports deleted successfully`,
                data: result
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || "Failed to delete reports",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
}
//# sourceMappingURL=report.controller.js.map