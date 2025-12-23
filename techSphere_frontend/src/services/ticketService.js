import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";

// Get all tickets
export const getAllTickets = async (params = {}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.TICKETS.BASE, {
    params,
  });
  return response.data;
};

// Get ticket by ID
export const getTicketById = async (id) => {
  const response = await axiosInstance.get(API_ENDPOINTS.TICKETS.BY_ID(id));
  return response.data;
};

// Create new ticket
export const createTicket = async (ticketData) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.TICKETS.BASE,
    ticketData
  );
  return response.data;
};

// Update ticket
export const updateTicket = async (id, ticketData) => {
  const response = await axiosInstance.put(
    API_ENDPOINTS.TICKETS.BY_ID(id),
    ticketData
  );
  return response.data;
};

// Add note to ticket
export const addTicketNote = async (id, noteData) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.TICKETS.NOTES(id),
    noteData
  );
  return response.data;
};

// Delete ticket
export const deleteTicket = async (id) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.TICKETS.BY_ID(id));
  return response.data;
};
