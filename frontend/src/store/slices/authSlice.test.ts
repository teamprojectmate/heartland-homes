import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const createTestStore = () =>
	configureStore({
		reducer: { auth: authReducer },
	});

describe('authSlice', () => {
	describe('initial state', () => {
		it('should have correct initial structure', () => {
			const store = createTestStore();
			const state = store.getState().auth;

			expect(state).toHaveProperty('user');
			expect(state).toHaveProperty('isAuthenticated');
			expect(state).toHaveProperty('isError');
			expect(state).toHaveProperty('isSuccess');
			expect(state).toHaveProperty('isLoading');
			expect(state).toHaveProperty('message');
		});
	});

	describe('reset action', () => {
		it('should clear loading, success, error and message', () => {
			const store = createTestStore();
			store.dispatch({ type: 'auth/reset' });
			const state = store.getState().auth;

			expect(state.isLoading).toBe(false);
			expect(state.isSuccess).toBe(false);
			expect(state.isError).toBe(false);
			expect(state.message).toBe('');
		});
	});

	describe('setUser action', () => {
		it('should set user and isAuthenticated', () => {
			const store = createTestStore();
			const mockUser = { id: 1, email: 'test@test.com', cleanRole: 'CUSTOMER' };

			store.dispatch({ type: 'auth/setUser', payload: mockUser });
			const state = store.getState().auth;

			expect(state.user).toEqual(mockUser);
			expect(state.isAuthenticated).toBe(true);
			expect(state.isLoading).toBe(false);
		});

		it('should set isAuthenticated to false when user is null', () => {
			const store = createTestStore();
			store.dispatch({ type: 'auth/setUser', payload: null });
			const state = store.getState().auth;

			expect(state.user).toBeNull();
			expect(state.isAuthenticated).toBe(false);
		});
	});

	describe('loginSuccess action', () => {
		it('should set user and clear error state', () => {
			const store = createTestStore();
			const mockUser = { id: 1, email: 'test@test.com', token: 'jwt-token' };

			store.dispatch({ type: 'auth/loginSuccess', payload: mockUser });
			const state = store.getState().auth;

			expect(state.user).toEqual(mockUser);
			expect(state.isAuthenticated).toBe(true);
			expect(state.isError).toBe(false);
			expect(state.isLoading).toBe(false);
		});
	});

	describe('login async thunk reducers', () => {
		it('login.pending should set isLoading and clear errors', () => {
			const store = createTestStore();
			store.dispatch({ type: 'auth/login/pending' });
			const state = store.getState().auth;

			expect(state.isLoading).toBe(true);
			expect(state.isError).toBe(false);
			expect(state.isSuccess).toBe(false);
			expect(state.message).toBe('');
		});

		it('login.fulfilled should save user and set isAuthenticated', () => {
			const store = createTestStore();
			const mockUser = { id: 1, email: 'test@test.com', cleanRole: 'CUSTOMER' };

			store.dispatch({ type: 'auth/login/fulfilled', payload: mockUser });
			const state = store.getState().auth;

			expect(state.isLoading).toBe(false);
			expect(state.isSuccess).toBe(true);
			expect(state.user).toEqual(mockUser);
			expect(state.isAuthenticated).toBe(true);
		});

		it('login.rejected should set error and clear user', () => {
			const store = createTestStore();
			store.dispatch({
				type: 'auth/login/rejected',
				payload: 'Invalid email or password',
			});
			const state = store.getState().auth;

			expect(state.isLoading).toBe(false);
			expect(state.isError).toBe(true);
			expect(state.message).toBe('Invalid email or password');
			expect(state.user).toBeNull();
			expect(state.isAuthenticated).toBe(false);
		});
	});

	describe('register async thunk reducers', () => {
		it('register.pending should set isLoading', () => {
			const store = createTestStore();
			store.dispatch({ type: 'auth/register/pending' });

			expect(store.getState().auth.isLoading).toBe(true);
		});

		it('register.fulfilled should set isSuccess', () => {
			const store = createTestStore();
			store.dispatch({ type: 'auth/register/fulfilled' });
			const state = store.getState().auth;

			expect(state.isLoading).toBe(false);
			expect(state.isSuccess).toBe(true);
		});

		it('register.rejected should set error', () => {
			const store = createTestStore();
			store.dispatch({
				type: 'auth/register/rejected',
				payload: 'Email already registered',
			});
			const state = store.getState().auth;

			expect(state.isLoading).toBe(false);
			expect(state.isError).toBe(true);
			expect(state.message).toBe('Email already registered');
		});
	});

	describe('logout async thunk reducer', () => {
		it('logout.fulfilled should clear user and authentication', () => {
			const store = createTestStore();
			// First set a user
			store.dispatch({
				type: 'auth/login/fulfilled',
				payload: { id: 1, email: 'test@test.com' },
			});
			// Then logout
			store.dispatch({ type: 'auth/logout/fulfilled' });
			const state = store.getState().auth;

			expect(state.user).toBeNull();
			expect(state.isAuthenticated).toBe(false);
		});
	});
});
