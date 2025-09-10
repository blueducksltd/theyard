import Link from "next/link";

const Testimonials = () => {
  return (
    <main className="w-full pb-16 relative">
      <img
        src={"/celebration-reverse.svg"}
        alt="Celebration Icon"
        width={70}
        className="absolute top-60 left-44 2xl:left-96"
      />
      <div className="relative flex items-center justify-center">
        <div className="w-[720px] h-[470px] border-x-2 border-yard-lightgreen justify-center items-center"></div>
        <div className="w-[800px] h-max border-y-2 border-yard-lightgreen absolute flex flex-col items-start py-10 px-24 gap-4">
          <div className="w-full flex justify-between items-center">
            <div className="flex flex-col items-start gap-2">
              <div className="title flex flex-col">
                <h1 className="italic">Testimonials</h1>
                <img
                  src={"/featured-line.svg"}
                  alt="Line"
                  className="-mt-4 w-44"
                />
              </div>
              <p className="paragraph">See what our clients say about us...</p>
            </div>

            <Link
              href={"#"}
              className="cta-btn group relative overflow-hidden hover:text-yard-dark-primary"
            >
              <span className="z-50">Write us a review</span>
              <div className="absolute top-0 left-0 bg-yard-primary-active w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </Link>
          </div>

          {/* Testimonial */}
          <section>
            <div className="shadow-xl p-8 rounded-sm my-4">
              <p className="paragraph">
                &quot;The Yard is the perfect picnic spot in Enugu—beautiful,
                peaceful, and full of charm.&quot;
              </p>
              <p className="font-lato font-bold text-lg tracking-[0.4px] leading-[26px] my-4">
                Ada, Enugu
              </p>

              <div className="flex items-center gap-2 justify-end">
                <div className="w-9 h-9 bg-yard-lightgreen flex justify-center items-center rounded-[2px] p-2 cursor-pointer">
                  <img src={"/icons/arrow-left.svg"} />
                </div>
                <div className="w-9 h-9 bg-yard-lightgreen flex justify-center items-center rounded-[2px] p-2 cursor-pointer">
                  <img src={"/icons/arrow-right.svg"} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <img
        src={"/celebration.svg"}
        alt="Celebration Icon"
        width={70}
        className="absolute top-32 right-44 2xl:right-96"
      />
    </main>
  );
};

export default Testimonials;
