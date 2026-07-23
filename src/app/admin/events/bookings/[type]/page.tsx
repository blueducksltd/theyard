"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from "next/navigation";
import axios from 'axios';
import { SafeBooking } from '@/types/Booking';
import Image from 'next/image';
import { IPageBooking } from '@/components/dashboard/BookingContent';
import { toast } from 'react-toastify';
import { confirmOrCancelBookings, getBookings } from '@/util';
import moment from 'moment';

function BookingRowSkeleton({ index }: { index: number }) {
  return (
    <tr className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
      </td>
      <td className="px-6 py-4">
        <div className="h-6 w-20 animate-pulse rounded-md bg-gray-200" />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded bg-gray-200" />
          <div className="h-9 w-9 animate-pulse rounded bg-gray-200" />
        </div>
      </td>
    </tr>
  );
}

export default function BookingPage() {
  const query = useSearchParams();
  const [bookings, setBookings] = useState<IPageBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<IPageBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getBookingPackageName = (booking: IPageBooking) => {
    if (booking.package && typeof booking.package === "object") {
      return booking.package.name ?? "Unknown package";
    }

    return "Unknown package";
  };

  const formatBookingDate = (date: Date | string) => {
    const bookingDate = moment.utc(date);
    return bookingDate.isValid() ? bookingDate.format("DD MMM YYYY") : "-";
  };


  const getBookingTimestamp = (date: Date | string | undefined) => {
    if (!date) return 0;
    const timestamp = new Date(date).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  };

  const resetBookingState = () => {
    setBookings([]);

  };
  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { data: { bookings: resBookings } } } = await axios.get(`/api/bookings?date=${query.get("date")!}`);
      setBookings(resBookings);
    } catch {
      resetBookingState();
      toast.error("Unable to load bookings right now.", {
        position: "bottom-right",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);
  const handleBooking = async (id: string, status: string) => {
    const toastId = toast.loading("Processing...", {
      position: "bottom-right",
    });
    const data = {
      id,
      status,
    };

    try {
      const response = await confirmOrCancelBookings(data);
      if (response.success == true) {
        if (status === "confirmed") {
          toast.update(toastId, {
            render: "Booking approved successfully!",
            type: "success",
            isLoading: false,
            autoClose: 5000,
            position: "bottom-right",
          });
        } else {
          toast.update(toastId, {
            render: "Booking cancelled successfully!",
            type: "success",
            isLoading: false,
            autoClose: 5000,
            position: "bottom-right",
          });
        }
        await fetchBookings();
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
      if (status === "confirmed") {
        toast.update(toastId, {
          render: `An error occurred while approving the booking. ${error}`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
          position: "bottom-right",
        });
      } else {
        toast.update(toastId, {
          render: `An error occurred while cancelling the booking. ${error}`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
          position: "bottom-right",
        });
      }
    }
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


  const formatBookingDateTime = (date: Date | string | undefined) => {
    if (!date) return "-";
    const bookingDate = moment.utc(date);
    return bookingDate.isValid() ? bookingDate.format("DD MMM YYYY, hh:mm A") : "-";
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);


  return (
    <div className='min-h-screen w-full'>
      <div className="w-full min-h-screen bg-gray-50 p-5">
        <div className="mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                      Booking details
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isLoading ? Array.from({ length: 5 }).map((_, index) => (
                      <BookingRowSkeleton key={`skeleton-${index}`} index={index} />
                    )) :
                      bookings.length > 0 ?
                        bookings.map((booking, index) => (
                          <tr
                            key={booking.id}
                            onClick={() => setSelectedBooking(booking)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                setSelectedBooking(booking);
                              }
                            }}
                            role="button"
                            tabIndex={0}
                            className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              } cursor-pointer`}
                          >
                            <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                              <div className="flex flex-col gap-1">
                                <span>{getBookingPackageName(booking)}</span>
                                <span className="text-xs font-normal text-[#999999]">
                                  {Number(booking.totalPrice ?? 0).toLocaleString()}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                              {formatBookingDate(booking.eventDate)}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`p-1.5 rounded-md text-sm border ${booking.status === "pending" ||
                                  booking.status === "cancelled"
                                  ? "border-[1px] border-[#8C8273] text-[#8C8273] rounded-sm italic leading-[22px] tracking-[0.5px] font-semibold"
                                  : "bg-green-50 border-[1px] border-green-400 text-green-700"
                                  }`}
                              >
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {
                                  booking.status === "confirmed" ? <button
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleBooking(booking.id, "cancelled");
                                    }}
                                    className="p-2 hover:bg-red-50 rounded transition-colors bg-[#EDF0EE] cursor-pointer duration-500 hover:scale-110"
                                    aria-label="Delete booking"
                                  >
                                    <Image
                                      src={"/icons/close.svg"}
                                      width={20}
                                      height={20}
                                      alt="Trash Icon"
                                    />
                                  </button> : booking.status === "cancelled" ? <button
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleBooking(booking.id, "confirmed");
                                    }}
                                    className="p-2 hover:bg-green-50 rounded transition-colors bg-[#EDF0EE] cursor-pointer duration-500 hover:scale-110"
                                    aria-label="Approve booking"
                                  >
                                    <Image
                                      src={"/icons/tick.svg"}
                                      width={20}
                                      height={20}
                                      alt="Tick Icon"
                                    />
                                  </button> : <>

                                    <button
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        handleBooking(booking.id, "confirmed");
                                      }}
                                      className="p-2 hover:bg-green-50 rounded transition-colors bg-[#EDF0EE] cursor-pointer duration-500 hover:scale-110"
                                      aria-label="Approve booking"
                                    >
                                      <Image
                                        src={"/icons/tick.svg"}
                                        width={20}
                                        height={20}
                                        alt="Tick Icon"
                                      />
                                    </button>

                                    <button
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        handleBooking(booking.id, "cancelled");
                                      }}
                                      className="p-2 hover:bg-red-50 rounded transition-colors bg-[#EDF0EE] cursor-pointer duration-500 hover:scale-110"
                                      aria-label="Delete booking"
                                    >
                                      <Image
                                        src={"/icons/close.svg"}
                                        width={20}
                                        height={20}
                                        alt="Trash Icon"
                                      />
                                    </button>

                                  </>
                                }


                              </div>
                            </td>
                          </tr>
                        )) : <tr>
                          <td colSpan={4} className="px-6 py-16 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <p className="text-sm font-semibold text-[#1F2937]">No bookings for this date</p>
                              <p className="text-xs text-[#999999]">Try selecting a different date to see bookings.</p>
                            </div>
                          </td>
                        </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

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
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#999999]">
                  Booking details
                </p>
                <h3 className="mt-2 text-2xl font-bold text-[#1F2937]">
                  {getBookingCustomerName(selectedBooking)}
                </h3>
                <p className="mt-1 text-sm text-[#737373]">
                  {getBookingPackageName(selectedBooking)}
                </p>
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
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#999999]">
                  Customer
                </p>
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
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#999999]">
                  Booking
                </p>
                <div className="mt-3 space-y-2 text-sm text-[#1F2937]">
                  <p>
                    <span className="font-semibold text-[#737373]">Date:</span> {formatBookingDate(selectedBooking.eventDate)}
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
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#999999]">
                  Package
                </p>
                <div className="mt-3 space-y-2 text-sm text-[#1F2937]">
                  <p>
                    <span className="font-semibold text-[#737373]">Name:</span> {getBookingPackageName(selectedBooking)}
                  </p>
                  <p>
                    <span className="font-semibold text-[#737373]">Package price:</span> {selectedBooking.package && typeof selectedBooking.package === "object" && selectedBooking.package.price != null ? Number(selectedBooking.package.price).toLocaleString() : "-"}
                  </p>
                  <p>
                    <span className="font-semibold text-[#737373]">Capacity:</span> {selectedBooking.package && typeof selectedBooking.package === "object" && selectedBooking.package.capacity != null ? selectedBooking.package.capacity : selectedBooking.package && typeof selectedBooking.package === "object" && selectedBooking.package.guestLimit != null ? selectedBooking.package.guestLimit : "-"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#999999]">
                  Status
                </p>
                <div className="mt-3">
                  <span
                    className={`inline-flex rounded-md border px-3 py-1 text-sm font-semibold ${selectedBooking.status === "pending" || selectedBooking.status === "cancelled"
                      ? "border-[#8C8273] text-[#8C8273]"
                      : "border-green-400 bg-green-50 text-green-700"
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
  )
}
