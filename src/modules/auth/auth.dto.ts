export interface RegisterDTO {
    username: string;
    password: string;
    email: string;
    role?: "admin" | "editor" | "manager";
}
export interface LoginDTO {
    email: string;
    password: string;
}