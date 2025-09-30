/*eslint-disable @next/next/no-img-element*/

import BookingCalendar from "./Calender";

const Hero = () => {
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
              Book Your Spot
            </h1>
            <img
              src={"/line.svg"}
              alt="Line"
              className="md:-mt-4 -mt-2 w-40 mr-10 md:mr-0 md:w-52 "
            />
          </div>
        </section>
      </header>
      <section className="w-full flex flex-col md:flex-row items-start h-max gap-10 px-5 md:px-14 mt-10">
        <div className="md:w-[257px] h-[358px] md:h-[404px] shadow-2xl">
          <h2 className="w-full bg-yard-primary text-2xl text-yard-lightgreen flex justify-center items-center py-4 px-6 font-playfair font-bold md:text-xl">
            How To Book a Date
          </h2>
          <div className="p-6 text-sm flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <img
                src={"/icons/checkmark.svg"}
                alt="Check Icon"
                className="mt-2"
              />
              <p className="text-[#717068] text-sm md:text-[16px]">
                Choose your date from our interactive calendar <b>below</b>.{" "}
                <br /> (
                <span className="text-green-600">green = Fully available,</span>{" "}
                <br />
                <span className="text-red-600">red = Not available,</span>
                <br />
                <span className="text-yellow-600">
                  yellow = Still available
                </span>
                )
              </p>
            </div>

            <div className="flex items-start gap-3">
              <img
                src={"/icons/checkmark.svg"}
                alt="Check Icon"
                className="mt-2"
              />
              <p className="text-[#717068] text-sm md:text-[16px]">
                Fill in the booking form with your details and package choice.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <img
                src={"/icons/checkmark.svg"}
                alt="Check Icon"
                className="mt-2"
              />
              <p className="text-[#717068] text-sm md:text-[16px]">
                Receive instant confirmation and a 24-hour reminder before your
                event.
              </p>
            </div>
          </div>
        </div>

        {/*Calender*/}
        <BookingCalendar />
      </section>
    </>
  );
};

export default Hero;
