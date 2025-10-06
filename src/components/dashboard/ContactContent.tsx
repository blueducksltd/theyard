/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import React, { useState } from "react";
import Modal from "../Modal";
// import Link from "next/link";

export default function ContactContent() {
  const [composeModal, setComposeModal] = React.useState<boolean>(false);
  const [contactModal, setContactModal] = React.useState<boolean>(false);
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

  const allSelected = bookings.length > 0 && bookings.every((b) => b.selected);

  return (
    <main className="flex-1 py-4 px-5 md:h-[600px] 2xl:h-[770px] overflow-y-auto">
      <section className="flex items-center justify-between border-[1px] border-[#E4E8E5] bg-[#FFFFFF] py-5 px-4 rounded-[4px]">
        <div className="flex flex-col gap-2">
          <h2 className="text-[#66655E] font-bold text-[32px] leading-10">
            Contacts
          </h2>

          <div className="flex items-center text-[#999999]">
            <p className="pr-2">200 phone number</p>
            {/*Divider*/}
            <div className="w-[1px] h-3 bg-[#C7CFC9] hidden md:block"></div>
            <p className="pl-2">50 emails</p>
          </div>
        </div>

        <div className="flex items-center gap-3 h-10 cursor-pointer">
          <div
            className="w-max h-10 items-center flex rounded2px border-[1px] border-[#999999] px-3 gap-2.5 group relative overflow-hidden"
            onClick={() => setComposeModal(true)}
          >
            <Image
              src={"/icons/messages.svg"}
              width={16}
              height={16}
              className="z-40"
              alt="Event Icon"
            />
            <p className="z-40 text-yard-primary text-[16px] leading-6 tracking-[0.5px]">
              Compose message
            </p>
            <div className="absolute top-0 left-0 bg-[#E4E8E5] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </div>
        </div>
      </section>

      {/*Content here */}
      <div className="w-full min-h-screen bg-gray-50 pt-5">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                      Name...
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                      Phone number
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                      Email address
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
                      <td className="px-6 py-4 text-sm font-semibold text-[#737373]">
                        Mrs The Yard
                      </td>
                      <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                        mrsdyard@gmail.com
                      </td>
                      <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                        +234 706283475
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/*Compose Message*/}
      <Modal isOpen={composeModal} useDefaultWidth>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Compose message
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setComposeModal(false)}
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
        {/*Form*/}
        <form className="w-full flex flex-col gap-4 mt-8">
          <div className="form-group flex flex-col md:flex-row items-start gap-6">
            <div className="w-full input-group flex flex-col gap-3">
              <label
                htmlFor="subject"
                className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
              >
                Enter Subject of message
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Enter Subject of message"
                className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
              />
            </div>
          </div>

          <div className="form-group flex flex-col md:flex-row items-start gap-6">
            <div className="w-full input-group flex flex-col gap-3">
              <label
                htmlFor="message"
                className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
              >
                Enter message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder=""
                className="w-full h-[147px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
              ></textarea>
            </div>
          </div>

          <div className="w-full flex items-center justify-between">
            <label
              htmlFor="all"
              className="flex gap-3 items-center rounded-[4px] py-3"
            >
              <input
                type="checkbox"
                id="all"
                value={"all"}
                name="role"
                className="radio radio-sm peer border-2 border-yard-primary checked:border-yard-dark-primary checked:text-yard-dark-primary"
              />
              <div>
                <h3 className="text-lg text-[#1A231C]">
                  Send to all customers
                </h3>
              </div>
            </label>

            <button
              type="button"
              role="button"
              className="flex items-center gap-1 cursor-pointer group relative"
              onClick={() => setContactModal(true)}
            >
              <Image
                src={"/icons/profileadd.svg"}
                width={16}
                height={16}
                alt="Profile Add Icon"
              />
              <span className="font-medium font-sen text-[16px] leading-6 tracking-[0.4px]">
                Select customers
              </span>
              <span className="yard-link-line bg-yard-primary"></span>
            </button>
          </div>

          <div className="w-full flex items-center gap-3">
            <button className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] cursor-pointer">
              <span className="z-40 font-sen">Cancel</span>
              <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>

            <button className="w-full flex justify-center cta-btn bg-yard-primary text-[#EEEEE6] group relative overflow-hidden rounded-[5px] cursor-pointer">
              <span className="z-40 font-sen">Send message</span>
              <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>
          </div>
        </form>
      </Modal>

      {/*Contact Modal*/}
      <Modal isOpen={contactModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Select customers
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setContactModal(false)}
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

        <div className="w-full h-[300px] border-[1px] border-[#BFBFBF] rounded2px mt-5 mb-2 overflow-y-scroll">
          <div className="w-full min-h-screen">
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
                          Phone number
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                          Email address
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
                            Mrs The Yard
                          </td>
                          <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                            mrsdyard@gmail.com
                          </td>
                          <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                            +234 706283475
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <label
          htmlFor="allinstead"
          className="flex gap-3 items-center rounded-[4px] py-3"
        >
          <input
            type="checkbox"
            id="allinstead"
            checked={allSelected}
            onChange={toggleSelectAll}
            value={"all"}
            name="role"
            className="radio radio-sm peer border-2 border-yard-primary checked:border-yard-dark-primary checked:text-yard-dark-primary"
          />
          <div>
            <h3 className="text-[16px] text-[#1A231C]">
              Send to all customers instead
            </h3>
          </div>
        </label>

        <div className="w-full flex items-center gap-3">
          <button
            className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] cursor-pointer"
            onClick={() => setContactModal(false)}
          >
            <span className="z-40 font-sen">Cancel</span>
            <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>

          <button className="w-full flex justify-center cta-btn bg-yard-primary text-[#EEEEE6] group relative overflow-hidden rounded-[5px] cursor-pointer">
            <span className="z-40 font-sen">Send message</span>
            <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>
        </div>
      </Modal>
    </main>
  );
}
