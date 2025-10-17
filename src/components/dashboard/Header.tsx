/* eslint-disable @next/next/no-img-element */
"use client";
import { IAdmin } from "@/types/Admin";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface IProps {
  section?: string;
}

export default function Header({ section }: IProps) {
  const [user, setUser] = useState<IAdmin | null>(null);

  useEffect(() => {
    // Only access localStorage in useEffect (client-side only)
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("user");
      if (savedData) {
        setUser(JSON.parse(savedData));
      }
    }
  }, []);

  return (
    <main className="w-full flex items-center justify-between py-4 px-5 border-b-[1px] border-[#E4E8E5]">
      <section className="flex items-center gap-[188px]">
        <Link href={"/"} target="_blank">
          <img src={"/logo-black.svg"} alt="Logo" className="w-[67px]" />
        </Link>
        <h2 className="font-bold text-2xl leading-8 text-yard-primary mt-4">
          {section || "Admin Dashboard"}
        </h2>
      </section>

      <section className="flex items-center gap-5">
        <Image
          src={"/icons/search.svg"}
          width={20}
          height={20}
          alt="Search Icon"
        />
        <Image
          src={"/icons/notification.svg"}
          width={20}
          height={20}
          alt="Notification Icon"
        />

        <Link
          href={"/admin/dashboard"}
          className="w-max h-[52px] lg:flex justify-center items-center bg-[#E4E8E5] text-yard-primary py-3 px-4 rounded-sm gap-2 hidden group relative overflow-hidden mr-5"
        >
          <div
            className="rounded-full w-[32px] h-[32px] bg-cover bg-center"
            style={{
              backgroundImage: `url(${user?.imageUrl ? user?.imageUrl : "/gallery/girl.svg"})`,
            }}
          ></div>
          <span className="z-50">{user?.name?.split(" ")[0]} Profile</span>
          {/*<div className="absolute top-0 left-0 bg-yard-hover w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>*/}
        </Link>
      </section>
    </main>
  );
}
