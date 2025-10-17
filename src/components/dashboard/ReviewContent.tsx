/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import Modal from "../Modal";
import { IReview } from "@/types/Review";
import { createReview, getReviews, publishOrIgnoreReview } from "@/util";
import { toast } from "react-toastify";
import moment from "moment";

export default function ReviewContent() {
  const [reviewModal, setReviewModal] = React.useState<boolean>(false);
  const [confModal, setConfModal] = React.useState<boolean>(false);
  const [comments, setComments] = React.useState<IReview[]>([]);
  const [defaultComments, setDefaultComments] = React.useState<IReview[]>([]);
  const [totalNum, setTotalNum] = React.useState<Record<string, number>>({});
  const [action, setAction] = React.useState<Record<string, string>>({});

  const handleSubmit = async (reviewForm: FormData) => {
    const toastId = toast.loading("Publishing comment...", {
      position: "bottom-right",
    });
    const data = {
      name: reviewForm.get("name") as string,
      location: reviewForm.get("location") as string,
      comment: reviewForm.get("comment") as string,
    };
    try {
      const response = await createReview(data);
      if (response.success == true) {
        const newData = response.data.review;
        comments.push(newData);
        setReviewModal(false);
        toast.update(toastId, {
          render: "Comment published successfully!",
          type: "success",
          position: "bottom-right",
          autoClose: 3000,
          isLoading: false,
        });
      } else {
        toast.update(toastId, {
          render: `${response.message}`,
          type: "error",
          position: "bottom-right",
          autoClose: 3000,
          isLoading: false,
        });
      }
      setReviewModal(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to publish comment!",
        type: "error",
        position: "bottom-right",
        autoClose: 3000,
        isLoading: false,
      });
    }
  };

  const handleFilterByStatus = (status: string) => {
    if (status == "all") {
      return setComments(defaultComments);
    }

    const _comments = defaultComments.filter(
      (gallery) => gallery.status.toLowerCase() === status.toLocaleLowerCase(),
    );
    if (_comments.length > 0) {
      setComments(_comments);
    } else {
      toast.info(`None found!"`, {
        position: "bottom-right",
      });
    }
  };

  const handleFilterByDate = (date: string) => {
    const _comments = comments.filter(
      (comment) => moment(comment.createdAt).format("YYYY-MM-DD") === date,
    );
    if (_comments.length > 0) {
      setComments(_comments);
    } else {
      toast.info(`No comment found on ${moment(date).format("LL")}`, {
        position: "bottom-right",
      });
    }
  };

  const handleReviewAction = async (
    status: string,
    id?: string,
    affect?: string,
  ) => {
    console.log(action);
    const loadingToast = toast.loading("Loading data...", {
      position: "bottom-right",
    });
    const data = {
      id,
      status,
      affect,
    };
    try {
      const response = await publishOrIgnoreReview(data);
      if (response) {
        toast.success(`${response.message}`, {
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to perform action on review", {
        position: "bottom-right",
      });
    }
    toast.dismiss(loadingToast);
  };

  React.useEffect(() => {
    const toastId = toast.loading("Loading comments...", {
      position: "bottom-right",
    });
    const fetchComments = async () => {
      try {
        const response = await getReviews();
        const reviews: IReview[] = response.data.reviews;
        setComments(reviews);
        setDefaultComments(reviews);
        setTotalNum({
          published: reviews.filter((review) => review.status === "published")
            .length,
          pending: reviews.filter((review) => review.status === "pending")
            .length,
          ignored: reviews.filter((review) => review.status === "ignored")
            .length,
        });
        toast.dismiss(toastId);
      } catch (error) {
        console.error(error);
        toast.update(toastId, {
          render: "Failed to load comments!",
          type: "error",
          position: "bottom-right",
          isLoading: false,
        });
      }
    };
    fetchComments();
  }, []);

  return (
    <main className="flex-1 py-4 px-5 md:h-[600px] 2xl:h-[770px] overflow-y-auto">
      <section className="flex items-center justify-between border-[1px] border-[#E4E8E5] bg-[#FFFFFF] py-5 px-4 rounded-[4px]">
        <div className="flex flex-col gap-2">
          <h2 className="text-[#66655E] font-bold text-[32px] leading-10">
            Comments
          </h2>

          <div className="flex items-center text-[#999999]">
            <p className="pr-2">{totalNum.published} Published</p>
            {/*Divider*/}
            <div className="w-[1px] h-3 bg-[#C7CFC9] hidden md:block"></div>
            <p className="pl-2">{totalNum.ignored} Ignored</p>
          </div>
        </div>

        <div className="flex items-center gap-3 h-10 cursor-pointer">
          <div className="flex gap-3 h-10">
            <div className="w-[193px] flex rounded2px border-[1px] border-[#999999] px-3 gap-3">
              <img
                src={"/icons/event.svg"}
                width={16}
                height={16}
                alt="Event Icon"
              />
              <select
                className="text-[#999999] z-40 outline-none"
                defaultValue={"all"}
                onChange={(e) => handleFilterByStatus(e.target.value)}
              >
                <option value={"all"}>All comments</option>
                <option value={"published"}>Published</option>
                <option value={"ignored"}>Ignored</option>
              </select>
            </div>

            <label
              htmlFor="date"
              className="w-[193px] flex rounded2px border-[1px] border-[#999999] px-3"
            >
              <img
                src={"/icons/calendar2.svg"}
                width={16}
                height={16}
                alt="Event Icon"
              />
              <input
                id="date"
                type="date"
                onChange={(e) => handleFilterByDate(e.target.value)}
                onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                className="input text-[#999999] [&::-webkit-calendar-picker-indicator]:hidden [&::-moz-calendar-picker-indicator]:hidden"
              />
            </label>
          </div>

          <div className="dropdown dropdown-bottom dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="w-9 h-9 p-2 bg-[#EDF0EE] flex items-center justify-center group relative overflow-hidden"
            >
              <img
                src={"/icons/more.svg"}
                width={16}
                height={16}
                className="z-40"
                alt="More Icon"
              />
              <div className="absolute top-0 left-0 bg-[#E4E8E5] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu bg-white rounded-lg z-1 w-44 p-2 shadow-sm mt-2"
            >
              <li
                className="text-[#595959] text-sm leading-[22px] tracking-[0.5px] duration-1000 hover:bg-[#E4E8E5] rounded"
                onClick={() => setReviewModal(true)}
              >
                <button>Create comment</button>
              </li>
              <li
                className="text-[#595959] text-sm leading-[22px] tracking-[0.5px] duration-1000 hover:bg-[#E4E8E5] rounded"
                onClick={() =>
                  handleReviewAction("published", undefined, "all")
                }
              >
                <button>Publish all</button>
              </li>
              <li
                className="text-[#A44B4B] text-sm leading-[22px] tracking-[0.5px] duration-1000 hover:bg-[#E4E8E5] rounded"
                onClick={() => handleReviewAction("ignored", undefined, "all")}
              >
                <button>Ignore all</button>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/*Comments Section*/}
      <section className="grid grid-cols-3 mt-5 gap-5">
        {/*Single Comment*/}

        {comments.length > 0 ? (
          comments.toReversed().map((comment) => (
            <div
              key={comment.id as string}
              className="w-full h-[264px] border-[1px] border-[#C7CFC9] rounded-lg gap-6 p-5 relative"
            >
              <div className="w-full flex items-center justify-between">
                <h2 className="font-bold text-[22px] leading-[30px] text-[#737373]">
                  {comment.name}, {comment.location}
                </h2>
                <p className="text-[#737373] text-[15px] leading-5 tracking-[0.5px]">
                  {moment(comment.createdAt).format("DD MMM, YYYY")}
                </p>
              </div>
              <p className="text-[#737373] text-[16px] leading-6 mt-5">
                {comment.comment}
              </p>

              <div className="w-full flex items-center justify-end gap-2 mt-10">
                {comment.status === "pending" ? (
                  <>
                    <button
                      className="w-[114px] h-[35px] flex items-center justify-center border-[1px] border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] cursor-pointer"
                      onClick={() => {
                        setAction({
                          id: comment._id as string,
                          status: "ignore",
                        });
                        setConfModal(true);
                      }}
                    >
                      <span className="z-40 font-sen font-medium">Ignore</span>
                      <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
                    </button>

                    <button
                      className="w-[114px] h-[35px] items-center flex justify-center border-[#8C5C5C] bg-yard-primary text-[#EEEEE6] group relative overflow-hidden rounded-[5px] cursor-pointer"
                      onClick={() => {
                        setAction({
                          id: comment._id as string,
                          status: "publish",
                        });
                        setConfModal(true);
                      }}
                    >
                      <span className="z-40 font-sen">Publish</span>
                      <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
                    </button>
                  </>
                ) : (
                  <p className="font-sen font-medium text-[16px] leading-[24px] tracking-[0.4px] text-[#999999]">
                    {comment.status}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </section>

      {/*Modals*/}
      <Modal isOpen={reviewModal} useDefaultWidth>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Add comment
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
                  Name of commentor
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

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="comment"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter comment
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  placeholder="150 words"
                  className="w-full h-[147px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden rounded-[5px] cursor-pointer"
            >
              <span className="z-40">Publish</span>
              <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>
          </form>
        </div>
      </Modal>

      {/*Confirmation Modal*/}
      <Modal isOpen={confModal} useDefaultWidth>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Confirm action
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setConfModal(false)}
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
        <p className="text-[#737373] font-medium text-[25px] mt-5">
          Are you sure you want to{" "}
          {action?.status === "publish"
            ? "publish this comment?"
            : "ignore this comment?"}
        </p>

        <div className="w-full flex items-center gap-5">
          <button
            className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] mt-5 cursor-pointer"
            onClick={() => {
              setAction({});
              setConfModal(false);
            }}
          >
            <span className="z-40 font-sen">Cancel</span>
            <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>

          <button
            className={`w-full flex justify-center cta-btn border-[#8C5C5C] ${action?.status === "publish" ? "bg-yard-primary" : "bg-[#8C5C5C]"} text-[#EEEEE6] group relative overflow-hidden rounded-[5px] mt-5 cursor-pointer`}
            onClick={
              action?.status === "publish"
                ? () => handleReviewAction("published", action?.id, undefined)
                : () => handleReviewAction("ignored", action?.id, undefined)
            }
          >
            <span className="z-40 font-sen">Proceed</span>
            <div
              className={`absolute top-0 left-0 ${action?.status === "publish" ? "bg-yard-dark-primary" : "bg-[#8C5C5C]"} w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0`}
            ></div>
          </button>
        </div>
      </Modal>
    </main>
  );
}
