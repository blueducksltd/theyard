"use client";
import Modal from '@/components/v2/Modal';
import { ArrowLeft, CalendarDays, ChevronDown, PackageX, X } from 'lucide-react';
import EmptyState from '@/components/v2/EmptyState';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { AddMoreFun, IPackageFun, ModalContent, PackageCard, SelectedAddon } from '../packages/page';
import BookingCalendar from '@/components/booking/Calender';
import { toast } from 'react-toastify';
import { useBookingStore } from '@/store/bookingStore';
import Link from 'next/link';
import axios from '@/util/axios';
import { IPackageClient } from '@/types/Package';
import { motion } from "motion/react";
import { initiatePayment } from '@/util/payment';
import { IBooking } from '@/types/Booking';
import { getBookings } from '@/util';
type FormErrors = Partial<{
  package: string;
  guest: string;
  firstname: string;
  lastname: string;
  phonenumber: string;
  email: string;
  date: string;
  time: string;
}>;

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className="text-red-500 text-xs mt-1.5 font-lato">{message}</p>;
};

type ShowState = {
  package: {
    show: boolean;
    value: IPackageFun | null;
  };
  time: {
    show: boolean;
    value: string;
  };
  fun: {
    show: boolean;
    value: SelectedAddon[];
  };
  date: {
    show: boolean;
    value: string;
  };
};

const PackageModalContent = ({ packages, showModal, setSelectedPackage, closePackageModal }: { packages: IPackageFun[], showModal: boolean, setSelectedPackage: (selectedPackage: IPackageFun) => void, closePackageModal: () => void; }) => {

  const [viewing, setViewing] = useState<IPackageFun | null>(null);
  const {selectedDate} = useBookingStore()

  if (viewing) {
    return <ModalContent
      selectedPackage={viewing}
      onClose={() => {
        setViewing(null)
      }}
      onConfirmAddon={(selectedAddon) => {
        setViewing(prev => prev ? { ...prev, selectedAddon } : prev)
      }}
      bookPackage={() => {
        setSelectedPackage(viewing)
        setViewing(null)
        closePackageModal()
      }}
    />
  }

  return <div className='bg-[#F6F2EC] md:w-[70%] p-5'>
    <div className=' flex justify-between items-center pb-7'>
      <h1 className='text-primaryGreen font-playfair-display text-lg font-bold'>Choose Package</h1>

      <div
        className="bg-white w-8 h-8 flex items-center justify-center cursor-pointer"
        style={{ boxShadow: "0 2px 40px rgba(0,0,0,0.1)" }}
        onClick={closePackageModal}
      >
        <X size={16} />
      </div>
    </div>
    <div
      className={`space-y-3 transition-all duration-300 ${showModal
        ? " opacity-100 scale-100 w-100  h-[70vh] md:w-full md:min-h-100"
        : "opacity-0 scale-0 w-0 h-0 overflow-hidden pointer-events-none"
        } grid grid-cols-1 md:grid-cols-2 gap-4 h-100 overflow-auto`}>


      {packages.length === 0 && (
        <EmptyState
          icon={PackageX}
          title="No Packages"
          message="There are no packages available at the moment. Please check back soon."
        />
      )}
      {packages.map((pkg, index) => (
        <PackageCard
          key={pkg.id}
          pkg={pkg}
          index={index}
          onSelect={() => {
            setViewing(pkg)
          }}
          selectedDate={selectedDate}
        />
      ))}
    </div>
  </div>
}

export default function BookingPage() {
  const { selectedPackage, selectedDate, clearSelectedPackage, clearDate } = useBookingStore()
  const [packages, setPackages] = useState<IPackageFun[]>([]);
  const [show, setShow] = useState<ShowState>({
    package: { show: false, value: null },
    time: { show: false, value: "" },
    fun: { show: false, value: [] },
    date: { show: false, value: "" }
  });

  const [loading, setLoading] = useState<boolean>(false)
  const [bookingData, setBookingData] = useState<IBooking[]>([])


  const [inputs, setInputs] = useState<{
    guest: number;
    firstname: string;
    lastname: string;
    phonenumber: string;
    email: string;
    note: string;
  }>({
    email: "",
    guest: 0,
    firstname: "",
    phonenumber: "",
    lastname: "",
    note: ""
  })

  const [errors, setErrors] = useState<FormErrors>({});

  const clearError = (field: keyof FormErrors) => {
    setErrors(prev => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    const timer = setTimeout(() => setErrors({}), 4000);
    return () => clearTimeout(timer);
  }, [errors]);

  const summary: { title: string; subtitle: string; }[] = [{
    title: "Package",
    subtitle: show.package.value?.name || "_____",

  },
  {
    title: "Participant",
    subtitle: `${inputs.guest || 0} ${inputs.guest === 1 ? "Person" : "Persons"}`,
  },
  {
    title: "Event Date",
    subtitle: show.date.value || "_____",
  },
  {
    title: "Event Time",
    subtitle: show.time.value || "_____",
  },
  {
    title: "Publish Event",
    subtitle: "No"
  }

  ]

  const pricing: { title: string; subtitle: number; }[] = [{
    title: "Full Party Package",
    subtitle: show.package.value?.price ?? 0,

  },

  ]
  const setSelectedPackage = (selectedPackage: IPackageFun) => {

    setShow(prev => ({ ...prev, package: { ...prev.package, value: selectedPackage } }));
    clearError('package');

  }

  const total = pricing
    .concat(show.package.value?.selectedAddon?.map(item => ({ title: item.name, subtitle: Number((item.price ?? item.pricePerMin ?? 0) * item.quantity) })) ?? [])
    .reduce((sum, item) => sum + item.subtitle, 0);

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const handleSubmit = async () => {
    const newErrors: FormErrors = {};
    if (!show.package.value) newErrors.package = "Please select a package.";
    if (!inputs.firstname.trim()) newErrors.firstname = "Please enter your first name.";
    if (!inputs.lastname.trim()) newErrors.lastname = "Please enter your last name.";
    if (!inputs.email.trim()) newErrors.email = "Please enter your email address.";
    if (!inputs.phonenumber.trim()) newErrors.phonenumber = "Please enter your phone number.";
    if (!show.date.value) newErrors.date = "Please select an event date.";
    if (!show.time.value) newErrors.time = "Please select an event time.";
    if (!inputs.guest || inputs.guest < 1) newErrors.guest = "Please enter the number of guests.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    if (!show.package.value) return;

    const data = {
      firstName: inputs.firstname,
      lastName: inputs.lastname,
      email: inputs.email,
      phone: inputs.phonenumber,
      date: formatDate(show.date.value),
      time: show.time.value,
      guestCount: inputs.guest,
      packageId: show.package.value.id,
      addon: show.package.value.selectedAddon.map(item => item.id),
      eventDescription: inputs.note
    }
    setLoading(true);
    initiatePayment(inputs.email, total, async () => {
      try {
        await axios.post("/bookings", data);
        toast.success("Transaction successful");
        clearSelectedPackage();
        clearDate();
        setInputs({
          email: "",
          guest: 0,
          firstname: "",
          phonenumber: "",
          lastname: "",
          note: ""
        });
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false);
      }

    });

  };


  useEffect(() => {
    if (selectedPackage) {
      setShow(prev => ({ ...prev, package: { ...prev.package, value: selectedPackage } }))
    }

    if (selectedDate) {
      setShow(prev => ({ ...prev, date: { ...prev.date, value: selectedDate.toLocaleDateString("en-US", { dateStyle: "medium" }) } }))
    }

  }, [])

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('../api/packages');
        setPackages(res.data.data.packages.map((p: IPackageClient) => ({ ...p, selectedAddon: [] })));

        setBookingData((await getBookings()).data.bookings)


      } catch (err) {
        console.error('Error fetching packages:', err);
      }
    })()
  }, [])

  const handleSelectedAddon = (selectedAddon: SelectedAddon[]) => {
    setShow(prev => ({ ...prev, package: { ...prev.package, value: prev.package.value ? { ...prev.package.value, selectedAddon } : null } }));

  }

  return (
    <div className='font-lato pb-20 md:pb-2 text-base'>
      <Modal isOpen={show.package.show} handleClose={() => {
        setShow(prev => ({ ...prev, package: { ...prev.package, show: false } }))
      }}>
        <PackageModalContent packages={packages} setSelectedPackage={setSelectedPackage} showModal={show.package.show} closePackageModal={() => {
          setShow(prev => ({ ...prev, package: { ...prev.package, show: false } }))
        }} />
      </Modal>

      <Modal isOpen={show.fun.show} handleClose={() => {
        setShow(prev => ({ ...prev, fun: { ...prev.fun, show: false } }));
      }}>
        <AddMoreFun
          closeFun={() => {
            setShow(prev => ({ ...prev, fun: { ...prev.fun, show: false } }));
          }}
          onConfirmAddon={(selectedAddon) => {
            handleSelectedAddon(selectedAddon)
          }}
          packageSelectedFun={show.package.value?.selectedAddon || []}
          show={show.fun.show} />
      </Modal>

      <div className='p-5 md:p-20  grid grid-cols-1 md:grid-cols-3 gap-10 items-center'>

        <div className='md:col-span-2  h-fit'>
          {
            selectedPackage && <Link className='border-b flex w-fit font-sen text-xs items-center gap-1 text-primaryGreen my-6' href={"/packages"}>
              <ArrowLeft size={10} /> <span>Back to packages</span>
            </Link>
          }

          {
            selectedDate && <Link className='border-b flex w-fit font-sen text-xs items-center gap-1 text-primaryGreen my-6' href={"/booking/calendar"}>
              <ArrowLeft size={10} /> <span>Back to calendar</span>
            </Link>
          }
          
          <h1 className={`font-semibold text-primaryGreen text-3xl md:text-2xl md:italic font-playfair-display  relative `}>Booking Form

            <Image width={150} height={100} alt="" src={"/images/paint_design.png"} className="object-contain absolute left-0 md:block hidden" />
          </h1>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-7 py-10'>
            <div className='space-y-1 text-sm' onClick={() => {
              setShow(prev => ({ ...prev, package: { ...prev.package, show: true } }))
            }}>
              <label htmlFor="package" className='block text-[#1A1A1A]'>Choose Package</label>

              <div className={`border h-12 p-3 flex justify-between items-center cursor-pointer transition-colors duration-200 ${errors.package ? "border-red-500" : ""}`}>
                <p className={(show.package.value?.name) ? "text-black" : "text-[#999999]"}>
                  {show.package.value?.name
                    ? show.package.value?.name
                    : "Browse Package Item"}

                </p>

                <ChevronDown size={20} />
              </div>
              <FieldError message={errors.package} />
            </div>

            <div className='space-y-1 text-sm'>
              <label htmlFor="package" className='block text-[#1A1A1A]'>Guest Number</label>

              <div className={`border h-12 p-3 flex justify-between items-center transition-colors duration-200 ${errors.guest ? "border-red-500" : ""}`}>
                <input type="number" value={inputs.guest || ""} onChange={e => {
                  if (!show.package.value) {
                    setErrors(prev => ({ ...prev, guest: "Please select a package first." }));
                    return;
                  }

                  const value = Number(e.target.value);
                  if (value > show.package.value.guestLimit) {
                    setErrors(prev => ({ ...prev, guest: `Guest exceeds max guest of ${show.package.value!.guestLimit}.` }));
                    return;
                  }
                  clearError('guest');
                  setInputs(prev => ({ ...prev, guest: value }))
                }} className='w-full h-full outline-0' placeholder='Enter Number of Participant' />
              </div>
              <FieldError message={errors.guest} />
            </div>
            <div className='space-y-1 text-sm'>
              <label htmlFor="package" className='block text-[#1A1A1A]'>First name</label>

              <div className={`border h-12 p-3 flex justify-between items-center transition-colors duration-200 ${errors.firstname ? "border-red-500" : ""}`}>
                <input type="text" value={inputs.firstname} onChange={e => { setInputs(prev => ({ ...prev, firstname: e.target.value })); clearError('firstname'); }} className='w-full h-full outline-0' placeholder='Enter your first name' />
              </div>
              <FieldError message={errors.firstname} />
            </div>
            <div className='space-y-1 text-sm'>
              <label htmlFor="package" className='block text-[#1A1A1A]'>Last name</label>

              <div className={`border h-12 p-3 flex justify-between items-center transition-colors duration-200 ${errors.lastname ? "border-red-500" : ""}`}>
                <input type="text" value={inputs.lastname} onChange={e => { setInputs(prev => ({ ...prev, lastname: e.target.value })); clearError('lastname'); }} className='w-full h-full outline-0' placeholder='Enter your last name' />
              </div>
              <FieldError message={errors.lastname} />
            </div>

            <div className='space-y-1 text-sm'>
              <label htmlFor="package" className='block text-[#1A1A1A]'>Phone Number(Whatsapp)</label>

              <div className={`border h-12 p-3 flex justify-between items-center transition-colors duration-200 ${errors.phonenumber ? "border-red-500" : ""}`}>
                <input type="tel" value={inputs.phonenumber} onChange={e => { setInputs(prev => ({ ...prev, phonenumber: e.target.value })); clearError('phonenumber'); }} className='w-full h-full outline-0' placeholder='Enter your phone number(Whatsapp)' />
              </div>
              <FieldError message={errors.phonenumber} />
            </div>
            <div className='space-y-1 text-sm'>
              <label htmlFor="package" className='block text-[#1A1A1A]'>Email address</label>

              <div className={`border h-12 p-3 flex justify-between items-center transition-colors duration-200 ${errors.email ? "border-red-500" : ""}`}>
                <input type="email" value={inputs.email} onChange={e => { setInputs(prev => ({ ...prev, email: e.target.value })); clearError('email'); }} className='w-full h-full outline-0' placeholder='Enter your email address' />
              </div>
              <FieldError message={errors.email} />
            </div>

            <div className='space-y-1 text-sm relative' onClick={() => {
              setShow(prev => ({ ...prev, date: { ...prev.date, show: !prev.date.show } }))
            }}>
              <label htmlFor="package" className='block text-[#1A1A1A]'>Select Date</label>

              <div className={`border h-12 p-3 flex justify-between items-center transition-colors duration-200 ${errors.date ? "border-red-500" : ""}`}>
                <p className={!!show.date.value ? "text-black" : "text-[#999999]"}>
                  {!!show.date.value
                    ? show.date.value
                    : "Select a date"}

                </p>
                <CalendarDays size={14} />
              </div>
              <FieldError message={errors.date} />

              <div
                className={`absolute left-0 -bottom-104 transition-[height] z-100 duration-500 ease-in-out cursor-pointer  justify-center ${show.date.show
                  ? "w-full md:w-120 h-100 bg-white overflow-auto shadow-2xl "
                  : "w-0 h-0 overflow-hidden delay-0"
                  }`}
                onClick={e => e.stopPropagation()}
              >
                <BookingCalendar bookingData={bookingData}

                  onDateClick={(date) => {
                    setShow(prev => ({ ...prev, date: { ...prev.date, show: false, value: date.toLocaleDateString("en-US", { dateStyle: "medium" }) } }));
                    clearError('date');

                  }} />
              </div>
            </div>

            <div className='space-y-1 text-sm relative cursor-pointer' onClick={(e) => {
              setShow(prev => ({ ...prev, time: { ...prev.time, show: !prev.time.show } }))
              e.stopPropagation()
            }}>
              <label htmlFor="package" className='block text-[#1A1A1A]'>Select time</label>

              <div className={`border h-12 p-3 flex justify-between items-center transition-colors duration-200 ${errors.time ? "border-red-500" : ""}`} >
                <input type="text" className='w-full h-full outline-0 cursor-pointer' placeholder='Select Time and Date' readOnly value={show.time.value as string} />
                <ChevronDown size={20} />
              </div>
              <FieldError message={errors.time} />

              <div className={`absolute bg-white z-10 overflow-auto transition-[height] duration-500 ease-in-out ${!show.time.show ? "w-0 h-0 p-0" : "w-full h-30 p-2 "}`}>
                {Array.from({ length: 15 }).map((_, index) => {
                  const hour = (index + 8).toLocaleString().padStart(2, "0");
                  return <p key={index} onClick={() => {
                    setShow(prev => ({ ...prev, time: { ...prev.time, value: hour + ":00" } }))
                    clearError('time');
                  }} className='p-3 z-50 hover:bg-black/5'>{hour}:00</p>
                })}
              </div>

            </div>

            <button onClick={() => {
              if (!show.package.value) {
                setErrors(prev => ({ ...prev, package: "Please select a package first." }));
                return;
              }
              setShow(prev => ({ ...prev, fun: { ...prev.fun, show: true } }))
            }} className='space-y-1 text-sm bg-primaryBrown text-lightBrown flex items-center justify-center h-12 font-sen'>
              <p>Add more fun</p>
            </button>

            <div className='space-y-1 text-sm md:col-span-2'>
              <label htmlFor="package" className='block text-[#1A1A1A]'>Event note/description</label>
              <textarea placeholder={`Tell us about your event, and we'll prepare a space tailored to your style and preferences`} value={inputs.note} onChange={e => setInputs(prev => ({ ...prev, note: e.target.value }))} name="" id="" className='block w-full border resize-none outline-none p-3 h-40'></textarea>
            </div>
          </div>



        </div>

        <div className='bg-white h-fit pb-5'>
          <div className='bg-primaryGreen text-white p-3 text-center '>
            <h1 className={`text-white text-lg capitalize font-playfair-display text-left`}>Booking Summary</h1>
          </div>

          <div className={`px-5  space-y-3   grid grid-cols-2 text-sm font-lato pt-5`}>
            {summary.map((item, index) => (
              <React.Fragment key={index}>
                <p className="text-[#717068]">{item.title}</p>
                <p className="text-primaryGreen text-right">{item.subtitle}</p>
              </React.Fragment>
            ))}
          </div>


          <div className='py-5'></div>

          <div className={`px-5  space-y-3   grid grid-cols-2 text-sm font-lato`}>
            <p className="font-playfair font-bold text-lg text-primaryGreen">Pricing</p>
            <p className="font-playfair font-bold text-lg text-primaryGreen text-right">₦</p>
            {pricing.concat(show.package.value?.selectedAddon?.map(item => ({ title: item.name, subtitle: Number((item.price ?? item.pricePerMin ?? 0) * item.quantity) })) ?? []).map((item, index) => (
              <React.Fragment key={index}>
                <p className="text-[#717068]">{item.title}</p>
                <p className="text-primaryGreen text-right font-bold">{item.subtitle.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </React.Fragment>
            ))}


            <div className="col-span-2 border-t border-gray-200 mt-2 pt-3 flex justify-between font-semibold text-primaryGreen text-sm">
              <p>Total</p>
              <p>{total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className='w-full h-10 bg-primaryGreen text-white font-sen text-sm mt-20 col-span-2 flex items-center justify-center'
            >
              {loading ? <motion.div
                className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              /> : "Proceed to  pay"}

            </button>
          </div>


        </div>



      </div>
    </div>
  )
}
