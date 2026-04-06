import type { Request, Response } from "express";
export declare class LeadController {
    private leadService;
    constructor();
    createLead: (req: Request, res: Response) => Promise<void>;
    getAllLeads: (req: Request, res: Response) => Promise<void>;
    getLeadById: (req: Request, res: Response) => Promise<void>;
    updateLead: (req: Request, res: Response) => Promise<void>;
    deleteLead: (req: Request, res: Response) => Promise<void>;
    getLeadStatistics: (req: Request, res: Response) => Promise<void>;
    searchLead: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=lead.controller.d.ts.map