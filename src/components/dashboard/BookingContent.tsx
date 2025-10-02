// import Link from "next/link";
// import Image from "next/image";

export default function BookingContent() {
  return (
    <main className="flex-1 py-4 md:h-[600px] 2xl:h-[770px] overflow-y-auto">
      <section className="flex flex-col gap-5">
        <div className="grid grid-cols-4 p-5 gap-5">
          {/*Single Container*/}
          <div className="bg-[#E4E8E5] px-4 py-5 rounded-sm border-[1px] border-[#C7CFC9] flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[52px] leading-9 text-[#66655E]">
                16
              </h2>
              <p className="font-medium leading-[22px] tracking-[0.5px] text-[#999999]">
                12 today
              </p>
            </div>
            <p className="font-medium leading-[22px] tracking-[0.5px] text-[#737373]">
              Pending Bookings
            </p>
          </div>

          {/*Single Container*/}
          <div className="bg-[#FFFFFF] px-4 py-5 rounded-sm border-[1px] border-[#C7CFC9] flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[52px] leading-9 text-[#66655E]">
                30
              </h2>
              <p className="font-medium leading-[22px] tracking-[0.5px] text-[#999999]">
                20 today
              </p>
            </div>
            <p className="font-medium leading-[22px] tracking-[0.5px] text-[#737373]">
              Active Bookings
            </p>
          </div>

          {/*Single Container*/}
          <div className="bg-[#FFFFFF] px-4 py-5 rounded-sm border-[1px] border-[#C7CFC9] flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[52px] leading-9 text-[#66655E]">
                20
              </h2>
              <p className="font-medium leading-[22px] tracking-[0.5px] text-[#999999]">
                5 today
              </p>
            </div>
            <p className="font-medium leading-[22px] tracking-[0.5px] text-[#737373]">
              Cancelled Bookings
            </p>
          </div>

          {/*Single Container*/}
          <div className="bg-[#FFFFFF] px-4 py-5 rounded-sm border-[1px] border-[#C7CFC9] flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[52px] leading-9 text-[#66655E]">
                10
              </h2>
              <p className="font-medium leading-[22px] tracking-[0.5px] text-[#999999]">
                2 today
              </p>
            </div>
            <p className="font-medium leading-[22px] tracking-[0.5px] text-[#737373]">
              Past Bookings
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
