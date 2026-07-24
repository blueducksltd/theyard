"use client";
import BookingCalendar from '@/components/booking/Calender'
import Modal from '@/components/v2/Modal';
import { useBookingStore } from '@/store/bookingStore'
import { IBooking } from '@/types/Booking';
import { getBookings } from '@/util';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const normalizeBookingTime = (value?: string | null): string | null => {
    if (!value) return null;

    const trimmedTime = value.trim();
    const twentyFourHourMatch = trimmedTime.match(/^(\d{1,2}):(\d{2})$/);
    if (twentyFourHourMatch) {
        const hours = Number(twentyFourHourMatch[1]);
        const minutes = Number(twentyFourHourMatch[2]);

        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        }
    }

    const meridiemMatch = trimmedTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!meridiemMatch) return null;

    let hours = Number(meridiemMatch[1]);
    const minutes = Number(meridiemMatch[2]);
    const meridiem = meridiemMatch[3].toUpperCase();

    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
        return null;
    }

    if (meridiem === 'AM') {
        hours = hours === 12 ? 0 : hours;
    } else if (hours !== 12) {
        hours += 12;
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export default function BookingCalendarPage() {
    const { setDate } = useBookingStore();
    const router = useRouter();
    const [bookingData, setBookingData] = useState<IBooking[]>([]);
    const [selectedDatePreview, setSelectedDatePreview] = useState<Date | null>(null);
    const [occupiedTimesPreview, setOccupiedTimesPreview] = useState<string[]>([]);
    const [showOccupiedTimesPreviewModal, setShowOccupiedTimesPreviewModal] = useState(false);

    const proceedToBookingForm = (date: Date) => {
        setDate(date);
        router.push("/booking");
    };
    
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
                            <Image
                                src={"/icons/checkmark.svg"}
                                alt="Check Icon"
                                width={16}
                                height={16}
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
                            <Image
                                src={"/icons/checkmark.svg"}
                                alt="Check Icon"
                                width={16}
                                height={16}
                                className="mt-2"
                            />
                            <p className="text-[#717068] ]">
                                Fill in the booking form with your details and package choice.
                            </p>
                        </div>

                        <div className="flex items-start gap-3">
                            <Image
                                src={"/icons/checkmark.svg"}
                                alt="Check Icon"
                                width={16}
                                height={16}
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
                    <BookingCalendar bookingData={bookingData} onDateClick={(date, bookings) => {
                        const occupiedTimes = Array.from(
                            new Set(
                                bookings
                                    .map((booking) => normalizeBookingTime(booking.time))
                                    .filter((time): time is string => Boolean(time)),
                            ),
                        ).sort();

                        if (bookings.length > 0) {
                            setSelectedDatePreview(date);
                            setOccupiedTimesPreview(occupiedTimes);
                            setShowOccupiedTimesPreviewModal(true);
                            return;
                        }

                        proceedToBookingForm(date);
                    }} />

                </div>
            </section>

            <Modal
                isOpen={showOccupiedTimesPreviewModal && !!selectedDatePreview}
                handleClose={() => setShowOccupiedTimesPreviewModal(false)}
            >
                {selectedDatePreview && (
                    <div className='w-[92vw] max-w-xl bg-white p-5 md:p-6'>
                        <h3 className='font-playfair text-primaryGreen text-xl'>
                            Occupied times for {selectedDatePreview.toLocaleDateString("en-US", { dateStyle: "medium" })}
                        </h3>

                        {occupiedTimesPreview.length > 0 ? (
                            <p className='text-sm text-[#717068] mt-2'>
                                {occupiedTimesPreview.join(', ')}
                            </p>
                        ) : (
                            <p className='text-sm text-[#717068] mt-2'>
                                This date already has bookings. No exact time blocks were recorded for those bookings yet.
                            </p>
                        )}

                        <div className='mt-5 flex flex-wrap gap-3'>
                            <button
                                type='button'
                                onClick={() => {
                                    setShowOccupiedTimesPreviewModal(false);
                                    proceedToBookingForm(selectedDatePreview);
                                }}
                                className='px-4 py-2 bg-primaryGreen text-white text-sm font-semibold'
                            >
                                Continue to booking form
                            </button>
                            <button
                                type='button'
                                onClick={() => setShowOccupiedTimesPreviewModal(false)}
                                className='px-4 py-2 border border-primaryGreen text-primaryGreen text-sm font-semibold'
                            >
                                Choose another date
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

        </div>
    )
}
