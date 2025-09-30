{
  /*eslint-disable @next/next/no-img-element*/
}
const Vision = () => {
  return (
    <section className="flex flex-col md:flex-row gap-10 md:gap-28 justify-center py-20">
      <div className="relative flex items-center justify-center">
        <div className="w-[305px] md:w-[494px] h-[290px] md:h-[354px] border-x-2 border-yard-lighter-orange justify-center items-center"></div>
        <div className="w-[330px] md:w-[558px] h-[230px] md:h-[274px] border-y-2 border-yard-lighter-orange absolute flex flex-col items-center pt-8 px-8 md:pt-10 md:px-24 gap-4">
          <div className="title flex flex-col items-end">
            <h1 className="">Our Mission</h1>
            <img src={"/about-line.svg"} alt="Line" className="-mt-3" />
          </div>

          <p className="paragraph text-center">
            To craft memorable outdoor experiences in a serene, nature-inspired
            setting that blends elegance with relaxation.
          </p>

          <div className="flex absolute bottom-20 right-5 md:bottom-10 md:right-16">
            <img
              src={"/celebration.svg"}
              alt="Celebration"
              className="hidden md:block md:w-12"
            />
            <img
              src={"/celebration.svg"}
              alt="Celebration"
              className="hidden md:block md:w-12"
            />

            <img
              src={"/celebration-reverse.svg"}
              alt="Celebration"
              className="w-7 md:hidden"
            />
            <img
              src={"/celebration-reverse.svg"}
              alt="Celebration"
              className="w-7 md:hidden"
            />
          </div>
        </div>
      </div>

      {/*Vision*/}
      <div className="relative flex items-center justify-center">
        <div className="w-[305px] md:w-[494px] h-[290px] md:h-[354px] border-x-2 border-yard-lighter-orange justify-center items-center"></div>
        <div className="w-[330px] md:w-[558px] h-[230px] md:h-[274px] border-y-2 border-yard-lighter-orange absolute flex flex-col items-center pt-8 px-8 md:pt-10 md:px-24 gap-4">
          <div className="title flex flex-col items-end">
            <h1 className="">Our Vision</h1>
            <img src={"/about-line.svg"} alt="Line" className="-mt-3 w-24" />
          </div>

          <p className="paragraph text-center">
            To be Enugu’s go-to destination for intimate celebrations, peaceful
            escapes, and creative gatherings.
          </p>

          <div className="flex absolute bottom-20 right-5 md:bottom-10 md:right-16">
            <img
              src={"/celebration.svg"}
              alt="Celebration"
              className="hidden md:block md:w-12"
            />
            <img
              src={"/celebration.svg"}
              alt="Celebration"
              className="hidden md:block md:w-12"
            />

            <img
              src={"/celebration-reverse.svg"}
              alt="Celebration"
              className="w-7 md:hidden"
            />
            <img
              src={"/celebration-reverse.svg"}
              alt="Celebration"
              className="w-7 md:hidden"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;
