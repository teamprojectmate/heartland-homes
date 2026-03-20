import type { TFunction } from 'i18next';

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
