import type { LoginDTO } from "./auth.dto.js";
export declare class AdminService {
    login(data: LoginDTO): Promise<{
        user: {
            username: string;
            email: string;
            role: "admin" | "editor" | "manager";
            createdAt: Date;
            updatedAt: Date;
            _id: import("mongoose").Types.ObjectId;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            isNew: boolean;
            schema: import("mongoose").Schema;
            __v: number;
        };
        token: string;
    }>;
    getProfile(userId: string): Promise<any>;
    updateProfile(userId: string, updateData: any): Promise<any>;
    forgotPassword(email: string): Promise<{
        message: string;
        otp: string;
    }>;
    resetPassword(email: string, otp: string, newPassword: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map