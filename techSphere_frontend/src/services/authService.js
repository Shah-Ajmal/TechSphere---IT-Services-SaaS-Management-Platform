import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";

// Register new user
export const register = async (userData) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.AUTH.REGISTER,
    userData
  );
  return response.data;
};

// Login user
export const login = async (credentials) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials
  );
  return response.data;
};

// Get user profile
export const getProfile = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.AUTH.PROFILE);
  return response.data;
};

// Update user profile
export const updateProfile = async (userData) => {
  const response = await axiosInstance.put(
    API_ENDPOINTS.AUTH.UPDATE_PROFILE,
    userData
  );
  return response.data;
};

// Change password
export const changeUserPassword = async (passwordData) => {
  const response = await axiosInstance.put(
    "/auth/change-password",
    passwordData
  );
  return response.data;
};

// Update notification preferences
export const updateNotificationPreferences = async (notificationData) => {
  const response = await axiosInstance.put(
    "/auth/notifications",
    notificationData
  );
  return response.data;
};

// Delete account

export const deleteUserAccount = async (password) => {
  const response = await axiosInstance.delete("/auth/account", {
    data: { password },
  });
  return response.data;
};
