// controllers/setting.controller.ts
import type{ Request, Response } from "express";
import { SettingService } from "./settings.service.js";
import {
    validateCreateSetting,
    validateUpdateSetting,
    PREDEFINED_SETTINGS
} from "./settings.dto.js";

export class SettingController {
    private settingService: SettingService;

    constructor() {
        this.settingService = new SettingService();
    }

    // Create setting
    createSetting = async (req: Request, res: Response): Promise<void> => {
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
        } catch (error: any) {
            const status = error.message.includes("already exists") ? 409 : 400;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to create setting",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get all settings with pagination
    getAllSettings = async (req: Request, res: Response): Promise<void> => {
        try {
            const paginationDto = {
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
                search: req.query.search as string,
                sortBy: req.query.sortBy as string,
                sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
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
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve settings",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get setting by ID
    getSettingById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const setting = await this.settingService.getSettingById(id as string);
            res.status(200).json({
                success: true,
                message: "Setting retrieved successfully",
                data: setting
            });
        } catch (error: any) {
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
    getAllSettingsAsObject = async (req: Request, res: Response): Promise<void> => {
        try {
            const settings = await this.settingService.getAllSettingsAsObject();
            res.status(200).json({
                success: true,
                message: "All settings retrieved successfully",
                data: settings
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve settings",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Update setting by key
    updateSettingByKey = async (req: Request, res: Response): Promise<void> => {
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

            const setting = await this.settingService.updateSettingByKey(key as string, req.body);
            res.status(200).json({
                success: true,
                message: "Setting updated successfully",
                data: setting
            });
        } catch (error: any) {
            const status = error.message.includes("expects") ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to update setting",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Update setting by ID
    updateSettingById = async (req: Request, res: Response): Promise<void> => {
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

            const setting = await this.settingService.updateSettingById(id as string, req.body);
            res.status(200).json({
                success: true,
                message: "Setting updated successfully",
                data: setting
            });
        } catch (error: any) {
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
    deleteSettingByKey = async (req: Request, res: Response): Promise<void> => {
        try {
            const { key } = req.params;
            const result = await this.settingService.deleteSettingByKey(key as string);
            res.status(200).json({
                success: true,
                message: result.message,
                data: { deletedKey: result.deletedKey }
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message || "Failed to delete setting",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Delete setting by ID
    deleteSettingById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const result = await this.settingService.deleteSettingById(id as string);
            res.status(200).json({
                success: true,
                message: result.message,
                data: { deletedId: result.deletedId }
            });
        } catch (error: any) {
            const status = error.message === "Invalid setting ID format" ? 400 : 404;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to delete setting",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get setting statistics
    getSettingStatistics = async (req: Request, res: Response): Promise<void> => {
        try {
            const statistics = await this.settingService.getSettingStatistics();
            res.status(200).json({
                success: true,
                message: "Statistics retrieved successfully",
                data: statistics
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve statistics",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Initialize default settings
    initializeDefaultSettings = async (req: Request, res: Response): Promise<void> => {
        try {
            const settings = await this.settingService.initializeDefaultSettings();
            res.status(200).json({
                success: true,
                message: `${settings.length} default settings initialized successfully`,
                data: settings
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to initialize default settings",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Get predefined settings list
    getPredefinedSettings = async (req: Request, res: Response): Promise<void> => {
        try {
            res.status(200).json({
                success: true,
                message: "Predefined settings retrieved successfully",
                data: PREDEFINED_SETTINGS
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve predefined settings",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };

    // Check if setting exists
    checkSettingExists = async (req: Request, res: Response): Promise<void> => {
        try {
            const { key } = req.params;
            const exists = await this.settingService.settingExists(key as string);
            res.status(200).json({
                success: true,
                data: {
                    key,
                    exists,
                    message: exists ? "Setting exists" : "Setting does not exist"
                }
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to check setting existence",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
    };
}