"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Modal from "../Modal";
import { usePathname } from "next/navigation";

// type definitions
type sectionType = "form" | "permission" | "password";
interface IPassword {
  showPwd: boolean;
  setShowPwd: (value: boolean) => void;
  showConfPwd: boolean;
  setShowConfPwd: (value: boolean) => void;
}

export default function Sidebar() {
  const [settingsModal, setSettingsModal] = React.useState<boolean>(false);
  const [logoutModal, setLogoutModal] = React.useState<boolean>(false);
  const [section, setSection] = React.useState<sectionType>("form");
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    React.useState<boolean>(false);
  const pathname = usePathname();

  return (
    <main className="w-[256px] py-4 px-5 border-r-[1px] border-[#E4E8E5] h-full">
      <section className="flex flex-col gap-2 relative h-full">
        <Link
          href={"/admin/dashboard"}
          className={`md:flex items-center py-3 px-4 rounded-sm gap-2 hidden group hover:text-yard-primary relative overflow-hidden ${pathname === "/admin/dashboard" ? "bg-yard-hover" : ""}`}
        >
          <Image
            src={"/icons/dashboard.svg"}
            className="z-40"
            width={20}
            height={20}
            alt="Dashboard Icon"
          />
          <div className="md:flex justify-center text-[#44433E] z-40">
            <span>Dashboard</span>
          </div>
          <div className="absolute top-0 left-0 bg-yard-hover w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0 z-10"></div>
        </Link>

        <Link
          href={"/admin/bookings"}
          className={`md:flex items-center py-3 px-4 rounded-sm gap-2 hidden group hover:text-yard-primary relative overflow-hidden ${pathname === "/admin/bookings" ? "bg-yard-hover" : ""}`}
        >
          <Image
            src={"/icons/bookmark.svg"}
            className="z-40"
            width={20}
            height={20}
            alt="Bookmark Icon"
          />
          <div className="md:flex justify-center text-[#44433E] z-40">
            <span>Bookings Mgt</span>
          </div>
          <div className="absolute top-0 left-0 bg-yard-hover w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0 z-10"></div>
        </Link>

        <Link
          href={"/admin/events"}
          className={`md:flex items-center py-3 px-4 rounded-sm gap-2 hidden group hover:text-yard-primary relative overflow-hidden ${pathname === "/admin/events" ? "bg-yard-hover" : ""}`}
        >
          <Image
            src={"/icons/calendar.svg"}
            className="z-40"
            width={20}
            height={20}
            alt="Calendar Icon"
          />
          <div className="md:flex justify-center text-[#44433E] z-40">
            <span>Events &amp; Calendar</span>
          </div>
          <div className="absolute top-0 left-0 bg-yard-hover w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0 z-10"></div>
        </Link>

        <Link
          href={"/admin/packages"}
          className={`md:flex items-center py-3 px-4 rounded-sm gap-2 hidden group hover:text-yard-primary relative overflow-hidden ${pathname === "/admin/packages" ? "bg-yard-hover" : ""}`}
        >
          <Image
            src={"/icons/box-tick.svg"}
            className="z-40"
            width={20}
            height={20}
            alt="Box-tick Icon"
          />
          <div className="md:flex justify-center text-[#44433E] z-40">
            <span>Packages &amp; Services</span>
          </div>
          <div className="absolute top-0 left-0 bg-yard-hover w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0 z-10"></div>
        </Link>

        <Link
          href={"/admin/gallery"}
          className={`md:flex items-center py-3 px-4 rounded-sm gap-2 hidden group hover:text-yard-primary relative overflow-hidden ${pathname === "/admin/gallery" ? "bg-yard-hover" : ""}`}
        >
          <Image
            src={"/icons/picture.svg"}
            className="z-40"
            width={20}
            height={20}
            alt="Picture Icon"
          />
          <div className="md:flex justify-center text-[#44433E] z-40">
            <span>Gallery</span>
          </div>
          <div className="absolute top-0 left-0 bg-yard-hover w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0 z-10"></div>
        </Link>

        <Link
          href={"/admin/reviews"}
          className={`md:flex items-center py-3 px-4 rounded-sm gap-2 hidden group hover:text-yard-primary relative overflow-hidden ${pathname === "/admin/reviews" ? "bg-yard-hover" : ""}`}
        >
          <Image
            src={"/icons/directbox.svg"}
            className="z-40"
            width={20}
            height={20}
            alt="Directbox Icon"
          />
          <div className="md:flex justify-center text-[#44433E] z-40">
            <span>Reviews</span>
          </div>
          <div className="absolute top-0 left-0 bg-yard-hover w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0 z-10"></div>
        </Link>

        <Link
          href={"/admin/contacts"}
          className={`md:flex items-center py-3 px-4 rounded-sm gap-2 hidden group hover:text-yard-primary relative overflow-hidden ${pathname === "/admin/contacts" ? "bg-yard-hover" : ""}`}
        >
          <Image
            src={"/icons/personalcard.svg"}
            className="z-40"
            width={20}
            height={20}
            alt="Personal Card Icon"
          />
          <div className="md:flex justify-center text-[#44433E] z-40">
            <span>Customer&apos;s Data</span>
          </div>
          <div className="absolute top-0 left-0 bg-yard-hover w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0 z-10"></div>
        </Link>

        <Link
          href={"/admin/users"}
          className={`md:flex items-center py-3 px-4 rounded-sm gap-2 hidden group hover:text-yard-primary relative overflow-hidden ${pathname === "/admin/users" ? "bg-yard-hover" : ""}`}
        >
          <Image
            src={"/icons/profile.svg"}
            className="z-40"
            width={20}
            height={20}
            alt="Profile Icon"
          />
          <div className="md:flex justify-center text-[#44433E] z-40">
            <span>Users &amp; Roles</span>
          </div>
          <div className="absolute top-0 left-0 bg-yard-hover w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0 z-10"></div>
        </Link>

        <div className="flex justify-end">
          <Image
            src={"/icons/arrow.svg"}
            width={20}
            height={20}
            alt="Arrow Icon"
          />
        </div>

        <footer className="absolute bottom-0 w-full">
          <div
            className="md:flex items-center py-3 px-4 rounded-sm gap-2 hidden group hover:text-yard-primary relative overflow-hidden cursor-pointer"
            onClick={() => setSettingsModal(true)}
          >
            <Image
              src={"/icons/setting.svg"}
              className="z-40"
              width={20}
              height={20}
              alt="Setting Icon"
            />
            <div className="md:flex justify-center text-[#44433E] z-40">
              <span>Settings</span>
            </div>
            <div className="absolute top-0 left-0 bg-yard-hover w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0 z-10"></div>
          </div>

          <div
            className="md:flex items-center py-3 px-4 rounded-sm gap-2 hidden group hover:text-yard-primary relative overflow-hidden cursor-pointer"
            onClick={() => setLogoutModal(true)}
          >
            <Image
              src={"/icons/logout.svg"}
              className="z-40"
              width={20}
              height={20}
              alt="Logout Icon"
            />
            <div className="md:flex justify-center text-[#44433E] z-40">
              <span>Log out</span>
            </div>
            <div className="absolute top-0 left-0 bg-yard-hover w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0 z-10"></div>
          </div>
        </footer>
      </section>

      {/*Modals*/}
      <Modal isOpen={settingsModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Settings
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setSettingsModal(false)}
            >
              <Image
                src={"/icons/cancel.svg"}
                width={16}
                height={16}
                alt="Close Icon"
                className="z-40"
              />
              <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
            </div>
          </div>
        </section>
        <hr className="w-full h-2 text-gray-200 my-5" />

        {/*Form*/}
        <div className="w-full flex items-start gap-20">
          <div className="w-[258px] flex flex-col gap-3">
            <button
              className={`w-full flex gap-2 items-center text-yard-primary py-3 px-4 ${section == "form" ? "bg-[#E4E8E5]" : null} rounded-sm cursor-pointer`}
              onClick={() => setSection("form")}
            >
              <Image
                src={"/icons/profile.svg"}
                width={16}
                height={16}
                alt="Profile Icon"
              />
              <span className="text-[16px]">Profile</span>
            </button>

            <button
              className={`w-full flex gap-2 items-center text-yard-primary py-3 px-4 ${section == "permission" ? "bg-[#E4E8E5]" : null} rounded-sm cursor-pointer`}
              onClick={() => setSection("permission")}
            >
              <Image
                src={"/icons/profile.svg"}
                width={16}
                height={16}
                alt="Profile Icon"
              />
              <span className="text-[16px]">Permission</span>
            </button>

            <button
              className={`w-full flex gap-2 items-center text-yard-primary py-3 px-4 ${section == "password" ? "bg-[#E4E8E5]" : null} rounded-sm cursor-pointer`}
              onClick={() => setSection("password")}
            >
              <Image
                src={"/icons/profile.svg"}
                width={16}
                height={16}
                alt="Profile Icon"
              />
              <span className="text-[16px]">Password</span>
            </button>
          </div>
          {section == "form" ? <SettingsForm /> : null}
          {section == "permission" ? <Permission /> : null}
          {section == "password" ? (
            <Password
              showPwd={showPassword}
              setShowPwd={setShowPassword}
              showConfPwd={showConfirmPassword}
              setShowConfPwd={setShowConfirmPassword}
            />
          ) : null}
        </div>
      </Modal>

      {/*Logout Modal*/}
      <Modal isOpen={logoutModal} useDefaultWidth>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Log out
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setLogoutModal(false)}
            >
              <Image
                width={16}
                height={16}
                src={"/icons/cancel.svg"}
                alt="Close Icon"
                className="z-40"
              />
              <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
            </div>
          </div>
        </section>
        <p className="text-[#737373] font-medium text-[25px] mt-5">
          Are you sure you want to log out?
        </p>

        <div className="w-full flex items-center gap-5">
          <button
            className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] mt-5 cursor-pointer"
            onClick={() => setLogoutModal(false)}
          >
            <span className="z-40 font-sen">Cancel</span>
            <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>

          <button className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-[#8C5C5C] text-[#EEEEE6] group relative overflow-hidden rounded-[5px] mt-5 cursor-pointer">
            <span className="z-40 font-sen">Log out</span>
            <div className="absolute top-0 left-0 bg-[#6d4a4aa6] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>
        </div>
      </Modal>
    </main>
  );
}

const SettingsForm = () => {
  return (
    <form className="w-full flex flex-col gap-5">
      <div className="form-group flex flex-col md:flex-row items-center justify-between">
        <Image
          src={"/gallery/girl.svg"}
          width={70}
          height={70}
          className="rounded-full"
          alt="Profile Image"
        />

        <label
          htmlFor="photo"
          className="border-[1px] border-yard-primarytext-yard-primary rounded-[5px] p-2.5 cursor-pointer"
        >
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*,video/*"
            className="hidden"
          />
          <span>Change photo</span>
        </label>
      </div>

      <div className="form-group flex flex-col md:flex-row items-start gap-6">
        <div className="w-full input-group flex flex-col">
          <label
            htmlFor="name"
            className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={"Juliet Ranky"}
            placeholder="Name"
            className="w-full h-[52px] rounded2px py-3 border-b-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px] text-[#999999] leading-[22px] tracking-[0.5px]"
          />
        </div>
      </div>

      <div className="form-group flex flex-col md:flex-row items-start gap-6">
        <div className="w-full input-group flex flex-col">
          <label
            htmlFor="email"
            className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={"juliet@gmail.com"}
            placeholder="Email"
            className="w-full h-[52px] rounded2px py-3 border-b-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px] text-[#999999] leading-[22px] tracking-[0.5px]"
          />
        </div>
      </div>

      <div className="form-group flex flex-col md:flex-row items-start gap-6">
        <div className="w-full input-group flex flex-col">
          <label
            htmlFor="phone"
            className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
          >
            Phone
          </label>
          <input
            type="phone"
            id="phone"
            name="phone"
            defaultValue={"+123456789"}
            placeholder="Phone"
            className="w-full h-[52px] rounded2px py-3 border-b-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px] text-[#999999] leading-[22px] tracking-[0.5px]"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden rounded-[5px] mt-3"
      >
        <span className="z-40">Save</span>
        <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
      </button>
    </form>
  );
};

const Permission = () => {
  return (
    <section className="w-full flex flex-col gap-5">
      <h3 className="text-[#1A1A1A] text-[16px] leading-6 tracking-[0.5px]">
        Notify me when:
      </h3>

      <label
        htmlFor="admin"
        className="w-full flex items-center justify-between border-[1px] border-[#BFBFBF] p-3 rounded2px"
      >
        <p className="text-[#717068] leading-[22px] tracking-[0.5px]">
          Someone joins the admin teach team
        </p>
        <input
          type="checkbox"
          id="admin"
          name="admin"
          className="checkbox checkbox-lg rounded-full"
        />
      </label>

      <label
        htmlFor="space"
        className="w-full flex items-center justify-between border-[1px] border-[#BFBFBF] p-3 rounded2px"
      >
        <p className="text-[#717068] leading-[22px] tracking-[0.5px]">
          Someone book a space/event
        </p>
        <input
          type="checkbox"
          id="space"
          name="space"
          className="checkbox checkbox-lg rounded-full"
        />
      </label>

      <label
        htmlFor="review"
        className="w-full flex items-center justify-between border-[1px] border-[#BFBFBF] p-3 rounded2px"
      >
        <p className="text-[#717068] leading-[22px] tracking-[0.5px]">
          Someone comment or give a review
        </p>
        <input
          type="checkbox"
          id="review"
          name="review"
          className="checkbox checkbox-lg text-yard-primary rounded-full"
        />
      </label>

      <button
        type="submit"
        className="w-full flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden rounded-[5px] mt-3"
      >
        <span className="z-40">Save preferences</span>
        <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
      </button>
    </section>
  );
};

const Password = ({
  showPwd,
  showConfPwd,
  setShowPwd,
  setShowConfPwd,
}: IPassword) => {
  return (
    <form className="w-full flex flex-col gap-5">
      <div className="form-group flex flex-col md:flex-row items-start gap-6">
        <div className="w-full input-group flex flex-col gap-3 relative">
          <label
            htmlFor="password"
            className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
          >
            Current password
          </label>
          <input
            type={showPwd ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter password"
            className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px] text-[#999999] leading-[22px] tracking-[0.5px]"
          />
          <Image
            src={`/icons/${!showPwd ? "eye.svg" : "eye-slash.svg"}`}
            width={23}
            height={23}
            alt="Eye Icon"
            className="absolute right-4 top-[50px] cursor-pointer"
            onClick={() => setShowPwd(!showPwd)}
          />
        </div>
      </div>

      <div className="form-group flex flex-col md:flex-row items-start gap-6">
        <div className="w-full input-group flex flex-col gap-3 relative">
          <label
            htmlFor="confPassword"
            className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
          >
            New password
          </label>
          <input
            type={showConfPwd ? "text" : "password"}
            id="confPassword"
            name="confPassword"
            placeholder="Enter password"
            className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px] text-[#999999] leading-[22px] tracking-[0.5px]"
          />
          <Image
            src={`/icons/${!showConfPwd ? "eye.svg" : "eye-slash.svg"}`}
            width={23}
            height={23}
            alt="Eye Icon"
            className="absolute right-4 top-[50px] cursor-pointer"
            onClick={() => setShowConfPwd(!showConfPwd)}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden rounded-[5px] mt-3"
      >
        <span className="z-40">Save</span>
        <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
      </button>
    </form>
  );
};
