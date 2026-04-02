export const ROLES = {
    admin: 'admin',
    editor: 'editor',
    manager: 'manager'
} as const;

export const ROLE_MAP={
    [ROLES.admin]:1,
    [ROLES.editor]:2,
    [ROLES.manager]:3
}
export const ROLE_REVERSE_MAP = {
  1: ROLES.admin,
  2: ROLES.editor,
  3: ROLES.manager
};

export type UserRole=typeof ROLES[keyof typeof ROLES];


