import type { Response } from "express";
import type { ICreateAreaDto, IUpdateAreaDto, AreaResponseDto, IPaginationDto } from "./area.dto.js";
export declare class AreaService {
    createArea(createDto: ICreateAreaDto): Promise<AreaResponseDto | Response | any>;
    getAllAreas(paginationDto: IPaginationDto): Promise<{
        areas: Response | any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getAreaById(id: string): Promise<AreaResponseDto | any>;
    getAreaBySlug(slug: string): Promise<AreaResponseDto | any>;
    updateArea(id: string, updateDto: IUpdateAreaDto): Promise<AreaResponseDto | any>;
    deleteArea(id: string): Promise<{
        message: string;
        deletedId: string;
    }>;
    getAreaStatistics(): Promise<any>;
    bulkDeleteAreas(ids: string[]): Promise<{
        deletedCount: number;
        deletedIds: string[];
    }>;
    isSlugUnique(slug: string, excludeId?: string): Promise<boolean>;
    searchAreaByName(name: string): Promise<Response | any>;
}
//# sourceMappingURL=area.service.d.ts.map