// Utility to decode JWT token
export const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const getUserIdFromToken = (token: string): number | null => {
  const decoded = decodeJWT(token);
  return decoded?.userId ? Number(decoded.userId) : null;
};

export const getUsernameFromToken = (token: string): string | null => {
  const decoded = decodeJWT(token);
  return decoded?.sub || null;
};

export const getHighestRoleFromToken = (token: string): import('../types').RoleType | null => {
  const decoded = decodeJWT(token);
  if (!decoded) return null;

  const rawRoles: string[] =
    decoded.roles ||
    decoded.authorities ||
    decoded.scope ||
    decoded.scopes ||
    decoded.role ||
    [];

  const rolesArray = Array.isArray(rawRoles) ? rawRoles : [rawRoles];

  const normalized = rolesArray
    .filter(Boolean)
    .map((r) => r.toString().toUpperCase().replace(/^ROLE_/, ''));

  if (normalized.includes('ADMIN')) return 'ADMIN';
  if (normalized.includes('DOCTOR')) return 'DOCTOR';
  if (normalized.includes('PATIENT')) return 'PATIENT';

  return null;
};

