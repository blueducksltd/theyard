import axios from "@/util/axios";

export const getServices = async () => {
  const response = await axios.get(`/services`);
  return response.data;
};

// Get events
export const getEvents = async () => {
  const response = await axios.get(`/events`);
  return response.data;
};

// Get reviews
export const getReviews = async () => {
  const response = await axios.get(`/reviews`);
  return response.data;
};

// Get images
export const getGallery = async () => {
  const response = await axios.get(`/gallery`);
  return response.data;
};

// Subscribe to newsletter
export const subscribeToNewsletter = async (email: string) => {
  const response = await axios.post(`/customers/subscribe`, { email });
  return response.data;
};

export const adminLogin = async (data: { email: string; password: string }) => {
  const response = await axios.post(`/admin/login`, data);
  return response.data;
};
