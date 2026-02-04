/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Get single events
export const getSingleEvent = async (slug: string) => {
  const response = await axios.get(`/events/${slug}`);
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

// Get bookings by date
export const getBookingsByDate = async (date: string) => {
  const response = await axios.get(`/calendar/days?date=${date}`);
  return response.data;
};

// Create bookings
export const createBookings = async (data: FormData) => {
  const response = await axios.post(`/bookings`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const verifyPayment = async (data: { reference: string }) => {
  const response = await axios.post(`/payments`, data);
  return response.data;
};

// ============================= API's for admin =============================
export const adminLogin = async (data: { email: string; password: string }) => {
  const response = await axios.post(`/admin/login`, data);
  return response.data;
};

export const getActiveBookings = async () => {
  const response = await axios.get(`/bookings?status=confirmed`);
  return response.data;
};

// Get dashboard Data
export const getDashboardData = async () => {
  const response = await axios.get(`/admin/dashboard`);
  return response.data;
};

export const publishOrIgnoreReview = async (data: {
  id?: string;
  status: string;
  affect?: string;
}) => {
  const response = await axios.put(
    `${data.id ? `/reviews/${data.id}` : `/reviews/all`}`,
    {
      status: data.status,
      affect: data.affect,
    },
  );
  return response.data;
};

// Create services
export const createServices = async (data: FormData) => {
  const response = await axios.post(`/services`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Update services
export const updateService = async (data: FormData, id: string) => {
  const response = await axios.put(`/services/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};


// Create packages
export const createPackages = async (data: FormData) => {
  const response = await axios.post(`/packages`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

//Update packages
export const updatePackage = async (data: FormData, id: string) => {
  const response = await axios.put(`/packages/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

// Create space
export const createSpace = async (data: FormData) => {
  const response = await axios.post(`/spaces`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Update services
export const updateSpace = async (data: FormData, id: string) => {
  const response = await axios.put(`/spaces/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Delete Packages
export const deletePackages = async (data: { id: string }) => {
  const response = await axios.delete(`/packages/${data.id}`);
  return response.data;
};

// Delete Services
export const deleteServices = async (data: { id: string }) => {
  const response = await axios.delete(`/services/${data.id}`);
  return response.data;
};

// Delete Spaces
export const deleteSpaces = async (data: { id: string }) => {
  const response = await axios.delete(`/spaces/${data.id}`);
  return response.data;
};

// Confirm bookings
export const confirmOrCancelBookings = async (data: {
  status: string;
  id: string;
}) => {
  const response = await axios.put(`/bookings/${data.id}`, {
    status: data.status,
  });
  return response.data;
};

// Create tag
export const createTag = async (name: string) => {
  const response = await axios.post(`/tags`, { name });
  return response.data;
};

// Create gallery
export const createGallery = async (data: FormData) => {
  const response = await axios.post(`/gallery`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Create gallery
export const updateGallery = async (id: string, data: any) => {
  const response = await axios.put(`/gallery/${id}`, data);
  return response.data;
};

// Delete Gallery
export const deleteGallery = async (data: { id: string }) => {
  const response = await axios.delete(`/gallery/${data.id}`);
  return response.data;
};

// Get customers
export const getCustomers = async () => {
  const response = await axios.get(`/customers`);
  return response.data;
};

// Send mail to customer(s)
export const sendMail = async (data: {
  subject: string;
  message: string;
  customers?: string[];
}) => {
  const response = await axios.post(`/customers/send-mail`, data);
  return response.data;
};

// Get admins
export const getAdmins = async () => {
  const response = await axios.get(`/admin`);
  return response.data;
};

// Create admin
export const createAdmin = async (data: {
  name: string;
  email: string;
  role: string;
}) => {
  const response = await axios.post(`/admin`, data);
  return response.data;
};

// Make admin
export const makeAdmin = async (id: string) => {
  const response = await axios.put(`/admin/${id}`, { role: "admin" });
  return response.data;
};

// Delete admin
export const deleteAdmin = async (id: string) => {
  const response = await axios.delete(`/admin/${id}`);
  return response.data;
};

// Get admin information
export const getMyInfo = async () => {
  const response = await axios.get(`/admin/me`);
  return response.data;
};

// Update admin profile
export const updateAdminInfo = async (data: FormData) => {
  const response = await axios.put(`/admin/me`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Update admin preferences
export const updateAdminPreferences = async (data: FormData) => {
  const response = await axios.put(`/admin/me`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Update admin password
export const updateAdminPassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await axios.post(`/admin/me/update-password`, data);
  return response.data;
};

// Admin Logout
export const adminLogout = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await axios.post(`/admin/logout`, data);
  return response.data;
};

// Get admin notifications
export const getAdminNotifications = async () => {
  const response = await axios.get(`/notifications`);
  return response.data;
};

// Read Notification
export const readNotification = async (data: { id: string }) => {
  const response = await axios.post(`/notifications/read`, data);
  return response.data;
};
