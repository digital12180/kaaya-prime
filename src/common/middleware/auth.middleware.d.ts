import type { Request, Response, NextFunction } from 'express';
export interface TokenData {
    userId: string;
    role: number;
    roleName: string;
    user: any;
}
declare global {
    namespace Express {
        interface Request {
            tokenData?: TokenData;
            user?: any;
        }
    }
}
export declare const generateToken: (user: any, expiresIn?: string) => Promise<string>;
export declare const verifyToken: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
export declare const checkRole: (allowedRoles?: string[]) => (req: Request, res: Response, next: NextFunction) => Response | void;
export declare const refreshToken: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
export declare const rateLimit: (maxRequests?: number, windowMs?: number) => (req: Request, res: Response, next: NextFunction) => Response | void;
//# sourceMappingURL=auth.middleware.d.ts.map