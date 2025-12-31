import axiosInstance from "@/lib/axios";

// Purchase a service
export const purchaseService = async (serviceId, billingCycle = "monthly") => {
  const response = await axiosInstance.post("/purchases", {
    serviceId,
    billingCycle,
  });
  return response.data;
};

// Get user's purchases
export const getUserPurchases = async (status = "") => {
  const response = await axiosInstance.get("/purchases", {
    params: status ? { status } : {},
  });
  return response.data;
};

// Cancel purchase
export const cancelPurchase = async (purchaseId) => {
  const response = await axiosInstance.put(`/purchases/${purchaseId}/cancel`);
  return response.data;
};

// Get all purchases (Admin)
export const getAllPurchases = async () => {
  const response = await axiosInstance.get("/purchases/all");
  return response.data;
};
