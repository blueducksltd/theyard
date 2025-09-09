import Link from "next/link";

const Introduction = () => {
  return (
    <section className="flex justify-center py-20">
      <div className="relative flex items-center justify-center">
        <div className="w-[720px] h-[375px] border-x-2 border-yard-lighter-orange justify-center items-center"></div>
        <div className="w-[800px] h-[295px] border-y-2 border-yard-lighter-orange absolute flex flex-col items-start pt-10 px-24 gap-4">
          <div className="title flex flex-col items-end">
            <h1 className="">Quick Introduction</h1>
            <img src={"/line.svg"} alt="Line" className="-mt-3" width={180} />
          </div>

          <p className="paragraph">
            At The Yard, we believe every moment is worth celebrating. Whether
            you’re here for a quiet picnic, a romantic date, or a joyful event
            with friends, our lush green spaces and curated setups create
            memories you’ll cherish forever.
          </p>

          <Link href={"#"} className="cta-btn bg-yard-primary text-yard-milk">
            Learn more about us
          </Link>

          <div className="flex absolute bottom-16 right-28">
            <img src={"/celebration.svg"} alt="Celebration" className="w-12" />
            <img src={"/celebration.svg"} alt="Celebration" className="w-12" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
