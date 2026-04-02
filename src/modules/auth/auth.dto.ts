export interface RegisterDTO {
    username: string;
    password: string;
    email: string;
    role?: "admin" | "editor" | "manager";
}
export interface LoginDTO {
    username: string;
    password: string;
}