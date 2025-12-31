import axiosInstance from "@/lib/axios";

// Get dashboard analytics
export const getDashboardAnalytics = async (period = "month") => {
  const response = await axiosInstance.get(
    `/analytics/dashboard?period=${period}`
  );
  return response.data;
};

// Get revenue trends
export const getRevenueTrends = async (period = "month") => {
  const response = await axiosInstance.get(
    `/analytics/revenue-trends?period=${period}`
  );
  return response.data;
};

// Get client acquisition data
export const getClientAcquisition = async () => {
  const response = await axiosInstance.get("/analytics/client-acquisition");
  return response.data;
};

// Get subscription distribution
export const getSubscriptionDistribution = async () => {
  const response = await axiosInstance.get(
    "/analytics/subscription-distribution"
  );
  return response.data;
};

// Get service performance
export const getServicePerformance = async () => {
  const response = await axiosInstance.get("/analytics/service-performance");
  return response.data;
};
