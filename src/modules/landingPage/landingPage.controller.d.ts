import type { Request, Response } from "express";
export declare class LandingPageController {
    private landingPageService;
    constructor();
    createLandingPage: (req: Request, res: Response) => Promise<void>;
    getAllLandingPages: (req: Request, res: Response) => Promise<void>;
    getLandingPageById: (req: Request, res: Response) => Promise<void>;
    getLandingPageBySlug: (req: Request, res: Response) => Promise<void>;
    getLandingPageBySlugAdmin: (req: Request, res: Response) => Promise<void>;
    searchLandingPagesByTitle: (req: Request, res: Response) => Promise<void | any>;
    updateLandingPage: (req: Request, res: Response) => Promise<void>;
    updateLandingPageStatus: (req: Request, res: Response) => Promise<void>;
    deleteLandingPage: (req: Request, res: Response) => Promise<void>;
    getLandingPagesByStatus: (req: Request, res: Response) => Promise<void>;
    getLandingPagesByFormType: (req: Request, res: Response) => Promise<void>;
    getPublishedLandingPages: (req: Request, res: Response) => Promise<void>;
    getLandingPageStatistics: (req: Request, res: Response) => Promise<void>;
    bulkDeleteLandingPages: (req: Request, res: Response) => Promise<void>;
    checkSlugUniqueness: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=landingPage.controller.d.ts.map