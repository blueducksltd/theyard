"use client";
import Modal from "@/components/Modal";
// import Link from "next/link";
// import Image from "next/image";

import Image from "next/image";
import React from "react";

export default function PackagesContent() {
  const [section, setSection] = React.useState<string>("services");
  const [addServiceModal, setAddServiceModal] = React.useState<boolean>(false);
  const [addPackageModal, setAddPackageModal] = React.useState<boolean>(false);

  return (
    <main className="flex-1 py-4 md:h-[600px] 2xl:h-[770px] overflow-y-auto">
      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between p-5 gap-5">
          {/* Container Holder */}
          <div className="w-[745px] flex gap-5">
            {/*Single Container*/}
            <div
              className={`w-full px-4 py-5 rounded-sm border-[1px] border-[#C7CFC9] ${section == "services" ? "bg-[#E4E8E5]" : "bg-[#FFFFFF]"} flex flex-col gap-4 cursor-pointer`}
              onClick={() => setSection("services")}
            >
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-[52px] leading-9 text-[#66655E]">
                  4
                </h2>
              </div>
              <p className="font-medium leading-[22px] tracking-[0.5px] text-[#737373]">
                Available services
              </p>
            </div>

            {/*Single Container*/}
            <div
              className={`w-full px-4 py-5 rounded-sm border-[1px] border-[#C7CFC9] ${section == "packages" ? "bg-[#E4E8E5]" : "bg-[#FFFFFF]"} flex flex-col gap-4 cursor-pointer`}
              onClick={() => setSection("packages")}
            >
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-[52px] leading-9 text-[#66655E]">
                  4
                </h2>
              </div>
              <p className="font-medium leading-[22px] tracking-[0.5px] text-[#737373]">
                Available Packages
              </p>
            </div>
          </div>
          <div className="dropdown">
            <button
              tabIndex={0}
              role="button"
              className="flex items-center gap-2 rounded-[4px] border-[1px] border-yard-primary p-3 text-yard-primary cursor-pointer group relative overflow-hidden"
            >
              <Image
                src={"/icons/add.svg"}
                width={16}
                height={16}
                className="z-40"
                alt="Add Icon"
              />
              <span className="leading-6 tracking-[0.5px] text-[16px] z-40">
                Add a new
              </span>
              <div className="absolute top-0 left-0 bg-[#E4E8E5] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>
            {/*Dropdown content*/}
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-lg z-1 w-full p-2 shadow-sm mt-2"
            >
              <li
                className="text-[#595959] text-sm leading-[22px] tracking-[0.5px] duration-1000 hover:bg-[#E4E8E5] rounded"
                onClick={() => setAddServiceModal(true)}
              >
                <button>Services</button>
              </li>
              <li
                className="text-[#595959] text-sm leading-[22px] tracking-[0.5px] duration-1000 hover:bg-[#E4E8E5] rounded"
                onClick={() => setAddPackageModal(true)}
              >
                <button>Packages</button>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {section == "services" ? (
        <section className="w-full p-4">
          <div className="flex gap-3 items-center">
            <h2 className="text-[#66655E] font-semibold text-[22px] leading-[30px]">
              All services
            </h2>
            <p className="text-[#999999] font-medium leading-[22px] tracking-[0.5px]">
              4 available
            </p>
          </div>

          <div className="grid grid-cols-3 mt-5 gap-5">
            <div className="flex flex-col gap-3">
              <div className="w-full h-[224px] bg-[url('/gallery/gallery.svg')] bg-cover bg-center rounded2px"></div>
              <h3 className="text-[#66655E] text-[16px] font-semibold leading-6 tracking-[0.5px]">
                Picnic Spaces gatherings
              </h3>
              <p className="font-medium text-xs leading-5 tracking-[0.5px] text-[#999999]">
                Relax in nature with our charming picnic setups. We offer an
                organized ranquil outdoor settings for lounging, reading, or
                informal.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="w-full h-[224px] bg-[url('/gallery/gallery.svg')] bg-cover bg-center rounded2px"></div>
              <h3 className="text-[#66655E] text-[16px] font-semibold leading-6 tracking-[0.5px]">
                Picnic Spaces gatherings
              </h3>
              <p className="font-medium text-xs leading-5 tracking-[0.5px] text-[#999999]">
                Relax in nature with our charming picnic setups. We offer an
                organized ranquil outdoor settings for lounging, reading, or
                informal.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="w-full h-[224px] bg-[url('/gallery/gallery.svg')] bg-cover bg-center rounded2px"></div>
              <h3 className="text-[#66655E] text-[16px] font-semibold leading-6 tracking-[0.5px]">
                Picnic Spaces gatherings
              </h3>
              <p className="font-medium text-xs leading-5 tracking-[0.5px] text-[#999999]">
                Relax in nature with our charming picnic setups. We offer an
                organized ranquil outdoor settings for lounging, reading, or
                informal.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="w-full p-4">
          <div className="flex gap-3 items-center">
            <h2 className="text-[#66655E] font-semibold text-[22px] leading-[30px]">
              All packages
            </h2>
            <p className="text-[#999999] font-medium leading-[22px] tracking-[0.5px]">
              3 available
            </p>
          </div>

          <div className="grid grid-cols-3 mt-5 gap-5">
            <div className="flex flex-col gap-3">
              <div className="w-full h-[224px] bg-[url('/gallery/gallery.svg')] bg-cover bg-center rounded2px"></div>
              <h3 className="text-[#66655E] text-[16px] font-semibold leading-6 tracking-[0.5px]">
                Picnic Package
              </h3>
              <p className="font-medium text-xs leading-5 tracking-[0.5px] text-[#999999]">
                Relax in nature with our charming picnic setups. We offer an
                organized ranquil outdoor settings for lounging, reading, or
                informal.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="w-full h-[224px] bg-[url('/gallery/gallery.svg')] bg-cover bg-center rounded2px"></div>
              <h3 className="text-[#66655E] text-[16px] font-semibold leading-6 tracking-[0.5px]">
                Intimate Event Package
              </h3>
              <p className="font-medium text-xs leading-5 tracking-[0.5px] text-[#999999]">
                Relax in nature with our charming picnic setups. We offer an
                organized ranquil outdoor settings for lounging, reading, or
                informal.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="w-full h-[224px] bg-[url('/gallery/gallery.svg')] bg-cover bg-center rounded2px"></div>
              <h3 className="text-[#66655E] text-[16px] font-semibold leading-6 tracking-[0.5px]">
                Full Party Package
              </h3>
              <p className="font-medium text-xs leading-5 tracking-[0.5px] text-[#999999]">
                Relax in nature with our charming picnic setups. We offer an
                organized ranquil outdoor settings for lounging, reading, or
                informal.
              </p>
            </div>
          </div>
        </section>
      )}

      {/*Modals*/}
      <Modal isOpen={addServiceModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Add a new service
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setAddServiceModal(false)}
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

        <div className="w-full flex items-start my-4 2xl:my-8 gap-10">
          {/*Form*/}
          <form className="w-full flex flex-col gap-5">
            <label htmlFor="media">
              <div className="flex flex-col h-[200px] items-center justify-center border-[1px] border-dashed border-[#BFBFBF] py-3 px-5 cursor-pointer rounded2px">
                <Image
                  src={"/icons/upload.svg"}
                  width={18}
                  height={18}
                  alt="Upload Icon"
                />
                <p className="w-[126px] text-xs text-[#999999] text-center leading-5 tracking-[0.5px] mt-4 mb-1">
                  Choose an image or drag &amp; drop them here
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

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="serviceName"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter service name
                </label>
                <input
                  type="text"
                  id="serviceName"
                  name="serviceName"
                  placeholder="Enter service name"
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

            <div className="w-full flex items-center gap-5 mt-3">
              <button
                type="button"
                className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] cursor-pointer"
                onClick={() => setAddServiceModal(false)}
              >
                <span className="z-40 font-sen">Cancel</span>
                <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>

              <button
                type="submit"
                className="w-full flex justify-center cta-btn bg-yard-primary text-[#EEEEE6] group relative overflow-hidden rounded-[5px] cursor-pointer"
              >
                <span className="z-40 font-sen">Add service</span>
                <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/*Add Package Modal*/}
      <Modal isOpen={addPackageModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Add a new package
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setAddPackageModal(false)}
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

        <div className="w-full flex items-start my-4 2xl:my-8 gap-10">
          {/*Form*/}
          <form className="w-full flex flex-col gap-5 h-[555px] overflow-y-scroll">
            <label htmlFor="media">
              <div className="flex flex-col h-[200px] items-center justify-center border-[1px] border-dashed border-[#BFBFBF] py-3 px-5 cursor-pointer rounded2px">
                <Image
                  src={"/icons/upload.svg"}
                  width={18}
                  height={18}
                  alt="Upload Icon"
                />
                <p className="w-[126px] text-xs text-[#999999] text-center leading-5 tracking-[0.5px] mt-4 mb-1">
                  Choose an image or drag &amp; drop them here
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

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="serviceName"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter service name
                </label>
                <input
                  type="text"
                  id="serviceName"
                  name="serviceName"
                  placeholder="Enter package name"
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
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="packagePrice"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter package price
                </label>
                <input
                  type="text"
                  id="packagePrice"
                  name="packagePrice"
                  placeholder="Package price"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <div className="w-full flex items-center gap-5 mt-3">
              <button
                type="button"
                className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] cursor-pointer"
                onClick={() => setAddPackageModal(false)}
              >
                <span className="z-40 font-sen">Cancel</span>
                <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>

              <button
                type="submit"
                className="w-full flex justify-center cta-btn bg-yard-primary text-[#EEEEE6] group relative overflow-hidden rounded-[5px] cursor-pointer"
              >
                <span className="z-40 font-sen">Add package</span>
                <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </main>
  );
}
