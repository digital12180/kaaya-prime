// dtos/opportunity.dto.ts
export class OpportunityResponseDto {
    _id;
    title;
    description;
    location;
    image;
    status;
    createdAt;
    updatedAt;
    constructor(opportunity) {
        this._id = opportunity._id.toString();
        this.title = opportunity.title;
        this.description = opportunity.description;
        this.location = opportunity.location;
        this.image = opportunity.image || "";
        this.status = opportunity.status;
        this.createdAt = opportunity.createdAt;
        this.updatedAt = opportunity.updatedAt;
    }
}
// Validation functions
export const validateCreateOpportunity = (data) => {
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
    if (!data.location || typeof data.location !== 'string' || data.location.trim().length === 0) {
        errors.push("Location is required and must be a non-empty string");
    }
    else if (data.location.length < 2 || data.location.length > 100) {
        errors.push("Location must be between 2 and 100 characters");
    }
    if (data.image && typeof data.image !== 'string') {
        errors.push("Image must be a string URL");
    }
    else if (data.image && !data.image.match(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i)) {
        errors.push("Image must be a valid URL pointing to an image file");
    }
    if (data.status) {
        const validStatuses = ["ACTIVE", "UPCOMING", "SOLD OUT", "UNDER REVIEW"];
        if (!validStatuses.includes(data.status)) {
            errors.push(`Status must be one of: ${validStatuses.join(", ")}`);
        }
    }
    return errors;
};
export const validateUpdateOpportunity = (data) => {
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
    if (data.location !== undefined) {
        if (typeof data.location !== 'string' || data.location.trim().length === 0) {
            errors.push("Location must be a non-empty string if provided");
        }
        else if (data.location.length < 2 || data.location.length > 100) {
            errors.push("Location must be between 2 and 100 characters");
        }
    }
    if (data.image !== undefined && typeof data.image !== 'string') {
        errors.push("Image must be a string URL");
    }
    if (data.status !== undefined) {
        const validStatuses = ["ACTIVE", "UPCOMING", "SOLD OUT", "UNDER REVIEW"];
        if (!validStatuses.includes(data.status)) {
            errors.push(`Status must be one of: ${validStatuses.join(", ")}`);
        }
    }
    return errors;
};
//# sourceMappingURL=opportunity.dto.js.map