import type { Request, Response } from "express";
export declare class UserController {
    private userService;
    constructor();
    createUser: (req: Request, res: Response) => Promise<void>;
    getAllUsers: (req: Request, res: Response) => Promise<void>;
    getUserById: (req: Request, res: Response) => Promise<void>;
    searchUsers: (req: Request, res: Response) => Promise<void>;
    updateUserRole: (req: Request, res: Response) => Promise<void>;
    deleteUser: (req: Request, res: Response) => Promise<void>;
    getUserStatistics: (req: Request, res: Response) => Promise<void>;
    updateUser: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map