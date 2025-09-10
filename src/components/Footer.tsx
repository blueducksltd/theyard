import Link from "next/link";

const Footer = () => {
  return (
    <main className="w-full mt-4 p-16 bg-yard-primary">
      <section className="flex items-start justify-between">
        <div className="flex flex-col">
          <h1 className="text-white font-playfair font-bold text-[28px] tracking-[-0.1px] leading-[36px]">
            Subscribe To Our Newsletter
          </h1>
          <p className="paragraph text-[#CCCCCC] my-2 w-[415px]">
            Join our picnic lovers list for updates, offers, and event
            inspiration.
          </p>

          <div className="flex my-4">
            <input
              type="text"
              placeholder="Enter your email address"
              className="w-[257px] border-[1px] border-[#999999] p-3 placeholder:text-[#999999] rounded-l-[2px]"
            />
            <button
              type="submit"
              className="w-[160px] h-[52px] bg-white font-sen leading-6 tracking-[0.4px] text-[16px] font-medium rounded-r-[2px] group relative overflow-hidden"
            >
              <span className="z-50 relative">Subscribe</span>
              <div className="cta-btn-hover"></div>
            </button>
          </div>

          <div className="mt-28">
            <img src={"/logo-white.svg"} />
            <p className="text-[#CCCCCC] w-[415px] text-[12px] tracking-[0.5px] leading-[22px] mt-2">
              We believe every moment is worth celebrating. Whether you’re here
              for a quiet picnic, a romantic date, or a joyful event with
              friends
            </p>
          </div>
        </div>

        <div className="flex flex-col h-[417px] relative">
          <div className="flex items-start gap-36">
            <div className="flex flex-col gap-2">
              <h3 className="font-[400] text-xs uppercase leading-[22px] tracking-[0.5px] text-[#C7CFC9]">
                Quick Links
              </h3>

              <Link
                href={"#"}
                className="text-[#EDF0EE] font-[400] leading-[22px] tracking-[0.5px] text-sm group relative w-max"
              >
                Home
                <span className="yard-link-line bg-[#EDF0EE]"></span>
              </Link>

              <Link
                href={"#"}
                className="text-[#EDF0EE] font-[400] leading-[22px] tracking-[0.5px] text-sm group relative w-max"
              >
                About
                <span className="yard-link-line bg-[#EDF0EE]"></span>
              </Link>

              <Link
                href={"#"}
                className="text-[#EDF0EE] font-[400] leading-[22px] tracking-[0.5px] text-sm group relative w-max"
              >
                Packages
                <span className="yard-link-line bg-[#EDF0EE]"></span>
              </Link>

              <Link
                href={"#"}
                className="text-[#EDF0EE] font-[400] leading-[22px] tracking-[0.5px] text-sm group relative w-max"
              >
                Booking
                <span className="yard-link-line bg-[#EDF0EE]"></span>
              </Link>

              <Link
                href={"#"}
                className="text-[#EDF0EE] font-[400] leading-[22px] tracking-[0.5px] text-sm group relative w-max"
              >
                Gallery
                <span className="yard-link-line bg-[#EDF0EE]"></span>
              </Link>

              <Link
                href={"#"}
                className="text-[#EDF0EE] font-[400] leading-[22px] tracking-[0.5px] text-sm group relative w-max"
              >
                Services
                <span className="yard-link-line bg-[#EDF0EE]"></span>
              </Link>

              <Link
                href={"#"}
                className="text-[#EDF0EE] font-[400] leading-[22px] tracking-[0.5px] text-sm group relative w-max"
              >
                Contact
                <span className="yard-link-line bg-[#EDF0EE]"></span>
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-[400] text-xs uppercase leading-[22px] tracking-[0.5px] text-[#C7CFC9]">
                Contact
              </h3>

              <Link
                href={"tel:+2348147871946"}
                className="text-[#EDF0EE] font-[400] leading-[22px] tracking-[0.5px] text-sm flex items-center gap-2 group relative w-max"
              >
                <img src={"/icons/call.svg"} />
                +234 81 4787 1946
                <span className="yard-link-line bg-[#EDF0EE]"></span>
              </Link>

              <Link
                href={"#"}
                className="text-[#EDF0EE] font-[400] leading-[22px] tracking-[0.5px] text-sm flex items-center gap-2 group relative w-max"
              >
                <img src={"/icons/mail.svg"} />
                info@theyard.com
                <span className="yard-link-line bg-[#EDF0EE]"></span>
              </Link>

              <Link
                href={"#"}
                className="w-[250px] text-[#EDF0EE] font-[400] leading-[22px] tracking-[0.5px] text-sm flex items-start gap-2 group relative"
              >
                <img src={"/icons/location.svg"} className="mt-1" />
                21 Umuawulu Street, Independence Layout, Enugu
                <span className="yard-link-line bg-[#EDF0EE]"></span>
              </Link>

              <div className="mt-5">
                <h3 className="font-[400] text-xs uppercase leading-[22px] tracking-[0.5px] text-[#C7CFC9] mb-3">
                  Social Links
                </h3>
                <div className="flex items-center gap-2">
                  <Link
                    href={"#"}
                    className="flex w-9 h-9 p-2 bg-[#EDF0EE] rounded-[2px] group relative overflow-hidden"
                  >
                    <img src={"/icons/whatsapp.svg"} className="w-7 z-50" />
                    <div className="cta-btn-hover"></div>
                  </Link>
                  <Link
                    href={"#"}
                    className="flex w-9 h-9 p-2 bg-[#EDF0EE] rounded-[2px] group relative overflow-hidden"
                  >
                    <img src={"/icons/facebook.svg"} className="w-7 z-50" />
                    <div className="cta-btn-hover"></div>
                  </Link>
                  <Link
                    href={"#"}
                    className="flex w-9 h-9 p-2 bg-[#EDF0EE] rounded-[2px] group relative overflow-hidden"
                  >
                    <img src={"/icons/instagram.svg"} className="w-7 z-50" />
                    <div className="cta-btn-hover"></div>
                  </Link>

                  <Link
                    href={"#"}
                    className="flex w-9 h-9 p-2 bg-[#EDF0EE] rounded-[2px] group relative overflow-hidden"
                  >
                    <img src={"/icons/x.svg"} className="w-7 z-50" />
                    <div className="cta-btn-hover"></div>
                  </Link>

                  <Link
                    href={"#"}
                    className="flex w-9 h-9 p-2 bg-[#EDF0EE] rounded-[2px] group relative overflow-hidden"
                  >
                    <img src={"/icons/linkedin.svg"} className="w-7 z-50" />
                    <div className="cta-btn-hover"></div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 text-[#CCCCCC] w-[415px] text-[12px] tracking-[0.5px] leading-[22px] mt-2">
            <p>&copy; 2025 - Copyright The Yard Picnic Park.</p>
            <p>All rights reserved</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Footer;
