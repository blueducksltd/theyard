import Link from "next/link";

const Upcoming = () => {
  return (
    <main className="w-full my-4 py-16">
      <header className="flex justify-between items-center">
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
          <span className="z-50">View all events</span>
          <div className="absolute top-0 left-0 bg-yard-primary-active w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
        </Link>
      </header>

      <section className="grid grid-cols-3 items-center my-4 gap-2">
        <div className="h-[368px] rounded-md bg-[url('/upcoming.svg')] bg-cover bg-center relative overflow-hidden group">
          {/*Inner Hover*/}
          <div className="absolute w-full h-full p-4 bg-[#090F10CC] top-0 left-0 transition-all duration-500 translate-y-full group-hover:translate-y-0">
            <p className="text-yard-milk transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0">
              12/09/2025
              <img
                src={"/featured-line.svg"}
                className="-mt-2 w-22 -translate-x-full transition-all delay-300 duration-500 group-hover:translate-x-0"
              />
            </p>

            <Link
              href={"#"}
              className="w-max h-max group relative text-yard-milk font-playfair font-[700] text-[28px] leading-[36px] tracking-[-0.1px]"
            >
              Relocation Celebration
              <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
            </Link>
            <p className="paragraph text-gray-200 w-[340px] transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0 mt-2">
              Join us in our new space at 21 Umuawulu Street!
            </p>
            <div className="w-9 h-9 border-2 border-yard-milk flex justify-center items-center rounded2px absolute bottom-5 transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0">
              <img src={"/icons/share.svg"} />
            </div>
          </div>
        </div>
        <div className="h-[368px] rounded-md bg-[url('/upcoming2.svg')] bg-cover bg-center relative overflow-hidden group">
          {/*Inner Hover*/}
          <div className="absolute w-full h-full p-4 bg-[#090F10CC] top-0 left-0 transition-all duration-500 translate-y-full group-hover:translate-y-0">
            <p className="text-yard-milk transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0">
              12/09/2025
              <img
                src={"/featured-line.svg"}
                className="-mt-2 w-22 -translate-x-full transition-all delay-300 duration-500 group-hover:translate-x-0"
              />
            </p>

            <Link
              href={"#"}
              className="w-max h-max group relative text-yard-milk font-playfair font-[700] text-[28px] leading-[36px] tracking-[-0.1px]"
            >
              Relocation Celebration
              <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
            </Link>
            <p className="paragraph text-gray-200 w-[340px] transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0 mt-2">
              Curated setups wiith exclusive perks.
            </p>
            <div className="w-9 h-9 border-2 border-yard-milk flex justify-center items-center rounded2px absolute bottom-5 transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0">
              <img src={"/icons/share.svg"} />
            </div>
          </div>
        </div>
        <div className="h-[368px] rounded-md bg-[url('/upcoming3.svg')] bg-cover bg-center relative overflow-hidden group">
          {/*Inner Hover*/}
          <div className="absolute w-full h-full p-4 bg-[#090F10CC] top-0 left-0 transition-all duration-500 translate-y-full group-hover:translate-y-0">
            <p className="text-yard-milk transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0">
              12/09/2025
              <img
                src={"/featured-line.svg"}
                className="-mt-2 w-22 -translate-x-full transition-all delay-300 duration-500 group-hover:translate-x-0"
              />
            </p>

            <Link
              href={"#"}
              className="w-max h-max group relative text-yard-milk font-playfair font-[700] text-[28px] leading-[36px] tracking-[-0.1px]"
            >
              Relocation Celebration
              <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
            </Link>
            <p className="paragraph text-gray-200 w-[340px] transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0 mt-2">
              Join us in our new space at 21 Umuawulu Street!
            </p>
            <div className="w-9 h-9 border-2 border-yard-milk flex justify-center items-center rounded2px absolute bottom-5 transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0">
              <img src={"/icons/share.svg"} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Upcoming;
