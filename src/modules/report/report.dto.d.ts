export interface ICreateReportDto {
    title: string;
    description: string;
    fileUrl: string;
    image?: string;
    status?: "PUBLISHED" | "DRAFT" | "ARCHIVED";
}
export interface IUpdateReportDto {
    title?: string;
    description?: string;
    fileUrl?: string;
    image?: string;
    status?: "PUBLISHED" | "DRAFT" | "ARCHIVED";
}
export interface IUpdateStatusDto {
    status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
}
export interface IReportResponseDto {
    _id: string;
    title: string;
    description: string;
    fileUrl: string;
    image: string;
    status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
    createdAt: Date;
    updatedAt: Date;
}
export interface IPaginationDto {
    page?: number;
    limit?: number;
    search?: string;
    status?: "PUBLISHED" | "DRAFT" | "ARCHIVED";
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class ReportResponseDto implements IReportResponseDto {
    _id: string;
    title: string;
    description: string;
    fileUrl: string;
    image: string;
    status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
    createdAt: Date;
    updatedAt: Date;
    constructor(report: any);
}
export declare const validateCreateReport: (data: any) => string[];
export declare const validateUpdateReport: (data: any) => string[];
export declare const validateUpdateStatus: (data: any) => string[];
//# sourceMappingURL=report.dto.d.ts.map