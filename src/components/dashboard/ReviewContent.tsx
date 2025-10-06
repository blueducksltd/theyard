/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import React from "react";
import Modal from "../Modal";
import Link from "next/link";

export default function ReviewContent() {
  const [mediaModal, setMediaModal] = React.useState<boolean>(false);
  const [shareModal, setShareModal] = React.useState<boolean>(false);
  const [tagModal, setTagModal] = React.useState<boolean>(false);
  const [picModal, setPicModal] = React.useState<boolean>(false);
  const [confModal, setConfModal] = React.useState<boolean>(false);

  return (
    <main className="flex-1 py-4 px-5 md:h-[600px] 2xl:h-[770px] overflow-y-auto">
      <section className="flex items-center justify-between border-[1px] border-[#E4E8E5] bg-[#FFFFFF] py-5 px-4 rounded-[4px]">
        <div className="flex flex-col gap-2">
          <h2 className="text-[#66655E] font-bold text-[32px] leading-10">
            Comments
          </h2>

          <div className="flex items-center text-[#999999]">
            <p className="pr-2">503 Published</p>
            {/*Divider*/}
            <div className="w-[1px] h-3 bg-[#C7CFC9] hidden md:block"></div>
            <p className="pl-2">50 Ignored</p>
          </div>
        </div>

        <div className="flex items-center gap-3 h-10 cursor-pointer">
          <div className="flex gap-3 h-10">
            <div className="w-[193px] flex rounded2px border-[1px] border-[#999999] px-3">
              <Image
                src={"/icons/event.svg"}
                width={16}
                height={16}
                alt="Event Icon"
              />
              <select className="select text-[#999999] z-40">
                <option>Purpose of event</option>
                <option value={"Santa"}>Santa</option>
              </select>
            </div>

            <label
              htmlFor="date"
              className="w-[193px] flex rounded2px border-[1px] border-[#999999] px-3"
            >
              <Image
                src={"/icons/calendar2.svg"}
                width={16}
                height={16}
                alt="Event Icon"
              />
              <input
                id="date"
                type="date"
                onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                className="input text-[#999999] [&::-webkit-calendar-picker-indicator]:hidden [&::-moz-calendar-picker-indicator]:hidden"
              />
            </label>
          </div>

          {/*<div className="dropdown dropdown-bottom dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="w-9 h-9 p-2 bg-[#EDF0EE] flex items-center justify-center group relative overflow-hidden"
            >
              <Image
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
              className="dropdown-content menu bg-white rounded-lg z-1 w-52 p-2 shadow-sm mt-2"
            >
              <li
                className="text-[#595959] text-sm leading-[22px] tracking-[0.5px] duration-1000 hover:bg-[#E4E8E5] rounded"
                onClick={() => setShareModal(true)}
              >
                <button>Share Gallery</button>
              </li>
              <li
                className="text-[#595959] text-sm leading-[22px] tracking-[0.5px] duration-1000 hover:bg-[#E4E8E5] rounded"
                onClick={() => setTagModal(true)}
              >
                <button>Create tags</button>
              </li>
            </ul>
          </div>*/}
        </div>
      </section>

      {/*Comments Section*/}
      <section className="grid grid-cols-3 mt-5 gap-5">
        {/*Single Comment*/}
        <div className="w-full h-[264px] border-[1px] border-[#C7CFC9] rounded-lg gap-6 p-5 relative">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-bold text-[22px] leading-[30px] text-[#737373]">
              Ada, Enugu
            </h2>
            <p className="text-[#737373] text-[15px] leading-5 tracking-[0.5px]">
              04 Oct 2025
            </p>
          </div>
          <p className="text-[#737373] text-[16px] leading-6 mt-5">
            The Yard is the perfect picnic spot in Enugu—beautiful, peaceful,
            and full of charm The Yard is the perfect picnic spot in
            Enugu—beautiful, peaceful, and full of charm.
          </p>

          <div className="w-full flex items-center justify-end gap-2 mt-10">
            <button className="w-[114px] h-[35px] flex items-center justify-center border-[1px] border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] cursor-pointer">
              <span className="z-40 font-sen font-medium">Ignore</span>
              <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>

            <button className="w-[114px] h-[35px] items-center flex justify-center border-[#8C5C5C] bg-yard-primary text-[#EEEEE6] group relative overflow-hidden rounded-[5px] cursor-pointer">
              <span className="z-40 font-sen">Delete</span>
              <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>
          </div>
        </div>
      </section>

      {/*Modals*/}
      <Modal isOpen={mediaModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Upload Media
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setMediaModal(false)}
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
        <div className="grid grid-cols-5 mt-8 gap-5">
          <button className="w-[124px] bg-yard-primary p-2.5 rounded-sm text-[#EEEEE6] font-medium font-sen text-[15px] border-[1px] border-[#C7CFC9]">
            Wedding
          </button>

          <button className="w-[124px] bg-[#EDF0EE] p-2.5 rounded-sm text-yard-primary font-medium font-sen text-[15px] border-[1px] border-[#C7CFC9]">
            Birthday
          </button>

          <button className="w-[124px] bg-[#EDF0EE] p-2.5 rounded-sm text-yard-primary font-medium font-sen text-[15px] border-[1px] border-[#C7CFC9]">
            Picnic
          </button>

          <button className="w-[124px] bg-[#EDF0EE] p-2.5 rounded-sm text-yard-primary font-medium font-sen text-[15px] border-[1px] border-[#C7CFC9]">
            Game
          </button>

          <button className="w-[124px] bg-[#EDF0EE] p-2.5 rounded-sm text-yard-primary font-medium font-sen text-[15px] border-[1px] border-[#C7CFC9]">
            Other
          </button>
        </div>

        {/*Media*/}
        <div className="flex items-start my-4 2xl:my-8 gap-10">
          <div className="w-[166px] flex flex-col items-center gap-5">
            <label htmlFor="media">
              <div className="flex flex-col h-[213px] items-center justify-center border-[1px] border-dashed border-[#BFBFBF] py-3 px-5 cursor-pointer rounded2px">
                <Image
                  src={"/icons/upload.svg"}
                  width={18}
                  height={18}
                  alt="Upload Icon"
                />
                <p className="w-[126px] text-xs text-[#999999] text-center leading-5 tracking-[0.5px] mt-4 mb-1">
                  Choose up to 5 images or drag & drop them here
                </p>

                <p className="w-[126px] text-[10px] text-[#BFBFBF] text-center leading-5 tracking-[0.5px]">
                  JPEG &amp; PNG up to 10mb
                </p>
              </div>
              <input
                type="file"
                accept="image/*,video/*"
                id="media"
                className="hidden"
              />
            </label>
            <div className="bg-[#8A38F51A] flex items-start rounded-[5px] p-2.5 gap-1">
              <Image
                src={"/icons/party.svg"}
                width={16}
                height={16}
                alt="Party Icon"
              />
              <p className="text-[#999999] leading-[22px] tracking-[0.5px] text-sm">
                Please link media to the event it orignate from
              </p>
            </div>
          </div>

          {/*Divider*/}
          <div className="w-[1px] h-[450px] bg-[#EDF0EE] hidden md:block"></div>

          {/*Form*/}
          <form className="w-[454px] flex flex-col gap-4">
            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="title"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter title of media
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter title of media"
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
                  Enter description
                </label>
                <textarea
                  id="desc"
                  name="desc"
                  placeholder="150 words"
                  className="w-full h-[147px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                ></textarea>
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex border-[1px] border-[#BFBFBF] h-[52px] rounded2px p-3 items-center">
                <Image
                  src={"/icons/event.svg"}
                  width={16}
                  height={16}
                  alt="Event Icon"
                />

                <select
                  id="space"
                  name="space"
                  className="w-full p-3 text-[#999999] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                >
                  <option defaultValue="" disabled>
                    Connect media to an event
                  </option>
                  <option value="event1">Event 1</option>
                </select>
              </div>
            </div>

            <div className="form-group flex items-center gap-3">
              <div className="w-full input-group flex border-[1px] border-[#BFBFBF] h-[52px] rounded2px p-3 items-center">
                <Image
                  src={"/icons/calendar2.svg"}
                  width={16}
                  height={16}
                  alt="Event Icon"
                />

                <input
                  type="date"
                  name="date"
                  onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                  className="w-full p-3 text-[#999999] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px] [&::-webkit-calendar-picker-indicator]:hidden [&::-moz-calendar-picker-indicator]:hidden"
                />
              </div>
              <label
                htmlFor="today"
                className="w-[209px] flex gap-3 bg-[#C7CFC9] items-center rounded-[4px] h-[52px] px-2.5 border-[1px] border-[#C7CFC9] transition-colors duration-500 hover:border-yard-dark-primary hover:bg-[#EDF0EE] has-[:checked]:bg-[#EDF0EE]"
              >
                <input
                  type="radio"
                  id="today"
                  value={"today"}
                  name="today"
                  className="radio radio-sm peer border-2 border-yard-primary checked:border-yard-dark-primary checked:text-yard-dark-primary"
                />
                <div>
                  <h3 className="text-xl text-yard-primary leading-9">Today</h3>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden rounded-[5px]"
            >
              <span className="z-40">Upload</span>
              <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>
          </form>
        </div>
      </Modal>

      {/*Share Gallery Modal*/}
      <Modal isOpen={shareModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Share Gallery
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setShareModal(false)}
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
        <div className="flex gap-5 mt-8 justify-center w-full">
          <button className="w-[50px] h-[50px] bg-[#EDF0EE] p-[11.11px] flex items-center justify-center rounded-[2.78px] text-[#EEEEE6] group relative overflow-hidden cursor-pointer">
            <Image
              src={"/icons/whatsapp.svg"}
              width={23}
              height={23}
              className="z-40"
              alt="WhatsApp Icon"
            />
            <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>

          <button className="w-[50px] h-[50px] bg-[#EDF0EE] p-[11.11px] flex items-center justify-center rounded-[2.78px] text-[#EEEEE6] group relative overflow-hidden cursor-pointer">
            <Image
              src={"/icons/facebook.svg"}
              width={23}
              height={23}
              className="z-40"
              alt="Facebook Icon"
            />
            <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>

          <button className="w-[50px] h-[50px] bg-[#EDF0EE] p-[11.11px] flex items-center justify-center rounded-[2.78px] text-[#EEEEE6] group relative overflow-hidden cursor-pointer">
            <Image
              src={"/icons/instagram.svg"}
              width={23}
              height={23}
              className="z-40"
              alt="Instagram Icon"
            />
            <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>

          <button className="w-[50px] h-[50px] bg-[#EDF0EE] p-[11.11px] flex items-center justify-center rounded-[2.78px] text-[#EEEEE6] group relative overflow-hidden cursor-pointer">
            <Image
              src={"/icons/x.svg"}
              width={23}
              height={23}
              className="z-40"
              alt="X Icon"
            />
            <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>

          <button className="w-[50px] h-[50px] bg-[#EDF0EE] p-[11.11px] flex items-center justify-center rounded-[2.78px] text-[#EEEEE6] group relative overflow-hidden cursor-pointer">
            <Image
              src={"/icons/linkedin.svg"}
              width={23}
              height={23}
              className="z-40"
              alt="Linkedin Icon"
            />
            <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center cta-btn bg-base-100 text-yard-primary group relative overflow-hidden rounded-[5px] mt-5"
        >
          <span className="z-40">Copy link</span>
          <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
        </button>
      </Modal>

      {/*Create Tag Modal*/}
      <Modal isOpen={tagModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Create tag
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setTagModal(false)}
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
        {/*Form*/}
        <form className="w-full flex flex-col gap-4 mt-8">
          <div className="form-group flex flex-col md:flex-row items-start gap-6">
            <div className="w-full input-group flex flex-col gap-3">
              <label
                htmlFor="title"
                className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
              >
                Enter tag name
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter tag name"
                className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden rounded-[5px]"
          >
            <span className="z-40">Create tag</span>
            <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>
        </form>
      </Modal>

      {/*Image Modal*/}
      <Modal isOpen={picModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
                Name of media here
              </h2>
              <p className="text-[#999999] text-[16px] leading-6 tracking-[0.5px]">
                Sept 20, 2025
              </p>
            </div>

            {/*Actions*/}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1 group relative cursor-pointer">
                <Image
                  src={"/icons/share2.svg"}
                  width={16}
                  height={16}
                  alt="Share Icon"
                />
                <span className="font-sen font-medium text-[#55544E] leading-6 tracking-[0.4px]">
                  Share
                </span>
                <div className="yard-link-line bg-yard-primary"></div>
              </div>
              <div className="dropdown dropdown-bottom dropdown-center">
                <div
                  tabIndex={0}
                  role="button"
                  className=" p-2 flex items-center justify-center group relative overflow-hidden cursor-pointer"
                >
                  <Image
                    src={"/icons/more2.svg"}
                    width={16}
                    height={16}
                    className="z-40"
                    alt="More Icon"
                  />
                  <div className="absolute top-0 left-0 bg-[#E4E8E5] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
                </div>
                {/*Dropdown content*/}
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-white rounded-lg z-1 w-32 p-2 shadow-sm mt-2"
                >
                  <li
                    className="text-[#595959] text-sm leading-[22px] tracking-[0.5px] duration-1000 hover:bg-[#E4E8E5] rounded"
                    onClick={() => setTagModal(true)}
                  >
                    <button>Edit</button>
                  </li>

                  <li className="text-[#595959] text-sm leading-[22px] tracking-[0.5px] duration-1000 hover:bg-[#E4E8E5] rounded">
                    <Link href={"/admin/dashboard"}>Event</Link>
                  </li>

                  <li
                    className="text-[#595959] text-sm leading-[22px] tracking-[0.5px] duration-1000 hover:bg-[#E4E8E5] rounded"
                    onClick={() => setConfModal(true)}
                  >
                    <button>Delete</button>
                  </li>
                </ul>
              </div>
              <div
                className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
                onClick={() => setPicModal(false)}
              >
                <img
                  src={"/icons/cancel.svg"}
                  alt="Close Icon"
                  className="z-40"
                />
                <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
              </div>
            </div>
          </div>
        </section>
        <p className="mt-5 text-[#999999] tracking-[0.4px] truncate w-full">
          The Yard is the perfect picnic spot in Enugu—beautiful, peaceful, and
          full of charm, The Yard is the perfect picnic spot in Enugu beautiful,
          peaceful, and full of charm
        </p>

        <div className="w-full h-[471px] bg-[url('/gallery/gallery.svg')] bg-cover bg-center mt-4 rounded-lg"></div>
      </Modal>

      {/*Modals*/}
      <Modal isOpen={mediaModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Upload Media
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setMediaModal(false)}
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
        <div className="grid grid-cols-5 mt-8 gap-5">
          <button className="w-[124px] bg-yard-primary p-2.5 rounded-sm text-[#EEEEE6] font-medium font-sen text-[15px] border-[1px] border-[#C7CFC9]">
            Wedding
          </button>

          <button className="w-[124px] bg-[#EDF0EE] p-2.5 rounded-sm text-yard-primary font-medium font-sen text-[15px] border-[1px] border-[#C7CFC9]">
            Birthday
          </button>

          <button className="w-[124px] bg-[#EDF0EE] p-2.5 rounded-sm text-yard-primary font-medium font-sen text-[15px] border-[1px] border-[#C7CFC9]">
            Picnic
          </button>

          <button className="w-[124px] bg-[#EDF0EE] p-2.5 rounded-sm text-yard-primary font-medium font-sen text-[15px] border-[1px] border-[#C7CFC9]">
            Game
          </button>

          <button className="w-[124px] bg-[#EDF0EE] p-2.5 rounded-sm text-yard-primary font-medium font-sen text-[15px] border-[1px] border-[#C7CFC9]">
            Other
          </button>
        </div>

        {/*Media*/}
        <div className="flex items-start my-4 2xl:my-8 gap-10">
          <div className="w-[166px] flex flex-col items-center gap-5">
            <label htmlFor="media">
              <div className="flex flex-col h-[213px] items-center justify-center border-[1px] border-dashed border-[#BFBFBF] py-3 px-5 cursor-pointer rounded2px">
                <Image
                  src={"/icons/upload.svg"}
                  width={18}
                  height={18}
                  alt="Upload Icon"
                />
                <p className="w-[126px] text-xs text-[#999999] text-center leading-5 tracking-[0.5px] mt-4 mb-1">
                  Choose up to 5 images or drag & drop them here
                </p>

                <p className="w-[126px] text-[10px] text-[#BFBFBF] text-center leading-5 tracking-[0.5px]">
                  JPEG &amp; PNG up to 10mb
                </p>
              </div>
              <input
                type="file"
                accept="image/*,video/*"
                id="media"
                className="hidden"
              />
            </label>
            <div className="bg-[#8A38F51A] flex items-start rounded-[5px] p-2.5 gap-1">
              <Image
                src={"/icons/party.svg"}
                width={16}
                height={16}
                alt="Party Icon"
              />
              <p className="text-[#999999] leading-[22px] tracking-[0.5px] text-sm">
                Please link media to the event it orignate from
              </p>
            </div>
          </div>

          {/*Divider*/}
          <div className="w-[1px] h-[450px] bg-[#EDF0EE] hidden md:block"></div>

          {/*Form*/}
          <form className="w-[454px] flex flex-col gap-4">
            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="title"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter title of media
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter title of media"
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
                  Enter description
                </label>
                <textarea
                  id="desc"
                  name="desc"
                  placeholder="150 words"
                  className="w-full h-[147px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                ></textarea>
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex border-[1px] border-[#BFBFBF] h-[52px] rounded2px p-3 items-center">
                <Image
                  src={"/icons/event.svg"}
                  width={16}
                  height={16}
                  alt="Event Icon"
                />

                <select
                  id="space"
                  name="space"
                  className="w-full p-3 text-[#999999] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                >
                  <option defaultValue="" disabled>
                    Connect media to an event
                  </option>
                  <option value="event1">Event 1</option>
                </select>
              </div>
            </div>

            <div className="form-group flex items-center gap-3">
              <div className="w-full input-group flex border-[1px] border-[#BFBFBF] h-[52px] rounded2px p-3 items-center">
                <Image
                  src={"/icons/calendar2.svg"}
                  width={16}
                  height={16}
                  alt="Event Icon"
                />

                <input
                  type="date"
                  name="date"
                  onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                  className="w-full p-3 text-[#999999] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px] [&::-webkit-calendar-picker-indicator]:hidden [&::-moz-calendar-picker-indicator]:hidden"
                />
              </div>
              <label
                htmlFor="today"
                className="w-[209px] flex gap-3 bg-[#C7CFC9] items-center rounded-[4px] h-[52px] px-2.5 border-[1px] border-[#C7CFC9] transition-colors duration-500 hover:border-yard-dark-primary hover:bg-[#EDF0EE] has-[:checked]:bg-[#EDF0EE]"
              >
                <input
                  type="radio"
                  id="today"
                  value={"today"}
                  name="today"
                  className="radio radio-sm peer border-2 border-yard-primary checked:border-yard-dark-primary checked:text-yard-dark-primary"
                />
                <div>
                  <h3 className="text-xl text-yard-primary leading-9">Today</h3>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden rounded-[5px]"
            >
              <span className="z-40">Upload</span>
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
              Delete Media
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
          Are you sure you want this media deleted?
        </p>

        <div className="w-full flex items-center gap-5">
          <button className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] mt-5">
            <span className="z-40 font-sen">Cancel</span>
            <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>

          <button className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-[#8C5C5C] text-[#EEEEE6] group relative overflow-hidden rounded-[5px] mt-5">
            <span className="z-40 font-sen">Delete</span>
            <div className="absolute top-0 left-0 bg-[#6d4a4aa6] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>
        </div>
      </Modal>
    </main>
  );
}
