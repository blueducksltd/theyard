"use client";
{
  /*eslint-disable @next/next/no-img-element*/
}
import { IReview } from "@/types/Review";
import { getReviews } from "@/util";
import Link from "next/link";
import React from "react";

const Testimonials = () => {
  const [reviews, setReviews] = React.useState<IReview[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const fetchReviews = async () => {
      const data = await getReviews();
      setReviews(data.data.reviews);
    };
    fetchReviews();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1,
    );
  };

  return (
    <main className="pt-5 md:pt-0 pb-16 relative">
      <img
        src={"/celebration-reverse.svg"}
        alt="Celebration Icon"
        width={70}
        className="absolute top-60 left-44 2xl:left-96 hidden md:block"
      />
      <div className="relative flex items-center justify-center">
        <div className="w-[305px] h-[550px] md:w-[720px] md:h-[470px] border-x-2 border-yard-lightgreen justify-center items-center"></div>
        <div className="w-[330px] md:w-[800px] h-max border-y-2 border-yard-lightgreen absolute flex flex-col items-start py-8 px-8 md:pt-10 md:px-24 gap-4">
          <div className="w-full flex flex-col md:flex-row items-start gap-5 justify-between md:items-center">
            <div className="flex flex-col items-start gap-2">
              <div className="title flex flex-col">
                <h1 className="italic">Testimonials</h1>
                <img
                  src={"/featured-line.svg"}
                  alt="Line"
                  className="-mt-4 w-44 hidden md:block"
                />
              </div>
              <p className="paragraph">See what our clients say about us...</p>
            </div>
            <Link
              href={"#"}
              className="cta-btn group relative overflow-hidden hover:text-yard-dark-primary"
            >
              <span className="z-40">Write us a review</span>
              <div className="absolute top-0 left-0 bg-yard-primary-active w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </Link>
          </div>
          {/* Testimonial */}
          <section className="w-full">
            <div className="w-full shadow-xl p-8 rounded-sm my-4">
              {reviews.length > 0 && (
                <div className="w-full">
                  <p className="paragraph">
                    &quot;{reviews[currentIndex].comment}&quot;
                  </p>
                  <p className="font-lato font-bold text-lg tracking-[0.4px] leading-[26px] my-4">
                    {reviews[currentIndex].name},{" "}
                    {reviews[currentIndex].location}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={handlePrev}
                  disabled={reviews.length === 0}
                  className="w-9 h-9 bg-yard-lightgreen flex justify-center items-center rounded-[2px] p-2 cursor-pointer hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img src={"/icons/arrow-left.svg"} alt="Left Icon" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={reviews.length === 0}
                  className="w-9 h-9 bg-yard-lightgreen flex justify-center items-center rounded-[2px] p-2 cursor-pointer hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img src={"/icons/arrow-right.svg"} alt="Right Icon" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
      <img
        src={"/celebration.svg"}
        alt="Celebration Icon"
        width={70}
        className="absolute top-32 right-44 2xl:right-96 hidden md:block"
      />
    </main>
  );
};

export default Testimonials;
