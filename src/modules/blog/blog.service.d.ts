import type { ICreateBlogDto, IUpdateBlogDto, BlogResponseDto, IPaginationDto } from "./blog.dto.js";
export declare class BlogService {
    createBlog(createDto: ICreateBlogDto): Promise<BlogResponseDto | any>;
    getAllBlogs(paginationDto: IPaginationDto): Promise<{
        blogs: any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getBlogById(id: string): Promise<BlogResponseDto | any>;
    getBlogBySlug(slug: string): Promise<BlogResponseDto | any>;
    searchBlogsByTitle(searchTerm: string, paginationDto: IPaginationDto): Promise<{
        blogs: any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateBlog(id: string, updateDto: IUpdateBlogDto): Promise<BlogResponseDto | any>;
    deleteBlog(id: string): Promise<{
        message: string;
        deletedId: string;
    }>;
    getPublishedBlogs(paginationDto: IPaginationDto): Promise<{
        blogs: any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getBlogStatistics(): Promise<any>;
}
//# sourceMappingURL=blog.service.d.ts.map