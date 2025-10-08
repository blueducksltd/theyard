import axios from "@/util/axios";

export const getServices = async () => {
  const response = await axios.get(`/services`);
  console.log(response.data);
  return response.data;
};

// Get events
export const getEvents = async () => {
  const response = await axios.get(`/events`);
  return response.data;
};

export const adminLogin = async (data: { email: string; password: string }) => {
  const response = await axios.post(`/admin/login`, data);
  return response.data;
};
