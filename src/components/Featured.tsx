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

        <Link href={"#"} className="cta-btn">
          Explore all services
        </Link>
      </header>

      <section className="grid grid-cols-3 items-center my-4 gap-4">
        <div className="flex flex-col border-[1px] border-yard-pinkish-orange py-4 px-2 gap-2 rounded-md">
          <div className="h-[156px] rounded-[2px] bg-[url('/featured1.svg')] bg-center bg-cover"></div>
          <h2>Picnic Spaces</h2>
          <p className="paragraph">
            Relax in nature with our charming picnic setups.
          </p>

          <Link href={"#"} className="cta-link">
            Book a space now
          </Link>
        </div>

        <div className="flex flex-col border-[1px] border-yard-pinkish-orange py-4 px-2 gap-2 rounded-md">
          <div className="h-[156px] rounded-[2px] bg-[url('/featured2.svg')] bg-center bg-cover"></div>
          <h2>Event Hosting</h2>
          <p className="paragraph">
            Celebrate life&apos;s special moments in grand and unique style.
          </p>

          <Link href={"#"} className="cta-link">
            Let&apos;s host your event
          </Link>
        </div>

        <div className="flex flex-col border-[1px] border-yard-pinkish-orange py-4 px-2 gap-2 rounded-md">
          <div className="h-[156px] rounded-[2px] bg-[url('/featured3.svg')] bg-center bg-cover"></div>
          <h2>Custom Packages</h2>
          <p className="paragraph">
            Add catering, décor, and games for a truly unique experience.
          </p>

          <Link href={"#"} className="cta-link">
            Explore packages
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Featured;
