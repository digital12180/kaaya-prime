// services/landingPage.service.ts
import mongoose from "mongoose";
import { LandingPage } from "./landingPage.model.js";
import { Opportunity } from "../opportunity/opportunity.model.js";
import type {
    ICreateLandingPageDto,
    IUpdateLandingPageDto,
    IUpdateStatusDto,
    LandingPageResponseDto,
    IPaginationDto,
} from "./landingPage.dto.js";
import { generateSlug } from "./landingPage.dto.js"
import { populate } from "dotenv";

export class LandingPageService {

    // Create a new landing page
    async createLandingPage(createDto: ICreateLandingPageDto): Promise<LandingPageResponseDto | any> {
        try {

            // Check if slug already exists
            const existingPage = await LandingPage.findOne({ slug: createDto.slug });
            if (existingPage) {
                throw new Error(`Landing page with slug '${createDto.slug}' already exists. Please use a different title.`);
            }
            if (!createDto.opportunity) {
                throw new Error("Opportunity Required");
            }
            console.log(createDto.opportunity);

            const opportunity = await Opportunity.findById(createDto.opportunity);
            if (!opportunity) {
                throw new Error("Opportunity Not Found");
            }
            // Check if title already exists (case-insensitive)
            const existingTitle = await LandingPage.findOne({
                title: { $regex: new RegExp(`^${createDto.title}$`, 'i') }
            });

            if (existingTitle) {
                throw new Error("A landing page with this title already exists");
            }

            const landingPageData = {
                ...createDto,
                formType: createDto.formType || "NONE",
                status: createDto.status || "DRAFT"
            };

            const landingPage = new LandingPage(landingPageData);
            await landingPage.save();
            opportunity.landingPage.push(landingPage._id);
            await opportunity.save();
            return landingPage;
        } catch (error: any) {
            if (error.code === 11000) {
                throw new Error("Duplicate landing page detected (slug or title already exists)");
            }
            throw error;
        }
    }

    // Get all landing pages with pagination and search
    async getAllLandingPages(paginationDto: IPaginationDto): Promise<{
        landingPages: any;
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

        // Filter by form type
        if (paginationDto.formType) {
            query.formType = paginationDto.formType;
        }

        // Sorting
        let sort: any = { createdAt: -1 };
        if (paginationDto.sortBy) {
            const sortOrder = paginationDto.sortOrder === 'asc' ? 1 : -1;
            sort = { [paginationDto.sortBy]: sortOrder };
        }

        const [landingPages, total] = await Promise.all([
            LandingPage.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            LandingPage.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            landingPages: landingPages,
            total,
            page,
            limit,
            totalPages
        };
    }

    // Get landing page by ID
    async getLandingPageById(id: string): Promise<LandingPageResponseDto | any> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid landing page ID format");
        }

        const landingPage = await LandingPage.findById(id).lean();
        if (!landingPage) {
            throw new Error("Landing page not found");
        }

        return landingPage;
    }

    // Get landing page by slug (for public viewing - only published)
    async getLandingPageBySlug(slug: string): Promise<LandingPageResponseDto | any> {
        if (!slug || typeof slug !== 'string') {
            throw new Error("Invalid slug format");
        }

        const landingPage = await LandingPage.findOne({ slug, status: "PUBLISHED" }).populate({
            path: 'opportunity', populate: {
                path: 'area',
                populate: {
                    path: 'opportunities',
                    populate: {
                        path: "landingPage"
                    }
                }
            }
        }).lean();
        if (!landingPage) {
            throw new Error("Landing page not found or not published");
        }

        return landingPage;
    }

    // Get landing page by slug for admin (all statuses)
    async getLandingPageBySlugAdmin(slug: string): Promise<LandingPageResponseDto | any> {
        if (!slug || typeof slug !== 'string') {
            throw new Error("Invalid slug format");
        }

        const landingPage = await LandingPage.findOne({ slug }).lean();
        if (!landingPage) {
            throw new Error("Landing page not found");
        }

        return landingPage;
    }

    // Search landing pages by title
    async searchLandingPagesByTitle(searchTerm: string, paginationDto: IPaginationDto): Promise<{
        landingPages: any;
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
        const query: any = {
            title: { $regex: searchTerm, $options: 'i' }
        };

        // Add filters if provided
        if (paginationDto.status) {
            query.status = paginationDto.status;
        }
        if (paginationDto.formType) {
            query.formType = paginationDto.formType;
        }

        const [landingPages, total] = await Promise.all([
            LandingPage.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            LandingPage.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            landingPages: landingPages,
            total,
            page,
            limit,
            totalPages
        };
    }

    // Update landing page
    async updateLandingPage(
        id: string,
        updateDto: IUpdateLandingPageDto
    ): Promise<LandingPageResponseDto | any> {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid landing page ID format");
        }

        const existingPage = await LandingPage.findById(id);
        if (!existingPage) {
            throw new Error("Landing page not found");
        }

        // ✅ Separate opportunity
        let { opportunity, ...rest } = updateDto;

        type UpdateLandingData = Partial<IUpdateLandingPageDto>;

        let updateData: UpdateLandingData = { ...rest };

        // -------------------------------
        // Slug + Title logic
        // -------------------------------
        if (updateDto.title && updateDto.title !== existingPage.title) {
            const newSlug = updateDto.title;

            const slugExists = await LandingPage.findOne({
                _id: { $ne: id },
                slug: newSlug,
            });

            if (slugExists) {
                throw new Error(`Landing page with slug '${newSlug}' already exists`);
            }

            const titleExists = await LandingPage.findOne({
                _id: { $ne: id },
                title: { $regex: new RegExp(`^${updateDto.title}$`, "i") },
            });

            if (titleExists) {
                throw new Error("Another landing page with this title already exists");
            }

            updateData.slug = newSlug;
        }

        // -------------------------------
        // ✅ Handle Opportunity Relation
        // -------------------------------
        if (opportunity && String(opportunity) !== String(existingPage.opportunity)) {

            // 1. Check new opportunity exists
            const newOpportunity = await Opportunity.findById(opportunity);
            if (!newOpportunity) {
                throw new Error("Opportunity Not Found");
            }

            // 2. Remove from OLD opportunity
            if (existingPage.opportunity) {
                await Opportunity.findByIdAndUpdate(existingPage.opportunity, {
                    $pull: { landingPage: existingPage._id },
                });
            }

            // 3. Add to NEW opportunity (NO overwrite, NO duplicate)
            await Opportunity.findByIdAndUpdate(opportunity, {
                $addToSet: { landingPage: existingPage._id },
            });

            // 4. Update landingPage side reference
            updateData.opportunity = new mongoose.Types.ObjectId(opportunity);
        }

        // -------------------------------
        // Update Landing Page
        // -------------------------------
        const landingPage = await LandingPage.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).lean();

        if (!landingPage) {
            throw new Error("Landing page not found");
        }

        return landingPage;
    }

    // Update landing page status only
    async updateLandingPageStatus(id: string, statusDto: IUpdateStatusDto): Promise<LandingPageResponseDto | any> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid landing page ID format");
        }

        const landingPage = await LandingPage.findByIdAndUpdate(
            id,
            { status: statusDto.status, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).lean();

        if (!landingPage) {
            throw new Error("Landing page not found");
        }

        return landingPage;
    }

    // Delete landing page
    async deleteLandingPage(id: string): Promise<{ message: string; deletedId: string }> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid landing page ID format");
        }

        const landingPage = await LandingPage.findByIdAndDelete(id);
        if (!landingPage) {
            throw new Error("Landing page not found");
        }

        return {
            message: "Landing page deleted successfully",
            deletedId: id
        };
    }

    // Get landing pages by status
    async getLandingPagesByStatus(status: string): Promise<LandingPageResponseDto[] | any> {
        const validStatuses = ["PUBLISHED", "DRAFT", "DISABLED"];

        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
        }

        const landingPages = await LandingPage.find({ status })
            .sort({ createdAt: -1 })
            .lean();

        return landingPages;
    }

    // Get landing pages by form type
    async getLandingPagesByFormType(formType: string): Promise<LandingPageResponseDto[] | any> {
        const validFormTypes = ["CONTACT", "CONSULTATION", "DOWNLOAD", "NONE"];

        if (!validFormTypes.includes(formType)) {
            throw new Error(`Invalid form type. Must be one of: ${validFormTypes.join(", ")}`);
        }

        const landingPages = await LandingPage.find({ formType, status: "PUBLISHED" })
            .sort({ createdAt: -1 })
            .lean();

        return landingPages;
    }

    // Get published landing pages only (for public viewing)
    async getPublishedLandingPages(paginationDto: IPaginationDto): Promise<{
        landingPages: LandingPageResponseDto[] | any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        paginationDto.status = "PUBLISHED";
        return this.getAllLandingPages(paginationDto);
    }

    // Get landing page statistics
    async getLandingPageStatistics(): Promise<any> {
        const [totalPages, publishedCount, draftCount, disabledCount, formTypeStats, recentPages] = await Promise.all([
            LandingPage.countDocuments(),
            LandingPage.countDocuments({ status: "PUBLISHED" }),
            LandingPage.countDocuments({ status: "DRAFT" }),
            LandingPage.countDocuments({ status: "DISABLED" }),
            LandingPage.aggregate([
                {
                    $group: {
                        _id: "$formType",
                        count: { $sum: 1 }
                    }
                }
            ]),
            LandingPage.find({ status: "PUBLISHED" })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean()
        ]);

        return {
            totalPages,
            publishedCount,
            draftCount,
            disabledCount,
            formTypeDistribution: formTypeStats,
            recentPages: recentPages
        };
    }

    // Bulk delete landing pages
    async bulkDeleteLandingPages(ids: string[]): Promise<{ deletedCount: number; deletedIds: string[] }> {
        const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));

        if (validIds.length === 0) {
            throw new Error("No valid landing page IDs provided");
        }

        const result = await LandingPage.deleteMany({
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
        const existing = await LandingPage.findOne(query);
        return !existing;
    }
}