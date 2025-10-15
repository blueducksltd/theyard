{
  /*eslint-disable @next/next/no-img-element*/
}

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { IEvent } from "@/types/Event";
// import { getEvents } from "@/util";
import moment from "moment";
import Link from "next/link";

const Page = async () => {
  // const events: IEvent[] = (await getEvents()).data.events;
  const events: IEvent[] = [];

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
                    href={`/event/${encodeURIComponent(event.id)}`}
                    className="w-max h-max group absolute top-8 md:top-auto md:bottom-10 md:relative text-yard-milk font-playfair font-[700] text-xl md:text-[28px] leading-[36px] tracking-[-0.1px]"
                  >
                    {event.title}
                    <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
                  </Link>
                  <p className="paragraph text-gray-200 w-[340px] transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0 md:-mt-7">
                    {event.description}
                  </p>
                  <div className="w-7 h-7 md:w-9 md:h-9 border-2 border-yard-milk flex justify-center items-center rounded2px absolute top-3 md:top-auto md:bottom-5 transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 right-5 md:left-5">
                    <img src={"/icons/share.svg"} alt="share icon" />
                  </div>
                </div>
              </div>
            ))}
          </section>
        </main>
      </section>

      <Footer />
    </main>
  );
};

export default Page;
