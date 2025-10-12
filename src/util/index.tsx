import axios from "@/util/axios";

// Get services
export const getServices = async () => {
  const response = await axios.get(`/services`);
  return response.data;
};

// Get events
export const getEvents = async () => {
  const response = await axios.get(`/events`);
  return response.data;
};

// Get spaces
export const getSpaces = async () => {
  const response = await axios.get(`/spaces`);
  return response.data;
};

// Get reviews
export const getReviews = async () => {
  const response = await axios.get(`/reviews`);
  return response.data;
};

// Create review
export const createReview = async (data: {
  name: string;
  location: string;
  comment: string;
}) => {
  const response = await axios.post(`/reviews`, data);
  return response.data;
};

// Get images
export const getGallery = async () => {
  const response = await axios.get(`/gallery`);
  return response.data;
};

// Get tags
export const getTags = async () => {
  const response = await axios.get(`/tags`);
  return response.data;
};

// Get packages
export const getPackages = async () => {
  const response = await axios.get(`/packages`);
  return response.data;
};

// Subscribe to newsletter
export const subscribeToNewsletter = async (email: string) => {
  const response = await axios.post(`/customers/subscribe`, { email });
  return response.data;
};

// Send inquiry
export const sendInquiries = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}) => {
  const response = await axios.post(`/inquiries`, data);
  return response.data;
};

// Get bookings
export const getBookings = async () => {
  const response = await axios.get(`/bookings`);
  return response.data;
};

// Create bookings
export const createBookings = async (data: FormData) => {
  const response = await axios.post(`/bookings`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const adminLogin = async (data: { email: string; password: string }) => {
  const response = await axios.post(`/admin/login`, data);
  return response.data;
};
