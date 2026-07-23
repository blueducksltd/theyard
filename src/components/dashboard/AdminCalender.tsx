"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IBooking } from "@/types/Booking";
import {
  getPackages,
  createEvent,
  getEvents,
  getEventRegistrations,
  updateEvent,
  deleteEvent,
  getAdminClosedDays,
  closeAdminDay,
  reopenAdminDay,
} from "@/util";
import { IPackage } from "@/types/Package";
import { saveToLS } from "@/util/helper";
import moment from "moment";
import Modal from "../Modal";
import { toast } from "react-toastify";
import { DESCRIPTION_WORD_LIMIT, limitWords } from "./GalleryContent";

// Type definitions
type BookingStatus = "available" | "unavailable" | "pending";
type EventDateCategory = "active" | "upcoming" | "past";
type EventDateFilter = EventDateCategory | "all";

type ClosedDayInfo = {
  id?: string;
  date: string;
  reason?: string;
  closureType?: "internal" | "event";
  isPrivate?: boolean;
  eventTitle?: string;
  eventOrganizer?: string;
  eventDetails?: string;
};

const EVENT_DATE_FILTER_OPTIONS: Array<{ label: string; value: EventDateFilter }> = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Past", value: "past" },
];

const EVENT_DATE_CATEGORY_ORDER: Record<EventDateCategory, number> = {
  active: 0,
  upcoming: 1,
  past: 2,
};

const DEFAULT_EVENT_INPUTS = {
  title: "",
  description: "",
  date: "",
  time: "",
  audienceType: "both",
  adultPrice: "",
  childPrice: "",
  public: false,
  location: "The Yard",
  activities: "",
  status: "pending",
};

const DEFAULT_CLOSE_DAY_INPUTS = {
  closureType: "internal",
  eventTitle: "",
  eventOrganizer: "",
  eventDetails: "",
  reason: "",
};

const getEventDateCategory = (date: Date | string | null | undefined): EventDateCategory => {
  if (!date) return "past";
  const eventDate = moment(date).startOf("day");
  const today = moment().startOf("day");
  if (eventDate.isSame(today, "day")) return "active";
  if (eventDate.isAfter(today)) return "upcoming";
  return "past";
};

interface CalendarProps {
  initialDate?: Date;
  bookingData?: IBooking[];
  calenderWidth?: string;
  onDateClick?: (date: Date, bookings: IBooking[]) => void;
}

const AdminCalendar: React.FC<CalendarProps> = ({
  initialDate = new Date(),
  bookingData = [],
  onDateClick,
  calenderWidth = "w-[813px]",
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [, setIsModalOpen] = useState(false);
  const [unavailableModal, setUnavailableModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [, setPackages] = useState<IPackage[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New event tabs, lists, and registration modal states
  const [activeTab, setActiveTab] = useState<"calendar" | "list">("calendar");
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [eventToEdit, setEventToEdit] = useState<any | null>(null);
  const [eventToDelete, setEventToDelete] = useState<any | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isRegLoading, setIsRegLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventSearch, setEventSearch] = useState("");
  const [eventDateFilter, setEventDateFilter] = useState<EventDateFilter>("all");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [closedDays, setClosedDays] = useState<Set<string>>(new Set());
  const [closedDayDetails, setClosedDayDetails] = useState<Record<string, ClosedDayInfo>>({});
  const [isDayActionLoading, setIsDayActionLoading] = useState(false);
  const [isCloseDayModalOpen, setIsCloseDayModalOpen] = useState(false);
  const [closeDayDate, setCloseDayDate] = useState<Date | null>(null);
  const [closeDayInputs, setCloseDayInputs] = useState({ ...DEFAULT_CLOSE_DAY_INPUTS });

  const [inputs, setInputs] = useState<Record<string, any>>({ ...DEFAULT_EVENT_INPUTS });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : ["description", "title"].includes(name) ? limitWords(
      value,
      name === "description" ? DESCRIPTION_WORD_LIMIT : 20,
    ) : value;

    // setInputs({ ...inputs, description: limited })
    setInputs((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const router = useRouter();

  const getDateKeyFromDate = (date: Date): string => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const currentMonthKey = useMemo(() => {
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
  }, [currentDate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const resetEventForm = () => {
    setInputs({ ...DEFAULT_EVENT_INPUTS });
    setImageFile(null);
    setImagePreview(null);
    setEventToEdit(null);
  };

  const openCreateModal = () => {
    resetEventForm();
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    resetEventForm();
    setIsCreateModalOpen(false);
  };

  const closeEditModal = () => {
    resetEventForm();
    setIsEditModalOpen(false);
  };

  const closeDeleteModal = () => {
    setEventToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const openCloseDayModal = (targetDate: Date) => {
    setCloseDayDate(targetDate);
    setCloseDayInputs({ ...DEFAULT_CLOSE_DAY_INPUTS });
    setIsCloseDayModalOpen(true);
  };

  const closeCloseDayModal = () => {
    setIsCloseDayModalOpen(false);
    setCloseDayDate(null);
    setCloseDayInputs({ ...DEFAULT_CLOSE_DAY_INPUTS });
  };

  const populateEventForm = (event: any) => {
    setInputs({
      title: event.title ?? "",
      description: event.description ?? "",
      date: event.date ? moment(event.date).format("YYYY-MM-DD") : "",
      time: event.startTime ?? event.time?.start ?? "09:00",
      audienceType: event.audienceType ?? "both",
      adultPrice: event.adultPrice != null ? String(event.adultPrice) : "",
      childPrice: event.childPrice != null ? String(event.childPrice) : "",
      public: Boolean(event.public),
      location: event.location ?? "The Yard",
      activities: Array.isArray(event.activities) ? event.activities.join(", ") : "",
      status: event.status ?? "pending",
    });
    setImageFile(null);
    setImagePreview(event.images?.[0] ?? null);
  };

  const openEditModal = (event: any) => {
    setEventToEdit(event);
    populateEventForm(event);
    setIsEditModalOpen(true);
  };

  const loadEvents = async () => {
    try {
      const res = await getEvents();
      if (res.success) {
        setEvents(res.data.events || []);
      }
    } catch (e) {
      console.error("Failed to load events:", e);
    }
  };

  const buildEventFormData = (toastId: string | number, includeStatus = false) => {
    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("description", inputs.description || "");
    formData.append("date", inputs.date);
    formData.append("time", inputs.time);
    formData.append("audienceType", inputs.audienceType);
    formData.append("public", String(!!inputs.public));
    formData.append("location", inputs.location || "The Yard");
    formData.append("activities", inputs.activities || "");

    if (includeStatus) {
      formData.append("status", inputs.status || "pending");
    }

    if (inputs.audienceType === "adults" || inputs.audienceType === "both") {
      const adultPrice = Number(inputs.adultPrice);
      if (!Number.isFinite(adultPrice) || adultPrice < 0) {
        toast.update(toastId, {
          render: "Please enter a valid adult ticket price.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        return null;
      }
      formData.append("adultPrice", String(adultPrice));
    }

    if (inputs.audienceType === "children" || inputs.audienceType === "both") {
      const childPrice = Number(inputs.childPrice);
      if (!Number.isFinite(childPrice) || childPrice < 0) {
        toast.update(toastId, {
          render: "Please enter a valid child ticket price.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        return null;
      }
      formData.append("childPrice", String(childPrice));
    }

    if (imageFile) {
      formData.append("images", imageFile);
    }

    return formData;
  };

  const handleOpenRegistrations = async (event: any) => {
    setSelectedEvent(event);
    setIsRegModalOpen(true);
    setIsRegLoading(true);
    setRegistrations([]);
    try {
      const res = await getEventRegistrations(event.id || event._id);
      if (res.success) {
        setRegistrations(res.data.registrations || []);
      }
    } catch (err) {
      console.error("Failed to load registrations:", err);
    } finally {
      setIsRegLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId = toast.loading("Creating event, please wait...", {
      position: "bottom-right",
    });

    try {
      const formData = buildEventFormData(toastId);
      if (!formData) {
        return;
      }

      const response = await createEvent(formData);

      if (response.success) {
        toast.update(toastId, {
          render: "Event created successfully!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });

        closeCreateModal();
        await loadEvents();

        router.refresh();
      } else {
        toast.update(toastId, {
          render: response.message || "Failed to create event.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.message || error.message || "An error occurred.";
      toast.update(toastId, {
        render: errMsg,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!eventToEdit?.id) {
      toast.error("No event selected for update.", { position: "bottom-right" });
      return;
    }

    const toastId = toast.loading("Updating event, please wait...", {
      position: "bottom-right",
    });

    try {
      const formData = buildEventFormData(toastId, true);
      if (!formData) {
        return;
      }

      const response = await updateEvent(formData, eventToEdit.id);

      if (response.success) {
        toast.update(toastId, {
          render: "Event updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });

        closeEditModal();
        await loadEvents();
        router.refresh();
        return;
      }

      toast.update(toastId, {
        render: response.message || "Failed to update event.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.message || error.message || "An error occurred.";
      toast.update(toastId, {
        render: errMsg,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const openDeleteEventModal = (event: any) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete?.id) {
      return;
    }

    const toastId = toast.loading("Deleting event, please wait...", {
      position: "bottom-right",
    });

    try {
      const response = await deleteEvent(eventToDelete.id);
      if (response.success) {
        toast.update(toastId, {
          render: "Event deleted successfully!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        await loadEvents();
        if (selectedEvent?.id === eventToDelete.id) {
          setIsRegModalOpen(false);
          setSelectedEvent(null);
          setRegistrations([]);
        }
        closeDeleteModal();
        router.refresh();
        return;
      }

      toast.update(toastId, {
        render: response.message || "Failed to delete event.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } catch (error: any) {
      toast.update(toastId, {
        render: error.response?.data?.message || error.message || "Failed to delete event.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const months: string[] = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

  const dayNames: string[] = [
    "Sun",
    "Mon",
    "Tues",
    "Wed",
    "Thurs",
    "Fri",
    "Sat",
  ];

  // Transform bookingData into a map for quick lookup
  const bookingsByDate = useMemo(() => {
    const map: { [key: string]: IBooking[] } = {};

    // Safety check: ensure bookingData is an array
    if (!Array.isArray(bookingData)) {
      console.warn("bookingData is not an array:", bookingData);
      return map;
    }

    bookingData.forEach((booking) => {
      const date = new Date(booking.eventDate);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(booking);
    });

    return map;
  }, [bookingData]);

  // Get booking status for a specific date
  const getDateStatus = (dateKey: string): BookingStatus | null => {
    if (closedDays.has(dateKey)) return "unavailable";

    const bookings = bookingsByDate[dateKey];
    if (!bookings || bookings.length === 0) return "available";

    // Check if any booking is cancelled
    // const hasCancelled = bookings.some((b) => b.status === "cancelled");

    // Check if all bookings are confirmed (fully booked)
    const allConfirmed = bookings.every((b) => b.status === "confirmed");

    // Check if any booking is pending
    // const hasPending = bookings.some((b) => b.status === "pending");
    //
    const hasPending = bookings.length > 0;

    if (allConfirmed && bookings.length >= 3) {
      // Adjust the number based on your capacity
      return "unavailable";
    }

    if (hasPending) {
      return "pending";
    }

    return "available";
  };

  // Get booking count for a specific date
  const getBookingCount = (dateKey: string): number => {
    const bookings = bookingsByDate[dateKey];
    return bookings
      ? bookings.filter((b) => b.status !== "cancelled").length
      : 0;
  };

  // Check if a day is today
  const isToday = (day: number | null): boolean => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Check if a day is in the past
  const isPastDay = (day: number | null): boolean => {
    if (!day) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    const dayDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );

    return dayDate < today;
  };

  const navigateMonth = (direction: number): void => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getDaysInMonth = (): (number | null)[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getDateKey = (day: number | null): string | null => {
    if (!day) return null;
    return `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
  };

  const getClosedDayInfoByDate = (date: Date | null): ClosedDayInfo | null => {
    if (!date) return null;
    const key = getDateKeyFromDate(date);
    return closedDayDetails[key] || null;
  };

  const handleToggleDayClosure = async (day: number): Promise<void> => {
    const targetDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    const dateKey = getDateKeyFromDate(targetDate);
    const apiDate = moment(targetDate).format("YYYY-MM-DD");
    const isClosed = closedDays.has(dateKey);

    if (!isClosed) {
      openCloseDayModal(targetDate);
      return;
    }

    setIsDayActionLoading(true);
    try {
      if (isClosed) {
        await reopenAdminDay(apiDate);
        setClosedDays((prev) => {
          const next = new Set(prev);
          next.delete(dateKey);
          return next;
        });
        setClosedDayDetails((prev) => {
          const next = { ...prev };
          delete next[dateKey];
          return next;
        });
        toast.success("Day reopened successfully", { position: "bottom-right" });
      } else {
        await closeAdminDay(apiDate);
        setClosedDays((prev) => new Set(prev).add(dateKey));
        toast.success("Day closed successfully", { position: "bottom-right" });
      }
      router.refresh();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update day status", {
        position: "bottom-right",
      });
    } finally {
      setIsDayActionLoading(false);
    }
  };

  const handleCloseDayInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setCloseDayInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitCloseDay = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!closeDayDate) {
      toast.error("No date selected for closure.", { position: "bottom-right" });
      return;
    }

    const closureType = closeDayInputs.closureType === "event" ? "event" : "internal";
    const isPrivate = closureType === "internal";

    if (closureType === "event" && !closeDayInputs.eventTitle.trim()) {
      toast.error("Please add the event title before closing this date.", {
        position: "bottom-right",
      });
      return;
    }

    const apiDate = moment(closeDayDate).format("YYYY-MM-DD");
    const dateKey = getDateKeyFromDate(closeDayDate);

    setIsDayActionLoading(true);
    const toastId = toast.loading("Closing day...", { position: "bottom-right" });

    try {
      await closeAdminDay(apiDate, {
        closureType,
        isPrivate,
        reason: closeDayInputs.reason.trim(),
        eventTitle: closureType === "event" ? closeDayInputs.eventTitle.trim() : "",
        eventOrganizer: closureType === "event" ? closeDayInputs.eventOrganizer.trim() : "",
        eventDetails: closureType === "event" ? closeDayInputs.eventDetails.trim() : "",
      });

      setClosedDays((prev) => new Set(prev).add(dateKey));
      setClosedDayDetails((prev) => ({
        ...prev,
        [dateKey]: {
          date: apiDate,
          reason: closeDayInputs.reason.trim(),
          closureType,
          isPrivate,
          eventTitle: closureType === "event" ? closeDayInputs.eventTitle.trim() : "",
          eventOrganizer: closureType === "event" ? closeDayInputs.eventOrganizer.trim() : "",
          eventDetails: closureType === "event" ? closeDayInputs.eventDetails.trim() : "",
        },
      }));
      toast.update(toastId, {
        render: "Day closed successfully",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        position: "bottom-right",
      });
      closeCloseDayModal();
      router.refresh();
    } catch (error: any) {
      toast.update(toastId, {
        render: error?.response?.data?.message || "Failed to close this day",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        position: "bottom-right",
      });
    } finally {
      setIsDayActionLoading(false);
    }
  };

  const handleDateClick = (day: number, status: BookingStatus | null): void => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );

    setSelectedDate(clickedDate);

    // Get bookings for this date
    const dateKey = getDateKey(day);
    const dayBookings = dateKey ? bookingsByDate[dateKey] || [] : [];

    switch (status) {
      case "unavailable":
        return setUnavailableModal(true);
      case "pending":
        saveToLS("booking", { date: clickedDate.toISOString() });
        return router.push(
          `/admin/events/bookings/pending?date=${moment(clickedDate).format("YYYY-MM-DD")}`,
        );
      default:
        saveToLS("booking", { date: clickedDate.toISOString() });
        setIsModalOpen(true);
    }

    if (onDateClick) {
      onDateClick(clickedDate, dayBookings);
    }
  };

  const days = getDaysInMonth();

  // const handleProcessPackage = () => {
  //   if (Object.entries(selectedPackage).length === 0) {
  //     toast.warning("Please select a package", { position: "bottom-right" });
  //     return;
  //   }

  //   const savedBookingDetails = loadFromLS("booking");
  //   savedBookingDetails["package"] = selectedPackage;
  //   console.log(savedBookingDetails);
  //   // return;
  //   saveToLS("booking", savedBookingDetails);
  //   router.push(`/booking/checkout`);
  // };

  // Get packages
  useEffect(() => {
    (async () => {
      const response = await getPackages();
      if (response.success == true) {
        setPackages(response.data.packages);
      }
    })();
  }, []);

  // Load all events for list view
  useEffect(() => {
    (async () => {
      await loadEvents();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await getAdminClosedDays(currentMonthKey);
        const rawClosedDays: ClosedDayInfo[] = response?.data?.closedDays || [];

        const normalized = rawClosedDays.map((item) => {
          const parsed = new Date(item.date);
          return `${parsed.getFullYear()}-${parsed.getMonth() + 1}-${parsed.getDate()}`;
        });

        const detailsMap = rawClosedDays.reduce<Record<string, ClosedDayInfo>>((acc, item) => {
          const parsed = new Date(item.date);
          const key = `${parsed.getFullYear()}-${parsed.getMonth() + 1}-${parsed.getDate()}`;
          acc[key] = item;
          return acc;
        }, {});

        setClosedDays(new Set(normalized));
        setClosedDayDetails(detailsMap);
      } catch (error) {
        console.error("Failed to load closed days:", error);
      }
    })();
  }, [currentMonthKey]);

  const sortedEvents = useMemo(() => {
    const searchTerm = eventSearch.trim().toLowerCase();

    const filteredEvents = events.filter((event) => {
      const eventDateCategory = getEventDateCategory(event.date);
      const matchesDateCategory = eventDateFilter === "all" || eventDateCategory === eventDateFilter;
      const searchableText = [event.title, event.description, event.location, event.audienceType, event.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = searchTerm.length === 0 || searchableText.includes(searchTerm);

      return matchesDateCategory && matchesSearch;
    });

    return filteredEvents.sort((a, b) => {
      const categoryA = getEventDateCategory(a.date);
      const categoryB = getEventDateCategory(b.date);

      if (EVENT_DATE_CATEGORY_ORDER[categoryA] !== EVENT_DATE_CATEGORY_ORDER[categoryB]) {
        return EVENT_DATE_CATEGORY_ORDER[categoryA] - EVENT_DATE_CATEGORY_ORDER[categoryB];
      }

      const dateA = moment(a.date);
      const dateB = moment(b.date);

      if (categoryA === "past") {
        return dateB.valueOf() - dateA.valueOf();
      }

      return dateA.valueOf() - dateB.valueOf();
    });
  }, [events, eventSearch, eventDateFilter]);

  return (
    <main className="flex-1 py-4 px-5 flex flex-col gap-4 w-full overflow-y-auto">

      {/* ── Header row: Tabs + Create Button ── */}
      <div className="flex items-center justify-between">
        {/* Tab Switcher */}
        <div className="flex items-center bg-[#EDF0EE] rounded2px p-1 gap-1">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`px-5 py-2 text-sm font-medium font-sen leading-6 tracking-[0.4px] rounded2px transition-all duration-300 relative overflow-hidden ${activeTab === "calendar"
              ? "bg-yard-primary text-white shadow-sm"
              : "text-yard-primary hover:bg-[#C7CFC9]"
              }`}
          >
            📅 Calendar View
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`px-5 py-2 text-sm font-medium font-sen leading-6 tracking-[0.4px] rounded2px transition-all duration-300 ${activeTab === "list"
              ? "bg-yard-primary text-white shadow-sm"
              : "text-yard-primary hover:bg-[#C7CFC9]"
              }`}
          >
            📋 All Events
          </button>
        </div>

        {/* Create Event Button */}
        <div
          onClick={openCreateModal}
          className="w-max h-10 items-center flex rounded2px border-[1px] border-[#999999] px-4 gap-2.5 group relative overflow-hidden cursor-pointer bg-white"
        >
          <img src={"/icons/add.svg"} className="w-4 h-4 z-40 relative" alt="Add Icon" />
          <p className="z-40 text-yard-primary text-[16px] font-medium font-sen leading-6 tracking-[0.5px]">
            Create Event
          </p>
          <div className="absolute top-0 left-0 bg-[#E4E8E5] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
        </div>
      </div>

      {/* ── CALENDAR VIEW ── */}
      {activeTab === "calendar" && (
        <div className="flex justify-center">
          <div className={`w-full md:${calenderWidth} p-6 rounded-lg shadow-2xl`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => navigateMonth(-1)}
                className="w-9 h-9 bg-[#EDF0EE] p-2 rounded2px group relative overflow-hidden"
                aria-label="Previous month"
              >
                <img
                  src={"/icons/arrow-left.svg"}
                  alt="arrow icon"
                  className="w-5 h-5 z-40 relative"
                />
                <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
              </button>

              <h2 className="text-[16px] font-bold text-[#3C5040] leading-[26px] tracking-[0.4px]">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>

              <button
                onClick={() => navigateMonth(1)}
                className="w-9 h-9 bg-[#EDF0EE] p-2 rounded2px group relative overflow-hidden"
                aria-label="Next month"
              >
                <img
                  src={"/icons/arrow-right.svg"}
                  alt="arrow icon"
                  className="w-5 h-5 z-40 relative"
                />
                <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
              </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map((day: string) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-[#2D3C30] py-2 leading-[22px]"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day: number | null, index: number) => {
                const dateKey = getDateKey(day);
                const status = dateKey ? getDateStatus(dateKey) : null;
                const bookingCount = dateKey ? getBookingCount(dateKey) : 0;
                const todayDate = isToday(day);
                const pastDay = isPastDay(day);
                const isClosedByAdmin = dateKey ? closedDays.has(dateKey) : false;
                const closureInfo = dateKey ? closedDayDetails[dateKey] : undefined;
                const closureHint = closureInfo?.closureType === "event"
                  ? closureInfo.eventTitle || "Event closure"
                  : "Internal event (private)";
                const closureReason = closureInfo?.reason?.trim() ? closureInfo.reason : "";
                const closureTitle = [closureHint, closureReason].filter(Boolean).join(" - ");

                return (
                  <div
                    key={index}
                    onClick={() => day && handleDateClick(day, status!)}
                    title={isClosedByAdmin ? closureTitle : undefined}
                    className={`relative h-20 flex items-center justify-center duration-10 rounded-sm group overflow-hidden cursor-pointer ${todayDate ? "bg-[#C7CFC9]" : null}`}
                  >
                    {day && (
                      <>
                        {!pastDay && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleDayClosure(day);
                            }}
                            disabled={isDayActionLoading}
                            className={`absolute right-1 top-1 z-50 rounded px-1.5 py-0.5 text-[10px] font-medium ${isClosedByAdmin
                              ? "bg-[#CA1919] text-white"
                              : "bg-[#EDF0EE] text-yard-primary"
                              } ${isDayActionLoading ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
                            title={isClosedByAdmin ? "Reopen this day" : "Close this day"}
                          >
                            {isClosedByAdmin ? "Open" : "Close"}
                          </button>
                        )}
                        <div className="flex flex-col gap-2 items-center">
                          <button
                            className="w-full h-full flex items-center justify-center text-[#33322F] rounded z-40 font-semibold text-2xl leading-8 tracking-[0.1px]"
                            aria-label={`Select ${day}`}
                          >
                            {day}
                          </button>
                          {bookingCount > 0 && (
                            <small className="text-yard-primary text-[10px] leading-[100%] tracking-[0.5px] italic font-medium z-40">
                              {bookingCount} booking{bookingCount !== 1 ? "s" : ""}
                            </small>
                          )}
                          {isClosedByAdmin && (
                            <div className="z-40 flex flex-col items-center gap-0.5">
                              <small className="text-[#CA1919] text-[10px] leading-[100%] tracking-[0.5px] font-semibold">
                                manually closed
                              </small>
                              <small className="rounded bg-[#FEE2E2] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.3px] text-[#9F1239]">
                                {closureInfo?.closureType === "event" ? "event" : "internal"}
                              </small>
                            </div>
                          )}
                          <div className="absolute top-0 -left-0 bg-[#E4E8E5] group-hover:w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── EVENTS LIST VIEW ── */}
      {activeTab === "list" && (
        <div className="w-full">
          <div className="mb-4 flex flex-col gap-3 rounded-lg border border-[#E4E8E5] bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
              <input
                type="search"
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
                placeholder="Search events by title, location, or description"
                className="h-11 w-full rounded2px border border-[#C7CFC9] px-4 text-sm text-yard-primary outline-none transition-colors placeholder:text-[#8B8B8B] focus:border-yard-primary md:max-w-md"
              />
              <select
                value={eventDateFilter}
                onChange={(e) => setEventDateFilter(e.target.value as EventDateFilter)}
                className="h-11 w-full rounded2px border border-[#C7CFC9] bg-white px-4 text-sm text-yard-primary outline-none transition-colors focus:border-yard-primary md:w-56"
              >
                {EVENT_DATE_FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm text-[#666] lg:justify-end">
              <span>
                Showing {sortedEvents.length} of {events.length}
              </span>
              {eventSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setEventSearch("");
                  }}
                  className="rounded2px border border-[#C7CFC9] px-3 py-2 font-medium text-yard-primary transition-colors hover:bg-[#EDF0EE]"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#EDF0EE] flex items-center justify-center text-3xl">📅</div>
              <p className="text-yard-primary font-semibold font-sen text-lg">No events yet</p>
              <p className="text-[#666] text-sm">Click &quot;Create Event&quot; to schedule your first event.</p>
            </div>
          ) : sortedEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#EDF0EE] flex items-center justify-center text-3xl">🔎</div>
              <p className="text-yard-primary font-semibold font-sen text-lg">No matching events</p>
              <p className="text-[#666] text-sm">Try a different search term or clear the status filter.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {sortedEvents.map((event: any) => {
                const eventDate = event.date ? new Date(event.date) : null;
                const formattedDate = eventDate
                  ? eventDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                  : "—";
                const dateCategory = getEventDateCategory(event.date);
                const dateCategoryStyles: Record<EventDateCategory, string> = {
                  active: "bg-green-100 text-green-700",
                  upcoming: "bg-blue-100 text-blue-700",
                  past: "bg-gray-100 text-gray-600",
                };
                return (
                  <div
                    key={event._id || event.id}
                    className="w-full bg-white border border-[#E4E8E5] rounded-lg px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group"
                    onClick={() => handleOpenRegistrations(event)}
                  >
                    {/* Image */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[#EDF0EE] flex items-center justify-center">
                      {event.images && event.images[0] ? (
                        <img src={event.images[0]} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">🎪</span>
                      )}
                    </div>

                    {/* Event Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-playfair font-bold text-yard-primary text-base leading-6 truncate group-hover:underline">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs text-[#555] font-sen">📅 {formattedDate}</span>
                        {event.location && (
                          <span className="text-xs text-[#555] font-sen">📍 {event.location}</span>
                        )}
                        {event.audienceType && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#EDF0EE] text-yard-primary font-medium font-sen capitalize">
                            {event.audienceType}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium font-sen capitalize ${dateCategoryStyles[dateCategory]}`}>
                          {dateCategory}
                        </span>
                        {/* <span className={`text-xs px-2 py-0.5 rounded-full font-medium font-sen capitalize ${event.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : event.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                          }`}>
                          {event.status || "pending"}
                        </span> */}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenRegistrations(event);
                        }}
                        className="px-3 py-2 rounded2px bg-[#EDF0EE] text-yard-primary text-xs font-medium font-sen hover:bg-[#D9E0DA] transition-colors"
                      >
                        Registrations
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(event);
                        }}
                        className="px-3 py-2 rounded2px bg-yard-primary text-white text-xs font-medium font-sen hover:bg-yard-dark-primary transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteEventModal(event);
                        }}
                        className="px-3 py-2 rounded2px bg-[#FDECEC] text-[#B42318] text-xs font-medium font-sen hover:bg-[#FBD5D5] transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isDeleteModalOpen}>
        <section className="w-full">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary font-playfair">
                Delete Event
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#666] font-sen">
                This event will be removed permanently. This action cannot be undone.
              </p>
            </div>
            <button
              type="button"
              onClick={closeDeleteModal}
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden shrink-0"
            >
              <img src="/icons/cancel.svg" alt="Close Icon" className="z-40" />
              <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
            </button>
          </div>

          <div className="mt-5 rounded-lg border border-[#E4E8E5] bg-[#FDFBF9] p-4">
            <p className="text-sm font-medium text-[#666] font-sen">Event</p>
            <h3 className="mt-1 text-lg font-semibold text-yard-primary font-playfair">
              {eventToDelete?.title || "Selected event"}
            </h3>
            <p className="mt-2 text-sm text-[#666] font-sen">
              {eventToDelete?.location || "No location set"}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeDeleteModal}
              className="rounded2px border border-[#C7CFC9] px-4 py-2 text-sm font-medium text-yard-primary transition-colors hover:bg-[#EDF0EE]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteEvent}
              className="rounded2px bg-[#B42318] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#8F1D14]"
            >
              Delete event
            </button>
          </div>
        </section>
      </Modal>

      {/* Create Event Modal */}
      <Modal isOpen={isCreateModalOpen}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary font-playfair">
              Create Event
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={closeCreateModal}
            >
              <img
                src={"/icons/cancel.svg"}
                alt="Close Icon"
                className="z-40"
              />
              <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
            </div>
          </div>
        </section>
        <hr className="w-full h-[1px] bg-[#E4E8E5] border-0 my-5" />

        {/*Form*/}
        <form
          className="w-full flex flex-col gap-5 max-h-[70vh] overflow-y-auto pr-2"
          onSubmit={handleCreateEvent}
        >
          {/* Title */}
          <div className="form-group flex flex-col md:flex-row items-start gap-6">
            <div className="w-full input-group flex flex-col gap-3">
              <label htmlFor="title" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                Event Title * <small>(Max 20 words)</small>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={inputs.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                className="w-full h-13 rounded2px p-3 border border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group flex flex-col md:flex-row items-start gap-6">
            <div className="w-full input-group flex flex-col gap-3">
              <label htmlFor="description" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                Event Description  <small>(Max 150 words)</small>
              </label>
              <textarea
                id="description"

                name="description"
                value={inputs.description}
                onChange={handleInputChange}
                placeholder="Enter event description"
                rows={3}
                className="w-full rounded2px p-3 border border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px] resize-none"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="form-group flex flex-col md:flex-row items-start gap-6">
            <div className="w-full md:w-1/2 input-group flex flex-col gap-3">
              <label htmlFor="date" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                Event Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={inputs.date}
                onChange={handleInputChange}
                className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
              />
            </div>

            <div className="w-full md:w-1/2 input-group flex flex-col gap-3">
              <label htmlFor="time" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                Start Time *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                required
                value={inputs.time}
                onChange={handleInputChange}
                className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
              />
            </div>
          </div>

          {/* Audience Type & Location */}
          <div className="form-group flex flex-col md:flex-row items-start gap-6">
            <div className="w-full md:w-1/2 input-group flex flex-col gap-3">
              <label htmlFor="audienceType" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                Audience *
              </label>
              <select
                id="audienceType"
                name="audienceType"
                value={inputs.audienceType}
                onChange={handleInputChange}
                className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px] bg-white"
              >
                <option value="both">Both (Adults & Children)</option>
                <option value="adults">Adults Only</option>
                <option value="children">Children Only</option>
              </select>
            </div>

            <div className="w-full md:w-1/2 input-group flex flex-col gap-3">
              <label htmlFor="location" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={inputs.location}
                onChange={handleInputChange}
                placeholder="The Yard"
                className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
              />
            </div>
          </div>

          {/* Prices (Conditional) */}
          <div className="form-group flex flex-col md:flex-row items-start gap-6">
            {(inputs.audienceType === "adults" || inputs.audienceType === "both") && (
              <div className="w-full md:w-1/2 input-group flex flex-col gap-3">
                <label htmlFor="adultPrice" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                  Adult Ticket Price (₦) *
                </label>
                <input
                  type="number"
                  id="adultPrice"
                  name="adultPrice"
                  required
                  min={0}
                  value={inputs.adultPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            )}

            {(inputs.audienceType === "children" || inputs.audienceType === "both") && (
              <div className="w-full md:w-1/2 input-group flex flex-col gap-3">
                <label htmlFor="childPrice" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                  Child Ticket Price (₦) *
                </label>
                <input
                  type="number"
                  id="childPrice"
                  name="childPrice"
                  required
                  min={0}
                  value={inputs.childPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            )}
          </div>

          {/* Activities */}
          <div className="form-group flex flex-col md:flex-row items-start gap-6">
            <div className="w-full input-group flex flex-col gap-3">
              <label htmlFor="activities" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                Activities (comma-separated)
              </label>
              <input
                type="text"
                id="activities"
                name="activities"
                value={inputs.activities}
                onChange={handleInputChange}
                placeholder="e.g. Picnic, Board games, Music, Networking"
                className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
              />
            </div>
          </div>

          {/* Event Image Upload */}
          <div className="form-group flex flex-col gap-3">
            <label className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
              Event Image (optional)
            </label>
            <label
              htmlFor="event-image-upload"
              className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${imagePreview ? "border-yard-primary bg-[#EDF0EE]" : "border-[#BFBFBF] bg-[#FAFAFA] hover:border-yard-primary hover:bg-[#EDF0EE]"
                }`}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-lg" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-center px-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#999]">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-sm text-[#666] font-sen">Click to upload or drag &amp; drop</p>
                  <p className="text-xs text-[#999] font-sen">PNG, JPG, WEBP up to 5MB</p>
                </div>
              )}
              <input
                id="event-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            {imageFile && (
              <div className="flex items-center justify-between text-sm text-[#555] font-sen bg-[#EDF0EE] rounded px-3 py-2">
                <span className="truncate max-w-[80%]">{imageFile.name}</span>
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="text-red-500 font-medium hover:text-red-700 flex-shrink-0 ml-2"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Visibility (Checkbox) */}
          <div className="form-group flex items-center gap-3">
            <input
              type="checkbox"
              id="public"
              name="public"
              hidden={true}
              checked={inputs.public}
              onChange={handleInputChange}
              className="checkbox checkbox-sm border-2 border-yard-primary checked:border-yard-dark-primary checked:text-yard-dark-primary cursor-pointer"
            />
            {/* <label htmlFor="public" className="leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen cursor-pointer select-none">
              Make event public (visible on the homepage/gallery)
            </label> */}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden rounded-[5px] mt-3 cursor-pointer py-4"
          >
            <span className="z-40 font-sen font-semibold text-[16px] leading-[26px]">Create Event</span>
            <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary font-playfair">
              Edit Event
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={closeEditModal}
            >
              <img
                src={"/icons/cancel.svg"}
                alt="Close Icon"
                className="z-40"
              />
              <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
            </div>
          </div>
        </section>
        <hr className="w-full h-[1px] bg-[#E4E8E5] border-0 my-5" />

        <form
          className="w-full flex flex-col gap-5 max-h-[70vh] overflow-y-auto pr-2"
          onSubmit={handleUpdateEvent}
        >
          <div className="form-group flex flex-col md:flex-row items-start gap-6">
            <div className="w-full input-group flex flex-col gap-3">
              <label htmlFor="edit-title" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                Event Title *
              </label>
              <input
                type="text"
                id="edit-title"
                name="title"
                required
                value={inputs.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
              />
            </div>
          </div>

          <div className="form-group flex flex-col md:flex-row items-start gap-6">
            <div className="w-full input-group flex flex-col gap-3">
              <label htmlFor="edit-description" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                Description
              </label>
              <textarea
                id="edit-description"
                name="description"
                value={inputs.description}
                onChange={handleInputChange}
                placeholder="Enter event description"
                rows={3}
                className="w-full rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px] resize-none"
              />
            </div>
          </div>

          <div className="form-group flex flex-col md:flex-row items-start gap-6">
            <div className="w-full md:w-1/2 input-group flex flex-col gap-3">
              <label htmlFor="edit-date" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                Event Date *
              </label>
              <input
                type="date"
                id="edit-date"
                name="date"
                required
                value={inputs.date}
                onChange={handleInputChange}
                className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
              />
            </div>

            <div className="w-full md:w-1/2 input-group flex flex-col gap-3">
              <label htmlFor="edit-time" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                Start Time *
              </label>
              <input
                type="time"
                id="edit-time"
                name="time"
                required
                value={inputs.time}
                onChange={handleInputChange}
                className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
              />
            </div>
          </div>

          <div className="form-group flex flex-col md:flex-row items-start gap-6">
            <div className="w-full md:w-1/3 input-group flex flex-col gap-3">
              <label htmlFor="edit-audienceType" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                Audience *
              </label>
              <select
                id="edit-audienceType"
                name="audienceType"
                value={inputs.audienceType}
                onChange={handleInputChange}
                className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px] bg-white"
              >
                <option value="both">Both (Adults & Children)</option>
                <option value="adults">Adults Only</option>
                <option value="children">Children Only</option>
              </select>
            </div>

            <div className="w-full md:w-1/3 input-group flex flex-col gap-3">
              <label htmlFor="edit-location" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                Location
              </label>
              <input
                type="text"
                id="edit-location"
                name="location"
                value={inputs.location}
                onChange={handleInputChange}
                placeholder="The Yard"
                className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
              />
            </div>

            <div className="w-full md:w-1/3 input-group flex flex-col gap-3">
              <label htmlFor="edit-status" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                Status
              </label>
              <select
                id="edit-status"
                name="status"
                value={inputs.status}
                onChange={handleInputChange}
                className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px] bg-white"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-group flex flex-col md:flex-row items-start gap-6">
            {(inputs.audienceType === "adults" || inputs.audienceType === "both") && (
              <div className="w-full md:w-1/2 input-group flex flex-col gap-3">
                <label htmlFor="edit-adultPrice" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                  Adult Ticket Price (₦) *
                </label>
                <input
                  type="number"
                  id="edit-adultPrice"
                  name="adultPrice"
                  required
                  min={0}
                  value={inputs.adultPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            )}

            {(inputs.audienceType === "children" || inputs.audienceType === "both") && (
              <div className="w-full md:w-1/2 input-group flex flex-col gap-3">
                <label htmlFor="edit-childPrice" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                  Child Ticket Price (₦) *
                </label>
                <input
                  type="number"
                  id="edit-childPrice"
                  name="childPrice"
                  required
                  min={0}
                  value={inputs.childPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            )}
          </div>

          <div className="form-group flex flex-col md:flex-row items-start gap-6">
            <div className="w-full input-group flex flex-col gap-3">
              <label htmlFor="edit-activities" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                Activities (comma-separated)
              </label>
              <input
                type="text"
                id="edit-activities"
                name="activities"
                value={inputs.activities}
                onChange={handleInputChange}
                placeholder="e.g. Picnic, Board games, Music, Networking"
                className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
              />
            </div>
          </div>

          <div className="form-group flex flex-col gap-3">
            <label className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
              Event Image
            </label>
            <label
              htmlFor="edit-event-image-upload"
              className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${imagePreview ? "border-yard-primary bg-[#EDF0EE]" : "border-[#BFBFBF] bg-[#FAFAFA] hover:border-yard-primary hover:bg-[#EDF0EE]"
                }`}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-lg" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-center px-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#999]">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-sm text-[#666] font-sen">Click to upload or drag &amp; drop</p>
                  <p className="text-xs text-[#999] font-sen">PNG, JPG, WEBP up to 5MB</p>
                </div>
              )}
              <input
                id="edit-event-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            {(imageFile || imagePreview) && (
              <div className="flex items-center justify-between text-sm text-[#555] font-sen bg-[#EDF0EE] rounded px-3 py-2">
                <span className="truncate max-w-[80%]">{imageFile ? imageFile.name : "Current event image"}</span>
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="text-red-500 font-medium hover:text-red-700 flex-shrink-0 ml-2"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="form-group flex items-center gap-3">
            <input
              type="checkbox"
              id="edit-public"
              name="public"
              checked={inputs.public}
              onChange={handleInputChange}
              className="checkbox checkbox-sm border-2 border-yard-primary checked:border-yard-dark-primary checked:text-yard-dark-primary cursor-pointer"
            />
            <label htmlFor="edit-public" className="leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen cursor-pointer select-none">
              Make event public
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden rounded-[5px] mt-3 cursor-pointer py-4"
          >
            <span className="z-40 font-sen font-semibold text-[16px] leading-[26px]">Update Event</span>
            <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>
        </form>
      </Modal>

      {/* ── Event Registrations Popup Modal ── */}
      <Modal isOpen={isRegModalOpen}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="font-semibold text-xl leading-8 tracking-[0.1px] text-yard-primary font-playfair">
                {selectedEvent?.title || "Event"}
              </h2>
              <p className="text-sm text-[#666] font-sen mt-0.5">
                Registered Attendees
              </p>
            </div>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => { setIsRegModalOpen(false); setSelectedEvent(null); setRegistrations([]); }}
            >
              <img src={"/icons/cancel.svg"} alt="Close Icon" className="z-40" />
              <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
            </div>
          </div>
        </section>
        <hr className="w-full h-[1px] bg-[#E4E8E5] border-0 my-4" />

        <div className="w-full max-h-[60vh] overflow-y-auto flex flex-col gap-2">
          {isRegLoading ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <div className="w-8 h-8 border-4 border-yard-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-[#666] font-sen">Loading registrations...</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-[#EDF0EE] flex items-center justify-center text-2xl">👥</div>
              <p className="text-yard-primary font-semibold font-sen">No registrations yet</p>
              <p className="text-sm text-[#999] font-sen">No one has registered for this event yet.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-[#555] font-sen mb-2">{registrations.length} attendee{registrations.length !== 1 ? "s" : ""} registered</p>
              {registrations.map((reg: any, idx: number) => {
                const name = reg.name || `${reg.firstname || ""} ${reg.lastname || ""}`.trim() || "Guest";
                const email = reg.email || reg.customerEmail || "";
                const phone = reg.phone || reg.customerPhone || "";
                const adults = reg.adults ?? reg.adultCount ?? null;
                const children = reg.children ?? reg.childCount ?? null;
                return (
                  <div key={reg._id || idx} className="flex items-center gap-4 p-3 rounded-lg border border-[#E4E8E5] bg-white hover:bg-[#FAFAFA] transition-colors">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-yard-primary flex items-center justify-center text-white font-bold font-sen text-sm flex-shrink-0">
                      {name.charAt(0).toUpperCase()}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium font-sen text-[#1A1A1A] text-sm leading-5 truncate">{name}</p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        {email && <span className="text-xs text-[#666] font-sen truncate">{email}</span>}
                        {phone && <span className="text-xs text-[#999] font-sen">{phone}</span>}
                      </div>
                    </div>

                    {/* Ticket counts */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {adults !== null && (
                        <span className="text-xs px-2 py-1 rounded-full bg-[#EDF0EE] text-yard-primary font-sen font-medium">
                          {adults} adult{adults !== 1 ? "s" : ""}
                        </span>
                      )}
                      {children !== null && (
                        <span className="text-xs px-2 py-1 rounded-full bg-[#EDF0EE] text-yard-primary font-sen font-medium">
                          {children} child{children !== 1 ? "ren" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </Modal>

      <Modal isOpen={isCloseDayModalOpen}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary font-playfair">
                Close Date
              </h2>
              <p className="mt-1 text-sm text-[#666] font-sen">
                {closeDayDate ? moment(closeDayDate).format("dddd, DD MMMM YYYY") : "Select date"}
              </p>
            </div>
            <button
              type="button"
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={closeCloseDayModal}
            >
              <img src="/icons/cancel.svg" alt="Close Icon" className="z-40" />
              <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
            </button>
          </div>
        </section>
        <hr className="w-full h-[1px] bg-[#E4E8E5] border-0 my-5" />

        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmitCloseDay}>
          <div className="form-group flex flex-col gap-3">
            <label htmlFor="closureType" className="leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
              What is happening on this day?
            </label>
            <select
              id="closureType"
              name="closureType"
              value={closeDayInputs.closureType}
              onChange={handleCloseDayInputChange}
              className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none bg-white"
            >
              <option value="internal">Internal event (private)</option>
              <option value="event">Specific event</option>
            </select>
            <p className="text-xs text-[#777] font-sen">
              Choose &quot;Internal event&quot; to close the day without filling event form details.
            </p>
          </div>

          {closeDayInputs.closureType === "event" && (
            <>
              <div className="form-group flex flex-col gap-3">
                <label htmlFor="eventTitle" className="leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                  Event title *
                </label>
                <input
                  type="text"
                  id="eventTitle"
                  name="eventTitle"
                  required={closeDayInputs.closureType === "event"}
                  value={closeDayInputs.eventTitle}
                  onChange={handleCloseDayInputChange}
                  placeholder="e.g. Wedding Reception"
                  className="w-full h-[52px] rounded2px p-3 border border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>

              <div className="form-group flex flex-col gap-3">
                <label htmlFor="eventOrganizer" className="leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                  Organizer (optional)
                </label>
                <input
                  type="text"
                  id="eventOrganizer"
                  name="eventOrganizer"
                  value={closeDayInputs.eventOrganizer}
                  onChange={handleCloseDayInputChange}
                  placeholder="Organizer name or team"
                  className="w-full h-[52px] rounded2px p-3 border border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>

              <div className="form-group flex flex-col gap-3">
                <label htmlFor="eventDetails" className="leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
                  Event details (optional)
                </label>
                <textarea
                  id="eventDetails"
                  name="eventDetails"
                  rows={3}
                  value={closeDayInputs.eventDetails}
                  onChange={handleCloseDayInputChange}
                  placeholder="Extra notes for admin records"
                  className="w-full rounded2px p-3 border border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px] resize-none"
                />
              </div>
            </>
          )}

          <div className="form-group flex flex-col gap-3">
            <label htmlFor="reason" className="leading-6 tracking-[0.5px] text-[#1A1A1A] font-medium font-sen">
              Closure note (optional)
            </label>
            <textarea
              id="reason"
              name="reason"
              rows={2}
              value={closeDayInputs.reason}
              onChange={handleCloseDayInputChange}
              placeholder="Reason visible in admin data"
              className="w-full rounded2px p-3 border border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px] resize-none"
            />
          </div>

          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeCloseDayModal}
              className="rounded2px border border-[#C7CFC9] px-4 py-2 text-sm font-medium text-yard-primary transition-colors hover:bg-[#EDF0EE]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDayActionLoading}
              className="rounded2px bg-yard-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yard-dark-primary disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isDayActionLoading ? "Closing..." : "Close this date"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={unavailableModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary font-playfair">
                Closed Day Details
              </h2>
              <p className="mt-1 text-sm text-[#666] font-sen">
                {selectedDate ? moment(selectedDate).format("dddd, DD MMMM YYYY") : "Selected date"}
              </p>
            </div>
            <button
              type="button"
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setUnavailableModal(false)}
            >
              <img src="/icons/cancel.svg" alt="Close Icon" className="z-40" />
              <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
            </button>
          </div>
        </section>
        <hr className="w-full h-[1px] bg-[#E4E8E5] border-0 my-5" />

        {(() => {
          const info = getClosedDayInfoByDate(selectedDate);
          const closureType = info?.closureType === "event" ? "event" : "internal";
          const isInternal = closureType === "internal";

          return (
            <div className="w-full flex flex-col gap-4">
              <div className="rounded-lg border border-[#E4E8E5] bg-[#FDFBF9] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.4px] text-[#777]">Closure type</p>
                <p className="mt-1 text-base font-semibold text-yard-primary font-sen">
                  {isInternal ? "Internal event (private)" : "Specific event"}
                </p>
              </div>

              {!isInternal && (
                <div className="rounded-lg border border-[#E4E8E5] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.4px] text-[#777]">Event information</p>
                  <div className="mt-2 space-y-2 text-sm text-[#333] font-sen">
                    <p>
                      <span className="font-semibold">Title:</span> {info?.eventTitle || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Organizer:</span> {info?.eventOrganizer || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Details:</span> {info?.eventDetails || "-"}
                    </p>
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-[#E4E8E5] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.4px] text-[#777]">Admin note</p>
                <p className="mt-2 text-sm text-[#333] font-sen whitespace-pre-wrap">
                  {info?.reason?.trim() ? info.reason : "No note provided for this closure."}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setUnavailableModal(false)}
                  className="rounded2px border border-[#C7CFC9] px-4 py-2 text-sm font-medium text-yard-primary transition-colors hover:bg-[#EDF0EE]"
                >
                  Close
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </main>
  );
};

export default AdminCalendar;
