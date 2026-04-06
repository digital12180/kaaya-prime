import { SettingService } from "./settings.service.js";
import { validateCreateSetting, validateUpdateSetting, PREDEFINED_SETTINGS } from "./settings.dto.js";
export class SettingController {
    settingService;
    constructor() {
        this.settingService = new SettingService();
    }
    // Create setting
    createSetting = async (req, res) => {
        try {
            // Validate request data
            const validationErrors = validateCreateSetting(req.body);
            if (validationErrors.length > 0) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: validationErrors
                });
                return;
            }
            const setting = await this.settingService.createSetting(req.body);
            res.status(201).json({
                success: true,
                message: "Setting created successfully",
                data: setting
            });
        }
        catch (error) {
            const status = error.message.includes("already exists") ? 409 : 400;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to create setting",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Get all settings with pagination
    getAllSettings = async (req, res) => {
        try {
            const paginationDto = {
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 10,
                search: req.query.search,
                sortBy: req.query.sortBy,
                sortOrder: req.query.sortOrder || 'desc'
            };
            // Validate pagination params
            if (paginationDto.page && (isNaN(paginationDto.page) || paginationDto.page < 1)) {
                res.status(400).json({
                    success: false,
                    message: "Page must be a positive number"
                });
                return;
            }
            if (paginationDto.limit && (isNaN(paginationDto.limit) || paginationDto.limit < 1 || paginationDto.limit > 100)) {
                res.status(400).json({
                    success: false,
                    message: "Limit must be between 1 and 100"
                });
                return;
            }
            const result = await this.settingService.getAllSettings(paginationDto);
            res.status(200).json({
                success: true,
                message: "Settings retrieved successfully",
                data: result.settings,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: result.totalPages
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve settings",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Get setting by ID
    getSettingById = async (req, res) => {
        try {
            const { id } = req.params;
            const setting = await this.settingService.getSettingById(id);
            res.status(200).json({
                success: true,
                message: "Setting retrieved successfully",
                data: setting
            });
        }
        catch (error) {
            const status = error.message === "Invalid setting ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to retrieve setting",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // // Get setting by key
    // getSettingByKey = async (req: Request, res: Response): Promise<void> => {
    //     try {
    //         const { key } = req.params;
    //         const value = await this.settingService.getSettingByKey(key as string);
    //         res.status(200).json({
    //             success: true,
    //             message: "Setting retrieved successfully",
    //             data: {
    //                 key,
    //                 value
    //             }
    //         });
    //     } catch (error: any) {
    //         res.status(404).json({
    //             success: false,
    //             message: error.message || "Failed to retrieve setting",
    //             error: process.env.NODE_ENV === "development" ? error.stack : undefined
    //         });
    //     }
    // };
    // // Get multiple settings by keys
    // getMultipleSettings = async (req: Request, res: Response): Promise<void> => {
    //     try {
    //         const { keys } = req.body;
    //         if (!keys || !Array.isArray(keys) || keys.length === 0) {
    //             res.status(400).json({
    //                 success: false,
    //                 message: "Please provide an array of setting keys"
    //             });
    //             return;
    //         }
    //         const settings = await this.settingService.getMultipleSettings(keys);
    //         res.status(200).json({
    //             success: true,
    //             message: "Settings retrieved successfully",
    //             data: settings
    //         });
    //     } catch (error: any) {
    //         res.status(400).json({
    //             success: false,
    //             message: error.message || "Failed to retrieve settings",
    //             error: process.env.NODE_ENV === "development" ? error.stack : undefined
    //         });
    //     }
    // };
    // Get all settings as object
    getAllSettingsAsObject = async (req, res) => {
        try {
            const settings = await this.settingService.getAllSettingsAsObject();
            res.status(200).json({
                success: true,
                message: "All settings retrieved successfully",
                data: settings
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve settings",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Update setting by key
    updateSettingByKey = async (req, res) => {
        try {
            const { key } = req.params;
            // Validate update data
            const validationErrors = validateUpdateSetting(req.body);
            if (validationErrors.length > 0) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: validationErrors
                });
                return;
            }
            const setting = await this.settingService.updateSettingByKey(key, req.body);
            res.status(200).json({
                success: true,
                message: "Setting updated successfully",
                data: setting
            });
        }
        catch (error) {
            const status = error.message.includes("expects") ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to update setting",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Update setting by ID
    updateSettingById = async (req, res) => {
        try {
            const { id } = req.params;
            // Validate update data
            const validationErrors = validateUpdateSetting(req.body);
            if (validationErrors.length > 0) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: validationErrors
                });
                return;
            }
            const setting = await this.settingService.updateSettingById(id, req.body);
            res.status(200).json({
                success: true,
                message: "Setting updated successfully",
                data: setting
            });
        }
        catch (error) {
            const status = error.message === "Invalid setting ID format" ? 400 :
                error.message.includes("expects") ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to update setting",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Delete setting by key
    deleteSettingByKey = async (req, res) => {
        try {
            const { key } = req.params;
            const result = await this.settingService.deleteSettingByKey(key);
            res.status(200).json({
                success: true,
                message: result.message,
                data: { deletedKey: result.deletedKey }
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error.message || "Failed to delete setting",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Delete setting by ID
    deleteSettingById = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await this.settingService.deleteSettingById(id);
            res.status(200).json({
                success: true,
                message: result.message,
                data: { deletedId: result.deletedId }
            });
        }
        catch (error) {
            const status = error.message === "Invalid setting ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to delete setting",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Bulk upsert settings
    bulkUpsertSettings = async (req, res) => {
        try {
            const { settings } = req.body;
            if (!settings || !Array.isArray(settings) || settings.length === 0) {
                res.status(400).json({
                    success: false,
                    message: "Please provide an array of settings with keys and values"
                });
                return;
            }
            // Validate each setting
            for (const setting of settings) {
                const validationErrors = validateCreateSetting(setting);
                if (validationErrors.length > 0) {
                    res.status(400).json({
                        success: false,
                        message: `Validation failed for setting '${setting.key}'`,
                        errors: validationErrors
                    });
                    return;
                }
            }
            const results = await this.settingService.bulkUpsertSettings(settings);
            res.status(200).json({
                success: true,
                message: `${results.length} settings upserted successfully`,
                data: results
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || "Failed to upsert settings",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Bulk delete settings
    bulkDeleteSettings = async (req, res) => {
        try {
            const { ids } = req.body;
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                res.status(400).json({
                    success: false,
                    message: "Please provide an array of setting IDs to delete"
                });
                return;
            }
            const result = await this.settingService.bulkDeleteSettings(ids);
            res.status(200).json({
                success: true,
                message: `${result.deletedCount} settings deleted successfully`,
                data: result
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || "Failed to delete settings",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Get setting statistics
    getSettingStatistics = async (req, res) => {
        try {
            const statistics = await this.settingService.getSettingStatistics();
            res.status(200).json({
                success: true,
                message: "Statistics retrieved successfully",
                data: statistics
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve statistics",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Initialize default settings
    initializeDefaultSettings = async (req, res) => {
        try {
            const settings = await this.settingService.initializeDefaultSettings();
            res.status(200).json({
                success: true,
                message: `${settings.length} default settings initialized successfully`,
                data: settings
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to initialize default settings",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Get predefined settings list
    getPredefinedSettings = async (req, res) => {
        try {
            res.status(200).json({
                success: true,
                message: "Predefined settings retrieved successfully",
                data: PREDEFINED_SETTINGS
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve predefined settings",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
    // Check if setting exists
    checkSettingExists = async (req, res) => {
        try {
            const { key } = req.params;
            const exists = await this.settingService.settingExists(key);
            res.status(200).json({
                success: true,
                data: {
                    key,
                    exists,
                    message: exists ? "Setting exists" : "Setting does not exist"
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to check setting existence",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
}
//# sourceMappingURL=settings.controller.js.map