import Link from "next/link";

const Hero = () => {
  return (
    <>
      <header className="pt-16 pb-10 px-14 flex justify-center relative">
        <img
          src={"/celebration.svg"}
          alt="Celebration Icon"
          width={70}
          className="absolute bottom-24 left-0"
        />
        <section className="flex flex-col items-center justify-center">
          <div className="title flex flex-col items-end">
            <h1 className="font-playfair text-[48px] text-yard-primary font-bold leading-[56px] tracking-[-0.1px]">
              Where Serenity Meets Celebration
            </h1>
            <img src={"/line.svg"} alt="Line" className="-mt-4" />
          </div>
          <p className="w-[814px] text-center text-yard-text my-4 font-lato text-[16px] font-[400] tracking-[0.5px] leading-6">
            Nestled in the heart of Independence Layout, Enugu, The Yard Picnic
            Park offers a serene, picturesque setting—perfect for picnics,
            intimate gatherings, and unforgettable celebrations.
          </p>
          <Link
            href={"#"}
            className="cta-btn group relative overflow-hidden hover:text-yard-dark-primary"
          >
            <span className="z-50">Plan your perfect picnic</span>
            <div className="absolute top-0 left-0 bg-yard-primary-active w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </Link>
        </section>
        <img
          src={"/celebration.svg"}
          alt="Celebration Icon"
          width={70}
          className="absolute top-20 right-0"
        />
      </header>
      <section className="w-full h-max px-14">
        <div className="h-[520px] bg-[url('/hero.svg')] bg-cover bg-center rounded-xl"></div>
      </section>
    </>
  );
};

export default Hero;
