{
  /*eslint-disable @next/next/no-img-element*/
}
import Link from "next/link";

const Gallery = () => {
  return (
    <main className="md:my-4">
      <header className="flex flex-col md:flex-row items-start gap-5 justify-between md:items-center">
        <div className="flex flex-col items-start gap-2">
          <div className="title flex flex-col items-end">
            <h1 className="">Gallery Teaser</h1>
            <img src={"/featured-line.svg"} alt="Line" className="-mt-3 w-24" />
          </div>
          <p className="paragraph lg:w-[650px]">
            See more of our space in action
          </p>
        </div>

        <Link
          href={"#"}
          className="cta-btn group relative overflow-hidden hover:text-yard-dark-primary"
        >
          <span className="z-40">View full gallery</span>
          <div className="absolute top-0 left-0 bg-yard-primary-active w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
        </Link>
      </header>

      <section className="w-full flex flex-wrap items-center my-5 md:my-4 gap-1">
        <div className="w-[817px] 2xl:w-[1093px] h-[260px] 2xl:h-[300px] bg-[url('/gallery/gallery.svg')] bg-cover bg-center flex-grow relative overflow-hidden group">
          {/*Inner Hover*/}
          <div className="absolute w-full h-full p-4 bg-[#090F10CC] top-48 md:top-0 left-0 transition-all duration-500 md:translate-y-full group-hover:translate-y-0 opacity-80">
            <p className="text-yard-milk transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 absolute top-2 md:top-auto md:bottom-12 md:relative md:mt-12">
              12/09/2025
              <img
                src={"/featured-line.svg"}
                alt="featured-line"
                className="-mt-2 w-22 md:-translate-x-full transition-all delay-300 duration-500 group-hover:translate-x-0"
              />
            </p>

            <Link
              href={"#"}
              className="w-max h-max group absolute top-8 md:top-auto md:bottom-10 md:relative text-yard-milk font-playfair font-[700] text-xl md:text-[28px] leading-[36px] tracking-[-0.1px]"
            >
              Relocation Celebration
              <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
            </Link>
            <p className="paragraph hidden md:block text-gray-200 w-[340px] transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0 -mt-7">
              Join us in our new space at 21 Umuawulu Street!
            </p>
            <div className="w-7 h-7 md:w-9 md:h-9 border-2 border-yard-milk flex justify-center items-center rounded2px absolute top-7 md:top-auto md:bottom-5 transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 right-5 md:left-5">
              <img src={"/icons/share.svg"} alt="share icon" />
            </div>
          </div>
        </div>

        <div className="w-[384px] 2xl:w-[500px] h-[260px] 2xl:h-[300px] bg-[url('/gallery/gallery2.svg')] bg-cover bg-center flex-grow relative overflow-hidden group">
          {/*Inner Hover*/}
          <div className="absolute w-full h-full p-4 bg-[#090F10CC] top-48 md:top-0 left-0 transition-all duration-500 md:translate-y-full group-hover:translate-y-0 opacity-80">
            <p className="text-yard-milk transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 absolute top-2 md:top-auto md:bottom-12 md:relative md:mt-12">
              12/09/2025
              <img
                src={"/featured-line.svg"}
                alt="featured-line"
                className="-mt-2 w-22 md:-translate-x-full transition-all delay-300 duration-500 group-hover:translate-x-0"
              />
            </p>

            <Link
              href={"#"}
              className="w-max h-max group absolute top-8 md:top-auto md:bottom-10 md:relative text-yard-milk font-playfair font-[700] text-xl md:text-[28px] leading-[36px] tracking-[-0.1px]"
            >
              Relocation Celebration
              <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
            </Link>
            <p className="paragraph hidden md:block text-gray-200 w-[340px] transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0 -mt-7">
              Join us in our new space at 21 Umuawulu Street!
            </p>
            <div className="w-7 h-7 md:w-9 md:h-9 border-2 border-yard-milk flex justify-center items-center rounded2px absolute top-7 md:top-auto md:bottom-5 transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 right-5 md:left-5">
              <img src={"/icons/share.svg"} alt="share icon" />
            </div>
          </div>
        </div>

        <div className="w-[384px] 2xl:w-[500px] h-[280px] 2xl:h-[320px] bg-[url('/gallery/gallery3.svg')] bg-cover bg-center flex-grow relative overflow-hidden group">
          {/*Inner Hover*/}
          <div className="absolute w-full h-full p-4 bg-[#090F10CC] top-48 md:top-0 left-0 transition-all duration-500 md:translate-y-full group-hover:translate-y-0 opacity-80">
            <p className="text-yard-milk transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 absolute top-2 md:top-auto md:bottom-12 md:relative md:mt-12">
              12/09/2025
              <img
                src={"/featured-line.svg"}
                alt="featured-line"
                className="-mt-2 w-22 md:-translate-x-full transition-all delay-300 duration-500 group-hover:translate-x-0"
              />
            </p>

            <Link
              href={"#"}
              className="w-max h-max group absolute top-8 md:top-auto md:bottom-10 md:relative text-yard-milk font-playfair font-[700] text-xl md:text-[28px] leading-[36px] tracking-[-0.1px]"
            >
              Relocation Celebration
              <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
            </Link>
            <p className="paragraph hidden md:block text-gray-200 w-[340px] transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0 -mt-7">
              Join us in our new space at 21 Umuawulu Street!
            </p>
            <div className="w-7 h-7 md:w-9 md:h-9 border-2 border-yard-milk flex justify-center items-center rounded2px absolute top-7 md:top-auto md:bottom-5 transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 right-5 md:left-5">
              <img src={"/icons/share.svg"} alt="share icon" />
            </div>
          </div>
        </div>

        <div className="w-[384px] 2xl:w-[500px] h-[280px] 2xl:h-[320px] bg-[url('/gallery/gallery4.svg')] bg-cover bg-center flex-grow relative overflow-hidden group">
          {/*Inner Hover*/}
          <div className="absolute w-full h-full p-4 bg-[#090F10CC] top-48 md:top-0 left-0 transition-all duration-500 md:translate-y-full group-hover:translate-y-0 opacity-80">
            <p className="text-yard-milk transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 absolute top-2 md:top-auto md:bottom-12 md:relative md:mt-12">
              12/09/2025
              <img
                src={"/featured-line.svg"}
                alt="featured-line"
                className="-mt-2 w-22 md:-translate-x-full transition-all delay-300 duration-500 group-hover:translate-x-0"
              />
            </p>

            <Link
              href={"#"}
              className="w-max h-max group absolute top-8 md:top-auto md:bottom-10 md:relative text-yard-milk font-playfair font-[700] text-xl md:text-[28px] leading-[36px] tracking-[-0.1px]"
            >
              Relocation Celebration
              <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
            </Link>
            <p className="paragraph hidden md:block text-gray-200 w-[340px] transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0 -mt-7">
              Join us in our new space at 21 Umuawulu Street!
            </p>
            <div className="w-7 h-7 md:w-9 md:h-9 border-2 border-yard-milk flex justify-center items-center rounded2px absolute top-7 md:top-auto md:bottom-5 transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 right-5 md:left-5">
              <img src={"/icons/share.svg"} alt="share icon" />
            </div>
          </div>
        </div>

        <div className="w-[384px] 2xl:w-[500px] h-[280px] 2xl:h-[320px] bg-[url('/gallery/gallery5.svg')] bg-cover bg-center flex-grow relative overflow-hidden group">
          {/*Inner Hover*/}
          <div className="absolute w-full h-full p-4 bg-[#090F10CC] top-48 md:top-0 left-0 transition-all duration-500 md:translate-y-full group-hover:translate-y-0 opacity-80">
            <p className="text-yard-milk transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 absolute top-2 md:top-auto md:bottom-12 md:relative md:mt-12">
              12/09/2025
              <img
                src={"/featured-line.svg"}
                alt="featured-line"
                className="-mt-2 w-22 md:-translate-x-full transition-all delay-300 duration-500 group-hover:translate-x-0"
              />
            </p>

            <Link
              href={"#"}
              className="w-max h-max group absolute top-8 md:top-auto md:bottom-10 md:relative text-yard-milk font-playfair font-[700] text-xl md:text-[28px] leading-[36px] tracking-[-0.1px]"
            >
              Relocation Celebration
              <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
            </Link>
            <p className="paragraph hidden md:block text-gray-200 w-[340px] transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0 -mt-7">
              Join us in our new space at 21 Umuawulu Street!
            </p>
            <div className="w-7 h-7 md:w-9 md:h-9 border-2 border-yard-milk flex justify-center items-center rounded2px absolute top-7 md:top-auto md:bottom-5 transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 right-5 md:left-5">
              <img src={"/icons/share.svg"} alt="share icon" />
            </div>
          </div>
        </div>

        <div className="w-[384px] 2xl:w-[500px] h-[260px] 2xl:h-[300px] bg-[url('/gallery/gallery6.svg')] bg-cover bg-center flex-grow relative overflow-hidden group">
          {/*Inner Hover*/}
          <div className="absolute w-full h-full p-4 bg-[#090F10CC] top-48 md:top-0 left-0 transition-all duration-500 md:translate-y-full group-hover:translate-y-0 opacity-80">
            <p className="text-yard-milk transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 absolute top-2 md:top-auto md:bottom-12 md:relative md:mt-12">
              12/09/2025
              <img
                src={"/featured-line.svg"}
                alt="featured-line"
                className="-mt-2 w-22 md:-translate-x-full transition-all delay-300 duration-500 group-hover:translate-x-0"
              />
            </p>

            <Link
              href={"#"}
              className="w-max h-max group absolute top-8 md:top-auto md:bottom-10 md:relative text-yard-milk font-playfair font-[700] text-xl md:text-[28px] leading-[36px] tracking-[-0.1px]"
            >
              Relocation Celebration
              <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
            </Link>
            <p className="paragraph hidden md:block text-gray-200 w-[340px] transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0 -mt-7">
              Join us in our new space at 21 Umuawulu Street!
            </p>
            <div className="w-7 h-7 md:w-9 md:h-9 border-2 border-yard-milk flex justify-center items-center rounded2px absolute top-7 md:top-auto md:bottom-5 transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 right-5 md:left-5">
              <img src={"/icons/share.svg"} alt="share icon" />
            </div>
          </div>
        </div>

        <div className="w-[817px] 2xl:w-[1093px] h-[260px] 2xl:h-[300px] bg-[url('/gallery/gallery7.svg')] bg-cover bg-center flex-grow relative overflow-hidden group">
          {/*Inner Hover*/}
          <div className="absolute w-full h-full p-4 bg-[#090F10CC] top-48 md:top-0 left-0 transition-all duration-500 md:translate-y-full group-hover:translate-y-0 opacity-80">
            <p className="text-yard-milk transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 absolute top-2 md:top-auto md:bottom-12 md:relative md:mt-12">
              12/09/2025
              <img
                src={"/featured-line.svg"}
                alt="featured-line"
                className="-mt-2 w-22 md:-translate-x-full transition-all delay-300 duration-500 group-hover:translate-x-0"
              />
            </p>

            <Link
              href={"#"}
              className="w-max h-max group absolute top-8 md:top-auto md:bottom-10 md:relative text-yard-milk font-playfair font-[700] text-xl md:text-[28px] leading-[36px] tracking-[-0.1px]"
            >
              Relocation Celebration
              <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
            </Link>
            <p className="paragraph hidden md:block text-gray-200 w-[340px] transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0 -mt-7">
              Join us in our new space at 21 Umuawulu Street!
            </p>
            <div className="w-7 h-7 md:w-9 md:h-9 border-2 border-yard-milk flex justify-center items-center rounded2px absolute top-7 md:top-auto md:bottom-5 transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 right-5 md:left-5">
              <img src={"/icons/share.svg"} alt="share icon" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Gallery;
