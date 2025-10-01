import Link from "next/link";
import Image from "next/image";

export default function HomeContent() {
  return (
    <main className="flex-1 py-4 px-5">
      <section className="grid grid-cols-2 gap-5">
        {/*Outer box*/}
        <div className="w-full h-[390px] bg-[#fdfdfd] border-[1px] border-[#C7CFC9] rounded-lg py-5 px-4 gap-6">
          <div className="w-full flex justify-between items-start bg-[#EDF0EE] rounded-sm border-[1px] border-[#C7CFC9] p-5">
            <div className="flex flex-col gap-5">
              <h2 className="font-bold text-[52px] leading-9 text-yard-primary">
                50
              </h2>
              <p className="font-medium text-md leading-[22px] tracking-[0.5px] text-[#999999]">
                Active Booking
              </p>
            </div>
            <Link
              href={"#"}
              className="text-[#55544E] text-sm font-sen leading-6 tracking-[0.4px] font-medium group relative w-max"
            >
              View all
              <span className="yard-link-line bg-yard-primary"></span>
            </Link>
          </div>

          {/*Inner box*/}
          <div className="flex items-center mt-7 gap-5">
            {/*Single box*/}
            <div className="w-full flex flex-col rounded-sm border-[0.2px] border-[#B8BDBF] gap-4 p-3">
              <div className="w-full flex justify-between">
                <h2 className="font-semibold text-yard-primary leading-6 tracking-[0.5px]">
                  Game Space
                </h2>
                <Image
                  src={"/icons/arrow-up-right.svg"}
                  width={16}
                  height={16}
                  alt="Arrow Up Right Icon"
                />
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-[#737373] text-sm leading-5 tracking-[0.5px]">
                  Name:
                </p>
                <p className="text-[#5A5A53] text-sm leading-5 tracking-[0.5px]">
                  Frank Itumo
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-[#737373] text-sm leading-5 tracking-[0.5px]">
                  Date:
                </p>
                <p className="text-[#5A5A53] text-sm leading-5 tracking-[0.5px]">
                  30 Sept, 2025
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-[#737373] text-sm leading-5 tracking-[0.5px]">
                  Time:
                </p>
                <p className="text-[#5A5A53] text-sm leading-5 tracking-[0.5px]">
                  10:00 - 12:00
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-[#737373] text-sm leading-5 tracking-[0.5px]">
                  Duration:
                </p>
                <p className="text-[#5A5A53] text-sm leading-5 tracking-[0.5px]">
                  2hrs
                </p>
              </div>
            </div>

            {/*Single box*/}
            <div className="w-full flex flex-col rounded-sm border-[0.2px] border-[#B8BDBF] gap-4 p-3">
              <div className="w-full flex justify-between">
                <h2 className="font-semibold text-yard-primary leading-6 tracking-[0.5px]">
                  Picnic Space
                </h2>
                <Image
                  src={"/icons/arrow-up-right.svg"}
                  width={16}
                  height={16}
                  alt="Arrow Up Right Icon"
                />
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-[#737373] text-sm leading-5 tracking-[0.5px]">
                  Name:
                </p>
                <p className="text-[#5A5A53] text-sm leading-5 tracking-[0.5px]">
                  Frank Itumo
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-[#737373] text-sm leading-5 tracking-[0.5px]">
                  Date:
                </p>
                <p className="text-[#5A5A53] text-sm leading-5 tracking-[0.5px]">
                  30 Sept, 2025
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-[#737373] text-sm leading-5 tracking-[0.5px]">
                  Time:
                </p>
                <p className="text-[#5A5A53] text-sm leading-5 tracking-[0.5px]">
                  10:00 - 12:00
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-[#737373] text-sm leading-5 tracking-[0.5px]">
                  Duration:
                </p>
                <p className="text-[#5A5A53] text-sm leading-5 tracking-[0.5px]">
                  2hrs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/*Outer box*/}
        <div className="w-full h-[390px] bg-[#FCF9F6] border-[1px] border-[#D2C3AD] rounded-lg py-5 px-4 gap-6">
          <div className="w-full flex justify-between items-start bg-[#F8F3EB] rounded-sm border-[1px] border-[#E9D9C0] p-5">
            <div className="flex flex-col gap-5">
              <h2 className="font-bold text-[52px] leading-9 text-yard-primary">
                12
              </h2>
              <p className="font-medium text-md leading-[22px] tracking-[0.5px] text-[#999999]">
                Upcoming Events
              </p>
            </div>
            <Link
              href={"#"}
              className="text-[#55544E] text-sm font-sen leading-6 tracking-[0.4px] font-medium group relative w-max"
            >
              View all
              <span className="yard-link-line bg-yard-primary"></span>
            </Link>
          </div>

          {/*Inner box*/}
          <div className="flex items-center mt-7 gap-5">
            {/*Single box*/}
            <div className="w-full flex flex-col rounded-sm border-[0.2px] border-[#B8BDBF] gap-4 p-3">
              <div className="flex justify-between border-t-[0.2px] border-[#B8BDBF] pt-2">
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  Frank Itumo
                </p>
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  Picnic
                </p>
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  02 Sept, 2025
                </p>
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  2hrs 30mins
                </p>
              </div>

              <div className="flex justify-between border-t-[0.2px] border-[#B8BDBF] pt-2">
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  Frank Itumo
                </p>
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  Picnic
                </p>
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  02 Sept, 2025
                </p>
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  2hrs 30mins
                </p>
              </div>

              <div className="flex justify-between border-t-[0.2px] border-[#B8BDBF] pt-2">
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  Frank Itumo
                </p>
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  Picnic
                </p>
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  02 Sept, 2025
                </p>
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  2hrs 30mins
                </p>
              </div>

              <div className="flex justify-between border-t-[0.2px] border-[#B8BDBF] pt-2">
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  Frank Itumo
                </p>
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  Picnic
                </p>
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  02 Sept, 2025
                </p>
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  2hrs 30mins
                </p>
              </div>
            </div>
          </div>
        </div>

        {/*Outer box*/}
        <div className="w-full h-[390px] bg-[#FCF9F6] border-[1px] border-[#D2C3AD] rounded-lg py-5 px-4 gap-6">
          <div className="w-full flex justify-between items-start bg-[#F8F3EB] rounded-sm border-[1px] border-[#E9D9C0] p-5">
            <div className="flex flex-col gap-5">
              <h2 className="font-bold text-[52px] leading-9 text-yard-primary">
                24
              </h2>
              <p className="font-medium text-md leading-[22px] tracking-[0.5px] text-[#999999]">
                Packages &amp; Services
              </p>
            </div>
            <Link
              href={"#"}
              className="text-[#55544E] text-sm font-sen leading-6 tracking-[0.4px] font-medium group relative w-max"
            >
              View all
              <span className="yard-link-line bg-yard-primary"></span>
            </Link>
          </div>

          {/*Inner box*/}
          <div className="flex items-center mt-7 gap-5">
            {/*Single box*/}
            <div className="w-full flex flex-col rounded-sm border-[0.2px] border-[#B8BDBF] gap-4 p-3">
              <div className="flex justify-between border-t-[0.2px] border-[#B8BDBF] pt-2">
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px] w-[134px]">
                  Full Party Package
                </p>
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  Picnic
                </p>
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  02 Sept, 2025
                </p>
              </div>

              <div className="flex justify-between border-t-[0.2px] border-[#B8BDBF] pt-2">
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px] w-[134px]">
                  Picnic Package
                </p>
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  Game
                </p>
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  02 Sept, 2025
                </p>
              </div>

              <div className="flex justify-between border-t-[0.2px] border-[#B8BDBF] pt-2">
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px] w-[134px]">
                  Intimate Package
                </p>
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  Picnic
                </p>
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  02 Sept, 2025
                </p>
              </div>

              <div className="flex justify-between border-t-[0.2px] border-[#B8BDBF] pt-2">
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px] w-[134px]">
                  Full Party Package
                </p>
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  Picnic
                </p>
                <p className="text-[#737373 ] text-xs leading-5 tracking-[0.5px]">
                  02 Sept, 2025
                </p>
              </div>
            </div>
          </div>
        </div>

        {/*Outer box*/}
        <div className="w-full h-[390px] bg-[#fdfdfd] border-[1px] border-[#C7CFC9] rounded-lg py-5 px-4 gap-6 flex flex-col">
          <div className="w-full flex justify-between items-start bg-[#EDF0EE] rounded-sm border-[1px] border-[#C7CFC9] p-5">
            <div className="flex flex-col gap-5">
              <h2 className="font-bold text-[52px] leading-9 text-yard-primary">
                15
              </h2>
              <p className="font-medium text-md leading-[22px] tracking-[0.5px] text-[#999999]">
                Comments
              </p>
            </div>
            <Link
              href={"#"}
              className="text-[#55544E] text-sm font-sen leading-6 tracking-[0.4px] font-medium group relative w-max"
            >
              View all
              <span className="yard-link-line bg-yard-primary"></span>
            </Link>
          </div>

          {/*Inner box*/}
          <div className="flex flex-col items-start gap-5 flex-1 relative">
            {/*Single box*/}
            <div className="w-full flex flex-col rounded-sm gap-4 p-3">
              <div className="w-full flex flex-col">
                <div className="w-full flex justify-between">
                  <h2 className="font-semibold text-yard-primary leading-6 tracking-[0.5px]">
                    Ada, Enugu
                  </h2>
                  <p className="text-[#5A5A53] text-sm leading-5 tracking-[0.5px]">
                    30 Sept, 2025
                  </p>
                </div>
                <p className="text-xs text-[#737373] leading-5 tracking-[0.5px] mt-3">
                  The Yard is the perfect picnic spot in Enugu—beautiful,
                  peaceful, and full of charm.
                </p>
              </div>
            </div>

            {/*Actions*/}
            <div className="w-full flex justify-end absolute bottom-0 gap-2">
              <button className="w-[114px] h-7 border-[1.5px] border-[#A44B4B] text-[#A44B4B] font-medium text-[16px] leading-6 tracking-[0.4px] font-sen px-6 py-5 rounded2px flex justify-center items-center cursor-pointer group relative overflow-hidden hover:text-yard-dark-primary">
                <span className="z-40">Ignore</span>
                <div className="absolute top-0 left-0 bg-yard-hover text w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>
              <button className="w-[114px] h-7 border-[1.5px] border-[#fdfdfd] bg-yard-primary text-[#EEEEE6] font-medium text-[16px] leading-6 tracking-[0.4px] font-sen px-6 py-5 rounded2px flex justify-center items-center cursor-pointer group relative overflow-hidden">
                <span className="z-40">Publish</span>
                <div className="absolute top-0 left-0 bg-yard-dark-primary text w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
