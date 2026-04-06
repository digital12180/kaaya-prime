import type { ICreateOpportunityDto, IUpdateOpportunityDto, IPaginationDto } from "./opportunity.dto.js";
export declare class OpportunityService {
    createOpportunity(createDto: ICreateOpportunityDto): Promise<any | Response>;
    getAllOpportunities(paginationDto: IPaginationDto): Promise<{
        opportunities: any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getOpportunityById(id: string): Promise<any | Response>;
    updateOpportunity(id: string, updateDto: IUpdateOpportunityDto): Promise<any>;
    deleteOpportunity(id: string): Promise<{
        message: string;
        deletedId: string;
    }>;
    getOpportunitiesByStatus(status: string): Promise<Response | any>;
    getOpportunityStatistics(): Promise<any>;
    bulkDeleteOpportunities(ids: string[]): Promise<{
        deletedCount: number;
        deletedIds: string[];
    }>;
    searchOpportunity(title: string): Promise<Response | any>;
}
//# sourceMappingURL=opportunity.service.d.ts.map