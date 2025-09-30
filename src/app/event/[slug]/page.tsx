/*eslint-disable @next/next/no-img-element*/

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const Page = () => {
  return (
    <main className={"w-full h-max bg-yard-white"}>
      <Navbar />
      {/*href={`/read/${encodeURIComponent(memory.slug)}`}*/}

      {/*Content */}
      <section className={"py-20 px-4 md:px-16 w-full"}>
        <main className="pt-10 md:my-4 md:py-16">
          <header className="w-full h-[250px] md:h-[391px] bg-[url('/event.svg')] bg-cover"></header>

          <h2 className="text-yard-primary font-playfair font-bold text-[40px] leading-11 mt-8 md:mt-5 flex flex-col md:flex-row justify-between md:items-center">
            Wedding Celebration
            <span className="font-[400] leading-[22px] font-lato text-[14px]">
              12/09/2025 09:00 - 13:00
            </span>
          </h2>
          <p className="paragraph mt-7 md:mt-4">
            Borem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
            turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus
            nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum
            tellus elit sed risus. Maecenas eget condimentum velit, sit amet
            feugiat lectus. Class aptent taciti sociosqu ad litora torquent per
            conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus
            enim egestas, ac scelerisque ante pulvinar.
          </p>
          <p className="paragraph mt-5">
            Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna.
            Curabitur vel bibendum lorem. Morbi convallis convallis diam sit
            amet lacinia. Aliquam in elementum tellus. Curabitur tempor quis
            eros tempus lacinia. Nam bibendum pellentesque quam a convallis. Sed
            ut vulputate nisi. Integer in felis sed leo vestibulum venenatis.
            Suspendisse quis arcu sem. Aenean feugiat ex eu vestibulum
            vestibulum. Morbi a eleifend magna. Nam metus lacus, porttitor eu
            mauris a, blandit ultrices nibh. Mauris sit amet magna non ligula
            vestibulum eleifend. Nulla varius volutpat turpis sed lacinia. Nam
            eget mi in purus lobortis eleifend. Sed nec ante dictum sem
            condimentum ullamcorper quis venenatis nisi. Proin vitae facilisis
            nisi, ac posuere leo.
          </p>
        </main>

        <section>
          <div className="flex flex-col gap-3 md:gap-5 md:flex-row justify-between md:items-center mt-5 md:mt-0">
            <div className="flex flex-col items-start md:gap-4">
              <div className="title flex flex-col items-end">
                <h1 className="text-[28px]">More Events</h1>
                <img
                  src={"/featured-line.svg"}
                  alt="Line"
                  className="-mt-3 w-20"
                />
              </div>
            </div>

            <Link
              href={"#"}
              className="cta-btn group relative overflow-hidden hover:text-yard-dark-primary"
            >
              <span className="z-40">View all events</span>
              <div className="absolute top-0 left-0 bg-yard-primary-active w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </Link>
          </div>
          <section className="w-full flex flex-wrap items-center my-5 md:my-4 gap-5 md:gap-1">
            <div className="w-[384px] 2xl:w-[500px] h-[280px] 2xl:h-[320px] bg-[url('/gallery/gallery3.svg')] bg-cover bg-center flex-grow relative overflow-hidden group">
              {/*Inner Hover*/}
              <div className="absolute w-full h-full p-4 bg-[#090F10CC] top-36 md:top-0 left-0 transition-all duration-500 md:translate-y-full group-hover:translate-y-0 opacity-80">
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
                <p className="paragraph text-gray-200 w-[340px] transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0 md:-mt-7">
                  Join us in our new space at 21 Umuawulu Street!
                </p>
                <div className="w-7 h-7 md:w-9 md:h-9 border-2 border-yard-milk flex justify-center items-center rounded2px absolute top-3 md:top-auto md:bottom-5 transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 right-5 md:left-5">
                  <img src={"/icons/share.svg"} alt="share icon" />
                </div>
              </div>
            </div>

            <div className="w-[384px] 2xl:w-[500px] h-[280px] 2xl:h-[320px] bg-[url('/gallery/gallery4.svg')] bg-cover bg-center flex-grow relative overflow-hidden group">
              {/*Inner Hover*/}
              <div className="absolute w-full h-full p-4 bg-[#090F10CC] top-36 md:top-0 left-0 transition-all duration-500 md:translate-y-full group-hover:translate-y-0 opacity-80">
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
                <p className="paragraph text-gray-200 w-[340px] transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0 md:-mt-7">
                  Join us in our new space at 21 Umuawulu Street!
                </p>
                <div className="w-7 h-7 md:w-9 md:h-9 border-2 border-yard-milk flex justify-center items-center rounded2px absolute top-3 md:top-auto md:bottom-5 transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 right-5 md:left-5">
                  <img src={"/icons/share.svg"} alt="share icon" />
                </div>
              </div>
            </div>

            <div className="w-[384px] 2xl:w-[500px] h-[280px] 2xl:h-[320px] bg-[url('/gallery/gallery5.svg')] bg-cover bg-center flex-grow relative overflow-hidden group">
              {/*Inner Hover*/}
              <div className="absolute w-full h-full p-4 bg-[#090F10CC] top-36 md:top-0 left-0 transition-all duration-500 md:translate-y-full group-hover:translate-y-0 opacity-80">
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
                <p className="paragraph text-gray-200 w-[340px] transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0 md:-mt-7">
                  Join us in our new space at 21 Umuawulu Street!
                </p>
                <div className="w-7 h-7 md:w-9 md:h-9 border-2 border-yard-milk flex justify-center items-center rounded2px absolute top-3 md:top-auto md:bottom-5 transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 right-5 md:left-5">
                  <img src={"/icons/share.svg"} alt="share icon" />
                </div>
              </div>
            </div>
          </section>
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default Page;
