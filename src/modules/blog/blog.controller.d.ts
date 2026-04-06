import type { Request, Response } from "express";
export declare class BlogController {
    private blogService;
    constructor();
    createBlog: (req: Request, res: Response) => Promise<void>;
    getAllBlogs: (req: Request, res: Response) => Promise<void>;
    getBlogById: (req: Request, res: Response) => Promise<void>;
    getBlogBySlug: (req: Request, res: Response) => Promise<void>;
    searchBlogsByTitle: (req: Request, res: Response) => Promise<void>;
    updateBlog: (req: Request, res: Response) => Promise<void>;
    deleteBlog: (req: Request, res: Response) => Promise<void>;
    getPublishedBlogs: (req: Request, res: Response) => Promise<void>;
    getBlogStatistics: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=blog.controller.d.ts.map