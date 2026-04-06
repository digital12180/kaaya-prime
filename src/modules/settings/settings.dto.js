// dtos/setting.dto.ts
export class SettingResponseDto {
    _id;
    key;
    value;
    createdAt;
    updatedAt;
    constructor(setting) {
        this._id = setting._id.toString();
        this.key = setting.key;
        this.value = setting.value;
        this.createdAt = setting.createdAt;
        this.updatedAt = setting.updatedAt;
    }
}
// Validation functions
export const validateCreateSetting = (data) => {
    const errors = [];
    if (!data.key || typeof data.key !== 'string' || data.key.trim().length === 0) {
        errors.push("Key is required and must be a non-empty string");
    }
    else if (data.key.length < 2 || data.key.length > 100) {
        errors.push("Key must be between 2 and 100 characters");
    }
    else if (!/^[a-zA-Z0-9_\.]+$/.test(data.key)) {
        errors.push("Key can only contain letters, numbers, underscores, and dots");
    }
    if (data.value === undefined || data.value === null) {
        errors.push("Value is required");
    }
    return errors;
};
export const validateUpdateSetting = (data) => {
    const errors = [];
    if (data.value === undefined || data.value === null) {
        errors.push("Value is required");
    }
    return errors;
};
// Helper function to validate value based on expected type
export const validateSettingValue = (key, value, expectedType) => {
    const errors = [];
    if (expectedType) {
        switch (expectedType) {
            case 'string':
                if (typeof value !== 'string') {
                    errors.push(`Setting '${key}' expects a string value`);
                }
                break;
            case 'number':
                if (typeof value !== 'number' || isNaN(value)) {
                    errors.push(`Setting '${key}' expects a number value`);
                }
                break;
            case 'boolean':
                if (typeof value !== 'boolean') {
                    errors.push(`Setting '${key}' expects a boolean value`);
                }
                break;
            case 'array':
                if (!Array.isArray(value)) {
                    errors.push(`Setting '${key}' expects an array value`);
                }
                break;
            case 'object':
                if (typeof value !== 'object' || value === null || Array.isArray(value)) {
                    errors.push(`Setting '${key}' expects an object value`);
                }
                break;
        }
    }
    return errors;
};
// Predefined setting keys with their expected types
export const PREDEFINED_SETTINGS = {
    'site.title': { type: 'string', defaultValue: 'My App', description: 'Site title' },
    'site.description': { type: 'string', defaultValue: '', description: 'Site description' },
    'site.logo': { type: 'string', defaultValue: '', description: 'Site logo URL' },
    'site.favicon': { type: 'string', defaultValue: '', description: 'Site favicon URL' },
    'contact.email': { type: 'string', defaultValue: '', description: 'Contact email address' },
    'contact.phone': { type: 'string', defaultValue: '', description: 'Contact phone number' },
    'contact.address': { type: 'string', defaultValue: '', description: 'Contact address' },
    'social.facebook': { type: 'string', defaultValue: '', description: 'Facebook URL' },
    'social.twitter': { type: 'string', defaultValue: '', description: 'Twitter URL' },
    'social.instagram': { type: 'string', defaultValue: '', description: 'Instagram URL' },
    'social.linkedin': { type: 'string', defaultValue: '', description: 'LinkedIn URL' },
    'social.youtube': { type: 'string', defaultValue: '', description: 'YouTube URL' },
    'analytics.google': { type: 'string', defaultValue: '', description: 'Google Analytics ID' },
    'analytics.facebook': { type: 'string', defaultValue: '', description: 'Facebook Pixel ID' },
    'features.maintenance_mode': { type: 'boolean', defaultValue: false, description: 'Enable maintenance mode' },
    'features.registration': { type: 'boolean', defaultValue: true, description: 'Allow user registration' },
    'email.smtp_host': { type: 'string', defaultValue: '', description: 'SMTP host' },
    'email.smtp_port': { type: 'number', defaultValue: 587, description: 'SMTP port' },
    'email.smtp_user': { type: 'string', defaultValue: '', description: 'SMTP username' },
    'email.smtp_password': { type: 'string', defaultValue: '', description: 'SMTP password' },
    'email.from_email': { type: 'string', defaultValue: '', description: 'From email address' },
    'pagination.default_limit': { type: 'number', defaultValue: 10, description: 'Default pagination limit' },
    'pagination.max_limit': { type: 'number', defaultValue: 100, description: 'Maximum pagination limit' },
    'cache.duration': { type: 'number', defaultValue: 3600, description: 'Cache duration in seconds' },
    'upload.max_size': { type: 'number', defaultValue: 5242880, description: 'Maximum upload size in bytes' },
    'upload.allowed_types': { type: 'array', defaultValue: ['jpg', 'png', 'pdf'], description: 'Allowed file types' }
};
//# sourceMappingURL=settings.dto.js.map