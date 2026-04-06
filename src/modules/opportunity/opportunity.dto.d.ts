export interface ICreateOpportunityDto {
    title: string;
    description: string;
    location: string;
    image?: string;
    status?: "ACTIVE" | "UPCOMING" | "SOLD OUT" | "UNDER REVIEW";
}
export interface IUpdateOpportunityDto {
    title?: string;
    description?: string;
    location?: string;
    image?: string;
    status?: "ACTIVE" | "UPCOMING" | "SOLD OUT" | "UNDER REVIEW";
}
export interface IOpportunityResponseDto {
    _id: string;
    title: string;
    description: string;
    location: string;
    image: string;
    status: "ACTIVE" | "UPCOMING" | "SOLD OUT" | "UNDER REVIEW";
    createdAt: Date;
    updatedAt: Date;
}
export interface IPaginationDto {
    page?: number;
    limit?: number;
    search?: string;
    status?: "ACTIVE" | "UPCOMING" | "SOLD OUT" | "UNDER REVIEW";
    location?: string;
}
export declare class OpportunityResponseDto implements IOpportunityResponseDto {
    _id: string;
    title: string;
    description: string;
    location: string;
    image: string;
    status: "ACTIVE" | "UPCOMING" | "SOLD OUT" | "UNDER REVIEW";
    createdAt: Date;
    updatedAt: Date;
    constructor(opportunity: any);
}
export declare const validateCreateOpportunity: (data: any) => string[];
export declare const validateUpdateOpportunity: (data: any) => string[];
//# sourceMappingURL=opportunity.dto.d.ts.map