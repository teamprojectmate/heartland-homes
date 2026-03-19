import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from '../../api/auth/authService';
import { getApiErrorMessage } from '../../utils/accommodationPayload';

const savedAuth = JSON.parse(sessionStorage.getItem('auth') || 'null');
const savedProfile = JSON.parse(sessionStorage.getItem('userProfile') || 'null');

let initialUser = null;
if (savedAuth?.token) {
	initialUser = { token: savedAuth.token, ...savedProfile };

	const rawRole = Array.isArray(initialUser.roles) ? initialUser.roles[0] : initialUser.role;
	initialUser.cleanRole = rawRole?.startsWith('ROLE_') ? rawRole.replace('ROLE_', '') : rawRole;
}

const initialState = {
	user: initialUser,
	isAuthenticated: !!initialUser,
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
};

export const login = createAsyncThunk(
	'auth/login',
	async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
		try {
			const { token } = await authService.login({ email, password });

			// Save token temporarily so getProfile() can use it
			sessionStorage.setItem('auth', JSON.stringify({ token }));

			const profile = await authService.getProfile();

			const rawRole = profile.role || (profile.roles?.[0] ?? null);
			const cleanRole = rawRole?.startsWith('ROLE_') ? rawRole.replace('ROLE_', '') : rawRole;

			// Save profile after successful verification
			sessionStorage.setItem('userProfile', JSON.stringify(profile));

			return { token, ...profile, cleanRole };
		} catch (err: unknown) {
			sessionStorage.removeItem('auth');
			sessionStorage.removeItem('userProfile');
			return rejectWithValue(getApiErrorMessage(err, 'Невірний логін або пароль'));
		}
	},
);

export const register = createAsyncThunk(
	'auth/register',
	async (userData: Record<string, unknown>, { rejectWithValue }) => {
		try {
			return await authService.register(userData);
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Помилка реєстрації'));
		}
	},
);

export const logout = createAsyncThunk('auth/logout', async () => {
	authService.logout();
});

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		reset: (s) => {
			s.isLoading = false;
			s.isSuccess = false;
			s.isError = false;
			s.message = '';
		},
		setUser: (s, { payload }) => {
			s.user = payload;
			s.isAuthenticated = !!payload;
		},
		loginSuccess: (s, { payload }) => {
			s.user = payload;
			s.isAuthenticated = true;
			s.isError = false;
			s.isLoading = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (s) => {
				s.isLoading = true;
				s.isError = false;
				s.isSuccess = false;
				s.message = '';
			})
			.addCase(login.fulfilled, (s, { payload }) => {
				s.isLoading = false;
				s.isSuccess = true;
				s.user = payload;
				s.isAuthenticated = !!payload;
			})
			.addCase(login.rejected, (s, { payload, error }) => {
				s.isLoading = false;
				s.isError = true;
				s.message = (payload as string) || error?.message || 'Невірний логін або пароль';
				s.user = null;
				s.isAuthenticated = false;
			})
			.addCase(register.pending, (s) => {
				s.isLoading = true;
				s.isError = false;
				s.isSuccess = false;
			})
			.addCase(register.fulfilled, (s) => {
				s.isLoading = false;
				s.isSuccess = true;
				s.message = 'Реєстрація успішна! Тепер увійдіть у систему.';
			})
			.addCase(register.rejected, (s, { payload }) => {
				s.isLoading = false;
				s.isError = true;
				s.message = (payload as string) || 'Помилка реєстрації';
			})
			.addCase(logout.fulfilled, (s) => {
				s.user = null;
				s.isAuthenticated = false;
			});
	},
});

export const { reset, setUser, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
