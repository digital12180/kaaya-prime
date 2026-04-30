// src/controllers/stage.controller.ts
import type { Request, Response } from "express";
import { StageService } from "./stage.service.js";
import {
    createStageSchema,
    updateStageSchema,
    bulkCreateStagesSchema,
    reorderStagesSchema,
} from "./validation.js";

export class StageController {
    private stageService: StageService;

    constructor() {
        this.stageService = new StageService();
    }

    // Create single stage
    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const { error, value } = createStageSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.details.map((d) => d.message),
                });
                return;
            }

            const stage = await this.stageService.create(value);
            res.status(201).json({
                success: true,
                data: stage,
                message: "Stage created successfully",
            });
        } catch (error: any) {
            if (error.message.includes("already exists")) {
                res.status(409).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        }
    };

    // Get all stages with filters
    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const {
                isActive,
                category,
                page,
                limit,
                sortBy,
                sortOrder,
            } = req.query;

            const result = await this.stageService.findAll({
                isActive: isActive !== undefined ? isActive === 'true' : undefined,
                category: category as string,
                page: page ? parseInt(page as string) : undefined,
                limit: limit ? parseInt(limit as string) : undefined,
                sortBy: sortBy as any,
                sortOrder: sortOrder as any,
            } as any);

            res.status(200).json({
                success: true,
                data: result.data,
                pagination: result.pagination,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

    // Get active stages (for frontend)
    getActiveStages = async (req: Request, res: Response): Promise<void> => {
        try {
            const stages = await this.stageService.getActiveStages();
            res.status(200).json({
                success: true,
                data: stages,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

    // Get stage by ID
    getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const stage = await this.stageService.findById(id as string);

            if (!stage) {
                res.status(404).json({
                    success: false,
                    message: "Stage not found",
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: stage,
            });
        } catch (error: any) {
            if (error.message === "Invalid ID format") {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        }
    };

    // Get stage by order
    getByOrder = async (req: Request, res: Response): Promise<void> => {
        try {
            const { order } = req.params;
            const stage = await this.stageService.findByOrder(parseInt(order as any));

            if (!stage) {
                res.status(404).json({
                    success: false,
                    message: `Stage with order ${order} not found`,
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: stage,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

    // Get stage by tag
    getByTag = async (req: Request, res: Response): Promise<void> => {
        try {
            const { tag } = req.params;
            const stage = await this.stageService.findByTag(decodeURIComponent(tag as any));

            if (!stage) {
                res.status(404).json({
                    success: false,
                    message: `Stage with tag "${tag}" not found`,
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: stage,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

    // Update stage
    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const { error, value } = updateStageSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.details.map((d) => d.message),
                });
                return;
            }

            const { id } = req.params;
            const stage = await this.stageService.update(id as string, value);

            res.status(200).json({
                success: true,
                data: stage,
                message: "Stage updated successfully",
            });
        } catch (error: any) {
            if (error.message === "Invalid ID format") {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else if (error.message.includes("not found")) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            } else if (error.message.includes("already exists")) {
                res.status(409).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        }
    };

    // Delete stage
    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.stageService.delete(id as string);
            res.status(200).json({
                success: true,
                message: "Stage deleted successfully",
            });
        } catch (error: any) {
            if (error.message === "Invalid ID format") {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else if (error.message.includes("not found")) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        }
    };

    // Reorder stages
    reorderStages = async (req: Request, res: Response): Promise<void> => {
        try {
            const { error, value } = reorderStagesSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.details.map((d) => d.message),
                });
                return;
            }

            const stages = await this.stageService.reorderStages(value.stages);
            res.status(200).json({
                success: true,
                data: stages,
                message: "Stages reordered successfully",
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

    // Toggle stage active status
    toggleActive = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const stage = await this.stageService.toggleActive(id as string);
            res.status(200).json({
                success: true,
                data: stage,
                message: `Stage ${stage?.isActive ? 'activated' : 'deactivated'} successfully`,
            });
        } catch (error: any) {
            if (error.message.includes("not found")) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        }
    };
}