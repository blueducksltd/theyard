import Link from "next/link";

const Introduction = () => {
  return (
    <section className="flex justify-center py-20">
      <div className="relative flex items-center justify-center">
        <div className="w-[305px] md:w-[720px] h-[400px] md:h-[375px] border-x-2 border-yard-lighter-orange justify-center items-center"></div>
        <div className="w-[330px] md:w-[800px] h-[370px] md:h-[295px] border-y-2 border-yard-lighter-orange absolute flex flex-col items-start pt-8 px-8 md:pt-10 md:px-24 gap-4">
          <div className="title flex flex-col items-end">
            <h1 className="">Quick Introduction</h1>
            <img src={"/line.svg"} alt="Line" className="-mt-3" width={180} />
          </div>

          <p className="paragraph">
            At The Yard, we believe every moment is worth celebrating. Whether
            you’re here for a quiet picnic, a romantic date, or a joyful event
            with friends, our lush green spaces and curated setups create
            memories you’ll cherish forever.
          </p>

          <Link
            href={"#"}
            className="cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden"
          >
            <span className="z-40">Learn more about us</span>
            <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </Link>

          <div className="flex absolute bottom-20 right-5 md:bottom-16 md:right-28">
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

export default Introduction;
