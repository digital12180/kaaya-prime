// controllers/landingPage.controller.ts
import type{ Request, Response } from "express";
import { LandingPageService } from "./landingPage.service.js";
import {
    validateCreateLandingPage,
    validateUpdateLandingPage,
    validateUpdateStatus
} from "./landingPage.dto.js";

export class LandingPageController {
    private landingPageService: LandingPageService;

    constructor() {
        this.landingPageService = new LandingPageService();
    }

    // Create landing page
    createLandingPage = async (req: Request, res: Response): Promise<void> => {
        try {
            // Validate request data
            const validationErrors = validateCreateLandingPage(req.body);
            if (validationErrors.length > 0) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: validationErrors
                });
                return;
            }

            const landingPage = await this.landingPageService.createLandingPage(req.body);
            res.status(201).json({
                success: true,
                message: "Landing page created successfully",
                data: landingPage
            });
        } catch (error: any) {
            const status = error.message.includes("already exists") ? 409 : 400;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to create landing page",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get all landing pages with pagination
    getAllLandingPages = async (req: Request, res: Response): Promise<void> => {
        try {
            const paginationDto = {
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
                search: req.query.search as string,
                status: req.query.status as any,
                formType: req.query.formType as any,
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
            if (paginationDto.status && !['PUBLISHED', 'DRAFT', 'DISABLED'].includes(paginationDto.status)) {
                res.status(400).json({
                    success: false,
                    message: "Status must be one of: PUBLISHED, DRAFT, DISABLED"
                });
                return;
            }

            // Validate form type
            if (paginationDto.formType && !['CONTACT', 'CONSULTATION', 'DOWNLOAD', 'NONE'].includes(paginationDto.formType)) {
                res.status(400).json({
                    success: false,
                    message: "Form type must be one of: CONTACT, CONSULTATION, DOWNLOAD, NONE"
                });
                return;
            }

            const result = await this.landingPageService.getAllLandingPages(paginationDto);
            res.status(200).json({
                success: true,
                message: "Landing pages retrieved successfully",
                data: result.landingPages,
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
                message: error.message || "Failed to retrieve landing pages",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get landing page by ID
    getLandingPageById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const landingPage = await this.landingPageService.getLandingPageById(id as string);
            res.status(200).json({
                success: true,
                message: "Landing page retrieved successfully",
                data: landingPage
            });
        } catch (error: any) {
            const status = error.message === "Invalid landing page ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to retrieve landing page",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get landing page by slug (public)
    getLandingPageBySlug = async (req: Request, res: Response): Promise<void> => {
        try {
            const { slug } = req.params;
            const landingPage = await this.landingPageService.getLandingPageBySlug(slug as string);
            res.status(200).json({
                success: true,
                message: "Landing page retrieved successfully",
                data: landingPage
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message || "Failed to retrieve landing page",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get landing page by slug (admin - all statuses)
    getLandingPageBySlugAdmin = async (req: Request, res: Response): Promise<void> => {
        try {
            const { slug } = req.params;
            const landingPage = await this.landingPageService.getLandingPageBySlugAdmin(slug as string);
            res.status(200).json({
                success: true,
                message: "Landing page retrieved successfully",
                data: landingPage
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message || "Failed to retrieve landing page",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Search landing pages by title
    searchLandingPagesByTitle = async (req: Request, res: Response): Promise<void|any> => {
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
                status: req.query.status as any,
                formType: req.query.formType as any
            };

            const result = await this.landingPageService.searchLandingPagesByTitle(title, paginationDto);
            res.status(200).json({
                success: true,
                message: `Landing pages matching "${title}" retrieved successfully`,
                data: result.landingPages,
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
                message: error.message || "Failed to search landing pages",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Update landing page
    updateLandingPage = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            
            // Validate update data
            const validationErrors = validateUpdateLandingPage(req.body);
            if (validationErrors.length > 0) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: validationErrors
                });
                return;
            }

            const landingPage = await this.landingPageService.updateLandingPage(id as string, req.body);
            res.status(200).json({
                success: true,
                message: "Landing page updated successfully",
                data: landingPage
            });
        } catch (error: any) {
            const status = error.message === "Invalid landing page ID format" ? 400 :
                          error.message.includes("already exists") ? 409 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to update landing page",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Update landing page status only
    updateLandingPageStatus = async (req: Request, res: Response): Promise<void> => {
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

            const landingPage = await this.landingPageService.updateLandingPageStatus(id as string, req.body);
            res.status(200).json({
                success: true,
                message: `Landing page status updated to ${req.body.status} successfully`,
                data: landingPage
            });
        } catch (error: any) {
            const status = error.message === "Invalid landing page ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to update landing page status",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Delete landing page
    deleteLandingPage = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const result = await this.landingPageService.deleteLandingPage(id as string);
            res.status(200).json({
                success: true,
                message: result.message,
                data: { deletedId: result.deletedId }
            });
        } catch (error: any) {
            const status = error.message === "Invalid landing page ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to delete landing page",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get landing pages by status
    getLandingPagesByStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { status } = req.params;
            const landingPages = await this.landingPageService.getLandingPagesByStatus(status as string);
            res.status(200).json({
                success: true,
                message: `Landing pages with status '${status}' retrieved successfully`,
                data: landingPages,
                count: landingPages.length
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Failed to retrieve landing pages by status",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get landing pages by form type
    getLandingPagesByFormType = async (req: Request, res: Response): Promise<void> => {
        try {
            const { formType } = req.params;
            const landingPages = await this.landingPageService.getLandingPagesByFormType(formType as string);
            res.status(200).json({
                success: true,
                message: `Landing pages with form type '${formType}' retrieved successfully`,
                data: landingPages,
                count: landingPages.length
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Failed to retrieve landing pages by form type",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get published landing pages (public endpoint)
    getPublishedLandingPages = async (req: Request, res: Response): Promise<void> => {
        try {
            const paginationDto = {
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
                search: req.query.search as string,
                formType: req.query.formType as any,
                sortBy: req.query.sortBy as string,
                sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
            };

            const result = await this.landingPageService.getPublishedLandingPages(paginationDto);
            res.status(200).json({
                success: true,
                message: "Published landing pages retrieved successfully",
                data: result.landingPages,
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
                message: error.message || "Failed to retrieve published landing pages",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get landing page statistics
    getLandingPageStatistics = async (req: Request, res: Response): Promise<void> => {
        try {
            const statistics = await this.landingPageService.getLandingPageStatistics();
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

    // Bulk delete landing pages
    bulkDeleteLandingPages = async (req: Request, res: Response): Promise<void> => {
        try {
            const { ids } = req.body;
            
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                res.status(400).json({
                    success: false,
                    message: "Please provide an array of landing page IDs to delete"
                });
                return;
            }

            const result = await this.landingPageService.bulkDeleteLandingPages(ids);
            res.status(200).json({
                success: true,
                message: `${result.deletedCount} landing pages deleted successfully`,
                data: result
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Failed to delete landing pages",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Check slug uniqueness
    checkSlugUniqueness = async (req: Request, res: Response): Promise<void> => {
        try {
            const { slug, excludeId } = req.query;
            
            if (!slug || typeof slug !== 'string') {
                res.status(400).json({
                    success: false,
                    message: "Slug parameter is required"
                });
                return;
            }

            const isUnique = await this.landingPageService.isSlugUnique(slug, excludeId as string);
            res.status(200).json({
                success: true,
                data: {
                    slug,
                    isUnique,
                    message: isUnique ? "Slug is available" : "Slug is already taken"
                }
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to check slug uniqueness",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
}