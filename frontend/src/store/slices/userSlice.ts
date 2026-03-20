import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	updateProfile as apiUpdateProfile,
	updateUserRole as apiUpdateUserRole,
	deleteUser,
	getAllUsers,
	getCurrentUser,
} from '../../api/user/userService';
import { getApiErrorMessage } from '../../utils/accommodationPayload';

const savedProfile = sessionStorage.getItem('userProfile');

type UserState = {
	profile: Record<string, unknown> | null;
	items: Record<string, unknown>[];
	loading: boolean;
	error: string | null;
};

const initialState: UserState = {
	profile: savedProfile ? JSON.parse(savedProfile) : null,
	items: [],
	loading: false,
	error: null,
};

export const fetchProfile = createAsyncThunk(
	'user/fetchProfile',
	async (_: undefined, { rejectWithValue }) => {
		try {
			return await getCurrentUser();
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Failed to load profile'));
		}
	},
);

export const updateProfile = createAsyncThunk(
	'user/updateProfile',
	async (userData: Record<string, unknown>, { rejectWithValue }) => {
		try {
			return await apiUpdateProfile(userData);
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Failed to update profile'));
		}
	},
);

export const fetchUsers = createAsyncThunk(
	'user/fetchUsers',
	async (_: undefined, { rejectWithValue }) => {
		try {
			const users = await getAllUsers();

			return users.map((u: Record<string, unknown>) => {
				let role = u.role || (Array.isArray(u.roles) ? u.roles[0] : null);
				if (role?.startsWith('ROLE_')) role = role.replace('ROLE_', '');
				return { ...u, role };
			});
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Failed to load users'));
		}
	},
);

export const updateUserRole = createAsyncThunk(
	'user/updateUserRole',
	async ({ id, role }: { id: number; role: string }, { rejectWithValue }) => {
		try {
			const updated = await apiUpdateUserRole({ id, role });
			return { id, role: updated.role || role };
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Failed to update role'));
		}
	},
);

export const removeUser = createAsyncThunk(
	'user/removeUser',
	async (id: number, { rejectWithValue }) => {
		try {
			await deleteUser(id);
			return id;
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Failed to delete user'));
		}
	},
);

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		clearProfile: (state) => {
			state.profile = null;
			state.error = null;
			sessionStorage.removeItem('userProfile');
		},
	},
	extraReducers: (builder) => {
		builder
			// PROFILE
			.addCase(fetchProfile.fulfilled, (s, { payload }) => {
				s.profile = payload;
				sessionStorage.setItem('userProfile', JSON.stringify(payload));
				s.loading = false;
			})
			.addCase(fetchProfile.pending, (s) => {
				s.loading = true;
			})
			.addCase(fetchProfile.rejected, (s, { payload }) => {
				s.loading = false;
				s.error = payload as string;
			})

			// USERS
			.addCase(fetchUsers.fulfilled, (s, { payload }) => {
				s.items = payload;
				s.loading = false;
			})

			// UPDATE ROLE
			.addCase(updateUserRole.fulfilled, (s, { payload }) => {
				const index = s.items.findIndex((u) => u.id === payload.id);
				if (index !== -1) {
					s.items[index].role = payload.role;
				}
			})

			// REMOVE USER
			.addCase(removeUser.fulfilled, (s, { payload }) => {
				s.items = s.items.filter((u) => u.id !== payload);
			});
	},
});

export const { clearProfile } = userSlice.actions;
export default userSlice.reducer;
