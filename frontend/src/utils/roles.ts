//  Словник ролей
export const roles = {
	CUSTOMER: { value: 'CUSTOMER', label: 'Клієнт' },
	MANAGER: { value: 'MANAGER', label: 'Менеджер' },
};

//  Хелпер для зручного отримання лейблу
export const getRoleLabel = (role: string) => {
	return (roles as Record<string, { value: string; label: string }>)[role]?.label || role;
};
