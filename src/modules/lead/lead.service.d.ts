import type { CreateLeadDto, UpdateLeadDto, LeadResponseDto, PaginationDto } from "./lead.dto.js";
export declare class LeadService {
    createLead(createLeadDto: CreateLeadDto): Promise<LeadResponseDto | Response | any>;
    getAllLeads(paginationDto: PaginationDto): Promise<{
        leads: any;
        total: number;
        page: number;
        totalPages: number;
    }>;
    getLeadById(id: string): Promise<LeadResponseDto | any | Response>;
    updateLead(id: string, updateLeadDto: UpdateLeadDto): Promise<LeadResponseDto | any | Response>;
    deleteLead(id: string): Promise<{
        message: string;
        deletedId: string;
    }>;
    getLeadStatistics(): Promise<any>;
    searchLead(name: string): Promise<any>;
}
//# sourceMappingURL=lead.service.d.ts.map