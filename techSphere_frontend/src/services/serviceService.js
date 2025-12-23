import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";

// Get all services
export const getAllServices = async (params = {}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.SERVICES.BASE, {
    params,
  });
  return response.data;
};

// Get service by ID
export const getServiceById = async (id) => {
  const response = await axiosInstance.get(API_ENDPOINTS.SERVICES.BY_ID(id));
  return response.data;
};

// Create new service
export const createService = async (serviceData) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.SERVICES.BASE,
    serviceData
  );
  return response.data;
};

// Update service
export const updateService = async (id, serviceData) => {
  const response = await axiosInstance.put(
    API_ENDPOINTS.SERVICES.BY_ID(id),
    serviceData
  );
  return response.data;
};

// Delete service
export const deleteService = async (id) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.SERVICES.BY_ID(id));
  return response.data;
};
