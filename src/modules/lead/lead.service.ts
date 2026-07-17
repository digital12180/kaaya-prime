// services/lead.service.ts
import mongoose from "mongoose";
import { Lead } from "./lead.model.js";
import type { CreateLeadDto, UpdateLeadDto, LeadResponseDto, PaginationDto } from "./lead.dto.js";
import { ApiError } from "../../common/exceptions/apiError.js";
import { emailService } from "../../common/services/email.service.js";
import { User } from "../user/user.model.js";
import axios from "axios";
const WEBHOOK_URL = process.env.BITRIX_WEBHOOK_URL;

export class LeadService {
    // Create a new lead
    async createLead(createLeadDto: CreateLeadDto): Promise<LeadResponseDto | Response | any> {
        try {

            const lead = new Lead(createLeadDto);
            await lead.save();



            // await axios.post(WEBHOOK_URL as string, {
            //     fields: {
            //         CATEGORY_ID: 0,

            //         TITLE: `Website Lead - ${lead.name}`,

            //         UF_CRM_1779090187757: lead.name,

            //         UF_CRM_1779090218946: lead.email,

            //         UF_CRM_1779090246683: lead.phone,

            //         UF_CRM_1779090263226: lead.message || "",

            //         SOURCE_ID: lead.source || "UC_D5J0FU"
            //     }
            // });
            const parts = lead.name.trim().split(" ");

            const firstName = parts[0];
            const lastName = parts.slice(1).join(" ");



            const res = await fetch(

                "https://crm.ka-aya.com/rest/1/i2bt6niix6521uxo/crm.deal.add.json",

                {

                    method: "POST",

                    headers: { "Content-Type": "application/json" },

                    body: JSON.stringify({

                        fields: {

                            CATEGORY_ID: 0,

                            TITLE: `${lead.name} - ${lead.source}`,

                            UF_CRM_1784022012: firstName,

                            UF_CRM_1784023125: lastName,

                            UF_CRM_1784022689: lead.email,

                            UF_CRM_1784022699: lead.phone,

                            UF_CRM_1779090354009: "39",

                            SOURCE_ID: "UC_D5J0FU",

                            UF_CRM_1781272129: "223",

                        },

                    }),

                }

            );

            const data = await res.json();

            console.log(data.result.UF_CRM_1784022012); // First Name
            console.log(data.result.UF_CRM_1784022689); // Email
            console.log(data.result.UF_CRM_1784022699); // Phone


            if (!res.ok || data.error) {
                console.error("Bitrix Error:", data);
            } else {
                console.log("Deal Created:", data.result);
            }

            console.log(data);


            // console.log(result.data)
            // await emailService.sendLeadCreatedEmail(createLeadDto.email.toLowerCase(),createLeadDto.name);
            return lead;
        } catch (error: any) {
            console.log(error.message);

            if (error.code === 11000) {
                throw new Error("Duplicate lead: Email and phone combination already exists");
            }
            throw error;
        }
    }

    // Get all leads with pagination and filtering
    async getAllLeads(paginationDto: PaginationDto): Promise<{
        leads: any;
        total: number;
        page: number;
        totalPages: number;
    }> {
        const page = Math.max(1, paginationDto.page || 1);
        const limit = Math.min(100, Math.max(1, paginationDto.limit || 10));
        const skip = (page - 1) * limit;

        let query: any = {};

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
    async getLeadById(id: string): Promise<LeadResponseDto | any | Response> {
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
    async updateLead(id: string, updateLeadDto: UpdateLeadDto): Promise<LeadResponseDto | any | Response> {
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

        const lead = await Lead.findByIdAndUpdate(
            id,
            { ...updateLeadDto, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).lean();

        if (!lead) {
            throw new Error("Lead not found");
        }

        return lead;
    }

    // Delete lead
    async deleteLead(id: string): Promise<{ message: string; deletedId: string }> {
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
    async getLeadStatistics(): Promise<any> {
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

    async searchLead(name: string): Promise<any> {
        try {
            const result = await Lead.find({
                name: { $regex: name, $options: 'i' }
            });

            if (!result) {
                throw new ApiError(404, "Lead not found");
            }
            return result;
        } catch (error: any) {
            throw new ApiError(500, error.message || "Search Error");
        }
    }

}