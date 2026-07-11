import type { Request, Response } from "express";
import { CareerService } from "./career.service.js";
import type { CreateCareerDTO, UpdateCareerDTO, CareerQueryParams } from "./career.dto.js";

export class CareerController {
    private careerService: CareerService;

    constructor() {
        this.careerService = new CareerService();
    }

    // Create Career
    createCareer = async (req: Request, res: Response): Promise<void> => {
        try {
            const data: CreateCareerDTO = req.body;
            const file = req.file;

            const career = await this.careerService.createCareer(data, file);

            res.status(201).json({
                success: true,
                message: "Career created successfully",
                data: career,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Failed to create career",
            });
        }
    };

    // Get All Careers with Pagination
    getCareers = async (req: Request, res: Response): Promise<void> => {
        try {
            const params: CareerQueryParams | any = {
                page: req.query.page ? parseInt(req.query.page as string) : undefined,
                limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
                fullName: req.query.fullName as string,
                location: req.query.location as string,
                search: req.query.search as string,
            };

            const result = await this.careerService.getCareers(params);

            res.status(200).json({
                success: true,
                message: "Careers retrieved successfully",
                ...result,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Failed to retrieve careers",
            });
        }
    };

    // Get Single Career
    getCareerById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const career = await this.careerService.getCareerById(id as string);

            if (!career) {
                res.status(404).json({
                    success: false,
                    message: "Career not found",
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Career retrieved successfully",
                data: career,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Failed to retrieve career",
            });
        }
    };

    // Update Career
    updateCareer = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const data: UpdateCareerDTO = req.body;
            const file = req.file;

            const career = await this.careerService.updateCareer(id as string, data, file);

            if (!career) {
                res.status(404).json({
                    success: false,
                    message: "Career not found",
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Career updated successfully",
                data: career,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Failed to update career",
            });
        }
    };

    // Delete Career
    deleteCareer = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const deleted = await this.careerService.deleteCareer(id as string);

            if (!deleted) {
                res.status(404).json({
                    success: false,
                    message: "Career not found",
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Career deleted successfully",
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Failed to delete career",
            });
        }
    };
}