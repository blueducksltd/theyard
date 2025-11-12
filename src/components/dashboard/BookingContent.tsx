"use client";
import Image from "next/image";
import { confirmOrCancelBookings, getBookings } from "@/util";
import { useEffect, useState } from "react";
import moment from "moment";
import { ICustomer } from "@/types/Customer";
import { ISpace } from "@/types/Space";
import { IEvent } from "@/types/Event";
import { IPackage } from "@/types/Package";
import { toast } from "react-toastify";

interface IPageBooking {
  id: string;
  customer: ICustomer["id"];
  space: ISpace["id"];
  event: IEvent["id"];
  package: IPackage["id"];
  eventDate: Date;
  startTime: string;
  endTime: string;
  times: string[];
  status: "pending" | "confirmed" | "cancelled";
  totalPrice: number;
  selected: boolean;
  createdAt?: Date;
}

export default function BookingContent() {
  const [bookings, setBookings] = useState<IPageBooking[]>([]);
  const [allBookings, setAllBookings] = useState<IPageBooking[]>([]);
  const [allPending, setAllPending] = useState<IPageBooking[]>([]);
  const [allActive, setAllActive] = useState<IPageBooking[]>([]);
  const [allCancelled, setAllCancelled] = useState<IPageBooking[]>([]);
  const [allCompleted, setAllCompleted] = useState<IPageBooking[]>([]);
  const [allPendingToday, setAllPendingToday] = useState<number>(0);
  const [allActiveToday, setAllActiveToday] = useState<number>(0);
  const [allCancelledToday, setAllCancelledToday] = useState<number>(0);
  const [allBookingsToday, setAllBookingsToday] = useState<number>(0);
  const [section, setSection] = useState<string>("pending");

  const toggleSelect = (id: string) => {
    const selected = bookings.map((booking) =>
      booking.id === id ? { ...booking, selected: !booking.selected } : booking,
    );
    setBookings(selected);
  };

  const toggleSelectAll = () => {
    const allSelected = bookings.every((b) => b.selected);
    setBookings(
      bookings.map((booking) => ({ ...booking, selected: !allSelected })),
    );
  };

  const allSelected = bookings.length > 0 && bookings.every((b) => b.selected);

  const handleSection = (_section: string) => {
    setSection(_section);
    switch (_section) {
      case "active":
        setBookings(allActive);
        break;
      case "cancelled":
        setBookings(allCancelled);
        break;
      case "completed":
        setBookings(allCompleted);
        break;
      case "pending":
        setBookings(allPending);
        break;
      default:
        setBookings(allBookings);
    }
  };

  // Perform actions on bookings
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

  const fetchBookings = async () => {
    const [fetchBookings] = await Promise.all([getBookings()]);
    const initialData = fetchBookings.data.bookings.map(
      (booking: IPageBooking) => ({
        ...booking,
        selected: false,
      }),
    );

    const allPending = initialData.filter(
      (booking: IPageBooking) => booking.status === "pending",
    );
    const allActive = initialData.filter((booking: IPageBooking) => {
      const bookingDate = moment(booking.eventDate);
      const today = moment().startOf("day");
      return (
        (bookingDate.isAfter(today) || bookingDate.isSame(today)) &&
        booking.status === "confirmed"
      );
    });
    const allCancelled = initialData.filter(
      (booking: IPageBooking) => booking.status === "cancelled",
    );
    const allCompleted = initialData.filter((booking: IPageBooking) => {
      const bookingDate = moment(booking.eventDate);
      const today = moment().startOf("day");
      return bookingDate.isBefore(today);
    });

    const allCancelledToday = allCancelled.filter((booking: IPageBooking) => {
      const bookingDate = moment(booking.eventDate);
      const today = moment().startOf("day");
      return bookingDate.isSame(today) && booking.status === "cancelled";
    });

    const allPendingToday = allPending.filter((booking: IPageBooking) => {
      const bookingDate = moment(booking.eventDate);
      const today = moment().startOf("day");
      return bookingDate.isSame(today);
    });

    const allActiveToday = allActive.filter((booking: IPageBooking) => {
      const bookingDate = moment(booking.eventDate);
      const today = moment().startOf("day");
      return bookingDate.isSame(today) && booking.status === "confirmed";
    });

    const allBoookingToday = allActive.filter((booking: IPageBooking) => {
      const bookingDate = moment(booking.createdAt).format("YYYY/DD/MM");
      const today = moment().format("YYYY/DD/MM");
      return bookingDate == today;
    });

    // console.log(moment(initialData[4].createdAt).isSame(moment()));
    // nug7mcc8

    setAllBookings(initialData);
    setAllPending(allPending);
    setAllActive(allActive);
    setAllCancelled(allCancelled);
    setAllCompleted(allCompleted);
    setAllActiveToday(allActiveToday.length);
    setAllPendingToday(allPendingToday.length);
    setAllCancelledToday(allCancelledToday.length);
    setAllBookingsToday(allBoookingToday.length);

    // Set initialData
    setBookings(allPending);
  };

  useEffect(() => {
    (async () => {
      await fetchBookings();
    })();
  }, []);

  return (
    <main className="flex-1 py-4 md:h-[600px] 2xl:h-[770px] overflow-y-auto">
      <section className="flex flex-col gap-5">
        <div className="grid grid-cols-4 p-5 gap-5">
          {/*Single Container*/}
          <div
            className={`${section == "pending" ? "bg-[#E4E8E5]" : "bg-[#FFFFFF]"} px-4 py-5 rounded-sm border-[1px] border-[#C7CFC9] flex flex-col gap-5 cursor-pointer duration-700 hover:scale-105 hover:shadow-lg`}
            onClick={() => handleSection("pending")}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[52px] leading-9 text-yard-primary">
                {allPending.length}
              </h2>
              <p className="font-medium leading-[22px] tracking-[0.5px] text-[#999999]">
                {allPendingToday} today
              </p>
            </div>
            <p className="font-medium leading-[22px] tracking-[0.5px] text-[#737373]">
              Booking Request
            </p>
          </div>

          {/*Single Container*/}
          <div
            className={`${section == "active" ? "bg-[#E4E8E5]" : "bg-[#FFFFFF]"} px-4 py-5 rounded-sm border-[1px] border-[#C7CFC9] flex flex-col gap-5 cursor-pointer duration-700 hover:scale-105 hover:shadow-lg`}
            onClick={() => handleSection("active")}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[52px] leading-9 text-yard-primary">
                {allActive.length}
              </h2>
              <p className="font-medium leading-[22px] tracking-[0.5px] text-[#999999]">
                {allActiveToday} today
              </p>
            </div>
            <p className="font-medium leading-[22px] tracking-[0.5px] text-[#737373]">
              Active Bookings
            </p>
          </div>

          {/*Single Container*/}
          <div
            className={`${section == "cancelled" ? "bg-[#E4E8E5]" : "bg-[#FFFFFF]"} px-4 py-5 rounded-sm border-[1px] border-[#C7CFC9] flex flex-col gap-5 cursor-pointer duration-700 hover:scale-105 hover:shadow-lg`}
            onClick={() => handleSection("cancelled")}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[52px] leading-9 text-yard-primary">
                {allCancelled.length}
              </h2>
              <p className="font-medium leading-[22px] tracking-[0.5px] text-[#999999]">
                {allCancelledToday} today
              </p>
            </div>
            <p className="font-medium leading-[22px] tracking-[0.5px] text-[#737373]">
              Cancelled Bookings
            </p>
          </div>

          {/*Single Container*/}
          <div
            className={`${section == "all" ? "bg-[#E4E8E5]" : "bg-[#FFFFFF]"} px-4 py-5 rounded-sm border-[1px] border-[#C7CFC9] flex flex-col gap-5 cursor-pointer duration-700 hover:scale-105 hover:shadow-lg`}
            onClick={() => handleSection("all")}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[52px] leading-9 text-yard-primary">
                {allBookings.length}
              </h2>
              <p className="font-medium leading-[22px] tracking-[0.5px] text-[#999999]">
                {allBookingsToday} today
              </p>
            </div>
            <p className="font-medium leading-[22px] tracking-[0.5px] text-[#737373]">
              All Bookings
            </p>
          </div>
        </div>
      </section>

      <div className="w-full min-h-screen bg-gray-50 p-5">
        <div className="mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                      Name...
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                      Space
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                      Package
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                      Price (N)
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                      Total (N)
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
                  {bookings.map((booking, index) => (
                    <tr
                      key={booking.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={booking.selected}
                          onChange={() => toggleSelect(booking.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#737373]">
                        {booking.event?.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                        {booking.space.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                        {booking.package.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                        {moment(booking.eventDate).format("d/MM/YYYY")}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                        {booking.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                        {booking.startTime && booking.endTime
                          ? moment(booking.endTime, "HH:mm").diff(
                              moment(booking.startTime, "HH:mm"),
                              "hours",
                              true,
                            )
                          : 0}{" "}
                        hr(s)
                      </td>
                      <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                        {booking.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`p-1.5 rounded-md text-sm border ${
                            booking.status === "pending" ||
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
                          <button
                            onClick={() =>
                              handleBooking(booking.id, "confirmed")
                            }
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
                            onClick={() =>
                              handleBooking(booking.id, "cancelled")
                            }
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
