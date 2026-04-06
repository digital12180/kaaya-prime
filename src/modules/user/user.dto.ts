// dtos/user.dto.ts

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

export class UserResponseDto implements IUserResponseDto {
    _id: string;
    username: string;
    email: string;
    role: "admin" | "editor" | "manager";
    createdAt: Date;
    updatedAt: Date;

    constructor(user: any) {
        this._id = user._id.toString();
        this.username = user.username;
        this.email = user.email;
        this.role = user.role;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}

// Validation functions
export const validateCreateUser = (data: any): string[] => {
    const errors: string[] = [];

    if (!data.username || typeof data.username !== 'string' || data.username.trim().length === 0) {
        errors.push("Username is required and must be a non-empty string");
    } else if (data.username.length < 3 || data.username.length > 30) {
        errors.push("Username must be between 3 and 30 characters");
    } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
        errors.push("Username can only contain letters, numbers, and underscores");
    }

    if (!data.email || typeof data.email !== 'string' || data.email.trim().length === 0) {
        errors.push("Email is required and must be a non-empty string");
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
        errors.push("Please provide a valid email address");
    }

    if (!data.password || typeof data.password !== 'string' || data.password.length === 0) {
        errors.push("Password is required");
    } else if (data.password.length < 6) {
        errors.push("Password must be at least 6 characters long");
    }

    if (data.role && !["admin", "editor", "manager"].includes(data.role)) {
        errors.push("Role must be either 'admin', 'editor', or 'manager'");
    }

    return errors;
};

export const validateUpdateRole = (data: any): string[] => {
    const errors: string[] = [];

    if (!data.role) {
        errors.push("Role is required");
    } else if (!["admin", "editor", "manager"].includes(data.role)) {
        errors.push("Role must be either 'admin', 'editor', or 'manager'");
    }

    return errors;
};
export const validateUpdateUser = (data: any): string[] => {
    const errors: string[] = [];

    if (data.username !== undefined) {
        if (typeof data.username !== 'string' || data.username.trim().length === 0) {
            errors.push("Username must be a non-empty string if provided");
        } else if (data.username.length < 3 || data.username.length > 30) {
            errors.push("Username must be between 3 and 30 characters");
        } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
            errors.push("Username can only contain letters, numbers, and underscores");
        }
    }

    if (data.email !== undefined) {
        if (typeof data.email !== 'string' || data.email.trim().length === 0) {
            errors.push("Email must be a non-empty string if provided");
        } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
            errors.push("Please provide a valid email address");
        }
    }

    if (data.password !== undefined) {
        if (typeof data.password !== 'string') {
            errors.push("Password must be a string");
        } else if (data.password.length > 0 && data.password.length < 6) {
            errors.push("Password must be at least 6 characters long if provided");
        }
    }

    if (data.role !== undefined && !["admin", "editor", "manager"].includes(data.role)) {
        errors.push("Role must be either 'admin', 'editor', or 'manager'");
    }

    return errors;
};