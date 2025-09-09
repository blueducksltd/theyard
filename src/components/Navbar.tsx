import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <nav
        className={
          "w-full h-28 px-16 flex items-center justify-between text-yard-gray text-base font-sen font-medium bg-yard-white fixed z-50"
        }
      >
        <a href="">
          {/*eslint-disable-next-line @next/next/no-img-element*/}
          <img src="/logo-black.svg" alt="Logo" />
        </a>

        <ul className="flex space-x-7">
          <Link href={"#"} className="group relative border-b-[1px]">
            Home
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>

          <Link href={"#"} className="group relative">
            Events
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>

          <Link href={"#"} className="group relative">
            About us
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>

          <Link href={"#"} className="group relative">
            Booking
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>

          <Link href={"#"} className="group relative">
            Services
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>

          <Link href={"#"} className="group relative">
            Packages
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>

          <Link href={"#"} className="group relative">
            Gallery
            <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>
        </ul>

        <Link
          href={"#"}
          className="w-[171px] h-[52px] flex justify-center items-center bg-yard-primary text-white px-6 py-5 rounded-[2px]"
        >
          Contact us now
        </Link>
      </nav>
    </>
  );
};
export default Navbar;
