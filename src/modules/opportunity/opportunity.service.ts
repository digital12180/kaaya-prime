// services/opportunity.service.ts
import mongoose from "mongoose";
import { Opportunity } from "./opportunity.model.js";
import type {
    ICreateOpportunityDto,
    IUpdateOpportunityDto,
    OpportunityResponseDto,
    IPaginationDto
} from "./opportunity.dto.js";
import { ApiError } from "../../common/exceptions/apiError.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";
import { generateSlug } from "../area/area.dto.js";
import cloudinary from "../../config/cloudinary.js";
export class OpportunityService {

    // Create a new opportunity
    async createOpportunity(
        createDto: ICreateOpportunityDto,
        files: Express.Multer.File[]
    ): Promise<any> {
        try {
            const slug = generateSlug(createDto.title);
            // ✅ Check duplicate title (case-insensitive)
            const existingOpportunity = await Opportunity.findOne({
                title: { $regex: new RegExp(`^${createDto.title}$`, "i") }
            });

            if (existingOpportunity) {
                throw new Error("An opportunity with this title already exists");
            }

            // ✅ Validate images properly
            if (!files || files.length === 0) {
                throw new Error("At least one image is required");
            }
            console.log("----", files);


            // ✅ Upload multiple images
            const imageUrls: any = await Promise.all(
                files.map(async (file) => {
                    return await uploadToCloudinary(file.buffer);
                })
            );

            // ✅ Assign images
            createDto.images = imageUrls;
            createDto.slug = slug;

            // ✅ Save opportunity
            const opportunity = new Opportunity(createDto);
            await opportunity.save();

            return opportunity;

        } catch (error: any) {
            if (error.code === 11000) {
                throw new Error("Duplicate opportunity detected");
            }
            throw error;
        }
    }

    // Get all opportunities with pagination and filters
    async getAllOpportunities(paginationDto: IPaginationDto): Promise<{
        opportunities: any;
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

        // Filter by location (case-insensitive partial match)
        if (paginationDto.location && paginationDto.location.trim()) {
            query.location = { $regex: paginationDto.location, $options: 'i' };
        }

        const [opportunities, total] = await Promise.all([
            Opportunity.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Opportunity.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            opportunities: opportunities,
            total,
            page,
            limit,
            totalPages
        };
    }

    // Get opportunity by ID
    async getOpportunityById(id: string): Promise<any | Response> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid opportunity ID format");
        }

        const opportunity = await Opportunity.findById(id).lean();
        if (!opportunity) {
            throw new Error("Opportunity not found");
        }

        return opportunity;
    }

    // Update opportunity
    async updateOpportunity(id: string, updateDto: IUpdateOpportunityDto, files?: Express.Multer.File[]): Promise<any> {
        if (!updateDto) {
            throw new Error("Update data is required");
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid opportunity ID format");
        }
        const opportunity = await Opportunity.findById(id);
        if (!opportunity) {
            throw new Error("Opportunity not found");
        }
        if (updateDto.title) {
            const existingOpportunity = await Opportunity.findOne({
                _id: { $ne: id },
                title: { $regex: new RegExp(`^${updateDto.title}$`, 'i') }
            });

            if (existingOpportunity) {
                throw new Error("Another opportunity with this title already exists");
            }
        }
        console.log("delete-----------", updateDto.deleteImages);

        let finalImages = [...opportunity.images];

        if (updateDto?.deleteImages) {
            let deleteImages = updateDto.deleteImages;

            if (!Array.isArray(deleteImages)) {
                deleteImages = [deleteImages];
            }
            // handle string case (form-data)
            // if (typeof deleteImages === "string") {
            //     deleteImages = JSON.parse(deleteImages);
            // }

            if (Array.isArray(deleteImages)) {
                for (const img of deleteImages) {

                    finalImages = finalImages.filter(i => i !== img);

                    const parts = img.split("/");
                    const publicId = parts.slice(-2).join("/").split(".")[0];
                    let result;
                    if (publicId) {
                        result = await cloudinary.uploader.destroy(publicId)
                    }
                    console.log("DELETE RESULT:", result);
                }
            }
        }

        if (files && files.length > 0) {
            const newImages = await Promise.all(
                files.map(file => uploadToCloudinary(file.buffer))
            );

            finalImages.push(...newImages);
        }
        updateDto.images = finalImages;

        const updated = await Opportunity.findByIdAndUpdate(
            id,
            { ...updateDto, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).lean();

        if (!updated) {
            throw new Error("Opportunity not found");
        }

        return updated;
    }

    // Delete opportunity
    async deleteOpportunity(id: string): Promise<{ message: string; deletedId: string }> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid opportunity ID format");
        }

        const opportunity = await Opportunity.findByIdAndDelete(id);
        if (!opportunity) {
            throw new Error("Opportunity not found");
        }

        return {
            message: "Opportunity deleted successfully",
            deletedId: id
        };
    }

    // Get opportunities by status
    async getOpportunitiesByStatus(status: string): Promise<Response | any> {
        const validStatuses = ["ACTIVE", "UPCOMING", "SOLD OUT", "UNDER REVIEW"];

        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
        }

        const opportunities = await Opportunity.find({ status })
            .sort({ createdAt: -1 })
            .lean();

        return opportunities;
    }

    // Get opportunities statistics
    async getOpportunityStatistics(): Promise<any> {
        const [totalOpportunities, statusStats, locationStats] = await Promise.all([
            Opportunity.countDocuments(),
            Opportunity.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]),
            Opportunity.aggregate([
                {
                    $group: {
                        _id: "$location",
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ])
        ]);

        return {
            totalOpportunities,
            statusDistribution: statusStats,
            topLocations: locationStats
        };
    }

    // Bulk delete opportunities
    async bulkDeleteOpportunities(ids: string[]): Promise<{ deletedCount: number; deletedIds: string[] }> {
        const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));

        if (validIds.length === 0) {
            throw new Error("No valid opportunity IDs provided");
        }

        const result = await Opportunity.deleteMany({
            _id: { $in: validIds }
        });

        return {
            deletedCount: result.deletedCount || 0,
            deletedIds: validIds
        };
    }

    async searchOpportunity(title: string): Promise<Response | any> {
        if (!title) {
            throw new ApiError(400, "empty data to search")
        }
        const result = await Opportunity.find({
            title: { $regex: title, $options: 'i' }
        });

        if (!result) {
            throw new ApiError(400, "searched data not found")
        }

        return result;
    }
    async getOpportunityBySlug(slug: string): Promise<Response | any> {
        if (!slug || typeof slug !== 'string') {
            throw new Error("Invalid slug format");
        }

        const opportunity = await Opportunity.findOne({ slug: slug }).populate('landingPage').lean();
        if (!opportunity) {
            throw new Error("opportunity not found or not published");
        }

        return opportunity;
    }

}