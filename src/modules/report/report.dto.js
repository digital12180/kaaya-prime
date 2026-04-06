// dtos/report.dto.ts
export class ReportResponseDto {
    _id;
    title;
    description;
    fileUrl;
    image;
    status;
    createdAt;
    updatedAt;
    constructor(report) {
        this._id = report._id.toString();
        this.title = report.title;
        this.description = report.description;
        this.fileUrl = report.fileUrl;
        this.image = report.image || "";
        this.status = report.status;
        this.createdAt = report.createdAt;
        this.updatedAt = report.updatedAt;
    }
}
// Validation functions
export const validateCreateReport = (data) => {
    const errors = [];
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
        errors.push("Title is required and must be a non-empty string");
    }
    else if (data.title.length < 3 || data.title.length > 200) {
        errors.push("Title must be between 3 and 200 characters");
    }
    if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
        errors.push("Description is required and must be a non-empty string");
    }
    else if (data.description.length < 10 || data.description.length > 5000) {
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
export const validateUpdateReport = (data) => {
    const errors = [];
    if (data.title !== undefined) {
        if (typeof data.title !== 'string' || data.title.trim().length === 0) {
            errors.push("Title must be a non-empty string if provided");
        }
        else if (data.title.length < 3 || data.title.length > 200) {
            errors.push("Title must be between 3 and 200 characters");
        }
    }
    if (data.description !== undefined) {
        if (typeof data.description !== 'string' || data.description.trim().length === 0) {
            errors.push("Description must be a non-empty string if provided");
        }
        else if (data.description.length < 10 || data.description.length > 5000) {
            errors.push("Description must be between 10 and 5000 characters");
        }
    }
    if (data.fileUrl !== undefined) {
        if (typeof data.fileUrl !== 'string' || data.fileUrl.trim().length === 0) {
            errors.push("File URL must be a non-empty string if provided");
        }
        else if (!data.fileUrl.match(/^(https?:\/\/.*\.(?:pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar))$/i)) {
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
export const validateUpdateStatus = (data) => {
    const errors = [];
    if (!data.status) {
        errors.push("Status is required");
    }
    else if (!["PUBLISHED", "DRAFT", "ARCHIVED"].includes(data.status)) {
        errors.push("Status must be either 'PUBLISHED', 'DRAFT', or 'ARCHIVED'");
    }
    return errors;
};
//# sourceMappingURL=report.dto.js.map