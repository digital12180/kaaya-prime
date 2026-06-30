import { Report } from './report.model.js';
import type { IReport } from './report.model.js';
import mongoose from 'mongoose';
import type { ICreateReportDto, IUpdateReportDto, IReportQueryDto } from './report.dto.js';

export class ReportService {
    // async createReport(reportData: ICreateReportDto): Promise<IReport> {

    //         console.log("data in service-------",reportData)

    //     const report = new Report(reportData);
    //     return await report.save();
    // }

    async createReport(reportData: ICreateReportDto): Promise<IReport> {

        const report = new Report(reportData);

        return await report.save();

    }
    async getAllReports(queryParams: IReportQueryDto): Promise<{
        reports: IReport[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const {
            page = 1,
            limit = 10,
            search,
            type,
            region,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = queryParams;

        const skip = (page - 1) * limit;
        const sortOptions: any = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Build query
        const query: any = {};

        // Filter by type (if not 'all')
        if (type && type !== 'all') {
            query.type = type;
        }

        // Filter by region
        if (region) {
            query.region = region;
        }

        // Search functionality
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { region: { $regex: search, $options: 'i' } },
            ];
        }

        const [reports, total] = await Promise.all([
            Report.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .lean(),
            Report.countDocuments(query),
        ]);

        return {
            reports,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getReportById(id: string): Promise<IReport | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Report.findById(id).lean();
    }

    async getReportBySlug(slug: string): Promise<IReport | null> {
        return await Report.findOne({ slug }).lean();
    }

    async updateReport(
        id: string,
        updateData: IUpdateReportDto
    ): Promise<IReport | null> {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        const report = await Report.findById(id);

        if (!report) {
            return null;
        }

        Object.assign(report, updateData);

        await report.save();

        return report.toObject();
    }

    async deleteReport(id: string): Promise<IReport | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Report.findByIdAndDelete(id).lean();
    }

    async getReportsByType(type: 'all' | 'marketinsights' | 'annualreport'): Promise<IReport[]> {
        const query = type === 'all' ? {} : { type };
        return await Report.find(query).sort({ createdAt: -1 }).lean();
    }

    async getReportStats(): Promise<{
        total: number;
        marketinsights: number;
        annualreport: number;
    }> {
        const [total, marketinsights, annualreport] = await Promise.all([
            Report.countDocuments(),
            Report.countDocuments({ type: 'marketinsights' }),
            Report.countDocuments({ type: 'annualreport' }),
        ]);

        return {
            total,
            marketinsights,
            annualreport,
        };
    }
}