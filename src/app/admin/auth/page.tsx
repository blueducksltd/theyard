"use client";
import { adminLogin } from "@/util";
import { useState } from "react";
import { toast } from "react-toastify";

/* eslint-disable @next/next/no-img-element */
export default function Page() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (formdata: FormData) => {
    const data = {
      email: formdata.get("email") as string,
      password: formdata.get("password") as string,
    };

    try {
      const response = await adminLogin(data);
      if (response.success === "success") {
        window.location.href = "/admin/dashboard";
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response.data.message, { position: "bottom-right" });
    }
  };

  return (
    <main className="w-full h-screen flex">
      {/*Image*/}
      <div className="hidden md:block w-[604px] h-full bg-[url('/auth.svg')] bg-center bg-cover"></div>
      <section className="flex justify-center items-center w-[53rem]">
        <form
          action={handleSubmit}
          className="flex flex-col w-[440px] items-center"
        >
          <img src={"/logo-black.svg"} alt="Logo" className="w-[90px]" />
          <div className="title flex flex-col items-end mb-10 mt-5">
            <h1 className="font-playfair w-[250px] text-center text-[22px] md:w-96 lg:w-full md:text-[32px] text-yard-primary font-bold md:leading-[56px] tracking-[-0.1px]">
              Login
            </h1>
            <img
              src={"/about-line.svg"}
              alt="Line"
              className="md:-mt-4 -mt-2 w-40 md:w-22"
            />
          </div>

          <div className="input-group flex flex-col w-full">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[#1A1A1A] leading-6">
                Enter your email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                className="md:w-full h-[52px] rounded2px border-[1px] focus:outline-yard-dark-primary border-[#BFBFBF] p-3"
              />
            </div>
          </div>

          <div className="input-group flex flex-col w-full mt-5 relative">
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[#1A1A1A] leading-6">
                Enter your password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                className="md:w-full h-[52px] rounded2px border-[1px] focus:outline-yard-dark-primary border-[#BFBFBF] p-3"
              />
              <img
                onClick={() => setShowPassword((prev) => !prev)}
                src={showPassword ? "/icons/eye-slash.svg" : "/icons/eye.svg"}
                alt="Eye Logo"
                className="w-6 absolute top-12 right-5 cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden mt-5 cursor-pointer"
          >
            <span className="z-40">Login to dashboard</span>
            <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>
        </form>
      </section>
    </main>
  );
}
