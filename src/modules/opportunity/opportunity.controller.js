import { OpportunityService } from "./opportunity.service.js";
export class OpportunityController {
    opportunityService;
    constructor() {
        this.opportunityService = new OpportunityService();
    }
    // Create opportunity
    createOpportunity = async (req, res) => {
        try {
            const opportunity = await this.opportunityService.createOpportunity(req.body);
            res.status(201).json({
                success: true,
                message: "Opportunity created successfully",
                data: opportunity
            });
        }
        catch (error) {
            const status = error.message.includes("already exists") ? 409 : 400;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to create opportunity",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Get all opportunities with pagination
    getAllOpportunities = async (req, res) => {
        try {
            const paginationDto = {
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 10,
                search: req.query.search,
                status: req.query.status,
                location: req.query.location
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
            const result = await this.opportunityService.getAllOpportunities(paginationDto);
            res.status(200).json({
                success: true,
                message: "Opportunities retrieved successfully",
                data: result.opportunities,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: result.totalPages
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve opportunities",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Get opportunity by ID
    getOpportunityById = async (req, res) => {
        try {
            const { id } = req.params;
            const opportunity = await this.opportunityService.getOpportunityById(id);
            res.status(200).json({
                success: true,
                message: "Opportunity retrieved successfully",
                data: opportunity
            });
        }
        catch (error) {
            const status = error.message === "Invalid opportunity ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to retrieve opportunity",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Update opportunity
    updateOpportunity = async (req, res) => {
        try {
            const { id } = req.params;
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Request body is required"
                });
            }
            const opportunity = await this.opportunityService.updateOpportunity(id, req.body);
            return res.status(200).json({
                success: true,
                message: "Opportunity updated successfully",
                data: opportunity
            });
        }
        catch (error) {
            const status = error.message === "Invalid opportunity ID format" ? 400 :
                error.message.includes("already exists") ? 409 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to update opportunity",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Delete opportunity
    deleteOpportunity = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await this.opportunityService.deleteOpportunity(id);
            res.status(200).json({
                success: true,
                message: result.message,
                data: { deletedId: result.deletedId }
            });
        }
        catch (error) {
            const status = error.message === "Invalid opportunity ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to delete opportunity",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Get opportunities by status
    getOpportunitiesByStatus = async (req, res) => {
        try {
            const { status } = req.params;
            const opportunities = await this.opportunityService.getOpportunitiesByStatus(status);
            res.status(200).json({
                success: true,
                message: `Opportunities with status '${status}' retrieved successfully`,
                data: opportunities,
                count: opportunities.length
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || "Failed to retrieve opportunities by status",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Get opportunity statistics
    getOpportunityStatistics = async (req, res) => {
        try {
            const statistics = await this.opportunityService.getOpportunityStatistics();
            res.status(200).json({
                success: true,
                message: "Statistics retrieved successfully",
                data: statistics
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve statistics",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Bulk delete opportunities
    bulkDeleteOpportunities = async (req, res) => {
        try {
            const { ids } = req.body;
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                res.status(400).json({
                    success: false,
                    message: "Please provide an array of opportunity IDs to delete"
                });
                return;
            }
            const result = await this.opportunityService.bulkDeleteOpportunities(ids);
            res.status(200).json({
                success: true,
                message: `${result.deletedCount} opportunities deleted successfully`,
                data: result
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || "Failed to delete opportunities",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    searchOpportunity = async (req, res) => {
        try {
            const { title } = req.query;
            const opportunities = await this.opportunityService.searchOpportunity(title);
            res.status(200).json({
                success: true,
                message: `Opportunities with title '${title}' retrieved successfully`,
                data: opportunities,
                count: opportunities.length
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || "Failed to retrieve opportunities by title",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
}
//# sourceMappingURL=opportunity.controller.js.map