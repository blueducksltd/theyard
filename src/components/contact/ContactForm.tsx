"use client";
import { sendInquiries } from "@/util";
import { toast } from "react-toastify";

export default function ContactForm() {
  const handleSubmit = async (formdata: FormData) => {
    const toastId = toast.loading("Sending message...", {
      position: "bottom-right",
    });
    const data = {
      firstName: formdata.get("firstName") as string,
      lastName: formdata.get("lastName") as string,
      phone: formdata.get("phone") as string,
      email: formdata.get("email") as string,
      message: formdata.get("message") as string,
    };
    try {
      const response = await sendInquiries(data);
      if (response.success == true) {
        toast.success("Message sent successfully", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      toast.error(`An error occurred while sending your message: ${error}`, {
        position: "bottom-right",
      });
    }
    toast.dismiss(toastId);
  };
  return (
    <main className="w-full h-max">
      {/*Socials*/}
      <section className="w-full md:w-[954px] md:mx-auto shadow-md p-3 hidden gap-8 md:gap-0 md:flex items-center bg-[#FDFBF9]">
        <div className="w-full flex flex-col">
          <p className="font-[600px] text-yard-dark-primary">Call us on</p>
          <p className="text-[#66655E] text-sm md:text-md">+234 8123-456-789</p>
        </div>

        <div className="w-full flex flex-col">
          <p className="font-[600px] text-yard-dark-primary">Whatsapp</p>
          <p className="text-[#66655E] text-sm md:text-md">+234 8123-456-789</p>
        </div>

        <div className="w-full flex flex-col">
          <p className="font-[600px] text-yard-dark-primary">Email us on</p>
          <p className="text-[#66655E] text-sm md:text-md">
            enquiry@theyard.com
          </p>
        </div>

        <div className="w-full flex flex-col">
          <p className="font-[600px] text-yard-dark-primary">
            Instagram handle
          </p>
          <p className="text-[#66655E] text-sm md:text-md">@theyardenugu</p>
        </div>
      </section>

      <section className="w-full flex flex-col-reverse md:flex-row md:px-[10.7rem] gap-9 md:mt-12">
        <div className="md:w-[368px] h-[526px] p-6 shadow-md">
          <h5 className="text-yard-dark-primary font-semibold">Visit us at</h5>
          <p className="text-[#66655E] leading-[26px]">
            21 Umuawulu Street, Independence Layout, Enugu
          </p>
          <div className="w-full h-96 bg-gray-200 mt-5">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.701327944728!2d7.521819210104804!3d6.432399124189377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1044a5dcb61b81a1%3A0xfd39886353b5bda1!2sThe%20Yard%20(Picnic%20Park)!5e0!3m2!1sen!2sng!4v1758203254043!5m2!1sen!2sng"
              width="100%"
              height="384"
              loading="lazy"
            ></iframe>
          </div>
        </div>
        <form
          action={handleSubmit}
          className="w-full md:w-[550px] md:h-[526px] p-6 shadow-md flex flex-col gap-4"
        >
          <div className="input-group flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-3">
              <label htmlFor="firstname" className="text-[#1A1A1A] leading-6">
                Enter your first name
              </label>
              <input
                type="text"
                id="firstname"
                name="firstName"
                placeholder="Enter your first name"
                className="md:w-[239px] h-[52px] rounded2px border-[1px] focus:outline-yard-dark-primary border-[#BFBFBF] p-3"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="lastname" className="text-[#1A1A1A] leading-6">
                Enter your last name
              </label>
              <input
                type="text"
                id="lastname"
                name="lastName"
                placeholder="Enter your last name"
                className="md:w-[239px] h-[52px] rounded2px border-[1px] focus:outline-yard-dark-primary border-[#BFBFBF] p-3"
              />
            </div>
          </div>

          <div className="input-group flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-3">
              <label htmlFor="email" className="text-[#1A1A1A] leading-6">
                Enter your email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email address"
                className="md:w-[239px] h-[52px] rounded2px border-[1px] focus:outline-yard-dark-primary border-[#BFBFBF] p-3"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="phone" className="text-[#1A1A1A] leading-6">
                Enter your phone nummber
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Enter your phone nummber"
                className="md:w-[239px] h-[52px] rounded2px border-[1px] focus:outline-yard-dark-primary border-[#BFBFBF] p-3"
              />
            </div>
          </div>

          <div className="input-group flex">
            <div className="w-full flex flex-col gap-3">
              <label htmlFor="message" className="text-[#1A1A1A] leading-6">
                Enter your message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Enter your message"
                className="w-full md:w-[502px] h-[181px] rounded2px border-[1px] focus:outline-yard-dark-primary border-[#BFBFBF] p-3"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden cursor-pointer"
          >
            <span className="z-40">Send message</span>
            <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>
        </form>
      </section>

      <section className="w-full md:w-[954px] md:mx-auto shadow-md p-3 grid grid-cols-2 gap-8 md:gap-0 md:hidden items-center bg-[#FDFBF9] mt-5">
        <div className="w-full flex flex-col">
          <p className="font-[600px] text-yard-dark-primary">Call us on</p>
          <p className="text-[#66655E] text-sm md:text-md">+234 8123-456-789</p>
        </div>

        <div className="w-full flex flex-col">
          <p className="font-[600px] text-yard-dark-primary">Whatsapp</p>
          <p className="text-[#66655E] text-sm md:text-md">+234 8123-456-789</p>
        </div>

        <div className="w-full flex flex-col">
          <p className="font-[600px] text-yard-dark-primary">Email us on</p>
          <p className="text-[#66655E] text-sm md:text-md">
            enquiry@theyard.com
          </p>
        </div>

        <div className="w-full flex flex-col">
          <p className="font-[600px] text-yard-dark-primary">
            Instagram handle
          </p>
          <p className="text-[#66655E] text-sm md:text-md">@theyardenugu</p>
        </div>
      </section>
    </main>
  );
}
