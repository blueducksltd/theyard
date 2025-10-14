"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ISpace } from "@/types/Space";
import { createBookings, getSpaces } from "@/util";
import { loadFromLS } from "@/util/helper";
import moment from "moment";
import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [spaces, setSpaces] = useState<ISpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<ISpace | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(true);
  const [image, setImage] = useState<File | undefined>();
  const savedBookingDetails = loadFromLS("booking");
  const [inputs] = useState<Record<string, any>>({});
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<string>("0");

  const handleSubmit = async () => {
    const [hours, minutes] = startTime?.split(":") || ["0", "0"];

    // Create booking datetime
    const bookingDateTime = new Date(inputs.date);
    bookingDateTime.setHours(+hours, +minutes, 0, 0);

    const now = new Date();

    // Check if the date is in the past
    const bookingDateOnly = new Date(inputs.date).setHours(0, 0, 0, 0);
    const todayDateOnly = new Date().setHours(0, 0, 0, 0);

    if (bookingDateOnly < todayDateOnly) {
      toast.error("Booking date cannot be in the past", {
        position: "bottom-right",
      });
      return;
    }

    // Helper function to format time in 12-hour format
    const formatTime = (hour: number) => {
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:00 ${period}`;
    };

    // If it's today, ensure booking is at least the next full hour
    if (bookingDateOnly === todayDateOnly) {
      const currentHour = now.getHours();
      const bookingHour = +hours;

      // User must book at least from the next full hour
      if (bookingHour <= currentHour) {
        const nextAvailableHour = currentHour + 1;
        toast.error(
          `Bookings for today must be made at least 1 hour in advance (${formatTime(nextAvailableHour)} onwards)`,
          {
            position: "bottom-right",
          },
        );
        return;
      }
    }

    if (inputs.date == null) {
      inputs.date = savedBookingDetails.date;
    }

    inputs.packageId = savedBookingDetails.package.id;
    inputs.startTime = startTime || "";
    inputs.endTime = endTime || "";
    inputs.public = isPublishing ? "true" : "false";
    inputs.images = image;
    // inputs.eventType = "weddings";

    if (Object.keys(inputs).length < 13) {
      toast.error(`Please fill out all fields`, {
        position: "bottom-right",
      });
      return;
    }

    const formdata = new FormData();
    Object.entries(inputs).map(([key, value]) => {
      formdata.append(key, value);
    });

    const toastId = toast.loading("Booking your event, please wait...", {
      position: "bottom-right",
    });

    // Create Booking
    try {
      const response = await createBookings(formdata);
      if (response.success == true) {
        // Handle success
        toast.success(`${response.message}`, { position: "bottom-right" });
      } else {
        toast.warning(`${response.message}`, { position: "bottom-right" });
      }
    } catch (error) {
      toast.error(
        `An error occurred while creating your booking. Please try again later.`,
        {
          position: "bottom-right",
        },
      );
    }
    toast.dismiss(toastId);
  };

  const handleSpace = (e: ChangeEvent<HTMLSelectElement>) => {
    const _selectedSpace = spaces.find((space) => space.id === e.target.value);
    setSelectedSpace(_selectedSpace || null);
    inputs.spaceId = e.target.value;

    // Update Total Price
    handleTotalPrice(
      endTime || "0.00",
      startTime || "0.00",
      _selectedSpace?.pricePerHour || 0,
    );
  };

  const handleTotalPrice = (
    _endTime: string,
    _startTime: string,
    _spacePrice: number,
  ) => {
    setTotalPrice(
      Intl.NumberFormat().format(
        moment(_endTime, "HH:mm").diff(
          moment(_startTime, "HH:mm"),
          "hours",
          true,
        ) *
          (_spacePrice ?? 0) +
          savedBookingDetails.package.price,
      ),
    );
  };

  useEffect(() => {
    toast.info("Bookings made today must be made at least 1 hour in advance", {
      position: "bottom-right",
    });
  }, []);

  useEffect(() => {
    (async () => {
      const response = await getSpaces();
      if (response.success == true) {
        setSpaces(response.data.spaces);
      }
    })();
  }, []);

  return (
    <main className={"w-full h-max bg-yard-white"}>
      <Navbar />

      {/*Content */}
      <section className={"py-20 px-4 md:px-16 w-full"}>
        <main className="pt-13 md:my-4 md:py-16">
          <header className="flex flex-col gap-5 md:flex-row justify-between md:items-center">
            <Link
              href={"/booking"}
              className="group relative text-[#55544E] font-medium flex items-center gap-2 font-sen w-max"
            >
              <img src={"/icons/arrow-left.svg"} alt="Back" className="w-5" />
              Back to calendar
              <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
            </Link>
          </header>

          <div className="flex flex-col items-start gap-4 mt-10">
            <div className="title flex flex-col items-end">
              <h1 className="text-[32px]">Booking form</h1>
              <img src={"/line.svg"} alt="Line" className="-mt-3 w-48" />
            </div>
          </div>

          <section className="w-full flex flex-col md:flex-row items-start my-5 md:my-4 gap-14 md:gap-20 flex-1">
            <form className="w-full md:w-[656px] flex flex-col gap-7 flex-1">
              <div className="form-group flex flex-col md:flex-row items-start gap-6">
                <div className="input-group w-full flex flex-col gap-3">
                  <label
                    htmlFor="firstname"
                    className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                  >
                    Enter your first name
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      (inputs.firstName = e.target.value)
                    }
                    placeholder="Enter your first name"
                    className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  />
                </div>

                <div className="input-group w-full flex flex-col gap-3">
                  <label
                    htmlFor="lastname"
                    className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                  >
                    Enter your last name
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      (inputs.lastName = e.target.value)
                    }
                    placeholder="Enter your last name"
                    className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  />
                </div>
              </div>

              <div className="form-group flex flex-col md:flex-row items-start gap-6">
                <div className="input-group w-full flex flex-col gap-3">
                  <label
                    htmlFor="phone"
                    className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                  >
                    Enter your phone number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      (inputs.phone = e.target.value)
                    }
                    placeholder="Enter your phone number"
                    className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  />
                </div>

                <div className="input-group w-full flex flex-col gap-3">
                  <label
                    htmlFor="email"
                    className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                  >
                    Enter your email address
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      (inputs.email = e.target.value)
                    }
                    placeholder="Enter your email address"
                    className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  />
                </div>
              </div>

              <div className="form-group flex flex-col md:flex-row items-start gap-6">
                <div className="input-group w-full flex flex-col gap-3">
                  <label
                    htmlFor="date"
                    className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                  >
                    Select a date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    defaultValue={new Date(
                      savedBookingDetails.date,
                    ).toLocaleDateString("en-CA")}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      (inputs.date = e.target.value)
                    }
                    placeholder="Select a date"
                    className="md:h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  />
                </div>

                <div className="input-group w-full flex flex-col gap-3">
                  <label
                    htmlFor="time-from"
                    className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                  >
                    Select time
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      id="time-from"
                      name="time-from"
                      onBlur={() => {
                        handleTotalPrice(
                          endTime || "0.00",
                          startTime || "0.00",
                          selectedSpace?.pricePerHour || 0,
                        );
                      }}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setStartTime(e.target.value);
                      }}
                      placeholder="Select time"
                      className="w-full md:h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                    />

                    <p className="text-[#1A1A1A] text-[16px]">to</p>

                    <input
                      type="time"
                      id="time-to"
                      name="time-to"
                      onBlur={() => {
                        handleTotalPrice(
                          endTime || "0.00",
                          startTime || "0.00",
                          selectedSpace?.pricePerHour || 0,
                        );
                      }}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setEndTime(e.target.value);
                      }}
                      placeholder="Select time"
                      className="w-full md:h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group flex flex-col md:flex-row items-start gap-6">
                <div className="w-full input-group flex flex-col gap-3">
                  <label
                    htmlFor="space"
                    className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                  >
                    Select a space
                  </label>
                  <select
                    id="space"
                    name="space"
                    onChange={(e) => handleSpace(e)}
                    className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  >
                    <option value="" disabled selected>
                      Select a space
                    </option>
                    {spaces.map((space) => (
                      <option key={space.id} value={space.id}>
                        {space.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group flex flex-col md:flex-row items-start gap-6">
                <div className="w-full input-group flex flex-col gap-3">
                  <label
                    htmlFor="title"
                    className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                  >
                    Enter the title of the event
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      (inputs.eventTitle = e.target.value)
                    }
                    placeholder="Enter the title of the event"
                    className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  />
                </div>
              </div>

              <div className="form-group flex flex-col md:flex-row items-start gap-6">
                <div className="w-full input-group flex flex-col gap-3">
                  <label
                    htmlFor="desc"
                    className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                  >
                    Enter event description
                  </label>
                  <textarea
                    id="desc"
                    name="desc"
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      (inputs.eventDescription = e.target.value)
                    }
                    placeholder="Enter event description"
                    className="w-full h-[147px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  ></textarea>
                </div>
              </div>

              <div className="form-group flex flex-col md:flex-row items-start gap-6">
                {image == undefined ? (
                  <label htmlFor="image" className="w-full">
                    <div className="flex flex-col h-[213px] items-center justify-center border-[1px] border-dashed border-[#BFBFBF] py-3 px-5 cursor-pointer rounded2px">
                      <Image
                        src={"/icons/upload.svg"}
                        width={18}
                        height={18}
                        alt="Upload Icon"
                      />
                      <p className="w-[126px] text-xs text-[#999999] text-center leading-5 tracking-[0.5px] mt-4 mb-1">
                        Choose an image
                        {/*or drag &amp; drop it here*/}
                      </p>

                      <p className="w-[126px] text-[10px] text-[#BFBFBF] text-center leading-5 tracking-[0.5px]">
                        JPEG &amp; PNG up to 10mb
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => setImage(e.target.files?.[0])}
                      id="image"
                      className="hidden"
                    />
                  </label>
                ) : (
                  <label
                    htmlFor="image"
                    className="w-full h-[213px] bg-center bg-cover rounded2px cursor-pointer"
                    title="Change Image"
                    style={{
                      backgroundImage: `url(${URL.createObjectURL(image)})`,
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*,video/*"
                      size={10}
                      onChange={(e) => setImage(e.target.files?.[0])}
                      id="image"
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="form-group flex flex-col md:flex-row items-start gap-6">
                <div className="w-full input-group flex flex-col gap-3">
                  <label
                    htmlFor="publish"
                    className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                  >
                    Would you like us to publish this event on our site?
                  </label>
                  <div className="flex items-center gap-5">
                    <label
                      htmlFor="yes"
                      className="w-[209px] md:h-[91px] flex gap-3 items-start rounded-[4px] p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 hover:border-yard-dark-primary hover:bg-[#EDF0EE] has-[:checked]:bg-[#EDF0EE] has-[:checked]:border-yard-dark-primary"
                    >
                      <input
                        type="radio"
                        id="yes"
                        value={"yes"}
                        defaultChecked={true}
                        onChange={() => setIsPublishing(true)}
                        name="publish"
                        className="mt-3 radio radio-lg peer border-2 border-yard-primary checked:border-yard-dark-primary checked:text-yard-dark-primary"
                      />
                      <div>
                        <h3 className="font-bold text-xl font-playfair text-[#1A231C]">
                          Yes
                        </h3>
                        <p className="text-sm text-[#717068]">
                          I would love it to be displayed on your site.
                        </p>
                      </div>
                    </label>
                    <label
                      htmlFor="no"
                      className="w-[209px] md:h-[91px] flex gap-3 items-start rounded-[4px] p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 hover:border-yard-dark-primary hover:bg-[#EDF0EE] has-[:checked]:bg-[#EDF0EE] has-[:checked]:border-yard-dark-primary"
                    >
                      <input
                        type="radio"
                        id="no"
                        value={"no"}
                        onChange={() => setIsPublishing(false)}
                        name="publish"
                        className="mt-3 radio radio-lg peer border-2 border-yard-primary checked:border-yard-dark-primary checked:text-yard-dark-primary"
                      />
                      <div>
                        <h3 className="font-bold text-xl font-playfair text-[#1A231C]">
                          No
                        </h3>
                        <p className="text-sm text-[#717068]">
                          I would love to keep my event private.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </form>

            {/*Divider*/}
            <div className="w-[1px] h-[917px] bg-[#C7CFC9] hidden md:block"></div>

            <div className="w-full md:w-[376] h-max shadow-xl">
              <h3 className="bg-yard-primary-active rounded2px font-bold text-xl leading-[28px] text-[#2D3C30] font-playfair py-5 px-6">
                Booking Summary
              </h3>
              <div className="p-5 flex flex-col gap-4">
                <div className="w-full flex justify-between">
                  <p className="leading-6 tracking-[0.5px] text-[#717068]">
                    Package
                  </p>
                  <p className="leading-6 tracking-[0.5px] text-[#1A231C]">
                    {savedBookingDetails.package.name}
                  </p>
                </div>

                <div className="w-full flex justify-between">
                  <p className="leading-6 tracking-[0.5px] text-[#717068]">
                    Space
                  </p>
                  <p className="leading-6 tracking-[0.5px] text-[#1A231C]">
                    {selectedSpace?.name}
                  </p>
                </div>

                <div className="w-full flex justify-between">
                  <p className="leading-6 tracking-[0.5px] text-[#717068]">
                    Event Date
                  </p>
                  <p className="leading-6 tracking-[0.5px] text-[#1A231C]">
                    {new Date(savedBookingDetails.date).toLocaleDateString()}
                    {/*{moment(savedBookingDetails.date).format("d/MM/YYYY")}*/}
                  </p>
                </div>

                <div className="w-full flex justify-between">
                  <p className="leading-6 tracking-[0.5px] text-[#717068]">
                    Event time
                  </p>
                  <p className="leading-6 tracking-[0.5px] text-[#1A231C]">
                    {startTime} - {endTime}
                  </p>
                </div>

                <div className="w-full flex justify-between">
                  <p className="leading-6 tracking-[0.5px] text-[#717068]">
                    Publish Event
                  </p>
                  <p className="leading-6 tracking-[0.5px] text-[#1A231C]">
                    {isPublishing ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <div className="p-5 flex flex-col gap-4 mt-4">
                <div className="w-full flex justify-between">
                  <p className="leading-6 tracking-[0.1px] text-[#152226] font-bold text-xl font-playfair">
                    Pricing
                  </p>
                  <p className="leading-6 tracking-[0.5px] text-[#1A231C]">₦</p>
                </div>

                <div className="w-full flex justify-between">
                  <p className="leading-6 tracking-[0.5px] text-[#717068]">
                    Game Space
                  </p>
                  <p className="leading-6 tracking-[0.5px] text-[#1A231C]">
                    {Intl.NumberFormat().format(
                      selectedSpace?.pricePerHour
                        ? +selectedSpace!.pricePerHour
                        : 0,
                    )}
                  </p>
                </div>

                <div className="w-full flex justify-between">
                  <p className="leading-6 tracking-[0.5px] text-[#717068]">
                    No. Hours
                  </p>
                  <p className="leading-6 tracking-[0.5px] text-[#1A231C]">
                    {startTime && endTime
                      ? moment(endTime, "HH:mm")
                          .diff(moment(startTime, "HH:mm"), "hours", true)
                          .toFixed(2)
                      : 0}
                  </p>
                </div>

                <div className="w-full flex justify-between">
                  <p className="leading-6 tracking-[0.5px] text-[#717068]">
                    Total
                  </p>
                  <p className="leading-6 tracking-[0.5px] text-[#1A231C]">
                    {totalPrice || 0}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden cursor-pointer"
                >
                  <span className="z-40">Proceed to pay</span>
                  <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
                </button>
              </div>
            </div>
          </section>
        </main>
      </section>

      <Footer />
    </main>
  );
};

export default Page;
