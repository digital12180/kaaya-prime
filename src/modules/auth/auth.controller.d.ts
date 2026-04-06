import type { Request, Response, NextFunction } from "express";
export declare class AdminController {
    private service;
    login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    forgotPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    resetPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map