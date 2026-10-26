import type { TFunction } from 'i18next';

const LEGACY_ROLE_PREFIX = 'ROLE_';

/** Role without the legacy Spring prefix: 'ROLE_MANAGER' → 'MANAGER'. */
export const normalizeRole = <T extends string | null | undefined>(role: T): T =>
	(role?.startsWith(LEGACY_ROLE_PREFIX) ? role.slice(LEGACY_ROLE_PREFIX.length) : role) as T;

// Role config with i18n keys
const roleKeys: Record<string, { value: string; i18nKey: string }> = {
	CUSTOMER: { value: 'CUSTOMER', i18nKey: 'roles.customer' },
	MANAGER: { value: 'MANAGER', i18nKey: 'roles.manager' },
};

// Helper to get translated role label
export const getRoleLabel = (role: string, t: TFunction) => {
	const config = roleKeys[role];
	return config ? t(config.i18nKey) : role;
};

// Helper to get roles with translated labels
export const getRoles = (t: TFunction) =>
	Object.fromEntries(
		Object.entries(roleKeys).map(([key, val]) => [
			key,
			{ value: val.value, label: t(val.i18nKey) },
		]),
	);
