{
  /*eslint-disable @next/next/no-img-element*/
}
import { IService } from "@/types/Service";
import { getServices } from "@/util";
import Link from "next/link";

const Featured = async () => {
  const services: IService[] = (await getServices()).data.services;

  return (
    <main className="md:my-4">
      <header className="flex flex-col gap-5 md:flex-row justify-between md:items-center">
        <div className="flex flex-col items-start gap-4">
          <div className="title flex flex-col items-end">
            <h1 className="">Featured Services</h1>
            <img src={"/featured-line.svg"} alt="Line" className="-mt-3 w-28" />
          </div>
          <p className="paragraph w-[280px] md:w-96 lg:w-[650px]">
            We offer more than just a venue—we create experiences. Our services
            are designed to be flexible, so you can make your day uniquely
            yours.
          </p>
        </div>

        <Link
          href={"#"}
          className="cta-btn group relative overflow-hidden hover:text-yard-dark-primary"
        >
          <span className="z-40">Explore all services</span>
          <div className="absolute top-0 left-0 bg-yard-primary-active w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
        </Link>
      </header>

      <section className="grid md:grid-cols-3 items-center my-4 gap-4">
        {services.slice(0, 3).map((service: IService) => (
          <div
            key={service.id}
            className="flex flex-col border-[1px] border-yard-pinkish-orange py-4 px-2 gap-2 rounded-md"
          >
            <div
              className={`h-[156px] rounded-[2px] bg-center bg-cover`}
              style={{ backgroundImage: `url(${service.imageUrl})` }}
            ></div>
            <h2>{service.name}</h2>
            <p className="paragraph">{service.description}</p>

            <Link href={"/booking"} className="cta-link w-max group relative">
              Book a space now
              <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
            </Link>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Featured;
