"use client";
import BookingCalendar from '@/components/booking/Calender'
import { useBookingStore } from '@/store/bookingStore'
import { IBooking } from '@/types/Booking';
import { getBookings } from '@/util';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function page() {
    const { setDate } = useBookingStore();
    const router = useRouter();
    const [bookingData, setBookingData] = useState<IBooking[]>([]);
    
  useEffect(() => {
    (async () => {
      try {

        setBookingData((await getBookings()).data.bookings)


      } catch (err) {
        console.error('Error fetching packages:', err);
      }
    })()
  }, [])
    return (
        <div className='pb-20 md:pb-40'>
            <div className=' flex flex-col justify-center items-center gap-6 pt-30 pb-10 md:py-20 '>
                <p className={`font-lato text-primaryGreen`}>{ }</p>
                <div className="w-full md:w-[40%] grid gap-4">
                    <h1 className={`text-primaryGreen text-4xl font-playfair-display  text-center`}>
                        Book {" "}
                        <span className={`font-petit text-primaryBrown`}>
                            Your
                        </span> {" "}
                        spot now
                    </h1>
                    <p className={`font-inter text-center text-sm`}>Create beautiful memories at The Yard</p>

                </div>

            </div>

            <section className="w-full flex flex-col md:flex-row items-start h-max gap-20 px-5 md:px-30 mt-10 pb-20">
                <div className=" md:h-max shadow-2xl bg-[#FDFBF9]">
                    <h2 className="w-full bg-primaryGreen  text-yard-lightgreen flex justify-center items-center py-4 px-6 font-playfair font-bold md:text-lg">
                        How To Book a Date
                    </h2>
                    <div className="p-6 text-lg flex flex-col gap-5  md:text-sm">
                        <div className="flex items-start gap-3">
                            <img
                                src={"/icons/checkmark.svg"}
                                alt="Check Icon"
                                className="mt-2"
                            />
                            <p className="text-[#717068] ">
                                Choose your date from our interactive calendar <b>below</b>.{" "}
                                <br /> (
                                <span className="text-green-600">green = Fully available,</span>{" "}
                                <br />
                                <span className="text-red-600">red = Not available,</span>
                                <br />
                                <span className="text-yellow-600">
                                    yellow = Still available
                                </span>
                                )
                            </p>
                        </div>

                        <div className="flex items-start gap-3">
                            <img
                                src={"/icons/checkmark.svg"}
                                alt="Check Icon"
                                className="mt-2"
                            />
                            <p className="text-[#717068] ]">
                                Fill in the booking form with your details and package choice.
                            </p>
                        </div>

                        <div className="flex items-start gap-3">
                            <img
                                src={"/icons/checkmark.svg"}
                                alt="Check Icon"
                                className="mt-2"
                            />
                            <p className="text-[#717068]">
                                Receive instant confirmation and a 24-hour reminder before your
                                event.
                            </p>
                        </div>
                    </div>
                </div>

                {/*Calender*/}
                <div className='bg-[#FDFBF9] w-full'>
                    <BookingCalendar bookingData={bookingData} onDateClick={(date) => {
                        setDate(date);
                        router.push("/booking")

                    }} />
                </div>
            </section>

        </div>
    )
}
