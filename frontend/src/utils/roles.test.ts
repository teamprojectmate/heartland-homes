import { describe, expect, it, vi } from 'vitest';
import { getRoleLabel } from './roles';

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
