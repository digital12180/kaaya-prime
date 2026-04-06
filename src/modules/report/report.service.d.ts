import type { ICreateReportDto, IUpdateReportDto, IUpdateStatusDto, ReportResponseDto, IPaginationDto } from "./report.dto.js";
export declare class ReportService {
    createReport(createDto: ICreateReportDto): Promise<ReportResponseDto | any>;
    getAllReports(paginationDto: IPaginationDto): Promise<{
        reports: any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getReportById(id: string): Promise<ReportResponseDto | any>;
    searchReportsByTitle(searchTerm: string, paginationDto: IPaginationDto): Promise<{
        reports: any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateReport(id: string, updateDto: IUpdateReportDto): Promise<ReportResponseDto | any>;
    updateReportStatus(id: string, statusDto: IUpdateStatusDto): Promise<ReportResponseDto | any>;
    deleteReport(id: string): Promise<{
        message: string;
        deletedId: string;
    }>;
    getReportsByStatus(status: string): Promise<ReportResponseDto[] | any>;
    getReportStatistics(): Promise<any>;
    bulkDeleteReports(ids: string[]): Promise<{
        deletedCount: number;
        deletedIds: string[];
    }>;
    getPublishedReports(paginationDto: IPaginationDto): Promise<{
        reports: ReportResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
//# sourceMappingURL=report.service.d.ts.map