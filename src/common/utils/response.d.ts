import type { Response } from "express";
export declare class ApiResponse {
    static success(res: Response, data?: any, message?: string, statusCode?: number): Response<any, Record<string, any>>;
    static error(res: Response, message?: string, statusCode?: number): Response<any, Record<string, any>>;
    static created(res: Response, data: any, message?: string): Response<any, Record<string, any>>;
    static badRequest(res: Response, message?: string): Response<any, Record<string, any>>;
    static unauthorized(res: Response, message?: string): Response<any, Record<string, any>>;
    static notFound(res: Response, message?: string): Response<any, Record<string, any>>;
}
//# sourceMappingURL=response.d.ts.map