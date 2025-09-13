import Link from "next/link";

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
              Our Packages
            </h1>
            <img
              src={"/line.svg"}
              alt="Line"
              className="md:-mt-4 -mt-2 w-40 md:w-52"
            />
          </div>
          <p className="w-[280px] md:w-[600px] lg:w-[814px] text-center text-yard-text my-4 font-lato text-[16px] font-[400] tracking-[0.5px] leading-6">
            Whether you’re planning a romantic picnic for two, a birthday with
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
      <section className="w-full h-max flex flex-wrap justify-center items-center gap-6 md:px-14">
        {/*Single Package*/}
        <div className="w-[449px] border-2 border-yard-lighter-orange p-4 rounded-[1px]">
          <div className="w-full h-[203px] bg-[url('/gallery/gallery4.svg')] bg-cover bg-center rounded-[2px]"></div>
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-0 md:items-center justify-between my-3">
            <div className="title flex flex-col items-end">
              <h1 className="font-playfair text-2xl text-yard-primary font-bold md:leading-[56px] tracking-[-0.1px]">
                Picnic Package
              </h1>
              <img
                src={"/about-line.svg"}
                alt="Line"
                className="-mt-2 md:-mt-5 w-40 md:w-40"
              />
            </div>

            <div className="w-max  bg-yard-primary-active font-playfair text-yard-dark-primary text-lg px-1.5 rounded-[2px]">
              Starting at <b>N8000</b>
            </div>
          </div>
          <p className="text-[16px] italic leading-6 tracking-[0.5px] text-[#717068]">
            Includes:
          </p>

          <div className="flex flex-col gap-4 my-3">
            <div className="flex items-center gap-3 text-[16px] leading-6 tracking-[0.5px] text-[#717068]">
              <img src={"/icons/checkmark.svg"} />
              <p>Perfect for casual gatherings or date days</p>
            </div>

            <div className="flex items-center gap-3 text-[16px] leading-6 tracking-[0.5px] text-[#717068]">
              <img src={"/icons/checkmark.svg"} />
              <p>Blankets</p>
            </div>

            <div className="flex items-center gap-3 text-[16px] leading-6 tracking-[0.5px] text-[#717068]">
              <img src={"/icons/checkmark.svg"} />
              <p> Cushions</p>
            </div>

            <div className="flex items-center gap-3 text-[16px] leading-6 tracking-[0.5px] text-[#717068]">
              <img src={"/icons/checkmark.svg"} />
              <p>Low Tables</p>
            </div>

            <div className="flex items-center gap-3 text-[16px] leading-6 tracking-[0.5px] text-[#717068]">
              <img src={"/icons/checkmark.svg"} />
              <p>Decor Props</p>
            </div>

            <div className="flex items-center gap-3 text-[16px] leading-6 tracking-[0.5px] text-[#717068]">
              <img src={"/icons/checkmark.svg"} />
              <p>Lush Garden Setting</p>
            </div>
          </div>
          {/*cta*/}
          <Link
            href={"#"}
            className="w-full h-[52px] lg:flex justify-center items-center bg-yard-primary text-white mt-5 px-6 py-5 rounded-[2px] hidden group relative overflow-hidden"
          >
            <span className="z-40">Book this package</span>
            <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </Link>
        </div>
        {/*End of package*/}

        {/*Single Package*/}
        <div className="w-[449px] border-2 border-yard-lighter-orange p-4 rounded-[1px]">
          <div className="w-full h-[203px] bg-[url('/gallery/gallery4.svg')] bg-cover bg-center rounded-[2px]"></div>
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-0 md:items-center justify-between my-3">
            <div className="title flex flex-col items-end">
              <h1 className="font-playfair text-2xl text-yard-primary font-bold md:leading-[56px] tracking-[-0.1px]">
                Intimate Event Package
              </h1>
              <img
                src={"/about-line.svg"}
                alt="Line"
                className="-mt-2 md:-mt-5 w-40 md:w-40"
              />
            </div>

            <div className="w-max  bg-yard-primary-active font-playfair text-yard-dark-primary text-lg px-1.5 rounded-[2px]">
              Starting at <b>N8000</b>
            </div>
          </div>
          <p className="text-[16px] italic leading-6 tracking-[0.5px] text-[#717068]">
            Includes:
          </p>

          <div className="flex flex-col gap-4 my-3">
            <div className="flex items-center gap-3 text-[16px] leading-6 tracking-[0.5px] text-[#717068]">
              <img src={"/icons/checkmark.svg"} />
              <p>Perfect for casual gatherings or date days</p>
            </div>

            <div className="flex items-center gap-3 text-[16px] leading-6 tracking-[0.5px] text-[#717068]">
              <img src={"/icons/checkmark.svg"} />
              <p>Blankets</p>
            </div>

            <div className="flex items-center gap-3 text-[16px] leading-6 tracking-[0.5px] text-[#717068]">
              <img src={"/icons/checkmark.svg"} />
              <p> Cushions</p>
            </div>

            <div className="flex items-center gap-3 text-[16px] leading-6 tracking-[0.5px] text-[#717068]">
              <img src={"/icons/checkmark.svg"} />
              <p>Low Tables</p>
            </div>

            <div className="flex items-center gap-3 text-[16px] leading-6 tracking-[0.5px] text-[#717068]">
              <img src={"/icons/checkmark.svg"} />
              <p>Decor Props</p>
            </div>

            <div className="flex items-center gap-3 text-[16px] leading-6 tracking-[0.5px] text-[#717068]">
              <img src={"/icons/checkmark.svg"} />
              <p>Lush Garden Setting</p>
            </div>
          </div>
          {/*cta*/}
          <Link
            href={"#"}
            className="w-full h-[52px] lg:flex justify-center items-center bg-yard-primary text-white mt-5 px-6 py-5 rounded-[2px] hidden group relative overflow-hidden"
          >
            <span className="z-40">Book this package</span>
            <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </Link>
        </div>
        {/*End of package*/}

        {/*Single Package*/}
        <div className="w-[449px] border-2 border-yard-lighter-orange p-4 rounded-[1px]">
          <div className="w-full h-[203px] bg-[url('/gallery/gallery4.svg')] bg-cover bg-center rounded-[2px]"></div>
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-0 md:items-center justify-between my-3">
            <div className="title flex flex-col items-end">
              <h1 className="font-playfair text-2xl text-yard-primary font-bold md:leading-[56px] tracking-[-0.1px]">
                Fully Party Package
              </h1>
              <img
                src={"/about-line.svg"}
                alt="Line"
                className="-mt-2 md:-mt-5 w-40 md:w-40"
              />
            </div>

            <div className="w-max  bg-yard-primary-active font-playfair text-yard-dark-primary text-lg px-1.5 rounded-[2px]">
              Starting at <b>N8000</b>
            </div>
          </div>
          <p className="text-[16px] italic leading-6 tracking-[0.5px] text-[#717068]">
            Includes:
          </p>

          <div className="flex flex-col gap-4 my-3">
            <div className="flex items-center gap-3 text-[16px] leading-6 tracking-[0.5px] text-[#717068]">
              <img src={"/icons/checkmark.svg"} />
              <p>Perfect for casual gatherings or date days</p>
            </div>

            <div className="flex items-center gap-3 text-[16px] leading-6 tracking-[0.5px] text-[#717068]">
              <img src={"/icons/checkmark.svg"} />
              <p>Blankets</p>
            </div>

            <div className="flex items-center gap-3 text-[16px] leading-6 tracking-[0.5px] text-[#717068]">
              <img src={"/icons/checkmark.svg"} />
              <p> Cushions</p>
            </div>

            <div className="flex items-center gap-3 text-[16px] leading-6 tracking-[0.5px] text-[#717068]">
              <img src={"/icons/checkmark.svg"} />
              <p>Low Tables</p>
            </div>

            <div className="flex items-center gap-3 text-[16px] leading-6 tracking-[0.5px] text-[#717068]">
              <img src={"/icons/checkmark.svg"} />
              <p>Decor Props</p>
            </div>

            <div className="flex items-center gap-3 text-[16px] leading-6 tracking-[0.5px] text-[#717068]">
              <img src={"/icons/checkmark.svg"} />
              <p>Lush Garden Setting</p>
            </div>
          </div>
          {/*cta*/}
          <Link
            href={"#"}
            className="w-full h-[52px] lg:flex justify-center items-center bg-yard-primary text-white mt-5 px-6 py-5 rounded-[2px] hidden group relative overflow-hidden"
          >
            <span className="z-40">Book this package</span>
            <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </Link>
        </div>
        {/*End of package*/}
      </section>
    </>
  );
};

export default Hero;
