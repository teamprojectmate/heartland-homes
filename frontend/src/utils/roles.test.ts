import { describe, expect, it, vi } from 'vitest';
import { getRoleLabel, normalizeRole } from './roles';

const mockT = vi.fn((key: string) => key);

describe('getRoleLabel', () => {
	it('returns i18n key for CUSTOMER', () => {
		expect(getRoleLabel('CUSTOMER', mockT)).toBe('roles.customer');
	});

	it('returns i18n key for MANAGER', () => {
		expect(getRoleLabel('MANAGER', mockT)).toBe('roles.manager');
	});

	it('returns role string for unknown role', () => {
		expect(getRoleLabel('UNKNOWN', mockT)).toBe('UNKNOWN');
	});

	it('handles undefined input', () => {
		expect(getRoleLabel(undefined as unknown as string, mockT)).toBeUndefined();
	});
});

describe('normalizeRole', () => {
	it('strips the legacy ROLE_ prefix', () => {
		expect(normalizeRole('ROLE_MANAGER')).toBe('MANAGER');
	});

	it('keeps a plain role and empty values as they are', () => {
		expect(normalizeRole('CUSTOMER')).toBe('CUSTOMER');
		expect(normalizeRole(null)).toBeNull();
		expect(normalizeRole(undefined)).toBeUndefined();
	});
});
