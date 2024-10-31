import { create } from "zustand";
import axios from "axios";
import { user } from "../types";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:9000/api/v1/auth"
    : "/api/auth";


// add cookies in every request
https: axios.defaults.withCredentials = true;

interface BearState {
  user: user | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean;
  message: string | null;
  error: string | null;
  signup: (
    firstname: string,
    lastname: string,
    email: string,
    phonenumber: string,
    password: string
  ) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  resetPassword: (token: any, password: string) => Promise<void>;
  forgotpassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<BearState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isCheckingAuth: true,
  message: null,

  signup: async (firstname, lastname, email, phonenumber, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${BASE_URL}/register`, {
        firstname,
        lastname,
        email,
        phonenumber,
        password,
      });
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });
      set({
        user: res.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.response.data.message || "Error Login in ",
        isLoading: false,
      });
      throw error;
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${BASE_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: "Error Logging out ",
        isLoading: false,
      });
    }
  },
  verifyEmail: async (code: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${BASE_URL}/verify`, { code });
      set({ user: res.data, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const res = await axios.get(`${BASE_URL}/checkAuth`);
      set({
        user: res.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error: any) {
      set({
        error: null,
        isCheckingAuth: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },
  forgotpassword: async (email: string) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await axios.post(`${BASE_URL}/forgotPassword`, {
        email,
      });
      set({ message: res.data.message, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error changing password ",
      });
      throw error;
    }
  },
  resetPassword: async (token: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BASE_URL}/resetPassword/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },
}));
