/* eslint-disable @next/next/no-img-element */

import BookingCalendar from "@/components/booking/Calender";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { IBooking } from "@/types/Booking";
import { getBookings } from "@/util";

const Page = async () => {
  const bookingData: IBooking[] = (await getBookings()).data.bookings;
  return (
    <main className={"w-full h-max bg-yard-white"}>
      <Navbar />

      {/*Content */}
      <section className={"py-20 px-4 md:px-16 w-full"}>
        <main className="pt-13 md:my-4 md:py-16">
          <section className="w-full flex flex-col-reverse md:flex-row items-start my-5 md:my-4 gap-14 md:gap-12">
            <div className="w-full md:w-[376] h-[max] shadow-xl">
              <BookingCalendar
                bookingData={bookingData}
                calenderWidth="w-full"
              />
            </div>

            {/*Divider*/}
            <div className="w-[1px] h-[917px] bg-[#C7CFC9] hidden md:block"></div>

            <div className="w-full md:w-[770px]">
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

              <div className="w-full overflow-hidden md:w-[770px] mt-5">
                <div className="header grid grid-cols-5 border-b-[1px] border-[#CCCCCC]">
                  <div className="p-4 text-sm italic text-[#1A231C] flex items-center">
                    Time
                  </div>

                  <div className="p-4 text-sm italic text-[#1A231C] text-center border-l-[1px] border-[#CCCCCC]">
                    <div className="flex items-center justify-center gap-2">
                      <span>{"Game Space"}</span>
                    </div>
                  </div>

                  <div className="p-4 text-sm italic text-[#1A231C] text-center border-l border-[#CCCCCC]">
                    <div className="flex items-center justify-center gap-2">
                      <span>{"Library"}</span>
                    </div>
                  </div>

                  <div className="p-4 text-sm italic text-[#1A231C] text-center border-l border-[#CCCCCC]">
                    <div className="flex items-center justify-center gap-2">
                      <span>{"Garden"}</span>
                    </div>
                  </div>

                  <div className="p-4 text-sm italic text-[#1A231C] text-center border-l-[1px] border-[#CCCCCC]">
                    <div className="flex items-center justify-center gap-2">
                      <span>{"Cimema"}</span>
                    </div>
                  </div>
                </div>

                {/*Content goes here*/}
                <div
                  className={`grid grid-cols-5 border-b-[1px] border-[#CCCCCC] hover:bg-gray-50/50 transition-colors`}
                >
                  <div className="p-4 font-mono text-sm font-medium text-gray-800 flex items-center border-[#CCCCCC]">
                    8:00
                  </div>
                  <div className="p-3 border-l-[1px] border-[#CCCCCC]">
                    <span className="flex items-center p-2 justify-center text-xs text-[#A44B4B] font-semibold">
                      Taken
                    </span>
                  </div>
                  <div className="p-3 border-l-[1px] border-[#CCCCCC]">
                    <span className="flex items-center bg-yard-primary-active md:mx-5 p-2 rounded-sm border-[1px] border-yard-primary justify-center text-[10px] md:text-xs text-yard-primary font-medium font-sen">
                      Available
                    </span>
                  </div>
                  <div className="p-3 border-l-[1px] border-[#CCCCCC]">
                    <span className="flex items-center p-2 justify-center text-xs text-[#A44B4B] font-semibold">
                      Taken
                    </span>
                  </div>
                  <div className="p-3 border-l-[1px] border-[#CCCCCC]">
                    <span className="flex items-center p-2 justify-center text-xs text-[#A44B4B] font-semibold">
                      Taken
                    </span>
                  </div>
                </div>
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
