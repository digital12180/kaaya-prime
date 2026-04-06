export interface ICreateUserDto {
    username: string;
    email: string;
    password: string;
    role?: "admin" | "editor" | "manager";
}
export interface IUpdateRoleDto {
    role: "admin" | "editor" | "manager";
}
export interface IUpdateUserDto {
    username?: string;
    email?: string;
    password?: string;
    role?: "admin" | "editor" | "manager";
}
export interface IUserResponseDto {
    _id: string;
    username: string;
    email: string;
    role: "admin" | "editor" | "manager";
    createdAt: Date;
    updatedAt: Date;
}
export interface IPaginationDto {
    page?: number;
    limit?: number;
    search?: string;
    role?: "admin" | "editor" | "manager";
}
export declare class UserResponseDto implements IUserResponseDto {
    _id: string;
    username: string;
    email: string;
    role: "admin" | "editor" | "manager";
    createdAt: Date;
    updatedAt: Date;
    constructor(user: any);
}
export declare const validateCreateUser: (data: any) => string[];
export declare const validateUpdateRole: (data: any) => string[];
export declare const validateUpdateUser: (data: any) => string[];
//# sourceMappingURL=user.dto.d.ts.map