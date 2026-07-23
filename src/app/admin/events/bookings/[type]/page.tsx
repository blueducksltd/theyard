"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-toastify";
import moment from "moment";
import { IPageBooking } from "@/components/dashboard/BookingContent";
import { confirmOrCancelBookings } from "@/util";

type BookingStatus = "pending" | "confirmed" | "cancelled";

type StatusFilter = "all" | BookingStatus;

type TimeGroupKey = "morning" | "afternoon" | "evening" | "unscheduled";

const statusBadgeStyles: Record<BookingStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  cancelled: "border-rose-200 bg-rose-50 text-rose-800",
};

const timeGroupMeta: Record<TimeGroupKey, { label: string; subtitle: string }> = {
  morning: {
    label: "Morning",
    subtitle: "06:00 - 11:59",
  },
  afternoon: {
    label: "Afternoon",
    subtitle: "12:00 - 17:59",
  },
  evening: {
    label: "Evening",
    subtitle: "18:00 onwards",
  },
  unscheduled: {
    label: "Unscheduled",
    subtitle: "No time slot provided",
  },
};

function BookingCardSkeleton() {
  return (
    <article className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
      <div className="mt-3 h-8 w-2/3 animate-pulse rounded bg-gray-100" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="h-16 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-16 animate-pulse rounded-xl bg-gray-100" />
      </div>
      <div className="mt-4 flex gap-3">
        <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </article>
  );
}

export default function BookingPage() {
  const router = useRouter();
  const query = useSearchParams();
  const dateParam = query.get("date") ?? "";

  const [bookings, setBookings] = useState<IPageBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<IPageBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  const resetBookingState = () => {
    setBookings([]);
  };

  const selectedDateMoment = useMemo(() => {
    const parsed = moment(dateParam, "YYYY-MM-DD", true);
    return parsed.isValid() ? parsed : null;
  }, [dateParam]);

  const selectedDateLabel = useMemo(() => {
    if (!selectedDateMoment) return "Selected day";
    return selectedDateMoment.format("dddd, DD MMMM YYYY");
  }, [selectedDateMoment]);

  const selectedDateShortLabel = useMemo(() => {
    if (!selectedDateMoment) return "-";
    return selectedDateMoment.format("DD MMM YYYY");
  }, [selectedDateMoment]);

  const getBookingPackageName = (booking: IPageBooking) => {
    if (booking.package && typeof booking.package === "object") {
      return booking.package.name ?? "Unknown package";
    }

    return "Unknown package";
  };

  const getBookingCustomerName = (booking: IPageBooking) => {
    if (booking.customer && typeof booking.customer === "object") {
      const firstName = booking.customer.firstname ?? "";
      const lastName = booking.customer.lastname ?? "";
      return `${firstName} ${lastName}`.trim() || "Unknown customer";
    }

    return "Unknown customer";
  };

  const getBookingCustomerEmail = (booking: IPageBooking) => {
    if (booking.customer && typeof booking.customer === "object") {
      return booking.customer.email ?? "-";
    }

    return "-";
  };

  const getBookingCustomerPhone = (booking: IPageBooking) => {
    if (booking.customer && typeof booking.customer === "object") {
      return booking.customer.phone ?? "-";
    }

    return "-";
  };

  const getBookingTimestamp = (date: Date | string | undefined) => {
    if (!date) return 0;
    const timestamp = new Date(date).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  };

  const formatBookingDateTime = (date: Date | string | undefined) => {
    if (!date) return "-";
    const bookingDate = moment.utc(date);
    return bookingDate.isValid() ? bookingDate.format("DD MMM YYYY, hh:mm A") : "-";
  };

  const formatTimeWindow = (booking: IPageBooking) => {
    if (Array.isArray(booking.times) && booking.times.length > 0) {
      return booking.times.join(" | ");
    }

    if (booking.startTime || booking.endTime) {
      return [booking.startTime, booking.endTime].filter(Boolean).join(" - ");
    }

    return "Not specified";
  };

  const getPrimaryTimeText = (booking: IPageBooking) => {
    if (Array.isArray(booking.times) && booking.times.length > 0) {
      const firstBlock = booking.times[0] ?? "";
      const firstPart = firstBlock.split("-")[0]?.trim();
      return firstPart || firstBlock;
    }

    return booking.startTime ?? "";
  };

  const getBookingTimeGroup = (booking: IPageBooking): TimeGroupKey => {
    const timeText = getPrimaryTimeText(booking);
    if (!timeText) return "unscheduled";

    const parsedTime = moment(timeText, ["h:mm A", "hh:mm A", "H:mm", "HH:mm", "h A", "ha"], true);
    if (!parsedTime.isValid()) return "unscheduled";

    const hour = parsedTime.hour();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  const fetchBookings = useCallback(async () => {
    if (!dateParam) {
      resetBookingState();
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const {
        data: {
          data: { bookings: resBookings },
        },
      } = await axios.get(`/api/bookings?date=${dateParam}`);

      const normalizedBookings = Array.isArray(resBookings)
        ? resBookings
            .filter((booking: unknown) => booking && typeof booking === "object")
            .sort((left: IPageBooking, right: IPageBooking) => {
              const rightTime = getBookingTimestamp(right.createdAt ?? right.eventDate);
              const leftTime = getBookingTimestamp(left.createdAt ?? left.eventDate);
              return rightTime - leftTime;
            })
        : [];

      setBookings(normalizedBookings as IPageBooking[]);
    } catch {
      resetBookingState();
      toast.error("Unable to load bookings right now.", {
        position: "bottom-right",
      });
    } finally {
      setIsLoading(false);
    }
  }, [dateParam]);

  const handleBooking = async (id: string, status: BookingStatus) => {
    setActiveActionId(id);
    const toastId = toast.loading("Processing...", {
      position: "bottom-right",
    });

    try {
      const response = await confirmOrCancelBookings({ id, status });
      if (response.success === true) {
        toast.update(toastId, {
          render: status === "confirmed" ? "Booking approved successfully!" : "Booking cancelled successfully!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          position: "bottom-right",
        });

        await fetchBookings();

        if (selectedBooking?.id === id) {
          const updatedStatus = status;
          setSelectedBooking((prev) => (prev ? { ...prev, status: updatedStatus } : prev));
        }
      } else {
        toast.update(toastId, {
          render: response.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
          position: "bottom-right",
        });
      }
    } catch (error) {
      toast.update(toastId, {
        render:
          status === "confirmed"
            ? `An error occurred while approving the booking. ${error}`
            : `An error occurred while cancelling the booking. ${error}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        position: "bottom-right",
      });
    } finally {
      setActiveActionId(null);
    }
  };

  const filteredBookings = useMemo(() => {
    if (statusFilter === "all") return bookings;
    return bookings.filter((booking) => booking.status === statusFilter);
  }, [bookings, statusFilter]);

  const summary = useMemo(() => {
    const pending = bookings.filter((booking) => booking.status === "pending").length;
    const confirmed = bookings.filter((booking) => booking.status === "confirmed").length;
    const cancelled = bookings.filter((booking) => booking.status === "cancelled").length;
    return {
      total: bookings.length,
      pending,
      confirmed,
      cancelled,
    };
  }, [bookings]);

  const groupedFilteredBookings = useMemo(() => {
    const groups: Record<TimeGroupKey, IPageBooking[]> = {
      morning: [],
      afternoon: [],
      evening: [],
      unscheduled: [],
    };

    for (const booking of filteredBookings) {
      groups[getBookingTimeGroup(booking)].push(booking);
    }

    return (Object.keys(timeGroupMeta) as TimeGroupKey[]).map((key) => ({
      key,
      label: timeGroupMeta[key].label,
      subtitle: timeGroupMeta[key].subtitle,
      bookings: groups[key],
    }));
  }, [filteredBookings]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <div className="min-h-screen w-full bg-[#F4F6F8]">
      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#DCE2E8] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-5">
            <button
              type="button"
              onClick={() => router.push("/admin/events")}
              className="inline-flex items-center gap-2 rounded-full border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-semibold text-[#374151] transition hover:border-[#9CA3AF] hover:bg-[#F9FAFB]"
            >
              <span aria-hidden="true">←</span>
              Back to calendar
            </button>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6B7280]">Day Bookings</p>
              <h1 className="mt-2 text-2xl font-bold text-[#111827] sm:text-3xl">{selectedDateLabel}</h1>
              <p className="mt-2 text-sm text-[#4B5563]">
                All events and booking requests submitted for this date are shown below.
              </p>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-4">
              <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#6B7280]">Total</p>
                <p className="mt-1 text-2xl font-bold text-[#111827]">{summary.total}</p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-amber-700">Pending</p>
                <p className="mt-1 text-2xl font-bold text-amber-900">{summary.pending}</p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-700">Confirmed</p>
                <p className="mt-1 text-2xl font-bold text-emerald-900">{summary.confirmed}</p>
              </div>
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-rose-700">Cancelled</p>
                <p className="mt-1 text-2xl font-bold text-rose-900">{summary.cancelled}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {(["all", "pending", "confirmed", "cancelled"] as StatusFilter[]).map((filter) => {
              const isActive = statusFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold capitalize transition ${
                    isActive
                      ? "border-[#111827] bg-[#111827] text-white"
                      : "border-[#D1D5DB] bg-white text-[#374151] hover:border-[#9CA3AF]"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
          <aside className="rounded-2xl border border-[#DCE2E8] bg-white p-4 shadow-sm lg:sticky lg:top-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]">Timeline</p>
            <nav className="mt-4 space-y-2">
              {groupedFilteredBookings.map((group) => (
                <a
                  key={group.key}
                  href={`#group-${group.key}`}
                  className="flex items-center justify-between rounded-lg border border-transparent px-3 py-2 text-sm transition hover:border-[#D1D5DB] hover:bg-[#F8FAFC]"
                >
                  <span>
                    <span className="font-semibold text-[#111827]">{group.label}</span>
                    <span className="ml-2 text-xs text-[#6B7280]">{group.subtitle}</span>
                  </span>
                  <span className="rounded-md bg-[#EEF2F7] px-2 py-0.5 text-xs font-semibold text-[#374151]">
                    {group.bookings.length}
                  </span>
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-6">
            {isLoading ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <BookingCardSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            ) : (
              groupedFilteredBookings.map((group) => (
                <section
                  key={group.key}
                  id={`group-${group.key}`}
                  className="scroll-mt-8 rounded-2xl border border-[#DCE2E8] bg-white p-5 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#EEF2F7] pb-3">
                    <div>
                      <h2 className="text-lg font-bold text-[#111827]">{group.label}</h2>
                      <p className="text-xs text-[#6B7280]">{group.subtitle}</p>
                    </div>
                    <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold text-[#3730A3]">
                      {group.bookings.length} bookings
                    </span>
                  </div>

                  {group.bookings.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5 text-sm text-[#6B7280]">
                      No bookings in this time block.
                    </div>
                  ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                      {group.bookings.map((booking) => {
                        const status = booking.status as BookingStatus;
                        const statusStyle = statusBadgeStyles[status] ?? statusBadgeStyles.pending;
                        const isActionLoading = activeActionId === booking.id;

                        return (
                          <article
                            key={booking.id}
                            className="group rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B7280]">Package</p>
                                <h3 className="mt-1 text-xl font-bold text-[#111827]">{getBookingPackageName(booking)}</h3>
                              </div>
                              <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyle}`}>
                                {status}
                              </span>
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              <div className="rounded-xl bg-[#F8FAFC] p-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B7280]">Customer</p>
                                <p className="mt-1 text-sm font-semibold text-[#111827]">{getBookingCustomerName(booking)}</p>
                                <p className="mt-1 text-xs text-[#4B5563]">{getBookingCustomerEmail(booking)}</p>
                              </div>
                              <div className="rounded-xl bg-[#F8FAFC] p-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B7280]">Time Slot</p>
                                <p className="mt-1 text-sm font-semibold text-[#111827]">{formatTimeWindow(booking)}</p>
                                <p className="mt-1 text-xs text-[#4B5563]">Date: {selectedDateShortLabel}</p>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#374151]">
                              <span className="rounded-md bg-[#EFF6FF] px-2.5 py-1 font-semibold text-[#1D4ED8]">
                                Guests: {booking.guestCount ?? "-"}
                              </span>
                              <span className="rounded-md bg-[#ECFDF3] px-2.5 py-1 font-semibold text-[#047857]">
                                Amount: {Number(booking.totalPrice ?? 0).toLocaleString()}
                              </span>
                              <span className="rounded-md bg-[#F3F4F6] px-2.5 py-1 text-xs font-medium text-[#4B5563]">
                                Created: {formatBookingDateTime(booking.createdAt)}
                              </span>
                            </div>

                            <div className="mt-5 flex flex-wrap items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setSelectedBooking(booking)}
                                className="rounded-lg border border-[#D1D5DB] px-4 py-2 text-sm font-semibold text-[#374151] transition hover:border-[#9CA3AF] hover:bg-[#F9FAFB]"
                              >
                                View details
                              </button>

                              {booking.status !== "confirmed" && (
                                <button
                                  type="button"
                                  onClick={() => handleBooking(booking.id, "confirmed")}
                                  disabled={isActionLoading}
                                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  <Image src="/icons/tick.svg" width={16} height={16} alt="Approve booking" />
                                  Approve
                                </button>
                              )}

                              {booking.status !== "cancelled" && (
                                <button
                                  type="button"
                                  onClick={() => handleBooking(booking.id, "cancelled")}
                                  disabled={isActionLoading}
                                  className="inline-flex items-center gap-2 rounded-lg border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-800 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  <Image src="/icons/close.svg" width={16} height={16} alt="Cancel booking" />
                                  Cancel
                                </button>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </section>
              ))
            )}
          </div>
        </div>

        {!isLoading && filteredBookings.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-10 text-center">
            <p className="text-lg font-semibold text-[#111827]">No events found for this filter</p>
            <p className="mt-2 text-sm text-[#6B7280]">
              Try a different status filter to see bookings for {selectedDateShortLabel}.
            </p>
          </div>
        )}
      </section>

      {selectedBooking ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#999999]">Booking details</p>
                <h3 className="mt-2 text-2xl font-bold text-[#1F2937]">{getBookingCustomerName(selectedBooking)}</h3>
                <p className="mt-1 text-sm text-[#737373]">{getBookingPackageName(selectedBooking)}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-full bg-[#EDF0EE] px-3 py-1 text-sm font-semibold text-[#737373] transition-colors hover:bg-[#E4E8E5]"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#999999]">Customer</p>
                <div className="mt-3 space-y-2 text-sm text-[#1F2937]">
                  <p>
                    <span className="font-semibold text-[#737373]">Name:</span> {getBookingCustomerName(selectedBooking)}
                  </p>
                  <p>
                    <span className="font-semibold text-[#737373]">Email:</span> {getBookingCustomerEmail(selectedBooking)}
                  </p>
                  <p>
                    <span className="font-semibold text-[#737373]">Phone:</span> {getBookingCustomerPhone(selectedBooking)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#999999]">Booking</p>
                <div className="mt-3 space-y-2 text-sm text-[#1F2937]">
                  <p>
                    <span className="font-semibold text-[#737373]">Date:</span> {selectedDateShortLabel}
                  </p>
                  <p>
                    <span className="font-semibold text-[#737373]">Time:</span> {formatTimeWindow(selectedBooking)}
                  </p>
                  <p>
                    <span className="font-semibold text-[#737373]">Created:</span> {formatBookingDateTime(selectedBooking.createdAt)}
                  </p>
                  <p>
                    <span className="font-semibold text-[#737373]">Guests:</span> {selectedBooking.guestCount ?? "-"}
                  </p>
                  <p>
                    <span className="font-semibold text-[#737373]">Total:</span> {Number(selectedBooking.totalPrice ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#999999]">Package</p>
                <div className="mt-3 space-y-2 text-sm text-[#1F2937]">
                  <p>
                    <span className="font-semibold text-[#737373]">Name:</span> {getBookingPackageName(selectedBooking)}
                  </p>
                  <p>
                    <span className="font-semibold text-[#737373]">Package price:</span>{" "}
                    {selectedBooking.package && typeof selectedBooking.package === "object" && selectedBooking.package.price != null
                      ? Number(selectedBooking.package.price).toLocaleString()
                      : "-"}
                  </p>
                  <p>
                    <span className="font-semibold text-[#737373]">Capacity:</span>{" "}
                    {selectedBooking.package && typeof selectedBooking.package === "object" && selectedBooking.package.capacity != null
                      ? selectedBooking.package.capacity
                      : selectedBooking.package &&
                          typeof selectedBooking.package === "object" &&
                          selectedBooking.package.guestLimit != null
                        ? selectedBooking.package.guestLimit
                        : "-"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#999999]">Status</p>
                <div className="mt-3">
                  <span
                    className={`inline-flex rounded-md border px-3 py-1 text-sm font-semibold capitalize ${
                      statusBadgeStyles[selectedBooking.status]
                    }`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
