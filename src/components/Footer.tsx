"use client";
{
  /*eslint-disable @next/next/no-img-element*/
}
import { subscribeToNewsletter } from "@/util";
import Link from "next/link";
import React from "react";
import { toast } from "react-toastify";

const Footer = () => {
  const [email, setEmail] = React.useState("");

  const handleSubscribe = async (email: string) => {
    // Progress toast with id
    const progressId = toast.loading("Subscribing...", {
      position: "bottom-right",
    });
    if (!email) {
      toast.error("Please enter your email address", {
        position: "bottom-right",
      });
      return;
    }
    try {
      const response = await subscribeToNewsletter(email);
      if (response.success == true) {
        toast.success("You have been subscribed to our newsletter", {
          position: "bottom-right",
        });
        setEmail("");
      }
    } catch (error) {
      toast.error(`Something went wrong ${error}`, {
        autoClose: false,
        position: "bottom-right",
      });
    }
    toast.dismiss(progressId);
  };

  return (
    <main className="mt-4 p-6 md:p-16 bg-yard-primary">
      <section className="flex flex-col md:flex-row md:gap-20 lg:gap-0 items-start justify-between">
        <img src={"/logo-white.svg"} className="md:hidden" alt="White Logo" />
        <div className="flex flex-col">
          <h1 className="text-white font-playfair font-bold text-xl md:text-[28px] tracking-[-0.1px] leading-[36px]">
            Subscribe To Our Newsletter
          </h1>
          <p className="paragraph text-[#CCCCCC] my-2 md:w-[415px]">
            Join our picnic lovers list for updates, offers, and event
            inspiration.
          </p>

          <div className="flex flex-col md:flex-row gap-3 md:gap-0 my-4">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="md:w-[257px] border-[1px] border-[#999999] p-3 placeholder:text-[#999999] rounded-l-[2px]"
            />
            <button
              type="button"
              onClick={() => handleSubscribe(email)}
              className="md:w-[160px] h-[52px] bg-white font-sen leading-6 tracking-[0.4px] text-[16px] font-medium rounded-r-[2px] group relative overflow-hidden"
            >
              <span className="z-40 relative">Subscribe</span>
              <div className="cta-btn-hover"></div>
            </button>
          </div>

          <div className="mt-28 hidden md:block">
            <img src={"/logo-white.svg"} alt="White Logo" />
            <p className="text-[#CCCCCC] w-[415px] text-[12px] tracking-[0.5px] leading-[22px] mt-2">
              We believe every moment is worth celebrating. Whether you’re here
              for a quiet picnic, a romantic date, or a joyful event with
              friends
            </p>
          </div>
        </div>

        <div className="flex flex-col md:h-[417px] relative mt-10 md:mt-0">
          <div className="flex flex-col md:flex-row items-start gap-10 lg:gap-36">
            <div className="flex flex-col gap-2">
              <h3 className="font-[400] md:text-xs uppercase leading-[22px] tracking-[0.5px] text-[#C7CFC9]">
                Quick Links
              </h3>

              <Link
                href={"/"}
                className="text-[#EDF0EE] font-[400] leading-[22px] tracking-[0.5px] md:text-sm group relative w-max"
              >
                Home
                <span className="yard-link-line bg-[#EDF0EE]"></span>
              </Link>

              <Link
                href={"/about"}
                className="text-[#EDF0EE] font-[400] leading-[22px] tracking-[0.5px] md:text-sm group relative w-max"
              >
                About
                <span className="yard-link-line bg-[#EDF0EE]"></span>
              </Link>

              <Link
                href={"/packages"}
                className="text-[#EDF0EE] font-[400] leading-[22px] tracking-[0.5px] md:text-sm group relative w-max"
              >
                Packages
                <span className="yard-link-line bg-[#EDF0EE]"></span>
              </Link>

              <Link
                href={"/booking"}
                className="text-[#EDF0EE] font-[400] leading-[22px] tracking-[0.5px] md:text-sm group relative w-max"
              >
                Booking
                <span className="yard-link-line bg-[#EDF0EE]"></span>
              </Link>

              <Link
                href={"/gallery"}
                className="text-[#EDF0EE] font-[400] leading-[22px] tracking-[0.5px] md:text-sm group relative w-max"
              >
                Gallery
                <span className="yard-link-line bg-[#EDF0EE]"></span>
              </Link>

              <Link
                href={"/services"}
                className="text-[#EDF0EE] font-[400] leading-[22px] tracking-[0.5px] md:text-sm group relative w-max"
              >
                Services
                <span className="yard-link-line bg-[#EDF0EE]"></span>
              </Link>

              <Link
                href={"/contact"}
                className="text-[#EDF0EE] font-[400] leading-[22px] tracking-[0.5px] md:text-sm group relative w-max"
              >
                Contact
                <span className="yard-link-line bg-[#EDF0EE]"></span>
              </Link>
            </div>

            <div className="flex flex-col gap-2 mb-20">
              <h3 className="font-[400] md:text-xs uppercase leading-[22px] tracking-[0.5px] text-[#C7CFC9]">
                Contact
              </h3>

              <Link
                href={"tel:+2348147871946"}
                className="text-[#EDF0EE] font-[400] leading-[22px] tracking-[0.5px] text-sm flex items-center gap-2 group relative w-max"
              >
                <img src={"/icons/call.svg"} alt="Call Icon" />
                +234 901 825 7388
                <span className="yard-link-line bg-[#EDF0EE]"></span>
              </Link>

              <Link
                href={"/contact"}
                className="text-[#EDF0EE] font-[400] leading-[22px] tracking-[0.5px] text-sm flex items-center gap-2 group relative w-max"
              >
                <img src={"/icons/mail.svg"} alt="Mail Icon" />
                info@theyard.com
                <span className="yard-link-line bg-[#EDF0EE]"></span>
              </Link>

              <Link
                href={"/contact"}
                className="w-[250px] text-[#EDF0EE] font-[400] leading-[22px] tracking-[0.5px] text-sm flex items-start gap-2 group relative"
              >
                <img
                  src={"/icons/location.svg"}
                  className="mt-1"
                  alt="Location Icon"
                />
                21 Umuawulu Street, Independence Layout, Enugu
                <span className="yard-link-line bg-[#EDF0EE]"></span>
              </Link>

              <div className="mt-5">
                <h3 className="font-[400] text-xs uppercase leading-[22px] tracking-[0.5px] text-[#C7CFC9] mb-3">
                  Social Links
                </h3>
                <div className="flex items-center gap-2">
                  <Link
                    href={"#"}
                    className="flex w-9 h-9 p-2 bg-[#EDF0EE] rounded-[2px] group relative overflow-hidden"
                  >
                    <img
                      src={"/icons/whatsapp.svg"}
                      className="w-7 z-40"
                      alt="Whatsapp Icon"
                    />
                    <div className="cta-btn-hover"></div>
                  </Link>
                  <Link
                    href={"#"}
                    className="flex w-9 h-9 p-2 bg-[#EDF0EE] rounded-[2px] group relative overflow-hidden"
                  >
                    <img
                      src={"/icons/facebook.svg"}
                      className="w-7 z-40"
                      alt="Facebook Icon"
                    />
                    <div className="cta-btn-hover"></div>
                  </Link>
                  <Link
                    href={"#"}
                    className="flex w-9 h-9 p-2 bg-[#EDF0EE] rounded-[2px] group relative overflow-hidden"
                  >
                    <img
                      src={"/icons/instagram.svg"}
                      className="w-7 z-40"
                      alt="Instagram Icon"
                    />
                    <div className="cta-btn-hover"></div>
                  </Link>

                  <Link
                    href={"#"}
                    className="flex w-9 h-9 p-2 bg-[#EDF0EE] rounded-[2px] group relative overflow-hidden"
                  >
                    <img
                      src={"/icons/x.svg"}
                      className="w-7 z-40"
                      alt="X Icon"
                    />
                    <div className="cta-btn-hover"></div>
                  </Link>

                  <Link
                    href={"#"}
                    className="flex w-9 h-9 p-2 bg-[#EDF0EE] rounded-[2px] group relative overflow-hidden"
                  >
                    <img
                      src={"/icons/linkedin.svg"}
                      className="w-7 z-40"
                      alt="LinkedIn Icon"
                    />
                    <div className="cta-btn-hover"></div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 text-[#CCCCCC] md:w-[415px] text-[12px] tracking-[0.5px] leading-[22px] mt-2">
            <p>&copy; 2025 - Copyright The Yard Picnic Park.</p>
            <p>All rights reserved</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Footer;
