"use client";
{
  /*eslint-disable @next/next/no-img-element*/
}
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const pathname = usePathname();

  return (
    <>
      <nav
        className={`w-full md:h-28 pt-12 pb-20 px-7 md:py-0 lg:px-16 flex justify-between text-yard-primary text-base font-sen font-medium bg-yard-white fixed z-50 ${openMenu ? "items-start h-auto md:items-center shadow-2xl" : "items-center h-28"}`}
      >
        <Link href="/" className={`${openMenu ? "hidden md:block" : "block"}`}>
          <img src="/logo-black.svg" alt="Logo" />
        </Link>

        <ul
          className={`w-full md:w-auto flex flex-col space-y-4 md:space-y-0 md:flex-row space-x-7 bg-yard-white ${openMenu ? "flex" : "hidden md:flex"}`}
        >
          <Link
            href={"/"}
            onClick={() => setOpenMenu(false)}
            className={`group relative w-max ${pathname === "/" ? "border-b-[1px]" : ""}`}
          >
            Home
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>

          <Link
            href={"/events"}
            onClick={() => setOpenMenu(false)}
            className={`group relative w-max ${pathname === "/events" ? "border-b-[1px]" : ""}`}
          >
            Events
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>

          <Link
            href={"/about"}
            onClick={() => setOpenMenu(false)}
            className={`group relative w-max ${pathname === "/about" ? "border-b-[1px]" : ""}`}
          >
            About us
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>

          <Link
            href={"/booking"}
            onClick={() => setOpenMenu(false)}
            className={`group relative w-max ${pathname === "/booking" || pathname === "/booking/pending" ? "border-b-[1px]" : ""}`}
          >
            Booking
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>

          <Link
            href={"/services"}
            onClick={() => setOpenMenu(false)}
            className={`group relative w-max ${pathname === "/services" ? "border-b-[1px]" : ""}`}
          >
            Services
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>

          <Link
            href={"/packages"}
            onClick={() => setOpenMenu(false)}
            className={`group relative w-max ${pathname === "/packages" ? "border-b-[1px]" : ""}`}
          >
            Packages
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>

          <Link
            href={"/gallery"}
            onClick={() => setOpenMenu(false)}
            className={`group relative w-max ${pathname === "/gallery" ? "border-b-[1px]" : ""}`}
          >
            Gallery
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>

          {/*Contact for mobile*/}
          <Link
            href={"/contact"}
            onClick={() => setOpenMenu(false)}
            className="w-full h-[52px] mt-14 flex justify-center items-center bg-yard-primary text-white px-6 py-5 rounded-[2px] md:hidden group relative overflow-hidden"
          >
            <span className="z-50">Contact us now</span>
            <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </Link>
        </ul>

        <Link
          href={"/contact"}
          onClick={() => setOpenMenu(false)}
          className="w-[171px] h-[52px] lg:flex justify-center items-center bg-yard-primary text-white px-6 py-5 rounded-[2px] hidden group relative overflow-hidden"
        >
          <span className="z-50">Contact us now</span>
          <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
        </Link>
        <div
          className="lg:hidden cursor-pointer"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <img
            src={`${openMenu ? "/icons/cancel.svg" : "/icons/menu.svg"}`}
            alt="menu icon"
            className="w-6"
          />
        </div>
      </nav>
    </>
  );
};
export default Navbar;
