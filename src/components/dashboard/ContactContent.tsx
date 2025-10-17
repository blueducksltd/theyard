/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import React, { useState } from "react";
import Modal from "../Modal";
import { toast } from "react-toastify";
import { getCustomers, sendMail } from "@/util";

interface IContactPage {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  selected: boolean;
}

export default function ContactContent() {
  const [composeModal, setComposeModal] = React.useState<boolean>(false);
  const [contactModal, setContactModal] = React.useState<boolean>(false);
  const [customers, setCustomers] = useState<IContactPage[]>([]);
  const [inputs, setInputs] = React.useState<Record<string, any>>({});
  const [totalNum, setTotalNum] = React.useState<Record<string, number>>({});
  const [sendToAll, setSendToAll] = React.useState<boolean>(false);
  const allSelected =
    customers.length > 0 && customers.every((b) => b.selected);

  const handleSendMail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;

    const toastId = toast.loading("Sending mail...", {
      position: "bottom-right",
    });
    const selectedCustomers = customers.filter((customer) => customer.selected);
    const users = selectedCustomers.map((customer) => customer.id);

    if (
      Object.keys(inputs).length === 0 ||
      !inputs.subject ||
      !inputs.message
    ) {
      toast.update(toastId, {
        render: "Please fill in all fields",
        position: "bottom-right",
        type: "error",
        autoClose: 6000,
        isLoading: false,
      });
      return;
    }

    if (!sendToAll && users.length === 0) {
      toast.update(toastId, {
        render: "Please select at least one customer",
        position: "bottom-right",
        type: "error",
        autoClose: 6000,
        isLoading: false,
      });
      return;
    }

    // const message = `
    // <!DOCTYPE html>
    // <html lang="en">
    // <head>
    //   <meta charset="UTF-8">
    //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //   <title></title>
    // </head>
    // <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    //   <table role="presentation" style="width: 100%; border-collapse: collapse;">
    //     <tr>
    //       <td style="padding: 20px 0;">
    //         <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    //           <tr>
    //             <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #0f3830 0%, #33322f 100%); border-radius: 8px 8px 0 0;">
    //               <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">${inputs.subject}</h1>
    //             </td>
    //           </tr>
    //           <tr>
    //             <td style="padding: 40px 30px;">
    //               <div style="font-size: 16px; line-height: 1.8; color: #333333;">
    //                 ${inputs.message}
    //               </div>
    //             </td>
    //           </tr>
    //           <tr>
    //             <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
    //               <p style="margin: 0; font-size: 12px; color: #999999;">
    //                 © ${moment().format("YYYY")} The Yard. All rights reserved.
    //               </p>
    //             </td>
    //           </tr>
    //         </table>
    //       </td>
    //     </tr>
    //   </table>
    // </body>
    // </html>
    // `;

    // inputs.message = message.trim();

    const data = {
      ...inputs,
      ...(!sendToAll && { customers: users }),
    } as { subject: string; message: string; customers?: string[] };

    try {
      const response = await sendMail(data);
      if (response) {
        toast.update(toastId, {
          render: `${response.message}`,
          position: "bottom-right",
          type: "success",
          autoClose: 6000,
          isLoading: false,
        });
        setContactModal(false);
        setComposeModal(false);
        setInputs({});
        formEl?.reset();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to send mail",
        position: "bottom-right",
        type: "error",
        autoClose: 6000,
        isLoading: false,
      });
    }
  };

  const toggleSelect = (id: string) => {
    setCustomers(
      customers.map((customer) =>
        customer.id === id
          ? { ...customer, selected: !customer.selected }
          : customer,
      ),
    );
  };

  const toggleSelectAll = () => {
    const allSelected = customers.every((b) => b.selected);
    setCustomers(
      customers.map((customer) => ({ ...customer, selected: !allSelected })),
    );
  };

  React.useEffect(() => {
    const toastId = toast.loading("Loading customers...", {
      position: "bottom-right",
    });
    const fetchComments = async () => {
      try {
        const response = await getCustomers();
        const customers: IContactPage[] = response.customers;
        setCustomers(customers);

        setTotalNum({
          all: customers.filter(
            (customer) => customer.firstname !== "Subscribed",
          ).length,
          emails: customers.length,
        });
        toast.dismiss(toastId);
      } catch (error) {
        console.error(error);
        toast.update(toastId, {
          render: "Failed to load customers!",
          type: "error",
          position: "bottom-right",
          isLoading: false,
        });
      }
    };
    fetchComments();
  }, []);

  return (
    <main className="flex-1 py-4 px-5 md:h-[600px] 2xl:h-[770px] overflow-y-auto">
      <section className="flex items-center justify-between border-[1px] border-[#E4E8E5] bg-[#FFFFFF] py-5 px-4 rounded-[4px]">
        <div className="flex flex-col gap-2">
          <h2 className="text-[#66655E] font-bold text-[32px] leading-10">
            Contacts
          </h2>

          <div className="flex items-center text-[#999999]">
            <p className="pr-2">{totalNum.all} phone number</p>
            {/*Divider*/}
            <div className="w-[1px] h-3 bg-[#C7CFC9] hidden md:block"></div>
            <p className="pl-2">{totalNum.emails} emails</p>
          </div>
        </div>

        <div className="flex items-center gap-3 h-10 cursor-pointer">
          <div
            className="w-max h-10 items-center flex rounded2px border-[1px] border-[#999999] px-3 gap-2.5 group relative overflow-hidden"
            onClick={() => setComposeModal(true)}
          >
            <Image
              src={"/icons/messages.svg"}
              width={16}
              height={16}
              className="z-40"
              alt="Event Icon"
            />
            <p className="z-40 text-yard-primary text-[16px] leading-6 tracking-[0.5px]">
              Compose message
            </p>
            <div className="absolute top-0 left-0 bg-[#E4E8E5] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </div>
        </div>
      </section>

      {/*Content here */}
      <div className="w-full min-h-screen bg-gray-50 pt-5">
        <div className="mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                      Name...
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                      Phone number
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                      Email address
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, index) => (
                    <tr
                      key={customer.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-[#737373]">
                        {`${customer.firstname} ${customer.lastname}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                        {customer.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                        {customer.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/*Compose Message*/}
      <Modal isOpen={composeModal} useDefaultWidth>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Compose message
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setComposeModal(false)}
            >
              <img
                src={"/icons/cancel.svg"}
                alt="Close Icon"
                className="z-40"
              />
              <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
            </div>
          </div>
        </section>
        {/*Form*/}
        <form
          className="w-full flex flex-col gap-4 mt-8"
          onSubmit={handleSendMail}
        >
          <div className="form-group flex flex-col md:flex-row items-start gap-6">
            <div className="w-full input-group flex flex-col gap-3">
              <label
                htmlFor="subject"
                className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
              >
                Enter Subject of message
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                defaultValue={inputs.subject || ""}
                onChange={(e) => (inputs.subject = e.target.value)}
                placeholder="Enter Subject of message"
                className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
              />
            </div>
          </div>

          <div className="form-group flex flex-col md:flex-row items-start gap-6">
            <div className="w-full input-group flex flex-col gap-3">
              <label
                htmlFor="message"
                className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
              >
                Enter message
              </label>
              <textarea
                id="message"
                name="message"
                defaultValue={inputs.message || ""}
                onChange={(e) => (inputs.message = e.target.value)}
                placeholder=""
                className="w-full h-[147px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
              ></textarea>
            </div>
          </div>

          <div className="w-full flex items-center justify-between">
            <label
              htmlFor="all"
              className="flex gap-3 items-center rounded-[4px] py-3"
            >
              <input
                type="checkbox"
                id="all"
                checked={sendToAll}
                onChange={(e) => {
                  setSendToAll(e.target.checked);
                  toggleSelectAll();
                }}
                name="role"
                className="radio radio-sm peer border-2 border-yard-primary checked:border-yard-dark-primary checked:text-yard-dark-primary"
              />
              <div>
                <h3 className="text-lg text-[#1A231C]">
                  Send to all customers
                </h3>
              </div>
            </label>

            <button
              type="button"
              role="button"
              className="flex items-center gap-1 cursor-pointer group relative"
              onClick={() => setContactModal(true)}
            >
              <Image
                src={"/icons/profileadd.svg"}
                width={16}
                height={16}
                alt="Profile Add Icon"
              />
              <span className="font-medium font-sen text-[16px] leading-6 tracking-[0.4px]">
                Select customers
              </span>
              <span className="yard-link-line bg-yard-primary"></span>
            </button>
          </div>

          <div className="w-full flex items-center gap-3">
            <button
              className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] cursor-pointer"
              onClick={() => setComposeModal(false)}
            >
              <span className="z-40 font-sen">Cancel</span>
              <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>

            <button
              type="submit"
              className="w-full flex justify-center cta-btn bg-yard-primary text-[#EEEEE6] group relative overflow-hidden rounded-[5px] cursor-pointer"
            >
              <span className="z-40 font-sen">Send message</span>
              <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>
          </div>
        </form>
      </Modal>

      {/*Contact Modal*/}
      <Modal isOpen={contactModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Select customers
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setContactModal(false)}
            >
              <img
                src={"/icons/cancel.svg"}
                alt="Close Icon"
                className="z-40"
              />
              <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
            </div>
          </div>
        </section>

        <div className="w-full h-[300px] border-[1px] border-[#BFBFBF] rounded2px mt-5 mb-2 overflow-y-scroll">
          <div className="w-full min-h-screen">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-200">
                        <th className="px-6 py-4 text-left">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                          Name...
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                          Phone number
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#737373] leading-[22px] tracking-[0.5px]">
                          Email address
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer, index) => (
                        <tr
                          key={customer.id}
                          className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={customer.selected}
                              onChange={() => toggleSelect(customer.id)}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-[#737373]">
                            {`${customer.firstname} ${customer.lastname}`}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                            {customer.phone}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#737373] font-semibold leading-[22px] tracking-[0.5px]">
                            {customer.email}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <label
          htmlFor="allinstead"
          className="flex gap-3 items-center rounded-[4px] py-3"
        >
          <input
            type="checkbox"
            id="allinstead"
            checked={sendToAll}
            onChange={(e) => {
              setSendToAll(e.target.checked);
              toggleSelectAll();
            }}
            value={"all"}
            name="role"
            className="radio radio-sm peer border-2 border-yard-primary checked:border-yard-dark-primary checked:text-yard-dark-primary"
          />
          <div>
            <h3 className="text-[16px] text-[#1A231C]">
              Send to all customers instead
            </h3>
          </div>
        </label>

        <div className="w-full flex items-center gap-3 my-2">
          <button
            type="button"
            className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] cursor-pointer"
            onClick={() => setContactModal(false)}
          >
            <span className="z-40 font-sen">Close</span>
            <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>
        </div>
      </Modal>
    </main>
  );
}
