"use client";
{
  /*eslint-disable @next/next/no-img-element*/
}
import { IReview } from "@/types/Review";
import { createReview, getReviews } from "@/util";
import React from "react";
import Modal from "./Modal";
import { toast } from "react-toastify";

const Testimonials = () => {
  const [reviews, setReviews] = React.useState<IReview[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [reviewModal, setReviewModal] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchReviews = async () => {
      const data = await getReviews();
      console.log(data);
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

  const handleSubmit = async (reviewForm: FormData) => {
    const data = {
      name: reviewForm.get("name") as string,
      location: reviewForm.get("location") as string,
      comment: reviewForm.get("comment") as string,
    };
    try {
      const response = await createReview(data);
      if (response.success == true) {
        setReviews((prevReviews) => [...prevReviews, response.data.review]);
        setReviewModal(false);
        toast.success("Review submitted successfully!", {
          position: "bottom-right",
          autoClose: false,
        });
      }
      setReviewModal(false);
    } catch (error) {
      console.error(error);
    }
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
            <button
              type="button"
              onClick={() => setReviewModal(true)}
              className="cta-btn group relative overflow-hidden hover:text-yard-dark-primary cursor-pointer"
            >
              <span className="z-40">Write us a review</span>
              <div className="absolute top-0 left-0 bg-yard-primary-active w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>
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

      <Modal isOpen={reviewModal} useDefaultWidth>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Leave a Review
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setReviewModal(false)}
            >
              <img
                src={"/icons/cancel.svg"}
                alt="Close Icon"
                className="z-40"
              />
              <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
            </div>
          </div>
        </section>

        <div className="w-full flex items-start my-4 2xl:my-8 gap-10">
          {/*Form*/}
          <form action={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="name"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter name"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="comment"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter review
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  placeholder="150 words"
                  className="w-full h-[147px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                ></textarea>
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="location"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Enugu, Lagos"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden rounded-[5px]"
            >
              <span className="z-40">Send review</span>
              <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>
          </form>
        </div>
      </Modal>
    </main>
  );
};

export default Testimonials;
