{
  /*eslint-disable @next/next/no-img-element*/
}
import { IEvent } from "@/types/Event";
import { getEvents } from "@/util";
import moment from "moment";
import Link from "next/link";

const Upcoming = async () => {
  const events: IEvent[] = (await getEvents()).data.events;

  return (
    <main className="pt-10 md:my-4 md:py-16">
      <header className="flex flex-col md:flex-row items-start gap-5 justify-between md:items-center">
        <div className="flex flex-col items-start gap-4">
          <div className="title flex flex-col items-end">
            <h1 className="">Upcoming Events</h1>
            <img src={"/featured-line.svg"} alt="Line" className="-mt-3 w-24" />
          </div>
        </div>

        <Link
          href={"#"}
          className="cta-btn group relative overflow-hidden hover:text-yard-dark-primary"
        >
          <span className="z-40">View all events</span>
          <div className="absolute top-0 left-0 bg-yard-primary-active w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
        </Link>
      </header>

      <section className="grid md:grid-cols-3 items-center my-10 md:my-4 gap-2">
        {events.slice(0, 3).map((event: IEvent) => (
          <div
            key={event.id}
            className="h-[368px] rounded-md bg-[url('/upcoming.svg')] bg-cover bg-center relative overflow-hidden group"
          >
            {/*Inner Hover*/}
            <div className="absolute w-full h-full p-4 bg-[#090F10CC] top-0 left-0 transition-all duration-500 md:translate-y-full group-hover:translate-y-0">
              <p className="text-yard-milk transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0">
                {moment(event.date).format("d/MM/YYYY")}
                <img
                  src={"/featured-line.svg"}
                  alt="featured line"
                  className="-mt-2 w-22 md:-translate-x-full transition-all delay-300 duration-500 group-hover:translate-x-0"
                />
              </p>

              <Link
                href={"#"}
                className="w-max h-max group relative text-yard-milk font-playfair font-[700] text-[28px] leading-[36px] tracking-[-0.1px]"
              >
                {event.title}
                <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
              </Link>
              <p className="paragraph text-gray-200 w-[280px] md:w-[340px] transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 mt-2">
                {event.description}
              </p>
              <div className="w-9 h-9 border-2 border-yard-milk flex justify-center items-center rounded2px absolute bottom-5 transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0">
                <img src={"/icons/share.svg"} alt="share icon" />
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Upcoming;
