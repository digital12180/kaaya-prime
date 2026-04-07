// services/blog.service.ts
import mongoose from "mongoose";
import { Blog } from "./blog.model.js";
import type {
  ICreateBlogDto,
  IUpdateBlogDto,
  BlogResponseDto,
  IPaginationDto
} from "./blog.dto.js";
import { generateSlug } from "./blog.dto.js"
import cloudinary, { uploadToCloudinary } from "../../config/cloudinary.js";

export class BlogService {

  // Create a new blog
  async createBlog(createDto: ICreateBlogDto, file: Express.Multer.File): Promise<BlogResponseDto | any> {
    try {
      // Generate slug from title
      const slug = generateSlug(createDto.title);

      // Check if slug already exists
      const existingBlog = await Blog.findOne({ slug });
      if (existingBlog) {
        throw new Error(`Blog with slug '${slug}' already exists. Please use a different title.`);
      }

      // Check if title already exists (case-insensitive)
      const existingTitle = await Blog.findOne({
        title: { $regex: new RegExp(`^${createDto.title}$`, 'i') }
      });

      if (existingTitle) {
        throw new Error("A blog with this title already exists");
      }
      if (!file) {
        throw new Error("Image Required");
      }

      const imageUrl = await uploadToCloudinary(file.buffer);
      if (!imageUrl) {
        throw new Error("Error when uploading file on cloudinary");
      }
      createDto.image = imageUrl;
      // Set default meta title and description if not provided
      const blogData = {
        ...createDto,
        slug,
        status: createDto.status || "DRAFT",
        metaTitle: createDto.metaTitle || createDto.title,
        metaDescription: createDto.metaDescription || createDto.content.substring(0, 160).replace(/<[^>]*>/g, '')
      };

      const blog = new Blog(blogData);
      await blog.save();
      return blog;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("Duplicate blog detected (slug or title already exists)");
      }
      throw error;
    }
  }

  // Get all blogs with pagination and search
  async getAllBlogs(paginationDto: IPaginationDto): Promise<{
    blogs: any;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = Math.max(1, paginationDto.page || 1);
    const limit = Math.min(100, Math.max(1, paginationDto.limit || 10));
    const skip = (page - 1) * limit;

    let query: any = {};

    // Search functionality (text search)
    if (paginationDto.search && paginationDto.search.trim()) {
      query.$text = { $search: paginationDto.search };
    }

    // Filter by status
    if (paginationDto.status) {
      query.status = paginationDto.status;
    }

    // Sorting
    let sort: any = { createdAt: -1 };
    if (paginationDto.sortBy) {
      const sortOrder = paginationDto.sortOrder === 'asc' ? 1 : -1;
      sort = { [paginationDto.sortBy]: sortOrder };
    }

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      blogs: blogs,
      total,
      page,
      limit,
      totalPages
    };
  }

  // Get blog by ID
  async getBlogById(id: string): Promise<BlogResponseDto | any> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid blog ID format");
    }

    const blog = await Blog.findById(id).lean();
    if (!blog) {
      throw new Error("Blog not found");
    }

    return blog;
  }

  // Get blog by slug (for SEO-friendly URLs)
  async getBlogBySlug(slug: string): Promise<BlogResponseDto | any> {
    if (!slug || typeof slug !== 'string') {
      throw new Error("Invalid slug format");
    }

    const blog = await Blog.findOne({ slug }).lean();
    if (!blog) {
      throw new Error("Blog not found");
    }

    return blog;
  }

  // Search blogs by title (simple title search)
  async searchBlogsByTitle(searchTerm: string, paginationDto: IPaginationDto): Promise<{
    blogs: any;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new Error("Search term is required");
    }

    const page = Math.max(1, paginationDto.page || 1);
    const limit = Math.min(100, Math.max(1, paginationDto.limit || 10));
    const skip = (page - 1) * limit;

    // Case-insensitive title search using regex
    const query = {
      title: { $regex: searchTerm, $options: 'i' }
    };

    // Add status filter if provided
    if (paginationDto.status) {
      Object.assign(query, { status: paginationDto.status });
    }

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      blogs: blogs,
      total,
      page,
      limit,
      totalPages
    };
  }

  // Update blog
  async updateBlog(id: string, updateDto: IUpdateBlogDto, file?: Express.Multer.File): Promise<BlogResponseDto | any> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid blog ID format");
    }

    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      throw new Error("Blog not found");
    }

    // Check if title is being updated and generate new slug if needed
    let updateData: any = { ...updateDto };

    if (updateDto.title && updateDto.title !== existingBlog.title) {
      const newSlug = generateSlug(updateDto.title);

      // Check if new slug already exists for another blog
      const slugExists = await Blog.findOne({
        _id: { $ne: id },
        slug: newSlug
      });

      if (slugExists) {
        throw new Error(`Blog with slug '${newSlug}' already exists. Please use a different title.`);
      }

      // Check if title already exists for another blog
      const titleExists = await Blog.findOne({
        _id: { $ne: id },
        title: { $regex: new RegExp(`^${updateDto.title}$`, 'i') }
      });

      if (titleExists) {
        throw new Error("Another blog with this title already exists");
      }

      updateData.slug = newSlug;
    }

    // Update meta fields if not provided but content/title changed
    if (updateDto.title && !updateDto.metaTitle) {
      updateData.metaTitle = updateDto.title;
    }

    if (updateDto.content && !updateDto.metaDescription) {
      updateData.metaDescription = updateDto.content.substring(0, 160).replace(/<[^>]*>/g, '');
    }
    if (file) {
      try {
        const newImageUrl = await uploadToCloudinary(file.buffer);
        if (existingBlog?.image) {
          const parts = existingBlog.image.split('/');
          const fileName = parts[parts.length - 1];
          const publicId = fileName?.split(".")[0];
          if (publicId) {
            const result = await cloudinary.uploader.destroy(`kaaya/${publicId}`);
          }
        }
        updateData.image = newImageUrl;
      } catch (error) {
        throw new Error("Image update failed");
      }
    }
    const blog = await Blog.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();

    if (!blog) {
      throw new Error("Blog not found");
    }

    return blog;
  }

  // Delete blog
  async deleteBlog(id: string): Promise<{ message: string; deletedId: string }> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid blog ID format");
    }

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      throw new Error("Blog not found");
    }

    return {
      message: "Blog deleted successfully",
      deletedId: id
    };
  }

  // Get published blogs only (for public viewing)
  async getPublishedBlogs(paginationDto: IPaginationDto): Promise<{
    blogs: any;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    paginationDto.status = "PUBLISHED";
    return this.getAllBlogs(paginationDto);
  }

  // Get blog statistics
  async getBlogStatistics(): Promise<any> {
    const [totalBlogs, publishedCount, draftCount, recentBlogs] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ status: "PUBLISHED" }),
      Blog.countDocuments({ status: "DRAFT" }),
      Blog.find({ status: "PUBLISHED" })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    return {
      totalBlogs,
      publishedCount,
      draftCount,
      recentBlogs: recentBlogs
    };
  }
}