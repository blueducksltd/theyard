"use client";
{
  /*eslint-disable @next/next/no-img-element*/
}
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  return (
    <>
      <nav
        className={
          "w-full h-28 px-4 lg:px-16 flex items-center justify-between text-yard-gray text-base font-sen font-medium bg-yard-white fixed z-50"
        }
      >
        <Link href="/">
          {/*eslint-disable-next-line @next/next/no-img-element*/}
          <img src="/logo-black.svg" alt="Logo" />
        </Link>

        <ul className="flex flex-col space-x-7">
          <Link href={"/"} className="group relative border-b-[1px]">
            Home
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>

          <Link href={"/events"} className="group relative">
            Events
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>

          <Link href={"/about"} className="group relative">
            About us
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>

          <Link href={"#"} className="group relative">
            Booking
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>

          <Link href={"/services"} className="group relative">
            Services
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>

          <Link href={"/packages"} className="group relative">
            Packages
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>

          <Link href={"/gallery"} className="group relative">
            Gallery
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>
        </ul>

        <Link
          href={"/contact"}
          className="w-[171px] h-[52px] lg:flex justify-center items-center bg-yard-primary text-white px-6 py-5 rounded-[2px] hidden group relative overflow-hidden"
        >
          <span className="z-50">Contact us now</span>
          <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
        </Link>
        <div className="lg:hidden">
          <img src={"/icons/menu.svg"} alt="menu icon" className="w-6" />
        </div>
      </nav>
    </>
  );
};
export default Navbar;
