export interface CreateLeadDto {
    name: string;
    email: string;
    phone: string;
    message?: string;
    source?: string;
    page?: string;
}
export interface UpdateLeadDto {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    source?: string;
    page?: string;
}
export interface LeadResponseDto {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message?: string;
    source?: string;
    page?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface PaginationDto {
    page?: number;
    limit?: number;
    search?: string;
    source?: string;
}
export declare const mapLeadResponseDto: (lead: any) => LeadResponseDto;
//# sourceMappingURL=lead.dto.d.ts.map