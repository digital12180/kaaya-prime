export interface ICreateSettingDto {
    key: string;
    value: any;
}
export interface IUpdateSettingDto {
    value?: any;
}
export interface ISettingResponseDto {
    _id: string;
    key: string;
    value: any;
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
export declare class SettingResponseDto implements ISettingResponseDto {
    _id: string;
    key: string;
    value: any;
    createdAt: Date;
    updatedAt: Date;
    constructor(setting: any);
}
export declare const validateCreateSetting: (data: any) => string[];
export declare const validateUpdateSetting: (data: any) => string[];
export declare const validateSettingValue: (key: string, value: any, expectedType?: string) => string[];
export declare const PREDEFINED_SETTINGS: {
    'site.title': {
        type: string;
        defaultValue: string;
        description: string;
    };
    'site.description': {
        type: string;
        defaultValue: string;
        description: string;
    };
    'site.logo': {
        type: string;
        defaultValue: string;
        description: string;
    };
    'site.favicon': {
        type: string;
        defaultValue: string;
        description: string;
    };
    'contact.email': {
        type: string;
        defaultValue: string;
        description: string;
    };
    'contact.phone': {
        type: string;
        defaultValue: string;
        description: string;
    };
    'contact.address': {
        type: string;
        defaultValue: string;
        description: string;
    };
    'social.facebook': {
        type: string;
        defaultValue: string;
        description: string;
    };
    'social.twitter': {
        type: string;
        defaultValue: string;
        description: string;
    };
    'social.instagram': {
        type: string;
        defaultValue: string;
        description: string;
    };
    'social.linkedin': {
        type: string;
        defaultValue: string;
        description: string;
    };
    'social.youtube': {
        type: string;
        defaultValue: string;
        description: string;
    };
    'analytics.google': {
        type: string;
        defaultValue: string;
        description: string;
    };
    'analytics.facebook': {
        type: string;
        defaultValue: string;
        description: string;
    };
    'features.maintenance_mode': {
        type: string;
        defaultValue: boolean;
        description: string;
    };
    'features.registration': {
        type: string;
        defaultValue: boolean;
        description: string;
    };
    'email.smtp_host': {
        type: string;
        defaultValue: string;
        description: string;
    };
    'email.smtp_port': {
        type: string;
        defaultValue: number;
        description: string;
    };
    'email.smtp_user': {
        type: string;
        defaultValue: string;
        description: string;
    };
    'email.smtp_password': {
        type: string;
        defaultValue: string;
        description: string;
    };
    'email.from_email': {
        type: string;
        defaultValue: string;
        description: string;
    };
    'pagination.default_limit': {
        type: string;
        defaultValue: number;
        description: string;
    };
    'pagination.max_limit': {
        type: string;
        defaultValue: number;
        description: string;
    };
    'cache.duration': {
        type: string;
        defaultValue: number;
        description: string;
    };
    'upload.max_size': {
        type: string;
        defaultValue: number;
        description: string;
    };
    'upload.allowed_types': {
        type: string;
        defaultValue: string[];
        description: string;
    };
};
//# sourceMappingURL=settings.dto.d.ts.map