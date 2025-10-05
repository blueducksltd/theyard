/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import React, { useState } from "react";
import Modal from "../Modal";

export default function UserContent() {
  const [inviteModal, setInviteModal] = React.useState<boolean>(false);
  const [sentModal, setSentModal] = React.useState<boolean>(false);

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
    <main className="flex-1 py-4 px-5 md:h-[600px] 2xl:h-[770px] overflow-y-auto">
      <section className="flex items-center justify-between border-[1px] border-[#E4E8E5] bg-[#FFFFFF] py-5 px-4 rounded-[4px]">
        <div className="flex flex-col gap-2">
          <h2 className="text-[#66655E] font-bold text-[32px] leading-10">
            Administrators
          </h2>
        </div>

        <div className="flex items-center gap-3 h-10 cursor-pointer">
          <div
            className="w-max h-10 items-center flex rounded2px border-[1px] border-[#999999] px-3 gap-2.5 group relative overflow-hidden"
            onClick={() => setInviteModal(true)}
          >
            <Image
              src={"/icons/add.svg"}
              width={16}
              height={16}
              className="z-40"
              alt="Event Icon"
            />
            <p className="z-40 text-yard-primary text-[16px] leading-6 tracking-[0.5px]">
              Add member
            </p>
            <div className="absolute top-0 left-0 bg-[#E4E8E5] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </div>
        </div>
      </section>

      <div className="w-full min-h-screen bg-gray-50 pt-5">
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
                      Admin name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                      Role
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
                        Mrs The Yard
                      </td>
                      <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                        mrsdyard@gmail.com
                      </td>
                      <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                        Admin
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
                        <div className="dropdown dropdown-bottom dropdown-end">
                          <div
                            tabIndex={0}
                            role="button"
                            className="w-9 h-9 p-2 bg-[#EDF0EE] flex items-center justify-center group relative overflow-hidden cursor-pointer"
                          >
                            <Image
                              src={"/icons/more.svg"}
                              width={16}
                              height={16}
                              className="z-40"
                              alt="More Icon"
                            />
                            <div className="absolute top-0 left-0 bg-[#E4E8E5] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
                          </div>
                          {/*Dropdown content*/}
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-white rounded-lg z-1 w-32 p-2 shadow-sm mt-2"
                          >
                            <li className="text-[#595959] text-sm leading-[22px] tracking-[0.5px] duration-1000 hover:bg-[#E4E8E5] rounded">
                              <button>Make admin</button>
                            </li>
                            <li className="text-[#A44B4B] text-sm leading-[22px] tracking-[0.5px] duration-1000 hover:bg-[#E4E8E5] rounded">
                              <button>Remove</button>
                            </li>
                          </ul>
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

      {/*Modals*/}
      <Modal isOpen={inviteModal} useDefaultWidth>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Invite member
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setInviteModal(false)}
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
        <hr className="w-full h-2 text-gray-200 my-5" />

        {/*Form*/}
        <form className="w-full flex flex-col gap-5">
          <div className="form-group flex flex-col md:flex-row items-start gap-6">
            <div className="w-full input-group flex flex-col gap-3">
              <label
                htmlFor="fullname"
                className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
              >
                Enter first and last name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                placeholder="Enter first and last name"
                className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
              />
            </div>
          </div>

          <div className="form-group flex flex-col md:flex-row items-start gap-6">
            <div className="w-full input-group flex flex-col gap-3">
              <label
                htmlFor="email"
                className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
              >
                Enter your email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
              />
            </div>
          </div>

          <div className="w-full input-group flex flex-col gap-1">
            <label
              htmlFor="publish"
              className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
            >
              Choose the role
            </label>
            <div className="flex items-center gap-5">
              <label
                htmlFor="manager"
                className="w-full md:h-[91px] flex gap-3 items-start rounded-[4px] p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 hover:border-yard-dark-primary hover:bg-[#EDF0EE] has-[:checked]:bg-[#EDF0EE] has-[:checked]:border-yard-dark-primary"
              >
                <input
                  type="radio"
                  id="manager"
                  value={"manager"}
                  defaultChecked={true}
                  name="role"
                  className="mt-3 radio radio-sm peer border-2 border-yard-primary checked:border-yard-dark-primary checked:text-yard-dark-primary"
                />
                <div>
                  <h3 className="font-bold text-xl font-playfair text-[#1A231C]">
                    Manager
                  </h3>
                  <p className="text-sm text-[#717068]">
                    Manages all activities, also the activities of managers
                  </p>
                </div>
              </label>
              <label
                htmlFor="admin"
                className="w-full md:h-[91px] flex gap-3 items-start rounded-[4px] p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 hover:border-yard-dark-primary hover:bg-[#EDF0EE] has-[:checked]:bg-[#EDF0EE] has-[:checked]:border-yard-dark-primary"
              >
                <input
                  type="radio"
                  id="admin"
                  value={"admin"}
                  name="role"
                  className="mt-3 radio radio-sm peer border-2 border-yard-primary checked:border-yard-dark-primary checked:text-yard-dark-primary"
                />
                <div>
                  <h3 className="font-bold text-xl font-playfair text-[#1A231C]">
                    Admin
                  </h3>
                  <p className="text-sm text-[#717068]">
                    Manages all activities but under the control of admin
                  </p>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden rounded-[5px] mt-3"
          >
            <span className="z-40">Send invitation</span>
            <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>
        </form>
      </Modal>

      {/*Sent Modal*/}
      <Modal isOpen={sentModal} useDefaultWidth>
        <hr className="w-full h-2 text-gray-200 my-5" />

        <div className="w-full flex items-center gap-5">
          <div className="w-full md:h-[91px] flex gap-3 items-start rounded-[4px] p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 hover:border-yard-dark-primary hover:bg-[#EDF0EE]">
            <div>
              <h3 className="font-bold text-xl font-playfair text-[#1A231C]">
                Invitation sent
              </h3>
              <p className="text-sm text-[#717068]">
                Your invite has been successfully sent via email to the
                receipient
              </p>
            </div>
          </div>
        </div>

        <button
          className="w-full flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden rounded-[5px] mt-3"
          onClick={() => setSentModal(false)}
        >
          <span className="z-40">Okay</span>
          <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
        </button>
      </Modal>
    </main>
  );
}
