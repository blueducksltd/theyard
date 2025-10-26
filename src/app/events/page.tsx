"use client";
{
  /*eslint-disable @next/next/no-img-element*/
}
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import Navbar from "@/components/Navbar";
import { IEvent } from "@/types/Event";
import { getEvents } from "@/util";
import moment from "moment";
import Link from "next/link";
import React from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [shareModal, setShareModal] = React.useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = React.useState<IEvent | null>(null);
  const [events, setEvents] = React.useState<IEvent[]>([]);

  React.useEffect(() => {
    const fetchEvents = async () => {
      const response = await getEvents();
      setEvents(response.data.events);
    };
    fetchEvents();
  }, []);

  return (
    <main className={"w-full h-max bg-yard-white"}>
      <Navbar />

      {/*Content */}
      <section className={"py-20 px-4 md:px-16 w-full"}>
        <main className="pt-10 md:my-4 md:py-16">
          <header className="flex flex-col gap-5 md:flex-row justify-between md:items-center">
            <div className="flex flex-col items-start gap-4">
              <div className="title flex flex-col items-end">
                <h1 className="text-5xl">Events</h1>
                <img
                  src={"/featured-line.svg"}
                  alt="Line"
                  className="-mt-3 w-36"
                />
              </div>
              <p className="paragraph w-[280px] md:w-96 lg:w-[650px]">
                Step into our world of serene beauty and vibrant celebrations.
                Browse our favorite moments and get inspired for your own Yard
                experience.
              </p>
            </div>

            <Link
              href={"/booking"}
              className="cta-btn group relative overflow-hidden hover:text-yard-dark-primary"
            >
              <span className="z-40">Book your spot now</span>
              <div className="absolute top-0 left-0 bg-yard-primary-active w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </Link>
          </header>

          <h2 className="text-yard-dark-primary font-playfair font-bold text-[28px] leading-9 mt-16 md:mt-5">
            Upcoming Events
          </h2>
          <section className="w-full flex flex-wrap items-center my-5 md:my-4 gap-5 md:gap-1">
            {events.toReversed().map((event: IEvent) => (
              <div
                key={event.id}
                className="w-[384px] 2xl:w-[500px] h-[260px] 2xl:h-[300px] bg-cover bg-center flex-grow relative overflow-hidden group"
                style={{
                  backgroundImage: `url(${event.images ? (event.images.length > 0 ? event.images[0] : "/gallery/gallery2.svg") : "/gallery/gallery2.svg"})`,
                }}
              >
                {/*Inner Hover*/}
                <div className="absolute w-full h-full p-4 bg-[#090F10CC] top-36 md:top-0 left-0 transition-all duration-500 md:translate-y-full group-hover:translate-y-0 opacity-80">
                  <p className="text-yard-milk transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 absolute top-2 md:top-auto md:bottom-12 md:relative md:mt-12">
                    {moment(event.date).format("d/MM/YYYY")}
                    <img
                      src={"/featured-line.svg"}
                      alt="featured-line"
                      className="-mt-2 w-22 md:-translate-x-full transition-all delay-300 duration-500 group-hover:translate-x-0"
                    />
                  </p>

                  <Link
                    href={`/event/${encodeURIComponent(event.title)}`}
                    className="w-max h-max group absolute top-8 md:top-auto md:bottom-10 md:relative text-yard-milk font-playfair font-[700] text-xl md:text-[28px] leading-[36px] tracking-[-0.1px]"
                  >
                    {event.title}
                    <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
                  </Link>
                  <p className="paragraph text-gray-200 w-[340px] transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0 md:-mt-7">
                    {event.description}
                  </p>
                  <div
                    className="w-9 h-9 border-2 border-yard-milk flex justify-center items-center rounded2px absolute bottom-5 transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 cursor-pointer hover:scale-105"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShareModal(true);
                    }}
                  >
                    <img src={"/icons/share.svg"} alt="share icon" />
                  </div>
                </div>
              </div>
            ))}
          </section>
        </main>

        {/*Share Event Modal*/}
        <Modal isOpen={shareModal} useDefaultWidth>
          <section className="w-full">
            <div className="w-full flex items-center justify-between">
              <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
                Share Event
              </h2>
              <div
                className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
                onClick={() => setShareModal(false)}
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
          <div className="flex gap-5 mt-8 justify-center w-full">
            <button className="w-[50px] h-[50px] bg-[#EDF0EE] p-[11.11px] flex items-center justify-center rounded-[2.78px] text-[#EEEEE6] group relative overflow-hidden cursor-pointer">
              <img
                src={"/icons/whatsapp.svg"}
                width={23}
                height={23}
                className="z-40"
                alt="WhatsApp Icon"
              />
              <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>

            <button className="w-[50px] h-[50px] bg-[#EDF0EE] p-[11.11px] flex items-center justify-center rounded-[2.78px] text-[#EEEEE6] group relative overflow-hidden cursor-pointer">
              <img
                src={"/icons/facebook.svg"}
                width={23}
                height={23}
                className="z-40"
                alt="Facebook Icon"
              />
              <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>

            <button className="w-[50px] h-[50px] bg-[#EDF0EE] p-[11.11px] flex items-center justify-center rounded-[2.78px] text-[#EEEEE6] group relative overflow-hidden cursor-pointer">
              <img
                src={"/icons/instagram.svg"}
                width={23}
                height={23}
                className="z-40"
                alt="Instagram Icon"
              />
              <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>

            <button className="w-[50px] h-[50px] bg-[#EDF0EE] p-[11.11px] flex items-center justify-center rounded-[2.78px] text-[#EEEEE6] group relative overflow-hidden cursor-pointer">
              <img
                src={"/icons/x.svg"}
                width={23}
                height={23}
                className="z-40"
                alt="X Icon"
              />
              <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>

            <button className="w-[50px] h-[50px] bg-[#EDF0EE] p-[11.11px] flex items-center justify-center rounded-[2.78px] text-[#EEEEE6] group relative overflow-hidden cursor-pointer">
              <img
                src={"/icons/linkedin.svg"}
                width={23}
                height={23}
                className="z-40"
                alt="Linkedin Icon"
              />
              <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center cta-btn bg-base-100 text-yard-primary group relative overflow-hidden rounded-[5px] mt-5 cursor-pointer"
            onClick={() => {
              const origin = window.location.origin;
              const shareUrl = `${origin}/event/${selectedEvent?.title}`;
              navigator.clipboard.writeText(shareUrl.replaceAll(" ", "-"));
              toast.success(`${selectedEvent?.title} copied to clipboard`);
            }}
          >
            <span className="z-40">Copy link</span>
            <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>
        </Modal>
      </section>

      <Footer />
    </main>
  );
};

export default Page;
