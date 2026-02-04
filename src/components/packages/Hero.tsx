"use client";
import { IPackage } from "@/types/Package";
import Link from "next/link";
import { useState } from "react";
import Modal from "../Modal";

interface HeroProps {
  packages: IPackage[];
}

const Hero = ({ packages }: HeroProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<IPackage | null>(null);

  const handleShowAllSpecs = (pkg: IPackage) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  return (
    <>
      <header className="pt-10 md:pt-16 pb-5 px-4 md:px-14 flex justify-center relative">
        <img
          src={"/celebration.svg"}
          alt="Celebration Icon"
          className="absolute bottom-[310px] -left-10 md:bottom-24 md:left-0 w-8 md:w-[70px]"
        />
        <section className="flex flex-col items-center justify-center">
          <div className="title flex flex-col items-end">
            <h1 className="font-playfair w-[250px] text-center text-[32px] md:w-96 lg:w-full md:text-[48px] text-yard-primary font-bold md:leading-[56px] tracking-[-0.1px]">
              Our Packages
            </h1>
            <img
              src={"/line.svg"}
              alt="Line"
              className="md:-mt-4 -mt-2 w-40 md:w-52"
            />
          </div>
          <p className="w-[280px] md:w-[600px] lg:w-[814px] text-center text-yard-text my-4 font-lato text-[16px] font-[400] tracking-[0.5px] leading-6">
            Whether you're planning a romantic picnic for two, a birthday with
            friends, or a stylish intimate wedding, The Yard offers curated
            packages tailored to your needs.
          </p>
        </section>
        <img
          src={"/celebration.svg"}
          alt="Celebration Icon"
          width={70}
          className="absolute top-20 right-0 hidden md:block"
        />
      </header>
      <section className="w-full h-max flex flex-wrap justify-center items-start gap-6 md:px-14">
        {/*Single Package*/}
        {packages.map((pk) => (
          <div
            key={pk.id as string}
            className="w-[449px] border-2 border-yard-lighter-orange p-4 rounded-[1px] flex-grow"
          >
            <div
              className="w-full h-[203px] bg-cover bg-center rounded-[2px]"
              style={{ backgroundImage: `url(${pk.imageUrl})` }}
            ></div>
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-0 md:items-center justify-between my-3">
              <div className="title flex flex-col items-end">
                <h1 className="font-playfair text-2xl text-yard-primary font-bold md:leading-[56px] tracking-[-0.1px]">
                  {pk.name}
                </h1>
                <img
                  src={"/about-line.svg"}
                  alt="Line"
                  className="-mt-2 md:-mt-5 w-full"
                />
              </div>

              <div className="w-max  bg-yard-primary-active font-playfair text-yard-dark-primary text-lg px-1.5 rounded-[2px]">
                Starting at <b>N{Intl.NumberFormat().format(pk.price)}</b>
              </div>
            </div>
            <p className="text-[16px] italic leading-6 tracking-[0.5px] text-[#717068]">
              Includes:
            </p>

            <div className="flex flex-col gap-4 my-3">
              {pk.specs.slice(0, 3).map((spec, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-[16px] leading-6 tracking-[0.5px] text-[#717068]"
                >
                  <img src={"/icons/checkmark.svg"} alt="Checkmark Icon" />
                  <p>{spec}</p>
                </div>
              ))}
              {pk.specs.length > 3 && (
                <button
                  onClick={() => handleShowAllSpecs(pk)}
                  className="flex items-center gap-3 text-[16px] leading-6 tracking-[0.5px] text-yard-primary hover:underline cursor-pointer"
                >
                  <img src={"/icons/checkmark.svg"} alt="Checkmark Icon" />
                  <p>+ {pk.specs.length - 3} more (click to see all)</p>
                </button>
              )}
            </div>
            {/*cta*/}
            <Link
              href={"/booking"}
              className="w-full h-[52px] lg:flex justify-center items-center bg-yard-primary text-white mt-5 px-6 py-5 rounded-[2px] hidden group relative overflow-hidden"
            >
              <span className="z-40">Book this package</span>
              <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </Link>
          </div>
        ))}
        {/*End of package*/}
      </section>

      {/* Modal for showing all specs */}
      <Modal isOpen={isModalOpen}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between mt-10">
            <div className="title flex flex-col items-start">
              <h1 className="font-playfair text-xl md:text-[28px] text-yard-primary font-bold leading-9 tracking-[-0.1px]">
                {selectedPackage?.name} - All Features
              </h1>
              <img
                src={"/line.svg"}
                alt="Line"
                className="-mt-2 w-40 md:mr-0 md:w-52 "
              />
            </div>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setIsModalOpen(false)}
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

        <div className="w-full flex flex-col mt-8 gap-4 max-h-[60vh] overflow-y-auto px-2">
          <p className="text-[16px] italic leading-6 tracking-[0.5px] text-[#717068]">
            This package includes:
          </p>
          {selectedPackage?.specs.map((spec, i) => (
            <div
              key={i}
              className="flex items-start gap-3 text-[16px] leading-6 tracking-[0.5px] text-[#717068]"
            >
              <img src={"/icons/checkmark.svg"} alt="Checkmark Icon" className="mt-1 flex-shrink-0" />
              <p>{spec}</p>
            </div>
          ))}
        </div>

        <div className="w-full flex justify-center mt-6 mb-4">
          <Link
            href={"/booking"}
            onClick={() => setIsModalOpen(false)}
            className="w-full md:w-[400px] h-[52px] flex justify-center items-center bg-yard-primary text-white px-6 py-5 rounded-[2px] group relative overflow-hidden"
          >
            <span className="z-40">Book this package</span>
            <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </Link>
        </div>
      </Modal>
    </>
  );
};

export default Hero;