import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";

// Get all clients
export const getAllClients = async (params = {}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.CLIENTS.BASE, {
    params,
  });
  return response.data;
};

// Get client by ID
export const getClientById = async (id) => {
  const response = await axiosInstance.get(API_ENDPOINTS.CLIENTS.BY_ID(id));
  return response.data;
};

// Create new client
export const createClient = async (clientData) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.CLIENTS.BASE,
    clientData
  );
  return response.data;
};

// Update client
export const updateClient = async (id, clientData) => {
  const response = await axiosInstance.put(
    API_ENDPOINTS.CLIENTS.BY_ID(id),
    clientData
  );
  return response.data;
};

// Delete client
export const deleteClient = async (id) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.CLIENTS.BY_ID(id));
  return response.data;
};
