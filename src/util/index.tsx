import axios from "@/util/axios";

export const getServices = async () => {
  const response = await axios.get(`/services`);
  return response.data;
};

export const adminLogin = async (data: { email: string; password: string }) => {
  const response = await axios.post(`/admin/login`, data);
  return response.data;
};
