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
              Our Gallery
            </h1>
            <img
              src={"/line.svg"}
              alt="Line"
              className="md:-mt-4 -mt-2 w-40 md:w-40"
            />
          </div>
          <p className="w-[280px] md:w-[600px] lg:w-[814px] text-center text-yard-text my-4 font-lato text-[16px] font-[400] tracking-[0.5px] leading-6">
            Step into our world of serene beauty and vibrant celebrations.
            Browse our favorite moments and get inspired for your own Yard
            experience.
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
