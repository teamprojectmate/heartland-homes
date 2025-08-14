import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1"; // ✅ Додано `/api/v1`

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
      if (response.data && response.data.token) {
        // ✅ Зберігаємо токен та дані користувача
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
      // ✅ Виправлення: Змінюємо `registration` на `register`
      const response = await axios.post(`${BASE_URL}/auth/register`, userData);
      // При успішній реєстрації можемо автоматично увійти
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: userData.email,
        password: userData.password,
      });
      if (loginResponse.data && loginResponse.data.token) {
        // ✅ Зберігаємо токен та дані користувача
        localStorage.setItem("user", JSON.stringify(loginResponse.data));
        return loginResponse.data;
      } else {
        return rejectWithValue({
          message: "Токен не був отриманий після реєстрації.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  },
);

// Отримуємо об'єкт користувача з локального сховища
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
      localStorage.removeItem("user"); // ✅ Видаляємо весь об'єкт
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
        // ✅ Зберігаємо весь об'єкт користувача
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
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        // ✅ Зберігаємо весь об'єкт користувача
        state.user = action.payload;
        state.token = action.payload.token;
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