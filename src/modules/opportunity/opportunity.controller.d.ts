import type { Request, Response } from "express";
export declare class OpportunityController {
    private opportunityService;
    constructor();
    createOpportunity: (req: Request, res: Response) => Promise<void>;
    getAllOpportunities: (req: Request, res: Response) => Promise<void>;
    getOpportunityById: (req: Request, res: Response) => Promise<void>;
    updateOpportunity: (req: Request, res: Response) => Promise<any>;
    deleteOpportunity: (req: Request, res: Response) => Promise<void>;
    getOpportunitiesByStatus: (req: Request, res: Response) => Promise<void>;
    getOpportunityStatistics: (req: Request, res: Response) => Promise<void>;
    bulkDeleteOpportunities: (req: Request, res: Response) => Promise<void>;
    searchOpportunity: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=opportunity.controller.d.ts.map