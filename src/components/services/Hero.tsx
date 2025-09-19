const Hero = () => {
  return (
    <>
      <header className="pt-10 md:pt-16 pb-5 px-4 md:px-14 flex justify-center relative">
        {/*<img
          src={"/celebration.svg"}
          alt="Celebration Icon"
          className="absolute bottom-[310px] -left-10 md:bottom-24 md:left-0 w-8 md:w-[70px]"
        />*/}
        <section className="flex flex-col items-center justify-center">
          <div className="title flex flex-col items-end">
            <h1 className="font-playfair w-[250px] text-center text-[32px] md:w-96 lg:w-full md:text-[48px] text-yard-primary font-bold md:leading-[56px] tracking-[-0.1px]">
              Our Services
            </h1>
            <img
              src={"/about-line.svg"}
              alt="Line"
              className="md:-mt-4 -mt-3 mr-7 md:mr-0 w-32 md:w-44"
            />
          </div>
          <p className="w-[280px] md:w-[600px] lg:w-[814px] text-center text-yard-text my-4 font-lato text-[16px] font-[400] tracking-[0.5px] leading-6">
            We offer more than just a venue, we create experiences. Our services
            are designed to be flexible, so you can make your day uniquely
            yours.
          </p>
        </section>
        {/*<img
          src={"/celebration.svg"}
          alt="Celebration Icon"
          width={70}
          className="absolute top-20 right-0 hidden md:block"
        />*/}
      </header>
    </>
  );
};

export default Hero;
