// services/lead.service.ts
import mongoose from "mongoose";
import { Lead } from "./lead.model.js";
import { ApiError } from "../../common/exceptions/apiError.js";
export class LeadService {
    // Create a new lead
    async createLead(createLeadDto) {
        try {
            // Check if lead already exists with same email or phone
            const existingLead = await Lead.findOne({
                $or: [
                    { email: createLeadDto.email.toLowerCase() },
                    { phone: createLeadDto.phone }
                ]
            });
            if (existingLead) {
                throw new Error("Lead with this email or phone already exists");
            }
            const lead = new Lead(createLeadDto);
            await lead.save();
            return lead;
        }
        catch (error) {
            if (error.code === 11000) {
                throw new Error("Duplicate lead: Email and phone combination already exists");
            }
            throw error;
        }
    }
    // Get all leads with pagination and filtering
    async getAllLeads(paginationDto) {
        const page = Math.max(1, paginationDto.page || 1);
        const limit = Math.min(100, Math.max(1, paginationDto.limit || 10));
        const skip = (page - 1) * limit;
        let query = {};
        // Search functionality
        if (paginationDto.search) {
            query.$text = { $search: paginationDto.search };
        }
        // Filter by source
        if (paginationDto.source) {
            query.source = paginationDto.source;
        }
        const [leads, total] = await Promise.all([
            Lead.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Lead.countDocuments(query)
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            leads: leads,
            total,
            page,
            totalPages
        };
    }
    // Get lead by ID
    async getLeadById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid lead ID format");
        }
        const lead = await Lead.findById(id).lean();
        if (!lead) {
            throw new Error("Lead not found");
        }
        return lead;
    }
    // Update lead
    async updateLead(id, updateLeadDto) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid lead ID format");
        }
        // Check if email/phone already exists for other leads
        if (updateLeadDto.email || updateLeadDto.phone) {
            const existingLead = await Lead.findOne({
                _id: { $ne: id },
                $or: [
                    ...(updateLeadDto.email ? [{ email: updateLeadDto.email.toLowerCase() }] : []),
                    ...(updateLeadDto.phone ? [{ phone: updateLeadDto.phone }] : [])
                ]
            });
            if (existingLead) {
                throw new Error("Another lead with this email or phone already exists");
            }
        }
        const lead = await Lead.findByIdAndUpdate(id, { ...updateLeadDto, updatedAt: new Date() }, { new: true, runValidators: true }).lean();
        if (!lead) {
            throw new Error("Lead not found");
        }
        return lead;
    }
    // Delete lead
    async deleteLead(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid lead ID format");
        }
        const lead = await Lead.findByIdAndDelete(id);
        if (!lead) {
            throw new Error("Lead not found");
        }
        return {
            message: "Lead deleted successfully",
            deletedId: id
        };
    }
    // Get lead statistics
    async getLeadStatistics() {
        const [totalLeads, sourceStats, recentLeads] = await Promise.all([
            Lead.countDocuments(),
            Lead.aggregate([
                {
                    $group: {
                        _id: "$source",
                        count: { $sum: 1 }
                    }
                }
            ]),
            Lead.find().sort({ createdAt: -1 }).limit(5).lean()
        ]);
        return {
            totalLeads,
            sourceDistribution: sourceStats,
            recentLeads: recentLeads
        };
    }
    async searchLead(name) {
        try {
            const result = await Lead.find({
                name: { $regex: name, $options: 'i' }
            });
            if (!result) {
                throw new ApiError(404, "Lead not found");
            }
            return result;
        }
        catch (error) {
            throw new ApiError(500, error.message || "Search Error");
        }
    }
}
//# sourceMappingURL=lead.service.js.map