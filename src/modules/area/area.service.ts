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
import { Opportunity } from "../opportunity/opportunity.model.js";

export class AreaService {

    // Create a new area
    async createArea(createDto: ICreateAreaDto, file: Express.Multer.File): Promise<Response | any> {
        try {
            // Generate slug from name
            const slug = generateSlug(createDto.name);

            // Check if slug already exists
            const existingArea = await Area.findOne({ slug }).select("+slug +_id");

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
            const opportuntiy = await Opportunity.findById(createDto.opportunities).select('+_id');
            if (!opportuntiy) {
                throw new Error("Opportunity not found");
            }


            // Set default meta title and description if not provided
            const areaData = {
                ...createDto,
                slug,
                metaTitle: createDto.metaTitle || createDto.name,
                metaDescription: createDto.metaDescription || createDto.description.substring(0, 160)
            };

            const area = new Area(areaData);

            await area.save();
            await Opportunity.findByIdAndUpdate(
                opportuntiy._id,
                { area: area._id },
                { new: true })
            return area;
        } catch (error: any) {
            if (error.code === 11000) {
                throw new Error("Duplicate area detected (slug or name already exists)");
            }
            throw error;
        }
    }

    // Get all areas with pagination and search
    async getAllAreas(paginationDto: IPaginationDto) {
        const page = Math.max(1, paginationDto.page || 1);
        const limit = Math.min(50, Math.max(1, paginationDto.limit || 10)); // reduce max
        const skip = (page - 1) * limit;

        const query: any = {};

        // ✅ Search Optimization
        if (paginationDto.search?.trim()) {
            query.$text = { $search: paginationDto.search };
        }

        // ✅ Sorting
        const sort: any = paginationDto.sortBy
            ? { [paginationDto.sortBy]: paginationDto.sortOrder === 'asc' ? 1 : -1 }
            : { createdAt: -1 };

        // ✅ Projection (VERY IMPORTANT)
        const projection = {
            name: 1,
            city: 1,
            createdAt: 1
        };

        const areasPromise = Area.find(query)
            .select(projection)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();

        // ✅ Faster count (optional optimization)
        const totalPromise = Area.estimatedDocumentCount(); // fast but not filtered

        const [areas, total] = await Promise.all([
            areasPromise,
            totalPromise
        ]);

        return {
            areas,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
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

        const area = await Area.findOne({ slug }).populate('opportunities').lean();
        if (!area) {
            throw new Error("Area not found");
        }

        return area;
    }

    // Update area
    async updateArea(
        id: string,
        updateDto: IUpdateAreaDto,
        file?: Express.Multer.File
    ): Promise<any> {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid area ID format");
        }

        const existingArea = await Area.findById(id);
        if (!existingArea) {
            throw new Error("Area not found");
        }

        // ✅ REMOVE opportunities from updateDto
        const { opportunities, ...restDto } = updateDto;

        let updateData: any = { ...restDto };

        // -------------------------------
        // Slug + Name logic
        // -------------------------------
        if (restDto.name && restDto.name !== existingArea.name) {
            const newSlug = generateSlug(restDto.name);

            const slugExists = await Area.findOne({
                _id: { $ne: id },
                slug: newSlug,
            });

            if (slugExists) {
                throw new Error(`Area with slug '${newSlug}' already exists`);
            }

            const nameExists = await Area.findOne({
                _id: { $ne: id },
                name: { $regex: new RegExp(`^${restDto.name}$`, "i") },
            });

            if (nameExists) {
                throw new Error("Another area with this name already exists");
            }

            updateData.slug = newSlug;
        }

        // -------------------------------
        // Meta fields
        // -------------------------------
        if (restDto.name && !restDto.metaTitle) {
            updateData.metaTitle = restDto.name;
        }

        if (restDto.description && !restDto.metaDescription) {
            updateData.metaDescription = restDto.description.substring(0, 160);
        }

        // -------------------------------
        // Image upload
        // -------------------------------
        if (file) {
            try {
                const uploadedImageUrl = await uploadToCloudinary(file.buffer);

                if (existingArea?.image) {
                    const parts = existingArea.image.split("/");
                    const fileName = parts[parts.length - 1];
                    const publicId = fileName?.split(".")[0];

                    if (publicId) {
                        await cloudinary.uploader.destroy(`kaaya/${publicId}`);
                    }
                }

                updateData.image = uploadedImageUrl;
            } catch (error) {
                throw new Error("Image update failed");
            }
        }

        // -------------------------------
        // ✅ UPDATE AREA (without opportunities)
        // -------------------------------
        const area = await Area.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!area) {
            throw new Error("Area not found after update");
        }

        // -------------------------------
        // ✅ HANDLE RELATION SEPARATELY
        // -------------------------------
        if (opportunities) {
            const opportunityIds = Array.isArray(opportunities)
                ? opportunities
                : [opportunities];

            for (const oppId of opportunityIds) {
                if (!mongoose.Types.ObjectId.isValid(oppId)) {
                    throw new Error(`Invalid opportunity ID: ${oppId}`);
                }

                const opportunity = await Opportunity.findById(oppId);
                if (!opportunity) {
                    throw new Error(`Opportunity not found: ${oppId}`);
                }

                // Set area in opportunity
                await Opportunity.findByIdAndUpdate(oppId, {
                    area: area._id,
                });

                // Push into area (no overwrite now ✅)
                await Area.findByIdAndUpdate(area._id, {
                    $addToSet: { opportunities: oppId },
                });
            }
        }

        // -------------------------------
        // FINAL FETCH
        // -------------------------------
        const updatedArea = await Area.findById(area._id)
            .populate("opportunities")
            .lean();

        return updatedArea;
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
        if (!name?.trim()) {
            throw new ApiError(400, "Search keyword is required");
        }
        const result = await Area.find({
            name: { $regex: name, $options: 'i' }
        })
        if (!result) {
            throw new ApiError(400, "Area not found with this keyword");
        }
        return result;
    }
}