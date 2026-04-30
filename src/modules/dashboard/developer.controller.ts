// src/controllers/developer-score.controller.ts
import type { Request, Response } from "express";
import { DeveloperScoreService } from "./developer.service.js";
import {
    createDeveloperScoreSchema,
    updateDeveloperScoreSchema,
    bulkCreateDeveloperScoreSchema,
} from "./validation.js";

export class DeveloperScoreController {
    private developerScoreService: DeveloperScoreService;

    constructor() {
        this.developerScoreService = new DeveloperScoreService();
    }

    // Create single record
    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const { error, value } = createDeveloperScoreSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.details.map((d) => d.message),
                });
                return;
            }

            const developerScore = await this.developerScoreService.create(value);
            res.status(201).json({
                success: true,
                data: developerScore,
                message: "Developer score created successfully",
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

    // Bulk create from specific format
    bulkCreate = async (req: Request, res: Response): Promise<void> => {
        try {
            const { error, value } = bulkCreateDeveloperScoreSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.details.map((d) => d.message),
                });
                return;
            }

            const { quarter } = req.query;
            const results = await this.developerScoreService.bulkCreateFromFormat(
                value,
                quarter as string
            );

            res.status(201).json({
                success: true,
                data: results,
                message: `${results.length} developer scores created successfully`,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

    // Get all records
    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const {
                quarter,
                developer,
                minScore,
                maxScore,
                page,
                limit,
                sortBy,
                sortOrder,
            } = req.query;

            const result = await this.developerScoreService.findAll({
                quarter: quarter as string,
                developer: developer as string,
                minScore: minScore ? parseInt(minScore as string) : undefined,
                maxScore: maxScore ? parseInt(maxScore as string) : undefined,
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

    // Get by ID
    getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const developerScore = await this.developerScoreService.findById(id as string);

            if (!developerScore) {
                res.status(404).json({
                    success: false,
                    message: "Developer score not found",
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: developerScore,
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

    // Get by developer and quarter
    getByDeveloperAndQuarter = async (req: Request, res: Response): Promise<void> => {
        try {
            const { developer, quarter } = req.params;
            const developerScore = await this.developerScoreService.findByDeveloperAndQuarter(
                developer as string,
                quarter as string 
            );

            if (!developerScore) {
                res.status(404).json({
                    success: false,
                    message: `Developer score for "${developer}" ${quarter ? `in quarter ${quarter} ` : ''}not found`,
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: developerScore,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

    // Update record
    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const { error, value } = updateDeveloperScoreSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.details.map((d) => d.message),
                });
                return;
            }

            const { id } = req.params;
            const developerScore = await this.developerScoreService.update(id as string, value);

            res.status(200).json({
                success: true,
                data: developerScore,
                message: "Developer score updated successfully",
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

    // Delete record
    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.developerScoreService.delete(id as string);
            res.status(200).json({
                success: true,
                message: "Developer score deleted successfully",
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

    // Delete by developer and quarter
    deleteByDeveloperAndQuarter = async (req: Request, res: Response): Promise<void> => {
        try {
            const { developer, quarter } = req.params;
            await this.developerScoreService.deleteByDeveloperAndQuarter(developer as string, quarter as string);
            res.status(200).json({
                success: true,
                message: `Developer score for "${developer}" ${quarter ? `in quarter ${quarter} ` : ''}deleted successfully`,
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

    // Get all quarters
    getQuarters = async (req: Request, res: Response): Promise<void> => {
        try {
            const quarters = await this.developerScoreService.getQuarters();
            res.status(200).json({
                success: true,
                data: quarters,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

    // Get all developers
    getDevelopers = async (req: Request, res: Response): Promise<void> => {
        try {
            const { quarter } = req.query;
            const developers = await this.developerScoreService.getDevelopers(quarter as string);
            res.status(200).json({
                success: true,
                data: developers,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };
}