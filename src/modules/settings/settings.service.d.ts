import type { ICreateSettingDto, IUpdateSettingDto, SettingResponseDto, IPaginationDto } from "./settings.dto.js";
export declare class SettingService {
    createSetting(createDto: ICreateSettingDto): Promise<SettingResponseDto | any>;
    getAllSettings(paginationDto: IPaginationDto): Promise<{
        settings: SettingResponseDto[] | any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getSettingById(id: string): Promise<SettingResponseDto | any>;
    getAllSettingsAsObject(): Promise<Record<string, any>>;
    updateSettingByKey(key: string, updateDto: IUpdateSettingDto): Promise<SettingResponseDto | any>;
    updateSettingById(id: string, updateDto: IUpdateSettingDto): Promise<SettingResponseDto | any>;
    deleteSettingByKey(key: string): Promise<{
        message: string;
        deletedKey: string;
    }>;
    deleteSettingById(id: string): Promise<{
        message: string;
        deletedId: string;
    }>;
    bulkUpsertSettings(settings: ICreateSettingDto[]): Promise<SettingResponseDto[] | any>;
    bulkDeleteSettings(ids: string[]): Promise<{
        deletedCount: number;
        deletedIds: string[];
    }>;
    getSettingStatistics(): Promise<any>;
    initializeDefaultSettings(): Promise<SettingResponseDto[] | any>;
    settingExists(key: string): Promise<boolean>;
}
//# sourceMappingURL=settings.service.d.ts.map