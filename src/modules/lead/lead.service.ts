// services/lead.service.ts
import mongoose from "mongoose";
import { Lead } from "./lead.model.js";
import type { CreateLeadDto, UpdateLeadDto, LeadResponseDto, PaginationDto } from "./lead.dto.js";
import { ApiError } from "../../common/exceptions/apiError.js";
import { emailService } from "../../common/services/email.service.js";
import { User } from "../user/user.model.js";
import axios from "axios";
import type { AnyAaaaRecord } from "dns";
const WEBHOOK_URL = process.env.BITRIX_WEBHOOK_URL;

export class LeadService {
    // Mapping Page -> Source ID
    private getPageId(page: string): number {
        switch ((page || "").trim().toLowerCase()) {
            case "Consult Now Form":
                return 12;

            case "Contact Us Form":
                return 13;

            case "Report Form":
                return 14;

            case "Popup Form":
                return 15;

            default:
                return 12;
        }
    }

    // Mapping Message -> Enumeration ID
    private getMessageId(message: string): number | null {
        switch ((message || "").trim().toLowerCase()) {
            case "help me understand the market":
                return 221;

            case "help me evaluate opportunities":
                return 222;

            case "i'd like an advisor's perspective":
                return 223;

            default:
                return null;
        }
    }
    //     async createLead(createLeadDto: CreateLeadDto): Promise<LeadResponseDto | Response | any> {
    //         try {

    //             const lead = new Lead(createLeadDto);
    //             await lead.save();

    //             const parts = lead.name.trim().split(" ");

    //             const firstName = parts[0];
    //             const lastName = parts.slice(1).join(" ");



    //             const res = await fetch(

    //                 "https://crm.ka-aya.com/rest/1/i2bt6niix6521uxo/crm.deal.add.json",

    //                 {

    //                     method: "POST",

    //                     headers: { "Content-Type": "application/json" },

    //                     body: JSON.stringify({

    //                         fields: {

    //                             CATEGORY_ID: 0,

    //                             TITLE: `${firstName} ${lastName}- ${lead.source || "WEBSITE"}`,

    //                             UF_CRM_1784022012: firstName,

    //                             UF_CRM_1784023125: lastName,

    //                             UF_CRM_1784022689: lead.email,

    //                             UF_CRM_1784022699: lead.phone,

    //                             UF_CRM_1779090354009: "39",

    //                             // SOURCE_ID: "UC_D5J0FU",  
    //                             SOURCE_ID: "WEBSITE",
    //                             UF_CRM_1781272129: "223",
    //                             COMMENTS: `Name: ${lead.name}
    // Email: ${lead.email}
    // Phone: ${lead.phone}`,



    //                         },

    //                     }),

    //                 }

    //             );

    //             const data = await res.json();

    //             console.log(data.result.UF_CRM_1784022012); // First Name
    //             console.log(data.result.UF_CRM_1784022689); // Email
    //             console.log(data.result.UF_CRM_1784022699); // Phone


    //             if (!res.ok || data.error) {
    //                 console.error("Bitrix Error:", data);
    //             } else {
    //                 console.log("Deal Created:", data.result);
    //             }

    //             console.log(data);


    //             // console.log(result.data)
    //             // await emailService.sendLeadCreatedEmail(createLeadDto.email.toLowerCase(),createLeadDto.name);
    //             return lead;
    //         } catch (error: any) {
    //             console.log(error.message);

    //             if (error.code === 11000) {
    //                 throw new Error("Duplicate lead: Email and phone combination already exists");
    //             }
    //             throw error;
    //         }
    //     }

    // Get all leads with pagination and filtering


    async createLead(
        createLeadDto: CreateLeadDto,
    ): Promise<LeadResponseDto | Response | any> {
        try {
            const lead = new Lead(createLeadDto);
            await lead.save();

            const parts = lead.name.trim().split(/\s+/);

            const firstName = parts[0];
            const lastName = parts.slice(1).join(" ");

            const sourceId = this.getPageId(lead.page as string);
            const messageId = this.getMessageId(lead.message as string);

            const payload = {
                fields: {
                    CATEGORY_ID: 0,
                    SOURCE_ID: sourceId,

                    UF_CRM_1784022012: firstName,
                    UF_CRM_1784023125: lastName,
                    UF_CRM_1784022689: lead.email,
                    UF_CRM_1784022699: lead.phone,

                    UF_CRM_1781272129: messageId,
                },
            };

            console.log("Lead Page:", lead.page);
            console.log("Lead Message:", lead.message);
            console.log("Bitrix Payload:", JSON.stringify(payload, null, 2));

            const res = await fetch(
                "https://crm.ka-aya.com/rest/1/i2bt6niix6521uxo/crm.deal.add.json",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                },
            );

            const data = await res.json();

            if (!res.ok || data.error) {
                console.error("Bitrix Error:", data);
                throw new Error(
                    data.error_description || data.error || "Failed to create Bitrix Deal",
                );
            }

            console.log("Bitrix Deal Created:", data.result);

            return lead;
        } catch (error: any) {
            console.error(error);

            if (error.code === 11000) {
                throw new Error(
                    "Duplicate lead: Email and phone combination already exists",
                );
            }

            throw error;
        }
    }


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