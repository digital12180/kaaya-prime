export declare const ROLES: {
    readonly admin: "admin";
    readonly editor: "editor";
    readonly manager: "manager";
};
export declare const ROLE_MAP: {
    admin: number;
    editor: number;
    manager: number;
};
export declare const ROLE_REVERSE_MAP: {
    1: "admin";
    2: "editor";
    3: "manager";
};
export type UserRole = typeof ROLES[keyof typeof ROLES];
//# sourceMappingURL=index.d.ts.map