// dtos/area.dto.ts
export class AreaResponseDto {
    _id;
    name;
    slug;
    description;
    image;
    metaTitle;
    metaDescription;
    createdAt;
    updatedAt;
    constructor(area) {
        this._id = area._id.toString();
        this.name = area.name;
        this.slug = area.slug;
        this.description = area.description;
        this.image = area.image || "";
        this.metaTitle = area.metaTitle || "";
        this.metaDescription = area.metaDescription || "";
        this.createdAt = area.createdAt;
        this.updatedAt = area.updatedAt;
    }
}
// Generate slug from name
export const generateSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+|-+$/g, "");
};
// Validation functions
export const validateCreateArea = (data) => {
    const errors = [];
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push("Name is required and must be a non-empty string");
    }
    else if (data.name.length < 2 || data.name.length > 100) {
        errors.push("Name must be between 2 and 100 characters");
    }
    else if (!/^[a-zA-Z\s\-']+$/.test(data.name)) {
        errors.push("Name can only contain letters, spaces, hyphens, and apostrophes");
    }
    if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
        errors.push("Description is required and must be a non-empty string");
    }
    else if (data.description.length < 10 || data.description.length > 5000) {
        errors.push("Description must be between 10 and 5000 characters");
    }
    // if (data.image && typeof data.image !== 'string') {
    //     errors.push("Image must be a string URL");
    // } else if (data.image && !data.image.match(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i)) {
    //     errors.push("Image must be a valid URL pointing to an image file");
    // }
    if (data.metaTitle !== undefined && data.metaTitle !== null) {
        if (typeof data.metaTitle !== 'string') {
            errors.push("Meta title must be a string");
        }
        else if (data.metaTitle.length > 160) {
            errors.push("Meta title cannot exceed 160 characters");
        }
    }
    if (data.metaDescription !== undefined && data.metaDescription !== null) {
        if (typeof data.metaDescription !== 'string') {
            errors.push("Meta description must be a string");
        }
        else if (data.metaDescription.length > 320) {
            errors.push("Meta description cannot exceed 320 characters");
        }
    }
    return errors;
};
export const validateUpdateArea = (data) => {
    const errors = [];
    if (data.name !== undefined) {
        if (typeof data.name !== 'string' || data.name.trim().length === 0) {
            errors.push("Name must be a non-empty string if provided");
        }
        else if (data.name.length < 2 || data.name.length > 100) {
            errors.push("Name must be between 2 and 100 characters");
        }
        else if (!/^[a-zA-Z\s\-']+$/.test(data.name)) {
            errors.push("Name can only contain letters, spaces, hyphens, and apostrophes");
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
    if (data.image !== undefined && typeof data.image !== 'string') {
        errors.push("Image must be a string URL");
    }
    if (data.metaTitle !== undefined && data.metaTitle !== null) {
        if (typeof data.metaTitle !== 'string') {
            errors.push("Meta title must be a string");
        }
        else if (data.metaTitle.length > 160) {
            errors.push("Meta title cannot exceed 160 characters");
        }
    }
    if (data.metaDescription !== undefined && data.metaDescription !== null) {
        if (typeof data.metaDescription !== 'string') {
            errors.push("Meta description must be a string");
        }
        else if (data.metaDescription.length > 320) {
            errors.push("Meta description cannot exceed 320 characters");
        }
    }
    return errors;
};
//# sourceMappingURL=area.dto.js.map