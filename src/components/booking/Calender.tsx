"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useMemo, useEffect } from "react";
import Modal from "../Modal";
import { useRouter } from "next/navigation";
import { IBooking } from "@/types/Booking";
import { getPackages } from "@/util";
import { IPackage } from "@/types/Package";
import { loadFromLS, saveToLS } from "@/util/helper";
import { toast } from "react-toastify";

// Type definitions
type BookingStatus = "available" | "unavailable" | "pending";

interface CalendarProps {
  initialDate?: Date;
  bookingData?: IBooking[];
  calenderWidth?: string;
  onDateClick?: (date: Date, bookings: IBooking[]) => void;
}

const BookingCalendar: React.FC<CalendarProps> = ({
  initialDate = new Date(),
  bookingData = [],
  onDateClick,
  calenderWidth = "w-[813px]",
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unavailableModal, setUnavailableModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState({});
  const router = useRouter();

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
    const bookings = bookingsByDate[dateKey];
    if (!bookings || bookings.length === 0) return "available";

    // Check if any booking is cancelled
    const hasCancelled = bookings.some((b) => b.status === "cancelled");

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

  const getStatusColor = (status: BookingStatus): string => {
    switch (status) {
      case "available":
        return "bg-[#33A510]";
      case "unavailable":
        return "bg-[#CA1919]";
      case "pending":
        return "bg-[#C2AC02]";
      default:
        return "bg-gray-300";
    }
  };

  const getDateKey = (day: number | null): string | null => {
    if (!day) return null;
    return `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
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
        // Navigate to pending bookings page with the date and bookings data
        const dateParam = clickedDate.toISOString().split("T")[0];
        const bookingIds = dayBookings.map((b) => b._id).join(",");
        return router.push(
          `/booking/pending?date=${dateParam}&bookings=${bookingIds}`,
        );
      default:
        const data = { date: clickedDate.toISOString() };
        saveToLS("booking", data);
        setIsModalOpen(true);
    }

    if (onDateClick) {
      onDateClick(clickedDate, dayBookings);
    }
  };

  const days = getDaysInMonth();

  const handleProcessPackage = () => {
    if (Object.entries(selectedPackage).length === 0) {
      toast.warning("Please select a package", { position: "bottom-right" });
      return;
    }

    const savedBookingDetails = loadFromLS("booking");
    savedBookingDetails["package"] = selectedPackage;
    console.log(savedBookingDetails);
    // return;
    saveToLS("booking", savedBookingDetails);
    router.push(`/booking/checkout`);
  };

  // Get packages
  useEffect(() => {
    (async () => {
      const response = await getPackages();
      if (response.success == true) {
        setPackages(response.data.packages);
      }
    })();
  }, []);

  return (
    <>
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

          <h2 className="text-[16px] md:text-2xl font-bold text-[#3C5040] leading-8">
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

            return (
              <div
                key={index}
                onClick={() => day && !pastDay && handleDateClick(day, status)}
                className={`relative h-20 flex items-center justify-center duration-10 rounded-sm group overflow-hidden ${
                  pastDay ? "cursor-not-allowed opacity-40" : "cursor-pointer"
                } ${todayDate ? "bg-[#C7CFC9]" : ""}`}
              >
                {day && (
                  <>
                    <div className="flex flex-col gap-2 items-center">
                      {status && !pastDay && (
                        <div
                          className={`w-2 h-2 z-40 rounded2px ${getStatusColor(status)}`}
                          aria-label={`Status: ${status}`}
                        />
                      )}
                      <button
                        disabled={pastDay}
                        className={`w-full h-full flex items-center justify-center rounded z-40 ${
                          todayDate
                            ? "text-white font-bold"
                            : pastDay
                              ? "text-gray-400"
                              : "text-black"
                        }`}
                        aria-label={`Select ${day}`}
                      >
                        {day}
                      </button>
                      {/*{bookingCount > 0 && !pastDay && (
                        <small className="text-yard-primary text-[10px] leading-[100%] tracking-[0.5px] italic font-medium z-40">
                          {bookingCount} booking{bookingCount !== 1 ? "s" : ""}
                        </small>
                      )}*/}
                      {!pastDay && (
                        <div
                          className={`absolute top-0 -left-0 h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0 ${
                            todayDate
                              ? "bg-[#3C5040] group-hover:w-full"
                              : "bg-yard-primary-active group-hover:w-full"
                          }`}
                        ></div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Modal isOpen={isModalOpen}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <div className="title flex flex-col items-end">
              <h1 className="font-playfair text-xl md:text-[28px] text-yard-primary font-bold leading-9 tracking-[-0.1px]">
                Select preferred package
              </h1>
              <img
                src={"/line.svg"}
                alt="Line"
                className="-mt-3 w-40 md:mr-0 md:w-52 "
              />
            </div>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setIsModalOpen(false)}
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
        <div className="w-full flex flex-col mt-8 md:my-5 md:ml-10 gap-5">
          {packages.map((pck) => (
            <label
              htmlFor={pck.name}
              key={pck.id as string}
              className="md:w-[554px] border-[1px] border-[#E4E8E5] px-3 py-4 md:px-5 md:py-6 flex items-start gap-3 rounded-sm"
            >
              <input
                id={pck.name}
                type="radio"
                onChange={() =>
                  setSelectedPackage({
                    id: pck.id,
                    name: pck.name,
                    price: pck.price,
                  })
                }
                className="radio radio-sm text-yard-primary mt-1 border-2"
                name="package"
              />
              <div>
                <h2 className="font-bold text-xl font-playfair">{pck.name}</h2>
                <p className="text-[#717068] text-sm">{pck.description}</p>
              </div>
            </label>
          ))}

          <label
            htmlFor="shutdown"
            className="md:w-[554px] border-[1px] border-[#E4E8E5] px-3 py-4 md:px-5 md:py-6 flex items-start gap-3 rounded-sm"
          >
            <input
              id="shutdown"
              type="radio"
              className="radio radio-sm text-yard-primary mt-1 border-2"
              onChange={() => setSelectedPackage("shutdown")}
              name="package"
            />
            <div>
              <h2 className="font-bold text-xl font-playfair">
                Special Custom Package
              </h2>
              <p className="text-[#8F4546] text-sm">Shut down the Yard!!!</p>
            </div>
          </label>

          <button
            onClick={() => handleProcessPackage()}
            className="w-full md:w-[554px] flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden cursor-pointer"
          >
            <span className="z-40">Select package</span>
            <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>
        </div>
      </Modal>

      <Modal isOpen={unavailableModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-end">
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setUnavailableModal(false)}
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
        <div className="w-full flex flex-col justify-center items-center mt-5 md:mt-8 md:my-5 gap-5">
          <div className="title flex flex-col items-end">
            <h1 className="font-playfair text-xl md:text-[28px] text-yard-red font-bold leading-9 tracking-[-0.1px]">
              Ouch! Spot Unavailable
            </h1>
            <img
              src={"/line.svg"}
              alt="Line"
              className="-mt-3 w-40 md:mr-0 md:w-38"
            />
          </div>
          <p className="text-[#5A5A53] leading-6">
            Please this day is not available
          </p>
          <button
            onClick={() => setUnavailableModal(false)}
            className="text-yard-primary font-medium font-sen cursor-pointer"
          >
            Please select another day
          </button>
        </div>
      </Modal>
    </>
  );
};

export default BookingCalendar;
