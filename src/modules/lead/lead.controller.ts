// controllers/lead.controller.ts
import type { Request, Response } from "express";
import { LeadService } from "./lead.service.js";
import type { CreateLeadDto, UpdateLeadDto, PaginationDto } from "./lead.dto.js";
import { validate } from "class-validator";


export class LeadController {
    private leadService: LeadService;

    constructor() {
        this.leadService = new LeadService();
    }

    // Create lead
    createLead = async (req: Request, res: Response): Promise<void> => {
        try {
            const createLeadDto: CreateLeadDto = req.body;
            // Object.assign(createLeadDto, req.body);

            // Validate DTO
            // const errors = await validate(createLeadDto);

            // console.log("errroo--",errors);

            // if (errors.length > 0) {
            //     res.status(400).json({
            //         success: false,
            //         message: "Validation failed",
            //         errors: errors.map(err => ({
            //             property: err.property,
            //             constraints: err.constraints
            //         }))
            //     });
            //     return;
            // }

            const lead = await this.leadService.createLead(createLeadDto);
            res.status(201).json({
                success: true,
                message: "Lead created successfully",
                data: lead
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Failed to create lead",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get all leads with pagination
    getAllLeads = async (req: Request, res: Response): Promise<void> => {
        try {
            const paginationDto: PaginationDto = req.query;
            paginationDto.page = req.query.page ? parseInt(req.query.page as string) : 1;
            paginationDto.limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            paginationDto.search = req.query.search as string;
            paginationDto.source = req.query.source as string;

            // Validate pagination params
            if (paginationDto.page && (paginationDto.page < 1 || isNaN(paginationDto.page))) {
                res.status(400).json({
                    success: false,
                    message: "Page must be a positive number"
                });
                return;
            }

            if (paginationDto.limit && (paginationDto.limit < 1 || paginationDto.limit > 100 || isNaN(paginationDto.limit))) {
                res.status(400).json({
                    success: false,
                    message: "Limit must be between 1 and 100"
                });
                return;
            }

            const result = await this.leadService.getAllLeads(paginationDto);
            res.status(200).json({
                success: true,
                message: "Leads retrieved successfully",
                data: result.leads,
                pagination: {
                    page: result.page,
                    limit: paginationDto.limit,
                    total: result.total,
                    totalPages: result.totalPages
                }
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve leads",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get lead by ID
    getLeadById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const lead = await this.leadService.getLeadById(id as string);
            res.status(200).json({
                success: true,
                message: "Lead retrieved successfully",
                data: lead
            });
        } catch (error: any) {
            const status = error.message === "Invalid lead ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to retrieve lead",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Update lead
    updateLead = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const updateLeadDto: UpdateLeadDto = req.body;
            // Object.assign(updateLeadDto, req.body);

            // Validate DTO
            // const errors = await validate(updateLeadDto);
            // if (errors.length > 0) {
            //     res.status(400).json({
            //         success: false,
            //         message: "Validation failed",
            //         errors: errors.map(err => ({
            //             property: err.property,
            //             constraints: err.constraints
            //         }))
            //     });
            //     return;
            // }

            const lead = await this.leadService.updateLead(id as string, updateLeadDto);
            res.status(200).json({
                success: true,
                message: "Lead updated successfully",
                data: lead
            });
        } catch (error: any) {
            const status = error.message === "Invalid lead ID format" ? 400 :
                error.message.includes("already exists") ? 409 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to update lead",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Delete lead
    deleteLead = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const result = await this.leadService.deleteLead(id as string);
            res.status(200).json({
                success: true,
                message: result.message,
                data: { deletedId: result.deletedId }
            });
        } catch (error: any) {
            const status = error.message === "Invalid lead ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to delete lead",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get lead statistics
    getLeadStatistics = async (req: Request, res: Response): Promise<void> => {
        try {
            const statistics = await this.leadService.getLeadStatistics();
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

    searchLead = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name } = req.query;

            const result = await this.leadService.searchLead(name as string);
            res.status(200).json({
                success: true,
                message: "leads retrieved successfully",
                data: result
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve statistics",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

}