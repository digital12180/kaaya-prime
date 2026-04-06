import type { Request, Response } from "express";
export declare class ReportController {
    private reportService;
    constructor();
    createReport: (req: Request, res: Response) => Promise<void>;
    getAllReports: (req: Request, res: Response) => Promise<void>;
    getReportById: (req: Request, res: Response) => Promise<void>;
    searchReportsByTitle: (req: Request, res: Response) => Promise<void>;
    updateReport: (req: Request, res: Response) => Promise<void>;
    updateReportStatus: (req: Request, res: Response) => Promise<void>;
    deleteReport: (req: Request, res: Response) => Promise<void>;
    getReportsByStatus: (req: Request, res: Response) => Promise<void>;
    getPublishedReports: (req: Request, res: Response) => Promise<void>;
    getReportStatistics: (req: Request, res: Response) => Promise<void>;
    bulkDeleteReports: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=report.controller.d.ts.map