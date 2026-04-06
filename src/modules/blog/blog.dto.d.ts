export interface ICreateBlogDto {
    title: string;
    content: string;
    image?: string;
    metaTitle?: string;
    metaDescription?: string;
    status?: "DRAFT" | "PUBLISHED";
}
export interface IUpdateBlogDto {
    title?: string;
    content?: string;
    image?: string;
    metaTitle?: string;
    metaDescription?: string;
    status?: "DRAFT" | "PUBLISHED";
}
export interface IBlogResponseDto {
    _id: string;
    title: string;
    slug: string;
    content: string;
    image: string;
    metaTitle: string;
    metaDescription: string;
    status: "DRAFT" | "PUBLISHED";
    createdAt: Date;
    updatedAt: Date;
}
export interface IPaginationDto {
    page?: number;
    limit?: number;
    search?: string;
    status?: "DRAFT" | "PUBLISHED";
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class BlogResponseDto implements IBlogResponseDto {
    _id: string;
    title: string;
    slug: string;
    content: string;
    image: string;
    metaTitle: string;
    metaDescription: string;
    status: "DRAFT" | "PUBLISHED";
    createdAt: Date;
    updatedAt: Date;
    constructor(blog: any);
}
export declare const generateSlug: (title: string) => string;
export declare const validateCreateBlog: (data: any) => string[];
export declare const validateUpdateBlog: (data: any) => string[];
//# sourceMappingURL=blog.dto.d.ts.map