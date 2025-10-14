"use client";

/* eslint-disable @next/next/no-img-element */
import { use, useEffect, useState } from "react";
import BookingCalendar from "@/components/booking/Calender";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Modal from "@/components/Modal"; // ✅ Ensure you have this component
import { IBooking } from "@/types/Booking";
import { getBookings, getBookingsByDate, getPackages } from "@/util";
import { IPackage } from "@/types/Package";
import { toast } from "react-toastify";
import { loadFromLS, saveToLS } from "@/util/helper";
import { useRouter } from "next/navigation";

interface IProps {
  searchParams: Promise<{ date: string }>;
}
interface IBookSpace {
  id: string;
  name: string;
  slots: {
    [time: string]: "available" | "unavailable";
  };
}

const Page = ({ searchParams }: IProps) => {
  const { date } = use(searchParams);
  const [bookingData, setBookingData] = useState<IBooking[]>([]);
  const [bookingsByDate, setBookingsByDate] = useState<IBookSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [packages, setPackages] = useState<IPackage[]>([]); // Replace 'any' with your package type
  const [selectedPackage, setSelectedPackage] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const bookings = await getBookings();
        const bookingsByDateRes = await getBookingsByDate(date);
        const packagesRes = await getPackages(); // Fetch packages data
        setBookingData(bookings.data.bookings);
        setBookingsByDate(bookingsByDateRes.data.spaces);
        setPackages(packagesRes.data.packages); // Set packages data
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [date]);

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

  const timeSlots =
    bookingsByDate.length > 0
      ? Object.keys(bookingsByDate[0].slots).sort()
      : [];

  if (loading) {
    return (
      <main className="w-full h-screen flex items-center justify-center bg-yard-white">
        <p className="text-gray-500 text-lg">Loading bookings...</p>
      </main>
    );
  }

  return (
    <main className="w-full h-max bg-yard-white">
      <Navbar />

      {/* Content */}
      <section className="py-20 px-4 md:px-16 w-full">
        <main className="pt-13 md:my-4 md:py-16">
          <section className="w-full flex flex-col-reverse md:flex-row items-start my-5 md:my-4 gap-14 md:gap-12">
            <div className="w-full md:w-[376px] h-max shadow-xl">
              <BookingCalendar
                bookingData={bookingData}
                calenderWidth="w-full"
              />
            </div>

            {/* Divider */}
            <div className="w-[1px] h-[917px] bg-[#C7CFC9] hidden md:block"></div>

            <div className="w-full md:w-[770px] flex-1">
              <div className="flex flex-col items-start">
                <div className="title flex flex-col items-end">
                  <h1 className="text-[32px]">Activities</h1>
                  <img
                    src={"/about-line.svg"}
                    alt="Line"
                    className="-mt-3 w-[8.5rem]"
                  />
                </div>
              </div>

              <div className="w-full overflow-x-auto md:w-[770px] mt-5">
                {/* Header */}
                <div
                  className={`header grid grid-cols-${bookingsByDate.length + 1} border-b-[1px] border-[#CCCCCC] min-w-max`}
                >
                  <div className="p-4 text-sm italic text-[#1A231C] flex items-center w-24">
                    Time
                  </div>

                  {bookingsByDate.map((space) => (
                    <div
                      key={space.id}
                      className="p-4 text-sm italic text-[#1A231C] text-center border-l-[1px] border-[#CCCCCC] min-w-[120px]"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span>{space.name}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className={`grid grid-cols-${bookingsByDate.length + 1} border-b-[1px] border-[#CCCCCC] hover:bg-gray-50/50 transition-colors min-w-max`}
                  >
                    <div className="p-4 font-mono text-sm font-medium text-gray-800 flex items-center border-[#CCCCCC] w-24">
                      <span>{time}</span>
                    </div>

                    {bookingsByDate.map((space) => {
                      const status = space.slots[time];
                      const isAvailable = status === "available";

                      return (
                        <div
                          key={`${space.id}-${time}`}
                          className="p-3 border-l-[1px] border-[#CCCCCC] min-w-[120px]"
                        >
                          {isAvailable ? (
                            <span
                              onClick={() => setIsModalOpen(true)}
                              className="flex items-center bg-yard-primary-active md:mx-5 p-2 rounded-sm border-[1px] border-yard-primary justify-center text-[10px] md:text-xs text-yard-primary font-medium font-sen cursor-pointer hover:bg-yard-primary hover:text-white transition-colors"
                            >
                              Available
                            </span>
                          ) : (
                            <span className="flex items-center p-2 justify-center text-xs text-[#A44B4B] font-semibold">
                              Taken
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </section>

      <Footer />

      {/* Modal */}
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
              htmlFor={pck.id}
              key={pck.id as string}
              className="md:w-[554px] border-[1px] border-[#E4E8E5] px-3 py-4 md:px-5 md:py-6 flex items-start gap-3 rounded-sm"
            >
              <input
                id={pck.id}
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
            htmlFor="shutdow1n"
            className="md:w-[554px] border-[1px] border-[#E4E8E5] px-3 py-4 md:px-5 md:py-6 flex items-start gap-3 rounded-sm"
          >
            <input
              id="shutdow1n"
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
            onClick={handleProcessPackage}
            className="w-full md:w-[554px] flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden cursor-pointer"
          >
            <span className="z-40">Select package</span>
            <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>
        </div>
      </Modal>
    </main>
  );
};

export default Page;
