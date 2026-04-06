import type { Request, Response } from "express";
export declare class AreaController {
    private areaService;
    constructor();
    createArea: (req: Request, res: Response) => Promise<void>;
    getAllAreas: (req: Request, res: Response) => Promise<void>;
    getAreaById: (req: Request, res: Response) => Promise<void>;
    getAreaBySlug: (req: Request, res: Response) => Promise<void>;
    updateArea: (req: Request, res: Response) => Promise<void>;
    deleteArea: (req: Request, res: Response) => Promise<void>;
    getAreaStatistics: (req: Request, res: Response) => Promise<void>;
    bulkDeleteAreas: (req: Request, res: Response) => Promise<void>;
    checkSlugUniqueness: (req: Request, res: Response) => Promise<void>;
    searchAreaByName: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=area.controller.d.ts.map