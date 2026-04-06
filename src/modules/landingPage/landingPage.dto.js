// dtos/landingPage.dto.ts
export class LandingPageResponseDto {
    _id;
    title;
    slug;
    content;
    formType;
    status;
    createdAt;
    updatedAt;
    constructor(landingPage) {
        this._id = landingPage._id.toString();
        this.title = landingPage.title;
        this.slug = landingPage.slug;
        this.content = landingPage.content;
        this.formType = landingPage.formType;
        this.status = landingPage.status;
        this.createdAt = landingPage.createdAt;
        this.updatedAt = landingPage.updatedAt;
    }
}
// Generate slug from title
export const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+|-+$/g, "");
};
// Validation functions
export const validateCreateLandingPage = (data) => {
    const errors = [];
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
        errors.push("Title is required and must be a non-empty string");
    }
    else if (data.title.length < 3 || data.title.length > 200) {
        errors.push("Title must be between 3 and 200 characters");
    }
    if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
        errors.push("Content is required and must be a non-empty string");
    }
    else if (data.content.length < 10) {
        errors.push("Content must be at least 10 characters long");
    }
    if (data.formType && !["CONTACT", "CONSULTATION", "DOWNLOAD", "NONE"].includes(data.formType)) {
        errors.push("Form type must be one of: CONTACT, CONSULTATION, DOWNLOAD, NONE");
    }
    if (data.status && !["PUBLISHED", "DRAFT", "DISABLED"].includes(data.status)) {
        errors.push("Status must be one of: PUBLISHED, DRAFT, DISABLED");
    }
    return errors;
};
export const validateUpdateLandingPage = (data) => {
    const errors = [];
    if (data.title !== undefined) {
        if (typeof data.title !== 'string' || data.title.trim().length === 0) {
            errors.push("Title must be a non-empty string if provided");
        }
        else if (data.title.length < 3 || data.title.length > 200) {
            errors.push("Title must be between 3 and 200 characters");
        }
    }
    if (data.slug !== undefined) {
        if (typeof data.slug !== 'string' || data.slug.trim().length === 0) {
            errors.push("slug must be a non-empty string if provided");
        }
        else if (data.slug.length < 3 || data.slug.length > 200) {
            errors.push("slug must be between 3 and 200 characters");
        }
    }
    if (data.content !== undefined) {
        if (typeof data.content !== 'string' || data.content.trim().length === 0) {
            errors.push("Content must be a non-empty string if provided");
        }
        else if (data.content.length < 10) {
            errors.push("Content must be at least 10 characters long");
        }
    }
    if (data.formType !== undefined && !["CONTACT", "CONSULTATION", "DOWNLOAD", "NONE"].includes(data.formType)) {
        errors.push("Form type must be one of: CONTACT, CONSULTATION, DOWNLOAD, NONE");
    }
    if (data.status !== undefined && !["PUBLISHED", "DRAFT", "DISABLED"].includes(data.status)) {
        errors.push("Status must be one of: PUBLISHED, DRAFT, DISABLED");
    }
    return errors;
};
export const validateUpdateStatus = (data) => {
    const errors = [];
    if (!data.status) {
        errors.push("Status is required");
    }
    else if (!["PUBLISHED", "DRAFT", "DISABLED"].includes(data.status)) {
        errors.push("Status must be one of: PUBLISHED, DRAFT, DISABLED");
    }
    return errors;
};
//# sourceMappingURL=landingPage.dto.js.map