// controllers/area.controller.ts
import type { Request, Response } from "express";
import { AreaService } from "./area.service.js";
import {
    validateCreateArea,
    validateUpdateArea
} from "./area.dto.js";

export class AreaController {
    private areaService: AreaService;

    constructor() {
        this.areaService = new AreaService();
    }

    // Create area
    createArea = async (req: Request, res: Response): Promise<void> => {
        try {
            // Validate request data
            const validationErrors = validateCreateArea(req.body);
            if (validationErrors.length > 0) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: validationErrors
                });
                return;
            }
            const file = req.file as Express.Multer.File;
            if (!file) {
                res.status(400).json({
                    success: false,
                    message: "File required",
                });
                return;
            }
            const area = await this.areaService.createArea(req.body, file);
            res.status(201).json({
                success: true,
                message: "Area created successfully",
                data: area
            });
        } catch (error: any) {
            const status = error.message.includes("already exists") ? 409 : 400;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to create area",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get all areas with pagination
    getAllAreas = async (req: Request, res: Response): Promise<void> => {
        try {
            const paginationDto = {
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
                search: req.query.search as string,
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

            // Validate sortBy field
            if (paginationDto.sortBy && !['name', 'createdAt', 'updatedAt'].includes(paginationDto.sortBy)) {
                res.status(400).json({
                    success: false,
                    message: "sortBy must be one of: name, createdAt, updatedAt"
                });
                return;
            }

            const result = await this.areaService.getAllAreas(paginationDto);
            res.status(200).json({
                success: true,
                message: "Areas retrieved successfully",
                data: result.areas,
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
                message: error.message || "Failed to retrieve areas",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get area by ID
    getAreaById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const area = await this.areaService.getAreaById(id as string);
            res.status(200).json({
                success: true,
                message: "Area retrieved successfully",
                data: area
            });
        } catch (error: any) {
            const status = error.message === "Invalid area ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to retrieve area",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get area by slug (SEO-friendly)
    getAreaBySlug = async (req: Request, res: Response): Promise<void> => {
        try {
            const { slug } = req.params;
            const area = await this.areaService.getAreaBySlug(slug as string);
            res.status(200).json({
                success: true,
                message: "Area retrieved successfully",
                data: area
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message || "Failed to retrieve area",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Update area
    updateArea = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            // Validate update data
            const validationErrors = validateUpdateArea(req.body);
            if (validationErrors.length > 0) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: validationErrors
                });
                return;
            }
            const file=req.file as Express.Multer.File;
            const area = await this.areaService.updateArea(id as string, req.body,file);
            res.status(200).json({
                success: true,
                message: "Area updated successfully",
                data: area
            });
        } catch (error: any) {
            const status = error.message === "Invalid area ID format" ? 400 :
                error.message.includes("already exists") ? 409 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to update area",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Delete area
    deleteArea = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const result = await this.areaService.deleteArea(id as string);
            res.status(200).json({
                success: true,
                message: result.message,
                data: { deletedId: result.deletedId }
            });
        } catch (error: any) {
            const status = error.message === "Invalid area ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to delete area",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get area statistics
    getAreaStatistics = async (req: Request, res: Response): Promise<void> => {
        try {
            const statistics = await this.areaService.getAreaStatistics();
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

            const isUnique = await this.areaService.isSlugUnique(slug, excludeId as string);
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
    searchAreaByName = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name } = req.query;

            if (!name || typeof name !== 'string') {
                res.status(400).json({
                    success: false,
                    message: "Name parameter is required"
                });
                return;
            }

            const areas = await this.areaService.searchAreaByName(name);
            res.status(200).json({
                success: true,
                data: areas
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