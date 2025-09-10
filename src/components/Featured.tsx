import Link from "next/link";

const Featured = () => {
  return (
    <main className="w-full my-4">
      <header className="flex justify-between items-center">
        <div className="flex flex-col items-start gap-4">
          <div className="title flex flex-col items-end">
            <h1 className="">Featured Services</h1>
            <img src={"/featured-line.svg"} alt="Line" className="-mt-3 w-28" />
          </div>
          <p className="paragraph w-[650px]">
            We offer more than just a venue—we create experiences. Our services
            are designed to be flexible, so you can make your day uniquely
            yours.
          </p>
        </div>

        <Link
          href={"#"}
          className="cta-btn group relative overflow-hidden hover:text-yard-dark-primary"
        >
          <span className="z-50">Explore all services</span>
          <div className="absolute top-0 left-0 bg-yard-primary-active w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
        </Link>
      </header>

      <section className="grid grid-cols-3 items-center my-4 gap-4">
        <div className="flex flex-col border-[1px] border-yard-pinkish-orange py-4 px-2 gap-2 rounded-md">
          <div className="h-[156px] rounded-[2px] bg-[url('/featured1.svg')] bg-center bg-cover"></div>
          <h2>Picnic Spaces</h2>
          <p className="paragraph">
            Relax in nature with our charming picnic setups.
          </p>

          <Link href={"#"} className="cta-link w-max group relative">
            Book a space now
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>
        </div>

        <div className="flex flex-col border-[1px] border-yard-pinkish-orange py-4 px-2 gap-2 rounded-md">
          <div className="h-[156px] rounded-[2px] bg-[url('/featured2.svg')] bg-center bg-cover"></div>
          <h2>Event Hosting</h2>
          <p className="paragraph">
            Celebrate life&apos;s special moments in grand and unique style.
          </p>

          <Link href={"#"} className="cta-link w-max group relative">
            Let&apos;s host your event
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>
        </div>

        <div className="flex flex-col border-[1px] border-yard-pinkish-orange py-4 px-2 gap-2 rounded-md">
          <div className="h-[156px] rounded-[2px] bg-[url('/featured3.svg')] bg-center bg-cover"></div>
          <h2>Custom Packages</h2>
          <p className="paragraph">
            Add catering, décor, and games for a truly unique experience.
          </p>

          <Link href={"#"} className="cta-link w-max group relative">
            Explore packages
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Featured;
