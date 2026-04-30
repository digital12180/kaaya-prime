// src/controllers/rental-yield.controller.ts
import type { Request, Response } from "express";
import { RentalYieldService } from "./rental-yield.service.js";
import {
    createRentalYieldSchema,
    updateRentalYieldSchema,
    bulkCreateRentalYieldSchema,
} from "./validation.js";

export class RentalYieldController {
    private rentalYieldService: RentalYieldService;

    constructor() {
        this.rentalYieldService = new RentalYieldService();
    }

    // Create single record
    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const { error, value } = createRentalYieldSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.message
                });
                return;
            }

            const rentalYield = await this.rentalYieldService.create(value);
            res.status(201).json({
                success: true,
                data: rentalYield,
                message: "Rental yield record created successfully",
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
            const { error, value } = bulkCreateRentalYieldSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.message
                });
                return;
            }

            const { quarter } = req.query;
            if (!quarter) {
                res.status(400).json({
                    success: false,
                    message: "Quarter parameter is required (e.g., Q1 2026)",
                });
                return;
            }

            const results = await this.rentalYieldService.bulkCreateFromFormat(value, quarter as string);
            res.status(201).json({
                success: true,
                data: results,
                message: `${results.length} rental yield records created successfully`,
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
            const { quarter, area, page, limit } = req.query;
            const result = await this.rentalYieldService.findAll({
                quarter: quarter as string,
                area: area as string,
                page: page ? parseInt(page as string) : undefined,
                limit: limit ? parseInt(limit as string) : undefined,
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
            const rentalYield = await this.rentalYieldService.findById(id as string);

            if (!rentalYield) {
                res.status(404).json({
                    success: false,
                    message: "Rental yield record not found",
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: rentalYield,
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

    // Get by area and quarter
    getByAreaAndQuarter = async (req: Request, res: Response): Promise<void> => {
        try {
            const { area, quarter } = req.params;
            const rentalYield = await this.rentalYieldService.findByAreaAndQuarter(area as string, quarter as string);

            if (!rentalYield) {
                res.status(404).json({
                    success: false,
                    message: `Rental yield for area "${area}" in quarter "${quarter}" not found`,
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: rentalYield,
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
            const { error, value } = updateRentalYieldSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.message
                });
                return;
            }

            const { id } = req.params;
            const rentalYield = await this.rentalYieldService.update(id as string, value);
            res.status(200).json({
                success: true,
                data: rentalYield,
                message: "Rental yield record updated successfully",
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
            await this.rentalYieldService.delete(id as string);
            res.status(200).json({
                success: true,
                message: "Rental yield record deleted successfully",
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

    // Delete by area and quarter
    deleteByAreaAndQuarter = async (req: Request, res: Response): Promise<void> => {
        try {
            const { area, quarter } = req.params;
            await this.rentalYieldService.deleteByAreaAndQuarter(area as string, quarter as string);
            res.status(200).json({
                success: true,
                message: `Rental yield for area "${area}" in quarter "${quarter}" deleted successfully`,
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
            const quarters = await this.rentalYieldService.getQuarters();
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

}