export const ROLES = {
  ADMIN: 'ADMIN',
  INSPECTOR: 'INSPECTOR',
  USER: 'USER'
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];