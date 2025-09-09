import Link from "next/link";

const Gallery = () => {
  return (
    <main className="w-full my-4">
      <header className="flex justify-between items-center">
        <div className="flex flex-col items-start gap-2">
          <div className="title flex flex-col items-end">
            <h1 className="">Gallery Teaser</h1>
            <img src={"/featured-line.svg"} alt="Line" className="-mt-3 w-24" />
          </div>
          <p className="paragraph w-[650px]">See more of our space in action</p>
        </div>

        <Link href={"#"} className="cta-btn">
          View full gallery
        </Link>
      </header>

      <section className="w-full flex flex-wrap items-center my-4 gap-1">
        <div className="w-[772px] h-[260px] bg-[url('/gallery/gallery.svg')] bg-cover bg-center flex-grow"></div>
        <div className="w-[384px] h-[260px] bg-[url('/gallery/gallery2.svg')] bg-cover bg-center flex-grow"></div>
        <div className="w-[384px] h-[280px] bg-[url('/gallery/gallery3.svg')] bg-cover bg-center flex-grow"></div>
        <div className="w-[384px] h-[280px] bg-[url('/gallery/gallery4.svg')] bg-cover bg-center flex-grow"></div>
        <div className="w-[384px] h-[280px] bg-[url('/gallery/gallery5.svg')] bg-cover bg-center flex-grow"></div>
        <div className="w-[384px] h-[260px] bg-[url('/gallery/gallery6.svg')] bg-cover bg-center flex-grow"></div>
        <div className="w-[772px] h-[260px] bg-[url('/gallery/gallery7.svg')] bg-cover bg-center flex-grow"></div>
      </section>
    </main>
  );
};

export default Gallery;
