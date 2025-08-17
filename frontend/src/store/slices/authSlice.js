import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
      if (response.data && response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data;
      } else {
        return rejectWithValue({
          message: "Токен не був отриманий від сервера.",
        });
      }
    } catch (error) {
      console.error("Login error:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/registration`,
        userData,
      );
      //  Після успішної реєстрації просто повертаємо відповідь.
      // Користувач буде перенаправлений на сторінку входу.
      return response.data;
    } catch (error) {
      console.error("Registration error:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  },
);

const savedUser = localStorage.getItem("user");
const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: !!savedUser,
  token: savedUser ? JSON.parse(savedUser).token : null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("user");
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error.message ||
          "Неправильний логін або пароль";
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Після успішної реєстрації ми не входимо автоматично
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error.message ||
          "Помилка реєстрації";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
