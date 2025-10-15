import { IService } from "@/types/Service";
// import { getServices } from "@/util";
import Link from "next/link";

export default async function Services() {
  // const services: IService[] = (await getServices()).data.services;
  const services: IService[] = [];

  return (
    <main className="flex flex-col gap-[60px] md:justify-center items-center mt-10">
      {services.map((service, index) => (
        <div
          key={service.id as string}
          className={`w-[280px] md:w-[990px] md:h-[360px] flex flex-col ${
            index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
          } items-center gap-5 md:gap-[60px]`}
        >
          <div
            className="w-[280px] md:w-[680px] h-[360px] bg-center bg-cover rounded2px"
            style={{
              backgroundImage: `url(${service.imageUrl})`,
            }}
          ></div>
          <div className="w-[280px] md:w-[450px] flex flex-col gap-2 md:gap-6">
            <h3 className="text-yard-primary font-playfair font-semibold text-2xl md:text-[32px] leading-10 tracking-[-0.1px]">
              {service.name}
            </h3>
            <p className="paragraph">{service.description}</p>
            <Link
              href={"/booking"}
              className="cta-btn group relative overflow-hidden hover:text-yard-dark-primary"
            >
              <span className="z-40">Book a space now</span>
              <div className="absolute top-0 left-0 bg-yard-primary-active w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </Link>
          </div>
        </div>
      ))}
    </main>
  );
}
