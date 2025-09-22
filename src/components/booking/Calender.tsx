"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import Modal from "../Modal";
import Link from "next/link";

// Type definitions
type BookingStatus = "available" | "unavailable" | "pending";

interface BookingData {
  [dateKey: string]: BookingStatus;
}

interface CalendarProps {
  initialDate?: Date;
  bookingData?: BookingData;
  onDateClick?: (date: Date) => void;
}

const BookingCalendar: React.FC<CalendarProps> = ({
  initialDate = new Date(2025, 8),
  bookingData,
  onDateClick,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // I will replace this with the actual data
  const defaultBookingStatus: BookingData = {
    "2025-8-1": "available",
    "2025-8-2": "available",
    "2025-8-3": "available",
    "2025-8-4": "available",
    "2025-8-5": "available",
    "2025-8-6": "unavailable",
    "2025-8-7": "available",
    "2025-8-8": "available",
    "2025-8-9": "available",
    "2025-8-10": "available",
    "2025-8-11": "available",
    "2025-8-12": "unavailable",
    "2025-8-13": "unavailable",
    "2025-8-14": "unavailable",
    "2025-8-15": "unavailable",
    "2025-8-16": "available",
    "2025-8-17": "pending",
    "2025-8-18": "available",
    "2025-8-19": "pending",
    "2025-8-20": "available",
    "2025-8-21": "available",
    "2025-8-22": "available",
    "2025-8-23": "available",
    "2025-8-24": "available",
    "2025-8-25": "available",
    "2025-8-26": "available",
    "2025-8-27": "pending",
    "2025-8-28": "available",
    "2025-8-29": "pending",
    "2025-8-30": "pending",
    "2025-8-31": "available",
  };

  const bookingStatus = bookingData || defaultBookingStatus;

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
        return "bg-yellow-500";
      default:
        return "bg-[#C2AC02]";
    }
  };

  const getDateKey = (day: number | null): string | null => {
    if (!day) return null;
    return `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
  };

  const handleDateClick = (day: number): void => {
    setIsModalOpen(true);
    console.log("ddd");
    if (onDateClick) {
      const clickedDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day,
      );
      onDateClick(clickedDate);
    }
  };

  const days = getDaysInMonth();

  return (
    <>
      <div className="w-full md:w-[813px] p-6 rounded-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Previous month"
          >
            <img
              src={"/icons/arrow-left.svg"}
              alt="arrow icon"
              className="w-5 h-5"
            />
          </button>

          <h2 className="text-2xl font-bold text-[#3C5040] leading-8">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Next month"
          >
            <img
              src={"/icons/arrow-right.svg"}
              alt="arrow icon"
              className="w-5 h-5"
            />
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
            const status = dateKey ? bookingStatus[dateKey] : null;

            return (
              <div
                key={index}
                className="relative h-20 flex items-center justify-center duration-1000 hover:bg-yard-primary-active transition-colors rounded-sm"
              >
                {day && (
                  <>
                    <div
                      className="flex flex-col gap-2 items-center"
                      onClick={() => handleDateClick(day)}
                    >
                      {status && (
                        <div
                          className={`w-2 h-2 ${getStatusColor(status)}`}
                          aria-label={`Status: ${status}`}
                        />
                      )}
                      <button
                        className="w-full h-full flex items-center justify-center text-black rounded"
                        aria-label={`Select ${day}`}
                      >
                        {day}
                      </button>
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
        <div className="w-full flex flex-col mt-8 md:m-12 gap-5">
          <div className="md:w-[554px] border-[1px] border-[#E4E8E5] px-3 py-4 md:px-5 md:py-6 flex items-start gap-3 rounded-sm">
            <input type="radio" className="mt-2" />
            <div>
              <h2 className="font-bold text-xl font-playfair">
                Picnic Package
              </h2>
              <p className="text-[#717068] text-sm">
                Perfect for casual gatherings or date days.
              </p>
            </div>
          </div>

          <div className="md:w-[554px] border-[1px] border-[#E4E8E5] px-3 py-4 md:px-5 md:py-6 flex items-start gap-3 rounded-sm">
            <input type="radio" className="mt-2" />
            <div>
              <h2 className="font-bold text-xl font-playfair">
                Intimate Event Package
              </h2>
              <p className="text-[#717068] text-sm">
                Ideal for birthdays, proposals, or family celebrations.
              </p>
            </div>
          </div>

          <div className="md:w-[554px] border-[1px] border-[#E4E8E5] px-3 py-4 md:px-5 md:py-6 flex items-start gap-3 rounded-sm">
            <input type="radio" className="mt-2" />
            <div>
              <h2 className="font-bold text-xl font-playfair">
                Full Party Package
              </h2>
              <p className="text-[#717068] text-sm">
                All features of Picnic + Intimate Event. Perfect for larger
                celebrations.
              </p>
            </div>
          </div>

          <div className="md:w-[554px] border-[1px] border-[#E4E8E5] px-3 py-4 md:px-5 md:py-6 flex items-start gap-3 rounded-sm">
            <input type="radio" className="mt-2" />
            <div>
              <h2 className="font-bold text-xl font-playfair">
                Special Custom Package
              </h2>
              <p className="text-[#8F4546] text-sm">Shut down the Yard!!!</p>
            </div>
          </div>
          <Link
            href={"#"}
            className="w-full md:w-[554px] flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden"
          >
            <span className="z-40">Select package</span>
            <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </Link>
        </div>
      </Modal>
    </>
  );
};

export default BookingCalendar;
