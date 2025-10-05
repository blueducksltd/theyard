"use client";
// import Link from "next/link";
// import Image from "next/image";

import Image from "next/image";
import { useState } from "react";

export default function BookingContent() {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      name: "Frank Edego",
      space: "Game",
      package: "Picnic Pack...",
      date: "12 Oct 2025",
      price: 10000,
      duration: "2hrs 30mins",
      total: 30000,
      status: "Pending",
      selected: false,
    },
    {
      id: 2,
      name: "Frank Edego",
      space: "Game",
      package: "Picnic Pack...",
      date: "12 Oct 2025",
      price: 10000,
      duration: "2hrs 30mins",
      total: 30000,
      status: "Pending",
      selected: false,
    },
    {
      id: 3,
      name: "Frank Edego",
      space: "Game",
      package: "Picnic Pack...",
      date: "12 Oct 2025",
      price: 10000,
      duration: "2hrs 30mins",
      total: 30000,
      status: "Pending",
      selected: false,
    },
    {
      id: 4,
      name: "Frank Edego",
      space: "Game",
      package: "Picnic Pack...",
      date: "12 Oct 2025",
      price: 10000,
      duration: "2hrs 30mins",
      total: 30000,
      status: "Pending",
      selected: false,
    },
    {
      id: 5,
      name: "Frank Edego",
      space: "Game",
      package: "Picnic Pack...",
      date: "12 Oct 2025",
      price: 10000,
      duration: "2hrs 30mins",
      total: 30000,
      status: "Pending",
      selected: false,
    },
    {
      id: 6,
      name: "Frank Edego",
      space: "Game",
      package: "Picnic Pack...",
      date: "12 Oct 2025",
      price: 10000,
      duration: "2hrs 30mins",
      total: 30000,
      status: "Pending",
      selected: false,
    },
    {
      id: 7,
      name: "Frank Edego",
      space: "Game",
      package: "Picnic Pack...",
      date: "12 Oct 2025",
      price: 10000,
      duration: "2hrs 30mins",
      total: 30000,
      status: "Pending",
      selected: false,
    },
    {
      id: 8,
      name: "Frank Edego",
      space: "Game",
      package: "Picnic Pack...",
      date: "12 Oct 2025",
      price: 10000,
      duration: "2hrs 30mins",
      total: 30000,
      status: "Pending",
      selected: false,
    },
  ]);

  const toggleSelect = (id: number) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === id
          ? { ...booking, selected: !booking.selected }
          : booking,
      ),
    );
  };

  const toggleSelectAll = () => {
    const allSelected = bookings.every((b) => b.selected);
    setBookings(
      bookings.map((booking) => ({ ...booking, selected: !allSelected })),
    );
  };

  const deleteBooking = (id: number) => {
    setBookings(bookings.filter((booking) => booking.id !== id));
  };

  const approveBooking = (id: number) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === id ? { ...booking, status: "Approved" } : booking,
      ),
    );
  };

  const allSelected = bookings.length > 0 && bookings.every((b) => b.selected);

  return (
    <main className="flex-1 py-4 md:h-[600px] 2xl:h-[770px] overflow-y-auto">
      <section className="flex flex-col gap-5">
        <div className="grid grid-cols-4 p-5 gap-5">
          {/*Single Container*/}
          <div className="bg-[#E4E8E5] px-4 py-5 rounded-sm border-[1px] border-[#C7CFC9] flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[52px] leading-9 text-[#66655E]">
                16
              </h2>
              <p className="font-medium leading-[22px] tracking-[0.5px] text-[#999999]">
                12 today
              </p>
            </div>
            <p className="font-medium leading-[22px] tracking-[0.5px] text-[#737373]">
              Pending Bookings
            </p>
          </div>

          {/*Single Container*/}
          <div className="bg-[#FFFFFF] px-4 py-5 rounded-sm border-[1px] border-[#C7CFC9] flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[52px] leading-9 text-[#66655E]">
                30
              </h2>
              <p className="font-medium leading-[22px] tracking-[0.5px] text-[#999999]">
                20 today
              </p>
            </div>
            <p className="font-medium leading-[22px] tracking-[0.5px] text-[#737373]">
              Active Bookings
            </p>
          </div>

          {/*Single Container*/}
          <div className="bg-[#FFFFFF] px-4 py-5 rounded-sm border-[1px] border-[#C7CFC9] flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[52px] leading-9 text-[#66655E]">
                20
              </h2>
              <p className="font-medium leading-[22px] tracking-[0.5px] text-[#999999]">
                5 today
              </p>
            </div>
            <p className="font-medium leading-[22px] tracking-[0.5px] text-[#737373]">
              Cancelled Bookings
            </p>
          </div>

          {/*Single Container*/}
          <div className="bg-[#FFFFFF] px-4 py-5 rounded-sm border-[1px] border-[#C7CFC9] flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[52px] leading-9 text-[#66655E]">
                10
              </h2>
              <p className="font-medium leading-[22px] tracking-[0.5px] text-[#999999]">
                2 today
              </p>
            </div>
            <p className="font-medium leading-[22px] tracking-[0.5px] text-[#737373]">
              Past Bookings
            </p>
          </div>
        </div>
      </section>

      <div className="w-full min-h-screen bg-gray-50 p-5">
        <div className="max-w-7xl mx-auto">
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
                        {booking.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                        {booking.space}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                        {booking.package}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                        {booking.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                        {booking.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                        {booking.duration}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                        {booking.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`p-1.5 rounded-md text-sm border ${
                            booking.status === "Pending"
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
                            onClick={() => approveBooking(booking.id)}
                            className="p-2 hover:bg-green-50 rounded transition-colors bg-[#EDF0EE]"
                            aria-label="Approve booking"
                          >
                            <Image
                              src={"/icons/tick.svg"}
                              width={16}
                              height={16}
                              alt="Tick Icon"
                            />
                          </button>
                          <button
                            onClick={() => deleteBooking(booking.id)}
                            className="p-2 hover:bg-red-50 rounded transition-colors bg-[#EDF0EE]"
                            aria-label="Delete booking"
                          >
                            <Image
                              src={"/icons/close.svg"}
                              width={16}
                              height={16}
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
