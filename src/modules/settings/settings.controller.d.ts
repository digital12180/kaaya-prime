import type { Request, Response } from "express";
export declare class SettingController {
    private settingService;
    constructor();
    createSetting: (req: Request, res: Response) => Promise<void>;
    getAllSettings: (req: Request, res: Response) => Promise<void>;
    getSettingById: (req: Request, res: Response) => Promise<void>;
    getAllSettingsAsObject: (req: Request, res: Response) => Promise<void>;
    updateSettingByKey: (req: Request, res: Response) => Promise<void>;
    updateSettingById: (req: Request, res: Response) => Promise<void>;
    deleteSettingByKey: (req: Request, res: Response) => Promise<void>;
    deleteSettingById: (req: Request, res: Response) => Promise<void>;
    bulkUpsertSettings: (req: Request, res: Response) => Promise<void>;
    bulkDeleteSettings: (req: Request, res: Response) => Promise<void>;
    getSettingStatistics: (req: Request, res: Response) => Promise<void>;
    initializeDefaultSettings: (req: Request, res: Response) => Promise<void>;
    getPredefinedSettings: (req: Request, res: Response) => Promise<void>;
    checkSettingExists: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=settings.controller.d.ts.map