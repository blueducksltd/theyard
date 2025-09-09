import Link from "next/link";

const Upcoming = () => {
  return (
    <main className="w-full my-4 py-16">
      <header className="flex justify-between items-center">
        <div className="flex flex-col items-start gap-4">
          <div className="title flex flex-col items-end">
            <h1 className="">Upcoming Events</h1>
            <img src={"/featured-line.svg"} alt="Line" className="-mt-3 w-24" />
          </div>
        </div>

        <Link href={"#"} className="cta-btn">
          View all events
        </Link>
      </header>

      <section className="grid grid-cols-3 items-center my-4 gap-2">
        <div className="h-[368px] rounded-md bg-[url('/upcoming.svg')] bg-cover bg-center"></div>
        <div className="h-[368px] rounded-md bg-[url('/upcoming2.svg')] bg-cover bg-center"></div>
        <div className="h-[368px] rounded-md bg-[url('/upcoming3.svg')] bg-cover bg-center"></div>
      </section>
    </main>
  );
};

export default Upcoming;
