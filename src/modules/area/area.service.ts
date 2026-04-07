// services/area.service.ts
import mongoose from "mongoose";
import type { Response } from "express";
import { Area } from "./area.model.js";
import type {
    ICreateAreaDto,
    IUpdateAreaDto,
    // AreaResponseDto,
    IPaginationDto,
} from "./area.dto.js";
import { generateSlug } from "./area.dto.js"
import { ApiError } from "../../common/exceptions/apiError.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";
import cloudinary from "../../config/cloudinary.js";

export class AreaService {

    // Create a new area
    async createArea(createDto: ICreateAreaDto, file: Express.Multer.File): Promise<Response | any> {
        try {
            // Generate slug from name
            const slug = generateSlug(createDto.name);

            // Check if slug already exists
            const existingArea = await Area.findOne({ slug });
            if (existingArea) {
                throw new Error(`Area with slug '${slug}' already exists. Please use a different name.`);
            }

            // Check if name already exists (case-insensitive)
            const existingName = await Area.findOne({
                name: { $regex: new RegExp(`^${createDto.name}$`, 'i') }
            });

            if (existingName) {
                throw new Error("An area with this name already exists");
            }
            const imageUrl = await uploadToCloudinary(file.buffer);
            if (!imageUrl) {
                throw new Error("Image Upload on cloudinary error");
            }
            createDto.image = imageUrl;
            // Set default meta title and description if not provided
            const areaData = {
                ...createDto,
                slug,
                metaTitle: createDto.metaTitle || createDto.name,
                metaDescription: createDto.metaDescription || createDto.description.substring(0, 160)
            };

            const area = new Area(areaData);
            await area.save();
            return area;
        } catch (error: any) {
            if (error.code === 11000) {
                throw new Error("Duplicate area detected (slug or name already exists)");
            }
            throw error;
        }
    }

    // Get all areas with pagination and search
    async getAllAreas(paginationDto: IPaginationDto): Promise<{
        areas: Response | any;
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

        // Sorting
        let sort: any = { createdAt: -1 };
        if (paginationDto.sortBy) {
            const sortOrder = paginationDto.sortOrder === 'asc' ? 1 : -1;
            sort = { [paginationDto.sortBy]: sortOrder };
        }

        const [areas, total] = await Promise.all([
            Area.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Area.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            areas: areas,
            total,
            page,
            limit,
            totalPages
        };
    }

    // Get area by ID
    async getAreaById(id: string): Promise<any> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid area ID format");
        }

        const area = await Area.findById(id).lean();
        if (!area) {
            throw new Error("Area not found");
        }

        return area;
    }

    // Get area by slug (for SEO-friendly URLs)
    async getAreaBySlug(slug: string): Promise<any> {
        if (!slug || typeof slug !== 'string') {
            throw new Error("Invalid slug format");
        }

        const area = await Area.findOne({ slug }).lean();
        if (!area) {
            throw new Error("Area not found");
        }

        return area;
    }

    // Update area
    async updateArea(id: string, updateDto: IUpdateAreaDto, file?: Express.Multer.File): Promise<any> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid area ID format");
        }

        const existingArea = await Area.findById(id);
        if (!existingArea) {
            throw new Error("Area not found");
        }

        // Check if name is being updated and generate new slug if needed
        let updateData: any = { ...updateDto };

        if (updateDto.name && updateDto.name !== existingArea.name) {
            const newSlug = generateSlug(updateDto.name);

            // Check if new slug already exists for another area
            const slugExists = await Area.findOne({
                _id: { $ne: id },
                slug: newSlug
            });

            if (slugExists) {
                throw new Error(`Area with slug '${newSlug}' already exists. Please use a different name.`);
            }

            // Check if name already exists for another area
            const nameExists = await Area.findOne({
                _id: { $ne: id },
                name: { $regex: new RegExp(`^${updateDto.name}$`, 'i') }
            });

            if (nameExists) {
                throw new Error("Another area with this name already exists");
            }

            updateData.slug = newSlug;
        }

        // Update meta fields if not provided
        if (updateDto.name && !updateDto.metaTitle) {
            updateData.metaTitle = updateDto.name;
        }

        if (updateDto.description && !updateDto.metaDescription) {
            updateData.metaDescription = updateDto.description.substring(0, 160);
        }
        if (file) {
            try {
                const uploadedImageUrl = await uploadToCloudinary(file.buffer);

                // 2. Delete old image (if exists)
                if (existingArea?.image) {
                    const parts = existingArea.image.split("/");
                    const fileName = parts[parts.length - 1];
                    const publicId = fileName?.split(".")[0];
                    
                    if (publicId) {
                        await cloudinary.uploader.destroy(`kaaya/${publicId}`);
                    }
                }

                // 3. Update data (IMPORTANT: updateData use karo, updateDto nahi)
                updateData.image = uploadedImageUrl;

            } catch (error) {
                throw new Error("Image update failed");
            }
        }
        const area = await Area.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).lean();

        if (!area) {
            throw new Error("Area not found");
        }

        return area;
    }

    // Delete area
    async deleteArea(id: string): Promise<{ message: string; deletedId: string }> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid area ID format");
        }

        const area = await Area.findByIdAndDelete(id);
        if (!area) {
            throw new Error("Area not found");
        }

        return {
            message: "Area deleted successfully",
            deletedId: id
        };
    }

    // Get area statistics
    async getAreaStatistics(): Promise<any> {
        const [totalAreas, recentAreas, searchStats] = await Promise.all([
            Area.countDocuments(),
            Area.find().sort({ createdAt: -1 }).limit(5).lean(),
            Area.aggregate([
                {
                    $project: {
                        nameLength: { $strLenCP: "$name" },
                        descLength: { $strLenCP: "$description" },
                        hasImage: { $cond: [{ $ne: ["$image", ""] }, 1, 0] },
                        hasMeta: { $cond: [{ $and: [{ $ne: ["$metaTitle", ""] }, { $ne: ["$metaDescription", ""] }] }, 1, 0] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        avgNameLength: { $avg: "$nameLength" },
                        avgDescLength: { $avg: "$descLength" },
                        totalWithImages: { $sum: "$hasImage" },
                        totalWithMeta: { $sum: "$hasMeta" }
                    }
                }
            ])
        ]);

        return {
            totalAreas,
            recentAreas: recentAreas,
            statistics: searchStats[0] || {
                avgNameLength: 0,
                avgDescLength: 0,
                totalWithImages: 0,
                totalWithMeta: 0
            }
        };
    }

    // Bulk delete areas
    async bulkDeleteAreas(ids: string[]): Promise<{ deletedCount: number; deletedIds: string[] }> {
        const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));

        if (validIds.length === 0) {
            throw new Error("No valid area IDs provided");
        }

        const result = await Area.deleteMany({
            _id: { $in: validIds }
        });

        return {
            deletedCount: result.deletedCount || 0,
            deletedIds: validIds
        };
    }

    // Check if slug is unique (for real-time validation)
    async isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
        const query: any = { slug };
        if (excludeId && mongoose.Types.ObjectId.isValid(excludeId)) {
            query._id = { $ne: excludeId };
        }
        const existing = await Area.findOne(query);
        return !existing;
    }


    async searchAreaByName(name: string): Promise<Response | any> {
        const result = await Area.find({
            name: { $regex: name, $options: 'i' }
        })
        if (!result) {
            throw new ApiError(400, "Area not found with this keyword");
        }
        return result;
    }
}