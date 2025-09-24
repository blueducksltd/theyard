/* eslint-disable @next/next/no-img-element */

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const Page = () => {
  return (
    <main className={"w-full h-max bg-yard-white"}>
      <Navbar />

      {/*Content */}
      <section className={"py-20 px-4 md:px-16 w-full"}>
        <main className="pt-13 md:my-4 md:py-16">
          <header className="flex flex-col gap-5 md:flex-row justify-between md:items-center">
            <Link
              href={"/booking"}
              className="group relative text-[#55544E] font-medium flex items-center gap-2 font-sen"
            >
              <img src={"/icons/arrow-left.svg"} alt="Back" className="w-5" />
              Back to calendar
              <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
            </Link>
          </header>

          <div className="flex flex-col items-start gap-4 mt-10">
            <div className="title flex flex-col items-end">
              <h1 className="text-[32px]">Booking form</h1>
              <img src={"/line.svg"} alt="Line" className="-mt-3 w-48" />
            </div>
          </div>

          <section className="w-full flex flex-col md:flex-row items-start my-5 md:my-4 gap-14 md:gap-20">
            <form className="w-full md:w-[656px] flex flex-col gap-7">
              <div className="form-group flex flex-col md:flex-row items-start gap-6">
                <div className="input-group w-full flex flex-col gap-3">
                  <label
                    htmlFor="firstname"
                    className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                  >
                    Enter your first name
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    placeholder="Enter your first name"
                    className="w-full md:w-[316px] h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  />
                </div>

                <div className="input-group w-full flex flex-col gap-3">
                  <label
                    htmlFor="lastname"
                    className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                  >
                    Enter your last name
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    placeholder="Enter your last name"
                    className="w-full md:w-[316px] h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  />
                </div>
              </div>

              <div className="form-group flex flex-col md:flex-row items-start gap-6">
                <div className="input-group w-full flex flex-col gap-3">
                  <label
                    htmlFor="phone"
                    className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                  >
                    Enter your phone number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Enter your phone number"
                    className="w-full md:w-[316px] h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  />
                </div>

                <div className="input-group w-full flex flex-col gap-3">
                  <label
                    htmlFor="email"
                    className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                  >
                    Enter your email address
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    className="w-full md:w-[316px] h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  />
                </div>
              </div>

              <div className="form-group flex flex-col md:flex-row items-start gap-6">
                <div className="input-group w-full flex flex-col gap-3">
                  <label
                    htmlFor="date"
                    className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                  >
                    Select a date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    placeholder="Select a date"
                    className="md:w-[316px] md:h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  />
                </div>

                <div className="input-group w-full flex flex-col gap-3">
                  <label
                    htmlFor="time-from"
                    className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                  >
                    Select time
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      id="time-from"
                      name="time-from"
                      placeholder="Select time"
                      className="w-full md:w-[142px] md:h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                    />

                    <p className="text-[#1A1A1A] text-[16px]">to</p>

                    <input
                      type="time"
                      id="time-to"
                      name="time-to"
                      placeholder="Select time"
                      className="w-full md:w-[142px] md:h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group flex flex-col md:flex-row items-start gap-6">
                <div className="w-full input-group flex flex-col gap-3">
                  <label
                    htmlFor="space"
                    className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                  >
                    Select a space
                  </label>
                  <select
                    id="space"
                    name="space"
                    className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  >
                    <option value="" disabled selected>
                      Select a space
                    </option>
                    <option value="space1">Space 1</option>
                    <option value="space2">Space 2</option>
                    <option value="space3">Space 3</option>
                  </select>
                </div>
              </div>

              <div className="form-group flex flex-col md:flex-row items-start gap-6">
                <div className="w-full input-group flex flex-col gap-3">
                  <label
                    htmlFor="title"
                    className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                  >
                    Enter the title of the event
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter the title of the event"
                    className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  />
                </div>
              </div>

              <div className="form-group flex flex-col md:flex-row items-start gap-6">
                <div className="w-full input-group flex flex-col gap-3">
                  <label
                    htmlFor="desc"
                    className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                  >
                    Enter event description
                  </label>
                  <textarea
                    id="desc"
                    name="desc"
                    placeholder="Enter event description"
                    className="w-full h-[147px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  ></textarea>
                </div>
              </div>

              <div className="form-group flex flex-col md:flex-row items-start gap-6">
                <div className="w-full input-group flex flex-col gap-3">
                  <label
                    htmlFor="publish"
                    className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                  >
                    Would you like us to publish this event on our site?
                  </label>
                  <div className="flex items-center gap-5">
                    <label
                      htmlFor="yes"
                      className="w-[209px] md:h-[91px] flex gap-3 items-start rounded-[4px] p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 hover:border-yard-dark-primary hover:bg-[#EDF0EE] has-[:checked]:bg-[#EDF0EE] has-[:checked]:border-yard-dark-primary"
                    >
                      <input
                        type="radio"
                        id="yes"
                        value={"yes"}
                        defaultChecked={true}
                        name="publish"
                        className="mt-3 radio radio-lg peer border-2 border-yard-primary checked:border-yard-dark-primary checked:text-yard-dark-primary"
                      />
                      <div>
                        <h3 className="font-bold text-xl font-playfair text-[#1A231C]">
                          Yes
                        </h3>
                        <p className="text-sm text-[#717068]">
                          I would love it to be displayed on your site.
                        </p>
                      </div>
                    </label>
                    <label
                      htmlFor="no"
                      className="w-[209px] md:h-[91px] flex gap-3 items-start rounded-[4px] p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 hover:border-yard-dark-primary hover:bg-[#EDF0EE] has-[:checked]:bg-[#EDF0EE] has-[:checked]:border-yard-dark-primary"
                    >
                      <input
                        type="radio"
                        id="no"
                        value={"no"}
                        name="publish"
                        className="mt-3 radio radio-lg peer border-2 border-yard-primary checked:border-yard-dark-primary checked:text-yard-dark-primary"
                      />
                      <div>
                        <h3 className="font-bold text-xl font-playfair text-[#1A231C]">
                          No
                        </h3>
                        <p className="text-sm text-[#717068]">
                          I would love to keep my event private.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </form>

            {/*Divider*/}
            <div className="w-[1px] h-[917px] bg-[#C7CFC9] hidden md:block"></div>

            <div className="w-full md:w-[376] h-max shadow-xl">
              <h3 className="bg-yard-primary-active rounded2px font-bold text-xl leading-[28px] text-[#2D3C30] font-playfair py-5 px-6">
                Booking Summary
              </h3>
              <div className="p-5 flex flex-col gap-4">
                <div className="w-full flex justify-between">
                  <p className="leading-6 tracking-[0.5px] text-[#717068]">
                    Package
                  </p>
                  <p className="leading-6 tracking-[0.5px] text-[#1A231C]">
                    Picnic Package
                  </p>
                </div>

                <div className="w-full flex justify-between">
                  <p className="leading-6 tracking-[0.5px] text-[#717068]">
                    Space
                  </p>
                  <p className="leading-6 tracking-[0.5px] text-[#1A231C]">
                    Game Space
                  </p>
                </div>

                <div className="w-full flex justify-between">
                  <p className="leading-6 tracking-[0.5px] text-[#717068]">
                    Event Date
                  </p>
                  <p className="leading-6 tracking-[0.5px] text-[#1A231C]">
                    12-09-2025
                  </p>
                </div>

                <div className="w-full flex justify-between">
                  <p className="leading-6 tracking-[0.5px] text-[#717068]">
                    Event time
                  </p>
                  <p className="leading-6 tracking-[0.5px] text-[#1A231C]">
                    11:00 -14:00
                  </p>
                </div>

                <div className="w-full flex justify-between">
                  <p className="leading-6 tracking-[0.5px] text-[#717068]">
                    Publish Event
                  </p>
                  <p className="leading-6 tracking-[0.5px] text-[#1A231C]">
                    No
                  </p>
                </div>
              </div>

              <div className="p-5 flex flex-col gap-4 mt-4">
                <div className="w-full flex justify-between">
                  <p className="leading-6 tracking-[0.1px] text-[#152226] font-bold text-xl font-playfair">
                    Pricing
                  </p>
                  <p className="leading-6 tracking-[0.5px] text-[#1A231C]">₦</p>
                </div>

                <div className="w-full flex justify-between">
                  <p className="leading-6 tracking-[0.5px] text-[#717068]">
                    Game Space
                  </p>
                  <p className="leading-6 tracking-[0.5px] text-[#1A231C]">
                    10,000
                  </p>
                </div>

                <div className="w-full flex justify-between">
                  <p className="leading-6 tracking-[0.5px] text-[#717068]">
                    No. Hours
                  </p>
                  <p className="leading-6 tracking-[0.5px] text-[#1A231C]">3</p>
                </div>

                <div className="w-full flex justify-between">
                  <p className="leading-6 tracking-[0.5px] text-[#717068]">
                    Total
                  </p>
                  <p className="leading-6 tracking-[0.5px] text-[#1A231C]">
                    30,000
                  </p>
                </div>
                <Link
                  href={"/booking/checkout"}
                  className="w-full flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden"
                >
                  <span className="z-40">Proceed to pay</span>
                  <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </section>

      <Footer />
    </main>
  );
};

export default Page;
