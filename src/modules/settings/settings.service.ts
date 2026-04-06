// services/setting.service.ts
import mongoose from "mongoose";
import { Setting } from "./settings.model.js";
import type {
  ICreateSettingDto,
  IUpdateSettingDto,
  SettingResponseDto,
  IPaginationDto,
} from "./settings.dto.js";
import { validateSettingValue, PREDEFINED_SETTINGS } from "./settings.dto.js"

export class SettingService {

  // Create a new setting
  async createSetting(createDto: ICreateSettingDto): Promise<SettingResponseDto|any> {
    try {
      // Check if setting key already exists
      const existingSetting = await Setting.findOne({ key: createDto.key });
      if (existingSetting) {
        throw new Error(`Setting with key '${createDto.key}' already exists`);
      }

      // Validate against predefined settings if exists
      const predefined = PREDEFINED_SETTINGS[createDto.key as keyof typeof PREDEFINED_SETTINGS];
      if (predefined) {
        const validationErrors = validateSettingValue(createDto.key, createDto.value, predefined.type);
        if (validationErrors.length > 0) {
          throw new Error(validationErrors.join(", "));
        }
      }

      const setting = new Setting(createDto);
      await setting.save();
      return setting;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("Setting key already exists");
      }
      throw error;
    }
  }

  // Get all settings with pagination
  async getAllSettings(paginationDto: IPaginationDto): Promise<{
    settings: SettingResponseDto[] | any;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = Math.max(1, paginationDto.page || 1);
    const limit = Math.min(100, Math.max(1, paginationDto.limit || 10));
    const skip = (page - 1) * limit;

    let query: any = {};

    // Search functionality
    if (paginationDto.search && paginationDto.search.trim()) {
      query.key = { $regex: paginationDto.search, $options: 'i' };
    }

    // Sorting
    let sort: any = { createdAt: -1 };
    if (paginationDto.sortBy) {
      const sortOrder = paginationDto.sortOrder === 'asc' ? 1 : -1;
      sort = { [paginationDto.sortBy]: sortOrder };
    }

    const [settings, total] = await Promise.all([
      Setting.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Setting.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      settings: settings,
      total,
      page,
      limit,
      totalPages
    };
  }

  // Get setting by ID
  async getSettingById(id: string): Promise<SettingResponseDto | any> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid setting ID format");
    }

    const setting = await Setting.findById(id).lean();
    if (!setting) {
      throw new Error("Setting not found");
    }

    return setting;
  }

  // Get multiple settings by keys
  // async getMultipleSettings(keys: string[]): Promise<Record<string, any>> {
  //   if (!keys || !Array.isArray(keys) || keys.length === 0) {
  //     throw new Error("Keys array is required");
  //   }

  //   const settings = await Setting.find({ key: { $in: keys } }).lean();
  //   const result: Record<string, any> = {};

  //   // Initialize with default values from predefined settings
  //   keys.forEach(key => {
  //     const predefined = PREDEFINED_SETTINGS[key as keyof typeof PREDEFINED_SETTINGS];
  //     result[key] = predefined ? predefined.defaultValue : null;
  //   });

  //   // Override with actual values from database
  //   settings.forEach(setting => {
  //     result[setting.key] = setting.value;
  //   });

  //   return result;
  // }

  // Get all settings as key-value object
  async getAllSettingsAsObject(): Promise<Record<string, any>> {
    const settings = await Setting.find().lean();
    const result: Record<string, any> = {};

    settings.forEach(setting => {
      result[setting.key] = setting.value;
    });

    return result;
  }

  // Update setting by key
  async updateSettingByKey(key: string, updateDto: IUpdateSettingDto): Promise<SettingResponseDto | any> {
    if (!key || typeof key !== 'string') {
      throw new Error("Invalid setting key");
    }

    // Validate against predefined settings if exists
    const predefined = PREDEFINED_SETTINGS[key as keyof typeof PREDEFINED_SETTINGS];
    if (predefined) {
      const validationErrors = validateSettingValue(key, updateDto.value, predefined.type);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(", "));
      }
    }

    const setting = await Setting.findOneAndUpdate(
      { key },
      { value: updateDto.value, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();

    if (!setting) {
      // Create new setting if it doesn't exist (upsert)
      const newSetting = new Setting({ key, value: updateDto.value });
      await newSetting.save();
      return newSetting;
    }

    return setting;
  }

  // Update setting by ID
  async updateSettingById(id: string, updateDto: IUpdateSettingDto): Promise<SettingResponseDto|any> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid setting ID format");
    }

    const existingSetting = await Setting.findById(id);
    if (!existingSetting) {
      throw new Error("Setting not found");
    }

    // Validate against predefined settings if exists
    const predefined = PREDEFINED_SETTINGS[existingSetting.key as keyof typeof PREDEFINED_SETTINGS];
    if (predefined) {
      const validationErrors = validateSettingValue(existingSetting.key, updateDto.value, predefined.type);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(", "));
      }
    }

    const setting = await Setting.findByIdAndUpdate(
      id,
      { value: updateDto.value, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();

    if (!setting) {
      throw new Error("Setting not found");
    }

    return setting;
  }

  // Delete setting by key
  async deleteSettingByKey(key: string): Promise<{ message: string; deletedKey: string }> {
    if (!key || typeof key !== 'string') {
      throw new Error("Invalid setting key");
    }

    const setting = await Setting.findOneAndDelete({ key });
    if (!setting) {
      throw new Error(`Setting with key '${key}' not found`);
    }

    return {
      message: "Setting deleted successfully",
      deletedKey: key
    };
  }

  // Delete setting by ID
  async deleteSettingById(id: string): Promise<{ message: string; deletedId: string }> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid setting ID format");
    }

    const setting = await Setting.findByIdAndDelete(id);
    if (!setting) {
      throw new Error("Setting not found");
    }

    return {
      message: "Setting deleted successfully",
      deletedId: id
    };
  }

  // Bulk create/update settings
  async bulkUpsertSettings(settings: ICreateSettingDto[]): Promise<SettingResponseDto[]|any> {
    if (!settings || !Array.isArray(settings) || settings.length === 0) {
      throw new Error("Settings array is required");
    }

    const results:any = [];

    for (const setting of settings) {
      try {
        // Validate against predefined settings if exists
        const predefined = PREDEFINED_SETTINGS[setting.key as keyof typeof PREDEFINED_SETTINGS];
        if (predefined) {
          const validationErrors = validateSettingValue(setting.key, setting.value, predefined.type);
          if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(", "));
          }
        }

        const updated = await Setting.findOneAndUpdate(
          { key: setting.key },
          { value: setting.value, updatedAt: new Date() },
          { new: true, upsert: true, runValidators: true }
        ).lean();

        results.push(updated);
      } catch (error: any) {
        throw new Error(`Failed to upsert setting '${setting.key}': ${error.message}`);
      }
    }

    return results;
  }

  // Bulk delete settings
  async bulkDeleteSettings(ids: string[]): Promise<{ deletedCount: number; deletedIds: string[] }> {
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));

    if (validIds.length === 0) {
      throw new Error("No valid setting IDs provided");
    }

    const result = await Setting.deleteMany({
      _id: { $in: validIds }
    });

    return {
      deletedCount: result.deletedCount || 0,
      deletedIds: validIds
    };
  }

  // Get setting statistics
  async getSettingStatistics(): Promise<any> {
    const [totalSettings, recentSettings, predefinedCount] = await Promise.all([
      Setting.countDocuments(),
      Setting.find().sort({ createdAt: -1 }).limit(5).lean(),
      Promise.resolve(Object.keys(PREDEFINED_SETTINGS).length)
    ]);

    const definedCount = await Setting.countDocuments({
      key: { $in: Object.keys(PREDEFINED_SETTINGS) }
    });

    return {
      totalSettings,
      predefinedSettingsCount: predefinedCount,
      definedSettingsCount: definedCount,
      customSettingsCount: totalSettings - definedCount,
      recentSettings: recentSettings
    };
  }

  // Initialize default settings
  async initializeDefaultSettings(): Promise<SettingResponseDto[]|any> {
    const results:any = [];

    for (const [key, config] of Object.entries(PREDEFINED_SETTINGS)) {
      const existing = await Setting.findOne({ key });
      if (!existing) {
        const setting = new Setting({
          key,
          value: config.defaultValue
        });
        await setting.save();
        results.push(setting);
      }
    }

    return results;
  }

  // Check if setting key exists
  async settingExists(key: string): Promise<boolean> {
    const setting = await Setting.findOne({ key });
    return !!setting;
  }
}