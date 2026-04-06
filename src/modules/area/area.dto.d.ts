export interface ICreateAreaDto {
    name: string;
    description: string;
    image?: string;
    metaTitle?: string;
    metaDescription?: string;
}
export interface IUpdateAreaDto {
    name?: string;
    description?: string;
    image?: string;
    metaTitle?: string;
    metaDescription?: string;
}
export interface IAreaResponseDto {
    _id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    metaTitle: string;
    metaDescription: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IPaginationDto {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class AreaResponseDto implements IAreaResponseDto {
    _id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    metaTitle: string;
    metaDescription: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(area: any);
}
export declare const generateSlug: (name: string) => string;
export declare const validateCreateArea: (data: any) => string[];
export declare const validateUpdateArea: (data: any) => string[];
//# sourceMappingURL=area.dto.d.ts.map