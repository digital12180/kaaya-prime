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

export class OpportunityService {

    // Create a new opportunity
    async createOpportunity(createDto: ICreateOpportunityDto): Promise<any | Response> {
        try {
            // Check if opportunity with same title exists
            const existingOpportunity = await Opportunity.findOne({
                title: { $regex: new RegExp(`^${createDto.title}$`, 'i') }
            });

            if (existingOpportunity) {
                throw new Error("An opportunity with this title already exists");
            }

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
    async updateOpportunity(id: string, updateDto: IUpdateOpportunityDto): Promise<any> {
        if (!updateDto) {
            throw new Error("Update data is required");
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid opportunity ID format");
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

        const opportunity = await Opportunity.findByIdAndUpdate(
            id,
            { ...updateDto, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).lean();

        if (!opportunity) {
            throw new Error("Opportunity not found");
        }

        return opportunity;
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

}