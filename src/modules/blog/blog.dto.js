// dtos/blog.dto.ts
export class BlogResponseDto {
    _id;
    title;
    slug;
    content;
    image;
    metaTitle;
    metaDescription;
    status;
    createdAt;
    updatedAt;
    constructor(blog) {
        this._id = blog._id.toString();
        this.title = blog.title;
        this.slug = blog.slug;
        this.content = blog.content;
        this.image = blog.image || "";
        this.metaTitle = blog.metaTitle || "";
        this.metaDescription = blog.metaDescription || "";
        this.status = blog.status;
        this.createdAt = blog.createdAt;
        this.updatedAt = blog.updatedAt;
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
export const validateCreateBlog = (data) => {
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
    if (data.status && !["DRAFT", "PUBLISHED"].includes(data.status)) {
        errors.push("Status must be either 'draft' or 'published'");
    }
    return errors;
};
export const validateUpdateBlog = (data) => {
    const errors = [];
    if (data.title !== undefined) {
        if (typeof data.title !== 'string' || data.title.trim().length === 0) {
            errors.push("Title must be a non-empty string if provided");
        }
        else if (data.title.length < 3 || data.title.length > 200) {
            errors.push("Title must be between 3 and 200 characters");
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
    if (data.status !== undefined && !["DRAFT", "PUBLISHED"].includes(data.status)) {
        errors.push("Status must be either 'draft' or 'published'");
    }
    return errors;
};
//# sourceMappingURL=blog.dto.js.map