// services/report.service.ts
import mongoose from "mongoose";
import { Report } from "./report.model.js";
import type {
    ICreateReportDto,
    IUpdateReportDto,
    IUpdateStatusDto,
    ReportResponseDto,
    IPaginationDto
} from "./report.dto.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";
import { generateSlug } from "../area/area.dto.js";

export class ReportService {

    // Create a new report
    async createReport(createDto: ICreateReportDto, imageFile: Express.Multer.File, pdfFile: Express.Multer.File): Promise<ReportResponseDto | any> {
        try {
            // Check if report with same title exists
            const slug = generateSlug(createDto.title);
            const existingReport = await Report.findOne({
                title: { $regex: new RegExp(`^${createDto.title}$`, 'i') }
            });

            if (existingReport) {
                throw new Error("A report with this title already exists");
            }
            if (!imageFile || !pdfFile) {
                throw new Error("Both image and PDF are required");
            }

            // ✅ Validate types
            if (!imageFile.mimetype.startsWith("image/")) {
                throw new Error("Invalid image file");
            }

            if (pdfFile.mimetype !== "application/pdf") {
                throw new Error("Invalid PDF file");
            }
            const imageUrl = await uploadToCloudinary(imageFile.buffer, "image");
            const pdfUrl = await uploadToCloudinary(pdfFile.buffer, "image");

            if (!imageUrl || !pdfUrl) {
                throw new Error("File upload failed");
            }
            const report = new Report({
                ...createDto,
                slug,
                image: imageUrl,
                fileUrl: pdfUrl,
                status: createDto.status || "DRAFT"
            });

            await report.save();
            return report;
        } catch (error: any) {
            if (error.code === 11000) {
                throw new Error("Duplicate report detected");
            }
            throw error;
        }
    }

    // Get all reports with pagination and search
    async getAllReports(paginationDto: IPaginationDto): Promise<{
        reports: any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const page = Math.max(1, paginationDto.page || 1);
        const limit = Math.min(100, Math.max(1, paginationDto.limit || 10));
        const skip = (page - 1) * limit;

        let query: any = {};

        // Search functionality (text search)
        if (paginationDto.search && paginationDto.search.trim()) {
            query.$text = { $search: paginationDto.search };
        }

        // Filter by status
        if (paginationDto.status) {
            query.status = paginationDto.status;
        }

        // Sorting
        let sort: any = { createdAt: -1 };
        if (paginationDto.sortBy) {
            const sortOrder = paginationDto.sortOrder === 'asc' ? 1 : -1;
            sort = { [paginationDto.sortBy]: sortOrder };
        }

        const [reports, total] = await Promise.all([
            Report.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Report.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            reports: reports,
            total,
            page,
            limit,
            totalPages
        };
    }

    // Get report by ID
    async getReportById(id: string): Promise<ReportResponseDto | any> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid report ID format");
        }

        const report = await Report.findById(id).lean();
        if (!report) {
            throw new Error("Report not found");
        }

        return report;
    }

    // Search reports by title
    async searchReportsByTitle(searchTerm: string, paginationDto: IPaginationDto): Promise<{
        reports: any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        if (!searchTerm || searchTerm.trim().length === 0) {
            throw new Error("Search term is required");
        }

        const page = Math.max(1, paginationDto.page || 1);
        const limit = Math.min(100, Math.max(1, paginationDto.limit || 10));
        const skip = (page - 1) * limit;

        // Case-insensitive title search using regex
        const query: any = {
            title: { $regex: searchTerm, $options: 'i' }
        };

        // Add status filter if provided
        if (paginationDto.status) {
            query.status = paginationDto.status;
        }

        const [reports, total] = await Promise.all([
            Report.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Report.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            reports: reports,
            total,
            page,
            limit,
            totalPages
        };
    }

    // Update report
    async updateReport(id: string, updateDto: IUpdateReportDto): Promise<ReportResponseDto | any> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid report ID format");
        }

        const existingReport = await Report.findById(id);
        if (!existingReport) {
            throw new Error("Report not found");
        }

        // Check if title is being updated and if it already exists
        if (updateDto.title && updateDto.title !== existingReport.title) {
            const titleExists = await Report.findOne({
                _id: { $ne: id },
                title: { $regex: new RegExp(`^${updateDto.title}$`, 'i') }
            });

            if (titleExists) {
                throw new Error("Another report with this title already exists");
            }
        }

        const report = await Report.findByIdAndUpdate(
            id,
            { ...updateDto, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).lean();

        if (!report) {
            throw new Error("Report not found");
        }

        return report;
    }

    // Update report status only
    async updateReportStatus(id: string, statusDto: IUpdateStatusDto): Promise<ReportResponseDto | any> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid report ID format");
        }

        const report = await Report.findByIdAndUpdate(
            id,
            { status: statusDto.status, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).lean();

        if (!report) {
            throw new Error("Report not found");
        }

        return report;
    }

    // Delete report
    async deleteReport(id: string): Promise<{ message: string; deletedId: string }> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid report ID format");
        }

        const report = await Report.findByIdAndDelete(id);
        if (!report) {
            throw new Error("Report not found");
        }

        return {
            message: "Report deleted successfully",
            deletedId: id
        };
    }

    // Get reports by status
    async getReportsByStatus(status: string): Promise<ReportResponseDto[] | any> {
        const validStatuses = ["PUBLISHED", "DRAFT", "ARCHIVED"];

        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
        }

        const reports = await Report.find({ status })
            .sort({ createdAt: -1 })
            .lean();

        return reports;
    }

    // Get report statistics
    async getReportStatistics(): Promise<any> {
        const [totalReports, publishedCount, draftCount, archivedCount, recentReports] = await Promise.all([
            Report.countDocuments(),
            Report.countDocuments({ status: "PUBLISHED" }),
            Report.countDocuments({ status: "DRAFT" }),
            Report.countDocuments({ status: "ARCHIVED" }),
            Report.find({ status: "PUBLISHED" })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean()
        ]);

        return {
            totalReports,
            publishedCount,
            draftCount,
            archivedCount,
            recentReports: recentReports
        };
    }

    // Bulk delete reports
    async bulkDeleteReports(ids: string[]): Promise<{ deletedCount: number; deletedIds: string[] }> {
        const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));

        if (validIds.length === 0) {
            throw new Error("No valid report IDs provided");
        }

        const result = await Report.deleteMany({
            _id: { $in: validIds }
        });

        return {
            deletedCount: result.deletedCount || 0,
            deletedIds: validIds
        };
    }

    // Get published reports only (for public viewing)
    async getPublishedReports(paginationDto: IPaginationDto): Promise<{
        reports: ReportResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        paginationDto.status = "PUBLISHED";
        return this.getAllReports(paginationDto);
    }
}