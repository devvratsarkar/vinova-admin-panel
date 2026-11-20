import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  token: localStorage.getItem('token'),
  role: localStorage.getItem('role'),
  permissions: localStorage.getItem('permissions'),
  country: localStorage.getItem('country'),
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.permissions = action.payload.permissions;
      // Only use country for SuperAdmin; other roles have no country
      state.country = action.payload.role === "SuperAdmin" ? (action.payload.country || "IR") : null;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('role', action.payload.role);
      localStorage.setItem('permissions', action.payload.permissions);
      if (action.payload.role === "SuperAdmin") {
        localStorage.setItem('country', action.payload.country || "IR");
      } else {
        localStorage.removeItem('country');
      }
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.role = null;
      state.permissions = null;
      state.country = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('country');
      localStorage.removeItem('permissions');
    },
    loader(state, action) {
      state.loading = action.payload;
    },
    setCountryCode(state, action) {
      state.country = action.payload;
    }
  },
});

export const { loginSuccess, logoutSuccess, loader, setCountryCode } = authSlice.actions;
export default authSlice.reducer;
