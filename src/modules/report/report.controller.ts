// controllers/report.controller.ts
import type { Request, Response } from "express";
import { ReportService } from "./report.service.js";
import {
    validateCreateReport,
    validateUpdateReport,
    validateUpdateStatus
} from "./report.dto.js";


export class ReportController {
    private reportService: ReportService;

    constructor() {
        this.reportService = new ReportService();
    }

    // Create report
    createReport = async (req: Request, res: Response): Promise<void> => {
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
            const files = req.files as {
                image: Express.Multer.File[];
                fileUrl: Express.Multer.File[];
            };

            if (!files?.image || !files?.fileUrl) {
                res.status(400).json({
                    success: false,
                    message: "Both image and PDF are required"
                });
                return;
            }

            const imageFile = files.image[0] as Express.Multer.File;
            const pdfFile = files.fileUrl[0] as Express.Multer.File;
            const report = await this.reportService.createReport(req.body, imageFile, pdfFile);
            res.status(201).json({
                success: true,
                message: "Report created successfully",
                data: report
            });
        } catch (error: any) {
            const status = error.message.includes("already exists") ? 409 : 400;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to create report",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get all reports with pagination
    getAllReports = async (req: Request, res: Response): Promise<void> => {
        try {
            const paginationDto = {
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
                search: req.query.search as string,
                status: req.query.status as any,
                sortBy: req.query.sortBy as string,
                sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
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
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve reports",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get report by ID
    getReportById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const report = await this.reportService.getReportById(id as string);
            res.status(200).json({
                success: true,
                message: "Report retrieved successfully",
                data: report
            });
        } catch (error: any) {
            const status = error.message === "Invalid report ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to retrieve report",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Search reports by title
    searchReportsByTitle = async (req: Request, res: Response): Promise<void> => {
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
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
                status: req.query.status as any
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
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Failed to search reports",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Update report
    updateReport = async (req: Request, res: Response): Promise<any> => {
        try {
            const { id } = req.params;

            const files = req.files as {
                image?: Express.Multer.File[];
                fileUrl?: Express.Multer.File[];
            };

            const report = await this.reportService.updateReport(
                id as string,
                req.body,
                files
            );

            return res.status(200).json({
                success: true,
                message: "Report updated successfully",
                data: report
            });

        } catch (error: any) {
            const status =
                error.message === "Invalid report ID format" ? 400 :
                    error.message.includes("already exists") ? 409 :
                        error.message === "Report not found" ? 404 : 500;

            res.status(status).json({
                success: false,
                message: error.message || "Failed to update report"
            });
        }
    };
    // Update report status only
    updateReportStatus = async (req: Request, res: Response): Promise<void> => {
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

            const report = await this.reportService.updateReportStatus(id as string, req.body);
            res.status(200).json({
                success: true,
                message: `Report status updated to ${req.body.status} successfully`,
                data: report
            });
        } catch (error: any) {
            const status = error.message === "Invalid report ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to update report status",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Delete report
    deleteReport = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const result = await this.reportService.deleteReport(id as string);
            res.status(200).json({
                success: true,
                message: result.message,
                data: { deletedId: result.deletedId }
            });
        } catch (error: any) {
            const status = error.message === "Invalid report ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to delete report",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get reports by status
    getReportsByStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { status } = req.params;
            const reports = await this.reportService.getReportsByStatus(status as string);
            res.status(200).json({
                success: true,
                message: `Reports with status '${status}' retrieved successfully`,
                data: reports,
                count: reports.length
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Failed to retrieve reports by status",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get published reports (public endpoint)
    getPublishedReports = async (req: Request, res: Response): Promise<void> => {
        try {
            const paginationDto = {
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
                search: req.query.search as string,
                sortBy: req.query.sortBy as string,
                sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
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
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve published reports",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get report statistics
    getReportStatistics = async (req: Request, res: Response): Promise<void> => {
        try {
            const statistics = await this.reportService.getReportStatistics();
            res.status(200).json({
                success: true,
                message: "Statistics retrieved successfully",
                data: statistics
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve statistics",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    getReportsBySlug = async (req: Request, res: Response): Promise<void> => {
        try {
            const { slug } = req.params;
            const reports = await this.reportService.getReportsBySlug(slug as string);
            res.status(200).json({
                success: true,
                message: "Reports retrieved successfully",
                data: reports
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message || "Failed to retrieve reports",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

}