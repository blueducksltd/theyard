import Link from "next/link";

export default function Services() {
  return (
    <main className="flex flex-col gap-[60px] md:justify-center items-center mt-10">
      <div className="w-[280px] md:w-[990px] md:h-[360px] flex flex-col md:flex-row items-center gap-5 md:gap-[60px]">
        <div className="w-[280px] md:w-[680px] h-[360px] bg-center bg-[url('/gallery/gallery4.svg')] bg-cover rounded2px"></div>
        <div className="w-[280px] md:w-[450px] flex flex-col gap-2 md:gap-6">
          <h3 className="text-yard-primary font-playfair font-semibold text-2xl md:text-[32px] leading-10 tracking-[-0.1px]">
            Picnic Spaces gatherings
          </h3>
          <p className="paragraph">
            Relax in nature with our charming picnic setups. We offer an
            organized ranquil outdoor settings for lounging, reading, or
            informal.
          </p>
          <Link
            href={"#"}
            className="cta-btn group relative overflow-hidden hover:text-yard-dark-primary"
          >
            <span className="z-40">Book a space now</span>
            <div className="absolute top-0 left-0 bg-yard-primary-active w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </Link>
        </div>
      </div>

      <div className="w-[280px] md:w-[990px] md:h-[360px] flex flex-col-reverse md:flex-row items-center gap-5 md:gap-[60px]">
        <div className="w-[280px] md:w-[450px] flex flex-col gap-2 md:gap-6">
          <h3 className="text-yard-primary font-playfair font-semibold text-2xl md:text-[32px] leading-10 tracking-[-0.1px]">
            Event Hosting
          </h3>
          <p className="paragraph">
            Celebrate life&apos;s special moments in grand and unique style. We
            provide tasteful setups for birthdays, date nights, and small
            celebrations.
          </p>
          <Link
            href={"#"}
            className="cta-btn group relative overflow-hidden hover:text-yard-dark-primary"
          >
            <span className="z-40">Let&apos;s host your event</span>
            <div className="absolute top-0 left-0 bg-yard-primary-active w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </Link>
        </div>
        <div className="w-[280px] md:w-[680px] h-[360px] bg-center bg-[url('/gallery/gallery.svg')] bg-cover rounded2px"></div>
      </div>

      <div className="w-[280px] md:w-[990px] md:h-[360px] flex flex-col md:flex-row items-center gap-5 md:gap-[60px]">
        <div className="w-[280px] md:w-[680px] h-[360px] bg-center bg-[url('/gallery/gallery3.svg')] bg-cover rounded2px"></div>
        <div className="w-[280px] md:w-[450px] flex flex-col gap-2 md:gap-6">
          <h3 className="text-yard-primary font-playfair font-semibold text-2xl md:text-[32px] leading-10 tracking-[-0.1px]">
            Customizable Packages
          </h3>
          <p className="paragraph">
            Add catering, décor, and games for a truly unique experience. We add
            decor, catering, games, and lighting to suit your style.
          </p>
          <Link
            href={"#"}
            className="cta-btn group relative overflow-hidden hover:text-yard-dark-primary"
          >
            <span className="z-40">Book a spot now</span>
            <div className="absolute top-0 left-0 bg-yard-primary-active w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </Link>
        </div>
      </div>
      <div className="w-[280px] md:w-[990px] md:h-[360px] flex flex-col-reverse md:flex-row items-center gap-5 md:gap-[60px]">
        <div className="w-[280px] md:w-[450px] flex flex-col gap-2 md:gap-6">
          <h3 className="text-yard-primary font-playfair font-semibold text-2xl md:text-[32px] leading-10 tracking-[-0.1px]">
            Bistro / Snack Add-ons
          </h3>
          <p className="paragraph">
            Enhance your picnic with bites, drinks, or full catering. Whether
            it&apos;s chapman, milkshake, small chops etc we are sure to
            deliver.
          </p>
          <Link
            href={"#"}
            className="cta-btn group relative overflow-hidden hover:text-yard-dark-primary"
          >
            <span className="z-40">Book us now</span>
            <div className="absolute top-0 left-0 bg-yard-primary-active w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </Link>
        </div>
        <div className="w-[280px] md:w-[680px] h-[360px] bg-center bg-[url('/gallery/gallery2.svg')] bg-cover rounded2px"></div>
      </div>
    </main>
  );
}
