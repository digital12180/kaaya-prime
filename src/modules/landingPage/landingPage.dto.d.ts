export interface ICreateLandingPageDto {
    title: string;
    content: string;
    slug: string;
    formType?: "CONTACT" | "CONSULTATION" | "DOWNLOAD" | "NONE";
    status?: "PUBLISHED" | "DRAFT" | "DISABLED";
}
export interface IUpdateLandingPageDto {
    title?: string;
    content?: string;
    slug: string;
    formType?: "CONTACT" | "CONSULTATION" | "DOWNLOAD" | "NONE";
    status?: "PUBLISHED" | "DRAFT" | "DISABLED";
}
export interface IUpdateStatusDto {
    status: "PUBLISHED" | "DRAFT" | "DISABLED";
}
export interface ILandingPageResponseDto {
    _id: string;
    title: string;
    slug: string;
    content: string;
    formType: "CONTACT" | "CONSULTATION" | "DOWNLOAD" | "NONE";
    status: "PUBLISHED" | "DRAFT" | "DISABLED";
    createdAt: Date;
    updatedAt: Date;
}
export interface IPaginationDto {
    page?: number;
    limit?: number;
    search?: string;
    status?: "PUBLISHED" | "DRAFT" | "DISABLED";
    formType?: "CONTACT" | "CONSULTATION" | "DOWNLOAD" | "NONE";
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class LandingPageResponseDto implements ILandingPageResponseDto {
    _id: string;
    title: string;
    slug: string;
    content: string;
    formType: "CONTACT" | "CONSULTATION" | "DOWNLOAD" | "NONE";
    status: "PUBLISHED" | "DRAFT" | "DISABLED";
    createdAt: Date;
    updatedAt: Date;
    constructor(landingPage: any);
}
export declare const generateSlug: (title: string) => string;
export declare const validateCreateLandingPage: (data: any) => string[];
export declare const validateUpdateLandingPage: (data: any) => string[];
export declare const validateUpdateStatus: (data: any) => string[];
//# sourceMappingURL=landingPage.dto.d.ts.map