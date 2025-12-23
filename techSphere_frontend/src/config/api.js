// API Base URL - Use environment variable or fallback to localhost
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("🔗 API Base URL:", API_BASE_URL); // Debug log

// API Endpoints - Use relative paths only
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: `/auth/register`,
    LOGIN: `/auth/login`,
    PROFILE: `/auth/profile`,
    UPDATE_PROFILE: `/auth/profile`,
  },

  // Clients
  CLIENTS: {
    BASE: `/clients`,
    BY_ID: (id) => `/clients/${id}`,
  },

  // Services
  SERVICES: {
    BASE: `/services`,
    BY_ID: (id) => `/services/${id}`,
  },

  // Tickets
  TICKETS: {
    BASE: `/tickets`,
    BY_ID: (id) => `/tickets/${id}`,
    NOTES: (id) => `/tickets/${id}/notes`,
  },
};

export default API_BASE_URL;
