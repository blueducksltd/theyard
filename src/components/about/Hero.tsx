{
  /*eslint-disable @next/next/no-img-element*/
}

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
              Our Story
            </h1>
            <img
              src={"/about-line.svg"}
              alt="Line"
              className="md:-mt-4 -mt-2 w-24 mr-10 md:mr-0 md:w-32"
            />
          </div>
          <p className="w-[280px] md:w-[600px] lg:w-[814px] text-center text-yard-text my-4 font-lato text-[16px] font-[400] tracking-[0.5px] leading-6">
            The Yard Picnic Park was born from a desire to create an elegant,
            open-air sanctuary right in the city’s vibrant Independence Layout.
            We wanted a place where people could step away from the bustle of
            everyday life and reconnect with nature, friends, and loved ones.
          </p>
        </section>
        <img
          src={"/celebration.svg"}
          alt="Celebration Icon"
          width={70}
          className="absolute top-20 right-0 hidden md:block"
        />
      </header>
      <section className="w-full h-max flex flex-row-reverse md:flex-row justify-center items-center gap-3 md:px-14">
        <div className="w-[64px] h-[216px] md:w-[242px] md:h-[520px] bg-[url('/about/about.svg')] bg-cover bg-center"></div>
        <div className="w-[64px] h-[216px] md:w-[242px] md:h-[520px] bg-[url('/about/about-2.svg')] bg-cover bg-center"></div>
        <div className="w-[64px] h-[216px] md:w-[242px] md:h-[520px] bg-[url('/about/about-3.svg')] bg-cover bg-center"></div>
        <div className="w-[64px] h-[216px] md:w-[242px] md:h-[520px] bg-[url('/about/about-4.svg')] bg-cover bg-center"></div>
      </section>
    </>
  );
};

export default Hero;
