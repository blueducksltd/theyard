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
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [spaces, setSpaces] = useState<ISpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<ISpace | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(true);
  const [image, setImage] = useState<File | undefined>();
  const [savedBookingDetails, setSavedBookingDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inputs] = useState<Record<string, any>>({});
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<string>("0");

  const handleSubmit = async () => {
    if (!savedBookingDetails) {
      toast.error(
        "No booking details found. Please start from the booking page.",
        {
          position: "bottom-right",
        },
      );
      return;
    }

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

    if (image == null) {
      toast.error(`Please upload an image`, {
        position: "bottom-right",
      });
      return;
    }

    if (Object.keys(inputs).length < 13) {
      toast.error(`Please fill out all fields`, {
        position: "bottom-right",
      });
      return;
    }

    const hasEmptyValues = Object.values(inputs).some(
      (val) => val === "" || val == null,
    );
    if (hasEmptyValues) {
      toast.error(`Please fill out all fields`, {
        position: "bottom-right",
      });
      return;
    }

    const formdata = new FormData();
    Object.entries(inputs).forEach(([key, value]) => {
      formdata.append(key, value);
    });

    const toastId = toast.loading("Booking your event, please wait...", {
      position: "bottom-right",
    });

    // Create Booking
    try {
      const response = await createBookings(formdata);
      if (response.success == true) {
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
    if (!savedBookingDetails) return;

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

  // Load booking details from localStorage on client side only
  useEffect(() => {
    const bookingData = loadFromLS("booking");

    if (!bookingData) {
      toast.error("No booking details found. Redirecting to booking page...", {
        position: "bottom-right",
      });
      router.push("/booking");
      return;
    }

    setSavedBookingDetails(bookingData);
    setIsLoading(false);

    toast.info("Bookings made today must be made at least 1 hour in advance", {
      position: "bottom-right",
    });
  }, [router]);

  useEffect(() => {
    (async () => {
      const response = await getSpaces();
      if (response.success == true) {
        setSpaces(response.data.spaces);
      }
    })();
  }, []);

  // Show loading state while checking for booking details
  if (isLoading) {
    return (
      <main className="w-full h-screen flex items-center justify-center bg-yard-white">
        <div className="text-center">
          <p className="text-lg text-[#717068]">Loading booking details...</p>
        </div>
      </main>
    );
  }

  // Show error state if no booking details
  if (!savedBookingDetails) {
    return null; // Router will redirect
  }

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
              {/* ... rest of your form fields ... */}

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
                    defaultValue={
                      savedBookingDetails?.date
                        ? new Date(savedBookingDetails.date).toLocaleDateString(
                            "en-CA",
                          )
                        : ""
                    }
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      (inputs.date = e.target.value)
                    }
                    placeholder="Select a date"
                    className="md:h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  />
                </div>

                {/* ... rest of form fields ... */}
              </div>

              {/* Keep all other form fields as they are */}
              {/* I'm showing just the date field for brevity */}
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
                    {savedBookingDetails?.package?.name || "N/A"}
                  </p>
                </div>

                <div className="w-full flex justify-between">
                  <p className="leading-6 tracking-[0.5px] text-[#717068]">
                    Space
                  </p>
                  <p className="leading-6 tracking-[0.5px] text-[#1A231C]">
                    {selectedSpace?.name || "Not selected"}
                  </p>
                </div>

                <div className="w-full flex justify-between">
                  <p className="leading-6 tracking-[0.5px] text-[#717068]">
                    Event Date
                  </p>
                  <p className="leading-6 tracking-[0.5px] text-[#1A231C]">
                    {savedBookingDetails?.date
                      ? new Date(savedBookingDetails.date).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {/* ... rest of summary ... */}
              </div>

              {/* ... rest of pricing section ... */}
            </div>
          </section>
        </main>
      </section>

      <Footer />
    </main>
  );
};

export default Page;
