// dtos/report.dto.ts

export interface ICreateReportDto {
    title: string;
    description: string;
    fileUrl: string;
    image: string;
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
    slug: string;
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

export class ReportResponseDto implements IReportResponseDto {
    _id: string;
    title: string;
    slug: string;
    description: string;
    fileUrl: string;
    image: string;
    status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
    createdAt: Date;
    updatedAt: Date;

    constructor(report: any) {
        this._id = report._id.toString();
        this.title = report.title;
        this.slug = report.slug;;
        this.description = report.description;
        this.fileUrl = report.fileUrl;
        this.image = report.image || "";
        this.status = report.status;
        this.createdAt = report.createdAt;
        this.updatedAt = report.updatedAt;
    }
}

// Validation functions
export const validateCreateReport = (data: any): string[] => {
    const errors: string[] = [];

    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
        errors.push("Title is required and must be a non-empty string");
    } else if (data.title.length < 3 || data.title.length > 200) {
        errors.push("Title must be between 3 and 200 characters");
    }

    if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
        errors.push("Description is required and must be a non-empty string");
    } else if (data.description.length < 10 || data.description.length > 5000) {
        errors.push("Description must be between 10 and 5000 characters");
    }

    // if (!data.fileUrl || typeof data.fileUrl !== 'string' || data.fileUrl.trim().length === 0) {
    //     errors.push("File URL is required");
    // } else if (!data.fileUrl.match(/^(https?:\/\/.*\.(?:pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar))$/i)) {
    //     errors.push("File URL must be a valid URL pointing to a document file");
    // }

    // if (data.image && typeof data.image !== 'string') {
    //     errors.push("Image must be a string URL");
    // } else if (data.image && !data.image.match(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i)) {
    //     errors.push("Image must be a valid URL pointing to an image file");
    // }

    if (data.status && !["PUBLISHED", "DRAFT", "ARCHIVED"].includes(data.status)) {
        errors.push("Status must be either 'PUBLISHED', 'DRAFT', or 'ARCHIVED'");
    }

    return errors;
};

export const validateUpdateReport = (data: any): string[] => {
    const errors: string[] = [];

    if (data.title !== undefined) {
        if (typeof data.title !== 'string' || data.title.trim().length === 0) {
            errors.push("Title must be a non-empty string if provided");
        } else if (data.title.length < 3 || data.title.length > 200) {
            errors.push("Title must be between 3 and 200 characters");
        }
    }

    if (data.description !== undefined) {
        if (typeof data.description !== 'string' || data.description.trim().length === 0) {
            errors.push("Description must be a non-empty string if provided");
        } else if (data.description.length < 10 || data.description.length > 5000) {
            errors.push("Description must be between 10 and 5000 characters");
        }
    }

    if (data.fileUrl !== undefined) {
        if (typeof data.fileUrl !== 'string' || data.fileUrl.trim().length === 0) {
            errors.push("File URL must be a non-empty string if provided");
        } else if (!data.fileUrl.match(/^(https?:\/\/.*\.(?:pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar))$/i)) {
            errors.push("File URL must be a valid URL pointing to a document file");
        }
    }

    if (data.image !== undefined && typeof data.image !== 'string') {
        errors.push("Image must be a string URL");
    }

    if (data.status !== undefined && !["PUBLISHED", "DRAFT", "ARCHIVED"].includes(data.status)) {
        errors.push("Status must be either 'PUBLISHED', 'DRAFT', or 'ARCHIVED'");
    }

    return errors;
};

export const validateUpdateStatus = (data: any): string[] => {
    const errors: string[] = [];

    if (!data.status) {
        errors.push("Status is required");
    } else if (!["PUBLISHED", "DRAFT", "ARCHIVED"].includes(data.status)) {
        errors.push("Status must be either 'PUBLISHED', 'DRAFT', or 'ARCHIVED'");
    }

    return errors;
};