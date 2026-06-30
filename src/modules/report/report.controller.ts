import type { Request, Response } from 'express';
import { ReportService } from './report.service.js';
import type { ICreateReportDto, IUpdateReportDto, IReportQueryDto } from './report.dto.js';
import { uploadToCloudinary } from '../../config/cloudinary.js';
const reportService = new ReportService();

export class ReportController {

    async createReport(req: Request, res: Response): Promise<Response> {
        try {

            const body = req.body;

            const files = req.files as {
                image?: Express.Multer.File[];
                file?: Express.Multer.File[];
            };

            let imageUrl = "";
            let fileUrl = "";

            if (files?.image?.[0]) {
                imageUrl = await uploadToCloudinary(
                    files.image[0].buffer,
                    "image"
                );
            }

            if (files?.file?.[0]) {
                fileUrl = await uploadToCloudinary(
                    files.file[0].buffer,
                    "raw"
                );
            }

            // Upload Image
            // if (files?.image?.length) {
            //     imageUrl = await uploadToCloudinary(
            //         files.image[0].buffer,
            //         "image"
            //     );
            // }

            // Upload PDF
            // if (files?.file?.length) {
            //     fileUrl = await uploadToCloudinary(
            //         files.file[0].buffer,
            //         "raw"
            //     );
            // }

            // const files = req.files as {
            //     image?: Express.Multer.File[];
            //     file?: Express.Multer.File[];
            // };


            // if (files?.image?.[0]) {
            //     imageUrl = await uploadToCloudinary(files.image[0].buffer, "image");
            // }

            // if (files?.file?.[0]) {
            //     fileUrl = await uploadToCloudinary(files.file[0].buffer, "raw");
            // }
            const reportData: ICreateReportDto = {
                ...body,
                imageUrl,
                fileUrl,
            };

            console.log(reportData);

            const report = await reportService.createReport(reportData);

            return res.status(201).json({
                success: true,
                message: "Report created successfully",
                data: report,
            });

        } catch (error: any) {

            if (error.code === 11000 && error.keyPattern?.slug) {
                return res.status(409).json({
                    success: false,
                    message: "Slug already exists",
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Get all reports with filtering and pagination
    async getAllReports(req: Request, res: Response): Promise<Response> {
        try {
            const queryParams: IReportQueryDto = {
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
                search: req.query.search as string,
                type: req.query.type as 'all' | 'marketinsights' | 'annualreport',
                region: req.query.region as string,
                sortBy: req.query.sortBy as string,
                sortOrder: req.query.sortOrder as 'asc' | 'desc',
            };

            const result = await reportService.getAllReports(queryParams);

            return res.status(200).json({
                success: true,
                message: 'Reports retrieved successfully',
                data: result.reports,
                pagination: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: result.totalPages,
                },
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve reports',
                error: error.message,
            });
        }
    }

    // Get report by ID
    async getReportById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const report = await reportService.getReportById(id as string);

            if (!report) {
                return res.status(404).json({
                    success: false,
                    message: 'Report not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Report retrieved successfully',
                data: report,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve report',
                error: error.message,
            });
        }
    }

    // Get report by slug
    async getReportBySlug(req: Request, res: Response): Promise<Response> {
        try {
            const { slug } = req.params;
            const report = await reportService.getReportBySlug(slug as string);

            if (!report) {
                return res.status(404).json({
                    success: false,
                    message: 'Report not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Report retrieved successfully',
                data: report,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve report',
                error: error.message,
            });
        }
    }

    // Update report
    async updateReport(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const updateData: IUpdateReportDto = req.body;

            const updatedReport = await reportService.updateReport(id as string, updateData);

            if (!updatedReport) {
                return res.status(404).json({
                    success: false,
                    message: 'Report not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Report updated successfully',
                data: updatedReport,
            });
        } catch (error: any) {
            // Handle duplicate slug error
            if (error.code === 11000 && error.keyPattern?.slug) {
                return res.status(409).json({
                    success: false,
                    message: 'A report with this slug already exists',
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Failed to update report',
                error: error.message,
            });
        }
    }

    // Delete report
    async deleteReport(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const deletedReport = await reportService.deleteReport(id as string);

            if (!deletedReport) {
                return res.status(404).json({
                    success: false,
                    message: 'Report not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Report deleted successfully',
                data: deletedReport,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete report',
                error: error.message,
            });
        }
    }

    // Get report statistics
    async getReportStats(req: Request, res: Response): Promise<Response> {
        try {
            const stats = await reportService.getReportStats();

            return res.status(200).json({
                success: true,
                message: 'Report statistics retrieved successfully',
                data: stats,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve report statistics',
                error: error.message,
            });
        }
    }

    // Get reports by type
    async getReportsByType(req: Request, res: Response): Promise<Response> {
        try {
            const { type } = req.params;

            if (!['all', 'marketinsights', 'annualreport'].includes(type as string)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid type. Must be: all, marketinsights, or annualreport',
                });
            }

            const reports = await reportService.getReportsByType(
                type as 'all' | 'marketinsights' | 'annualreport'
            );

            return res.status(200).json({
                success: true,
                message: 'Reports retrieved successfully',
                data: reports,
                count: reports.length,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve reports',
                error: error.message,
            });
        }
    }
}