import type { ICreateLandingPageDto, IUpdateLandingPageDto, IUpdateStatusDto, LandingPageResponseDto, IPaginationDto } from "./landingPage.dto.js";
export declare class LandingPageService {
    createLandingPage(createDto: ICreateLandingPageDto): Promise<LandingPageResponseDto | any>;
    getAllLandingPages(paginationDto: IPaginationDto): Promise<{
        landingPages: any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getLandingPageById(id: string): Promise<LandingPageResponseDto | any>;
    getLandingPageBySlug(slug: string): Promise<LandingPageResponseDto | any>;
    getLandingPageBySlugAdmin(slug: string): Promise<LandingPageResponseDto | any>;
    searchLandingPagesByTitle(searchTerm: string, paginationDto: IPaginationDto): Promise<{
        landingPages: any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateLandingPage(id: string, updateDto: IUpdateLandingPageDto): Promise<LandingPageResponseDto | any>;
    updateLandingPageStatus(id: string, statusDto: IUpdateStatusDto): Promise<LandingPageResponseDto | any>;
    deleteLandingPage(id: string): Promise<{
        message: string;
        deletedId: string;
    }>;
    getLandingPagesByStatus(status: string): Promise<LandingPageResponseDto[] | any>;
    getLandingPagesByFormType(formType: string): Promise<LandingPageResponseDto[] | any>;
    getPublishedLandingPages(paginationDto: IPaginationDto): Promise<{
        landingPages: LandingPageResponseDto[] | any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getLandingPageStatistics(): Promise<any>;
    bulkDeleteLandingPages(ids: string[]): Promise<{
        deletedCount: number;
        deletedIds: string[];
    }>;
    isSlugUnique(slug: string, excludeId?: string): Promise<boolean>;
}
//# sourceMappingURL=landingPage.service.d.ts.map