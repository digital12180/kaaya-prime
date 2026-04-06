// controllers/blog.controller.ts
import type{ Request, Response } from "express";
import { BlogService } from "./blog.service.js";
import {
    validateCreateBlog,
    validateUpdateBlog
} from "./blog.dto.js";

export class BlogController {
    private blogService: BlogService;

    constructor() {
        this.blogService = new BlogService();
    }

    // Create blog
    createBlog = async (req: Request, res: Response): Promise<void> => {
        try {
            // Validate request data
            const validationErrors = validateCreateBlog(req.body);
            if (validationErrors.length > 0) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: validationErrors
                });
                return;
            }

            const blog = await this.blogService.createBlog(req.body);
            res.status(201).json({
                success: true,
                message: "Blog created successfully",
                data: blog
            });
        } catch (error: any) {
            const status = error.message.includes("already exists") ? 409 : 400;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to create blog",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get all blogs with pagination
    getAllBlogs = async (req: Request, res: Response): Promise<void> => {
        try {
            const paginationDto = {
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
                search: req.query.search as string,
                status: req.query.status as any,
                sortBy: req.query.sortBy as string,
                sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
            };

            // Validate pagination params
            if (paginationDto.page && (isNaN(paginationDto.page) || paginationDto.page < 1)) {
                res.status(400).json({
                    success: false,
                    message: "Page must be a positive number"
                });
                return;
            }

            if (paginationDto.limit && (isNaN(paginationDto.limit) || paginationDto.limit < 1 || paginationDto.limit > 100)) {
                res.status(400).json({
                    success: false,
                    message: "Limit must be between 1 and 100"
                });
                return;
            }

            // Validate status
            if (paginationDto.status && !['draft', 'published'].includes(paginationDto.status)) {
                res.status(400).json({
                    success: false,
                    message: "Status must be either 'draft' or 'published'"
                });
                return;
            }

            const result = await this.blogService.getAllBlogs(paginationDto);
            res.status(200).json({
                success: true,
                message: "Blogs retrieved successfully",
                data: result.blogs,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: result.totalPages
                }
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve blogs",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get blog by ID
    getBlogById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const blog = await this.blogService.getBlogById(id as string);
            res.status(200).json({
                success: true,
                message: "Blog retrieved successfully",
                data: blog
            });
        } catch (error: any) {
            const status = error.message === "Invalid blog ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to retrieve blog",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get blog by slug
    getBlogBySlug = async (req: Request, res: Response): Promise<void> => {
        try {
            const { slug } = req.params;
            const blog = await this.blogService.getBlogBySlug(slug as string);
            res.status(200).json({
                success: true,
                message: "Blog retrieved successfully",
                data: blog
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message || "Failed to retrieve blog",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Search blogs by title
    searchBlogsByTitle = async (req: Request, res: Response): Promise<void> => {
        try {
            const { title } = req.query;
            
            if (!title || typeof title !== 'string') {
                res.status(400).json({
                    success: false,
                    message: "Search title parameter is required"
                });
                return;
            }

            const paginationDto = {
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
                status: req.query.status as any,
                search: title
            };

            const result = await this.blogService.searchBlogsByTitle(title, paginationDto);
            res.status(200).json({
                success: true,
                message: `Blogs matching "${title}" retrieved successfully`,
                data: result.blogs,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: result.totalPages
                }
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Failed to search blogs",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Update blog
    updateBlog = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            
            // Validate update data
            const validationErrors = validateUpdateBlog(req.body);
            if (validationErrors.length > 0) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: validationErrors
                });
                return;
            }

            const blog = await this.blogService.updateBlog(id as string, req.body);
            res.status(200).json({
                success: true,
                message: "Blog updated successfully",
                data: blog
            });
        } catch (error: any) {
            const status = error.message === "Invalid blog ID format" ? 400 :
                          error.message.includes("already exists") ? 409 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to update blog",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Delete blog
    deleteBlog = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const result = await this.blogService.deleteBlog(id as string);
            res.status(200).json({
                success: true,
                message: result.message,
                data: { deletedId: result.deletedId }
            });
        } catch (error: any) {
            const status = error.message === "Invalid blog ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to delete blog",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get published blogs (public endpoint)
    getPublishedBlogs = async (req: Request, res: Response): Promise<void> => {
        try {
            const paginationDto = {
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
                search: req.query.search as string,
                sortBy: req.query.sortBy as string,
                sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
            };

            const result = await this.blogService.getPublishedBlogs(paginationDto);
            res.status(200).json({
                success: true,
                message: "Published blogs retrieved successfully",
                data: result.blogs,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: result.totalPages
                }
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve published blogs",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get blog statistics
    getBlogStatistics = async (req: Request, res: Response): Promise<void> => {
        try {
            const statistics = await this.blogService.getBlogStatistics();
            res.status(200).json({
                success: true,
                message: "Statistics retrieved successfully",
                data: statistics
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve statistics",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
}