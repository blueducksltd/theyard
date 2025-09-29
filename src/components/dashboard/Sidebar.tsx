import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
  return (
    <main className="w-[256px] py-4 px-5 border-r-[1px] border-[#E4E8E5] h-full">
      <section className="flex flex-col gap-2 relative h-full">
        <div className="md:flex items-center py-3 px-4 rounded-sm gap-2 hidden group hover:text-yard-primary relative overflow-hidden">
          <Image
            src={"/icons/dashboard.svg"}
            className="z-40"
            width={20}
            height={20}
            alt="Dashboard Icon"
          />
          <Link
            href={"#"}
            className="md:flex justify-center text-[#44433E] z-40"
          >
            <span>Dashboard</span>
          </Link>
          <div className="absolute top-0 left-0 bg-yard-hover w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0 z-10"></div>
        </div>

        <div className="md:flex items-center py-3 px-4 rounded-sm gap-2 hidden group hover:text-yard-primary relative overflow-hidden">
          <Image
            src={"/icons/bookmark.svg"}
            className="z-40"
            width={20}
            height={20}
            alt="Bookmark Icon"
          />
          <Link
            href={"#"}
            className="md:flex justify-center text-[#44433E] z-40"
          >
            <span>Bookings Mgt</span>
          </Link>
          <div className="absolute top-0 left-0 bg-yard-hover w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0 z-10"></div>
        </div>

        <div className="md:flex items-center py-3 px-4 rounded-sm gap-2 hidden group hover:text-yard-primary relative overflow-hidden">
          <Image
            src={"/icons/calendar.svg"}
            className="z-40"
            width={20}
            height={20}
            alt="Calendar Icon"
          />
          <Link
            href={"#"}
            className="md:flex justify-center text-[#44433E] z-40"
          >
            <span>Events &amp; Calendar</span>
          </Link>
          <div className="absolute top-0 left-0 bg-yard-hover w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0 z-10"></div>
        </div>

        <div className="md:flex items-center py-3 px-4 rounded-sm gap-2 hidden group hover:text-yard-primary relative overflow-hidden">
          <Image
            src={"/icons/box-tick.svg"}
            className="z-40"
            width={20}
            height={20}
            alt="Box-tick Icon"
          />
          <Link
            href={"#"}
            className="md:flex justify-center text-[#44433E] z-40"
          >
            <span>Packages &amp; Services</span>
          </Link>
          <div className="absolute top-0 left-0 bg-yard-hover w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0 z-10"></div>
        </div>

        <div className="md:flex items-center py-3 px-4 rounded-sm gap-2 hidden group hover:text-yard-primary relative overflow-hidden">
          <Image
            src={"/icons/picture.svg"}
            className="z-40"
            width={20}
            height={20}
            alt="Picture Icon"
          />
          <Link
            href={"#"}
            className="md:flex justify-center text-[#44433E] z-40"
          >
            <span>Gallery</span>
          </Link>
          <div className="absolute top-0 left-0 bg-yard-hover w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0 z-10"></div>
        </div>

        <div className="md:flex items-center py-3 px-4 rounded-sm gap-2 hidden group hover:text-yard-primary relative overflow-hidden">
          <Image
            src={"/icons/directbox.svg"}
            className="z-40"
            width={20}
            height={20}
            alt="Directbox Icon"
          />
          <Link
            href={"#"}
            className="md:flex justify-center text-[#44433E] z-40"
          >
            <span>Reviews</span>
          </Link>
          <div className="absolute top-0 left-0 bg-yard-hover w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0 z-10"></div>
        </div>

        <div className="md:flex items-center py-3 px-4 rounded-sm gap-2 hidden group hover:text-yard-primary relative overflow-hidden">
          <Image
            src={"/icons/profile.svg"}
            className="z-40"
            width={20}
            height={20}
            alt="Profile Icon"
          />
          <Link
            href={"#"}
            className="md:flex justify-center text-[#44433E] z-40"
          >
            <span>Users &amp; Roles</span>
          </Link>
          <div className="absolute top-0 left-0 bg-yard-hover w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0 z-10"></div>
        </div>

        <div className="flex justify-end">
          <Image
            src={"/icons/arrow.svg"}
            width={20}
            height={20}
            alt="Arrow Icon"
          />
        </div>

        <footer className="absolute bottom-0 w-full">
          <div className="md:flex items-center py-3 px-4 rounded-sm gap-2 hidden group hover:text-yard-primary relative overflow-hidden">
            <Image
              src={"/icons/setting.svg"}
              className="z-40"
              width={20}
              height={20}
              alt="Setting Icon"
            />
            <Link
              href={"#"}
              className="md:flex justify-center text-[#44433E] z-40"
            >
              <span>Settings</span>
            </Link>
            <div className="absolute top-0 left-0 bg-yard-hover w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0 z-10"></div>
          </div>

          <div className="md:flex items-center py-3 px-4 rounded-sm gap-2 hidden group hover:text-yard-primary relative overflow-hidden">
            <Image
              src={"/icons/logout.svg"}
              className="z-40"
              width={20}
              height={20}
              alt="Logout Icon"
            />
            <Link
              href={"#"}
              className="md:flex justify-center text-[#44433E] z-40"
            >
              <span>Log out</span>
            </Link>
            <div className="absolute top-0 left-0 bg-yard-hover w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0 z-10"></div>
          </div>
        </footer>
      </section>
    </main>
  );
}
