"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/components/Modal";
import { IPackage } from "@/types/Package";
import { IService } from "@/types/Service";
import { ISpace } from "@/types/Space";
import {
  createPackages,
  createServices,
  createSpace, deletePackages, deleteServices, deleteSpaces,
  getPackages,
  getServices,
  getSpaces, updatePackage, updateService,
} from "@/util";
import { compressImage } from "@/util/helper";
import Image from "next/image";
import React, { DragEvent, FormEvent, useEffect } from "react";
import { toast } from "react-toastify";

export default function PackagesContent() {
  const [section, setSection] = React.useState<string>("services");
  const [addServiceModal, setAddServiceModal] = React.useState<boolean>(false);
  const [addPackageModal, setAddPackageModal] = React.useState<boolean>(false);
  const [addSpaceModal, setAddSpaceModal] = React.useState<boolean>(false);
  const [updatePackageModal, setUpdatePackageModal] = React.useState<boolean>(false);
  const [updateServiceModal, setUpdateServiceModal] = React.useState<boolean>(false);
  const [preview, setPreview] = React.useState<File | undefined>(undefined);
  const [inputs, setInputs] = React.useState<Record<string, any>>({});
  const [packages, setPackages] = React.useState<IPackage[]>([]);
  const [services, setServices] = React.useState<IService[]>([]);
  const [spaces, setSpaces] = React.useState<ISpace[]>([]);

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setPreview(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const clearInputs = () => {
    setInputs({});
    // setPreview(undefined);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;

    const toastId = toast.loading("Adding, please wait...", {
      position: "bottom-right",
    });

    if (preview == null) {
      toast.update(toastId, {
        render: "Please upload an image!",
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
      return;
    }
    inputs.image = (await compressImage(preview)) || "null";
    if (inputs.price) {
      inputs.price = inputs.price.toString().replace(/[.,]/g, "");
    }

    if (
      section == "services"
        ? Object.keys(inputs).length < 3
        : Object.keys(inputs).length < 5
    ) {
      toast.update(toastId, {
        render: "All inputs are needed!",
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
      return;
    }

    Object.values(inputs).map((val) => {
      console.log(val);
      if (val == "" || val == null) {
        toast.update(toastId, {
          render: "All inputs are needed!",
          type: "error",
          isLoading: false,
          autoClose: 8000,
        });
        return;
      }
    });

    const formData = new FormData();
    Object.entries(inputs).map(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response =
        section == "services"
          ? await createServices(formData)
          : await createPackages(formData);
      if (response.success == true) {
        formElement.reset();
        // Handle success
        toast.update(toastId, {
          render: `${response.message}`,
          type: "success",
          isLoading: false,
          autoClose: 8000,
        });
        await fetchData();
        setAddServiceModal(false);
        setAddPackageModal(false);
        clearInputs();
        return;
      } else {
        toast.update(toastId, {
          render: `${response.message}`,
          type: "warning",
          isLoading: false,
          autoClose: 8000,
        });
        return;
      }
    } catch (error) {
      toast.update(toastId, {
        render: `An error occurred. Please try again later. (${error})`,
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
    }
  };

  const handleSubmitSpace = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;

    const toastId = toast.loading("Adding, please wait...", {
      position: "bottom-right",
    });

    if (preview == null) {
      toast.update(toastId, {
        render: "Please upload an image!",
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
      return;
    }
    inputs.image = (await compressImage(preview)) || "null";
    inputs.pricePerHour = parseInt(inputs.pricePerHour.toString().replace(/[.,]/g, ""))

    if (Object.keys(inputs).length < 7) {
      toast.update(toastId, {
        render: "All inputs are needed!",
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
      return;
    }

    Object.values(inputs).map((val) => {
      if (val == "" || val == null) {
        toast.update(toastId, {
          render: "All inputs are needed!",
          type: "error",
          isLoading: false,
          autoClose: 8000,
        });
        return;
      }
    });

    const formData = new FormData();
    Object.entries(inputs).map(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await createSpace(formData);
      if (response.success == true) {
        formElement.reset();
        // Handle success
        toast.update(toastId, {
          render: `${response.message}`,
          type: "success",
          isLoading: false,
          autoClose: 8000,
        });
        await fetchData();
        setAddServiceModal(false);
        setAddPackageModal(false);
        setAddSpaceModal(false);
        clearInputs();
        return;
      } else {
        toast.update(toastId, {
          render: `${response.message}`,
          type: "warning",
          isLoading: false,
          autoClose: 8000,
        });
        return;
      }
    } catch (error) {
      toast.update(toastId, {
        render: `An error occurred. Please try again later. (${error})`,
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
    }
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;

    const toastId = toast.loading("Updating, please wait...", {
      position: "bottom-right",
    });

    if (preview && preview !== null) {
      inputs.image = (await compressImage(preview));
    }

    if (inputs.price) {
      inputs.price = inputs.price.toString().replace(/[.,]/g, "");
    }

    const formData = new FormData();
    Object.entries(inputs).map(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response =
        section == "services"
          ? await updateService(formData, inputs.id)
          : await updatePackage(formData, inputs.id);
      if (response.success == true) {
        formElement.reset();
        // Handle success
        toast.update(toastId, {
          render: `${response.message}`,
          type: "success",
          isLoading: false,
          autoClose: 8000,
        });
        await fetchData();
        setUpdateServiceModal(false);
        setUpdatePackageModal(false);
        clearInputs();
        return;
      } else {
        toast.update(toastId, {
          render: `${response.message}`,
          type: "warning",
          isLoading: false,
          autoClose: 8000,
        });
        return;
      }
    } catch (error) {
      toast.update(toastId, {
        render: `An error occurred. Please try again later. (${error})`,
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
    }
  };

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting, please wait...", {
      position: "bottom-right",
    });
    const conf = confirm("Are you sure you want to delete?");
    if (conf) {
      let res;
      try {
        switch (section) {
          case "packages":
            res = await deletePackages({ id })
            break;
          case "services":
            res = await deleteServices({ id })
            break;
          case "spaces":
            res = await deleteSpaces({ id })
            break;
          default:
            console.log('default')
        }

        if (res.success == true) {
          // Handle success
          toast.update(toastId, {
            render: `${res.message}`,
            type: "success",
            isLoading: false,
            autoClose: 8000,
          });
          await fetchData();
          clearInputs();
          return;
        } else {
          toast.update(toastId, {
            render: `${res.message}`,
            type: "warning",
            isLoading: false,
            autoClose: 8000,
          });
          return;
        }
      } catch (e) {
        toast.update(toastId, {
          render: `An error occurred. Please try again later. (${e})`,
          type: "error",
          isLoading: false,
          autoClose: 8000,
        });
      }
    }
  }

  const fetchData = async () => {
    const [packages, services, spaces] = await Promise.all([
      getPackages(),
      getServices(),
      getSpaces(),
    ]);

    setPackages(packages.data.packages);
    setServices(services.data.services);
    setSpaces(spaces.data.spaces);
  };

  useEffect(() => {
    const toastId = toast.loading("Loading data....");
    (async () => {
      await fetchData();
      toast.dismiss(toastId);
    })();

    //clean up
    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, []);

  return (
    <main className="flex-1 py-4 md:h-[600px] 2xl:h-[770px] overflow-y-auto">
      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between p-5 gap-5">
          {/* Container Holder */}
          <div className="w-[745px] flex gap-5">
            {/*Single Container*/}
            <div
              className={`w-full px-4 py-5 rounded-sm border-[1px] border-[#C7CFC9] ${section == "services" ? "bg-[#E4E8E5]" : "bg-[#FFFFFF]"} flex flex-col gap-4 cursor-pointer duration-700 hover:scale-105 hover:shadow-lg`}
              onClick={() => setSection("services")}
            >
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-[52px] leading-9 text-[#66655E]">
                  {services.length}
                </h2>
              </div>
              <p className="font-medium leading-[22px] tracking-[0.5px] text-[#737373]">
                Available services
              </p>
            </div>

            {/*Single Container*/}
            <div
              className={`w-full px-4 py-5 rounded-sm border-[1px] border-[#C7CFC9] ${section == "packages" ? "bg-[#E4E8E5]" : "bg-[#FFFFFF]"} flex flex-col gap-4 cursor-pointer duration-700 hover:scale-105 hover:shadow-lg`}
              onClick={() => setSection("packages")}
            >
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-[52px] leading-9 text-[#66655E]">
                  {packages.length}
                </h2>
              </div>
              <p className="font-medium leading-[22px] tracking-[0.5px] text-[#737373]">
                Available Packages
              </p>
            </div>

            {/*Single Container*/}
            <div
              className={`w-full px-4 py-5 rounded-sm border-[1px] border-[#C7CFC9] ${section == "spaces" ? "bg-[#E4E8E5]" : "bg-[#FFFFFF]"} flex flex-col gap-4 cursor-pointer duration-700 hover:scale-105 hover:shadow-lg`}
              onClick={() => setSection("spaces")}
            >
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-[52px] leading-9 text-[#66655E]">
                  {spaces.length}
                </h2>
              </div>
              <p className="font-medium leading-[22px] tracking-[0.5px] text-[#737373]">
                Available Spaces
              </p>
            </div>
          </div>
          <div className="dropdown">
            <button
              tabIndex={0}
              role="button"
              className="flex items-center gap-2 rounded-[4px] border-[1px] border-yard-primary p-3 text-yard-primary cursor-pointer group relative overflow-hidden"
            >
              <Image
                src={"/icons/add.svg"}
                width={16}
                height={16}
                className="z-40"
                alt="Add Icon"
              />
              <span className="leading-6 tracking-[0.5px] text-[16px] z-40">
                Add a new
              </span>
              <div className="absolute top-0 left-0 bg-[#E4E8E5] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>
            {/*Dropdown content*/}
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-lg z-1 w-full p-2 shadow-sm mt-2"
            >
              <li
                className="text-[#595959] text-sm leading-[22px] tracking-[0.5px] duration-1000 hover:bg-[#E4E8E5] rounded"
                onClick={() => {
                  setSection("services");
                  setAddServiceModal(true);
                }}
              >
                <button>Service</button>
              </li>
              <li
                className="text-[#595959] text-sm leading-[22px] tracking-[0.5px] duration-1000 hover:bg-[#E4E8E5] rounded"
                onClick={() => {
                  setSection("packages");
                  setAddPackageModal(true);
                }}
              >
                <button>Package</button>
              </li>
              <li
                className="text-[#595959] text-sm leading-[22px] tracking-[0.5px] duration-1000 hover:bg-[#E4E8E5] rounded"
                onClick={() => {
                  setSection("spaces");
                  setAddSpaceModal(true);
                }}
              >
                <button>Space</button>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {section == "services" && (
        <section className="w-full p-4">
          <div className="flex gap-3 items-center">
            <h2 className="text-[#66655E] font-semibold text-[22px] leading-[30px]">
              All services
            </h2>
            <p className="text-[#999999] font-medium leading-[22px] tracking-[0.5px]">
              {services.length} available
            </p>
          </div>

          <div className="grid grid-cols-3 mt-5 gap-5">
            {services.toReversed().map((service) => (
              <div key={service.id as string} className="flex flex-col gap-3">
                <div
                  className="w-full h-[224px] bg-cover bg-center rounded2px"
                  style={{ backgroundImage: `url(${service.imageUrl})` }}
                ></div>
                <div className={'flex items-center justify-between'}>
                  <h3 className="text-[#66655E] text-[16px] font-semibold leading-6 tracking-[0.5px]">
                    {service.name}
                  </h3>
                  <div className={'flex items-center gap-x-3'}>
                    <div
                      onClick={() => {
                        console.log(service)
                        setInputs(service)
                        setUpdateServiceModal(true)
                      }}
                      className={'flex items-center justify-center bg-yard-primary p-2 rounded-lg cursor-pointer hover:scale-105 duration-500 gap-x-2 text-white font-medium'}
                    >
                      <Image
                        src={"/icons/password-check.svg"}
                        width={17}
                        height={17}
                        alt="Edit Icon"
                        className={'invert brightness-0'}
                      />
                      <span>Edit</span>
                    </div>
                    <div
                      onClick={() => handleDelete(service.id)}
                      className={'flex items-center justify-center bg-red-500 p-2 rounded-lg cursor-pointer hover:scale-105 duration-500 gap-x-2 text-white'}
                    >
                      <Image
                        src={"/icons/trash-black.svg"}
                        width={17}
                        height={17}
                        alt="Trash Icon"
                        className={'invert brightness-0'}
                      />
                      <span>Delete</span>
                    </div>
                  </div>
                </div>
                <p className="font-medium text-xs leading-5 tracking-[0.5px] text-[#999999]">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {section == "packages" && (
        <section className="w-full p-4">
          <div className="flex gap-3 items-center">
            <h2 className="text-[#66655E] font-semibold text-[22px] leading-[30px]">
              All packages
            </h2>
            <p className="text-[#999999] font-medium leading-[22px] tracking-[0.5px]">
              {packages.length} available
            </p>
          </div>

          <div className="grid grid-cols-3 mt-5 gap-5">
            {packages.toReversed().map((pck) => (
              <div key={pck.id as string} className="flex flex-col gap-3">
                <div
                  className="w-full h-[224px] bg-cover bg-center rounded2px"
                  style={{ backgroundImage: `url(${pck.imageUrl})` }}
                ></div>
                <div className={'flex items-center justify-between'}>
                  <h3 className="text-[#66655E] text-[16px] font-semibold leading-6 tracking-[0.5px]">
                    {pck.name}
                  </h3>
                  <div className={'flex items-center gap-x-3'}>
                    <div
                      onClick={() => {
                        console.log(pck)
                        setInputs(pck)
                        setUpdatePackageModal(true)
                      }}
                      className={'flex items-center justify-center bg-yard-primary p-2 rounded-lg cursor-pointer hover:scale-105 duration-500 gap-x-2 text-white fonot-medium'}
                    >
                      <Image
                        src={"/icons/password-check.svg"}
                        width={17}
                        height={17}
                        alt="Edit Icon"
                        className={'invert brightness-0'}
                      />
                      <span>Edit</span>
                    </div>
                    <div
                      onClick={() => handleDelete(pck.id)}
                      className={'flex items-center justify-center bg-red-500 p-2 rounded-lg cursor-pointer hover:scale-105 duration-500 gap-x-2 text-white'}
                    >
                      <Image
                        src={"/icons/trash-black.svg"}
                        width={17}
                        height={17}
                        alt="Trash Icon"
                        className={'invert brightness-0'}
                      />
                      <span>Delete</span>
                    </div>
                  </div>
                </div>
                <p className="font-medium text-xs leading-5 tracking-[0.5px] text-[#999999]">
                  {pck.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {section == "spaces" && (
        <section className="w-full p-4">
          <div className="flex gap-3 items-center">
            <h2 className="text-[#66655E] font-semibold text-[22px] leading-[30px]">
              All spaces
            </h2>
            <p className="text-[#999999] font-medium leading-[22px] tracking-[0.5px]">
              {spaces.length} available
            </p>
          </div>

          <div className="grid grid-cols-3 mt-5 gap-5">
            {spaces.toReversed().map((space) => (
              <div key={space.id as string} className="flex flex-col gap-3">
                <div
                  className="w-full h-[224px] bg-cover bg-center rounded2px"
                  style={{ backgroundImage: `url(${space.imageUrl})` }}
                ></div>
                <div className={'flex justify-between'}>
                  <h3 className="text-[#66655E] text-[16px] font-semibold leading-6 tracking-[0.5px]">
                    {space.name}
                  </h3>
                </div>
                <p className="font-medium text-xs leading-5 tracking-[0.5px] text-[#999999]">
                  {space.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/*Modals*/}
      <Modal isOpen={addServiceModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Add a new service
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => {
                clearInputs();
                setAddServiceModal(false);
              }}
            >
              <Image
                src={"/icons/cancel.svg"}
                width={16}
                height={16}
                alt="Close Icon"
                className="z-40"
              />
              <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
            </div>
          </div>
        </section>

        <div className="w-full flex items-start my-4 2xl:my-8 gap-10">
          {/*Form*/}
          <form
            className="w-full flex flex-col gap-5"
            onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}
          >
            <label
              htmlFor="media"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="bg-cover bg-center"
              style={{
                backgroundImage: `url(${preview ? URL.createObjectURL(preview) : null})`,
              }}
            >
              <div className="flex flex-col h-[200px] items-center justify-center border-[1px] border-dashed border-[#BFBFBF] py-3 px-5 cursor-pointer rounded2px">
                {preview == undefined ? (
                  <>
                    <Image
                      src={"/icons/upload.svg"}
                      width={18}
                      height={18}
                      alt="Upload Icon"
                    />
                    <p className="w-[126px] text-xs text-[#999999] text-center leading-5 tracking-[0.5px] mt-4 mb-1">
                      Choose an image or drag &amp; drop them here
                    </p>

                    <p className="w-[126px] text-[10px] text-[#BFBFBF] text-center leading-5 tracking-[0.5px]">
                      JPEG &amp; PNG up to 10mb
                    </p>
                  </>
                ) : null}
              </div>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setPreview(e.target.files?.[0])}
                id="media"
                className="hidden"
              />
            </label>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="serviceName"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter service name
                </label>
                <input
                  type="text"
                  id="serviceName"
                  name="serviceName"
                  onChange={(e) => (inputs.name = e.target.value)}
                  placeholder="Enter service name"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="desc"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter description
                </label>
                <textarea
                  id="desc"
                  name="desc"
                  onChange={(e) => (inputs.description = e.target.value)}
                  placeholder="150 words"
                  className="w-full h-[147px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                ></textarea>
              </div>
            </div>

            <div className="w-full flex items-center gap-5 mt-3">
              <button
                type="button"
                className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] cursor-pointer"
                onClick={() => {
                  clearInputs();
                  setAddServiceModal(false);
                }}
              >
                <span className="z-40 font-sen">Cancel</span>
                <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>

              <button
                type="submit"
                className="w-full flex justify-center cta-btn bg-yard-primary text-[#EEEEE6] group relative overflow-hidden rounded-[5px] cursor-pointer"
              >
                <span className="z-40 font-sen">Add service</span>
                <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/*Add Package Modal*/}
      <Modal isOpen={addPackageModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Add a new package
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => {
                clearInputs();
                setAddPackageModal(false);
              }}
            >
              <Image
                src={"/icons/cancel.svg"}
                width={16}
                height={16}
                alt="Close Icon"
                className="z-40"
              />
              <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
            </div>
          </div>
        </section>

        <div className="w-full flex items-start my-4 2xl:my-8 gap-10">
          {/*Form*/}
          <form
            className="w-full flex flex-col gap-5 h-[555px] overflow-y-scroll"
            onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}
          >
            <label
              htmlFor="media"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="bg-cover bg-center"
              style={{
                backgroundImage: `url(${preview ? URL.createObjectURL(preview) : null})`,
              }}
            >
              <div className="flex flex-col h-[200px] items-center justify-center border-[1px] border-dashed border-[#BFBFBF] py-3 px-5 cursor-pointer rounded2px">
                {preview == undefined ? (
                  <>
                    <Image
                      src={"/icons/upload.svg"}
                      width={18}
                      height={18}
                      alt="Upload Icon"
                    />
                    <p className="w-[126px] text-xs text-[#999999] text-center leading-5 tracking-[0.5px] mt-4 mb-1">
                      Choose an image or drag &amp; drop them here
                    </p>

                    <p className="w-[126px] text-[10px] text-[#BFBFBF] text-center leading-5 tracking-[0.5px]">
                      JPEG &amp; PNG up to 10mb
                    </p>
                  </>
                ) : null}
              </div>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setPreview(e.target.files?.[0])}
                id="media"
                className="hidden"
              />
            </label>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="packageName"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter package name
                </label>
                <input
                  type="text"
                  id="packageName"
                  name="packageName"
                  onChange={(e) => (inputs.name = e.target.value)}
                  placeholder="Enter package name"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="desc"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter description
                </label>
                <textarea
                  id="desc"
                  name="desc"
                  onChange={(e) => (inputs.description = e.target.value)}
                  placeholder="150 words"
                  className="w-full h-[147px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                ></textarea>
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="packagePrice"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter package price
                </label>
                <input
                  type="text"
                  id="packagePrice"
                  name="packagePrice"
                  value={inputs.price ? Number(inputs.price.toString().replace(/,/g, "")).toLocaleString() : ""}
                  onChange={(e) => setInputs({ ...inputs, price: e.target.value })}
                  placeholder="Package price"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="packageSpecs"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter package specs{" "}
                  <small className="italic">
                    (Add a comma to seperate specs)
                  </small>
                </label>
                <input
                  type="text"
                  id="packageSpecs"
                  name="packageSpecs"
                  onChange={(e) => (inputs.specs = e.target.value)}
                  placeholder="games and dates, Game hall special, Game hall special"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <div className="w-full flex items-center gap-5 mt-3">
              <button
                type="button"
                className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] cursor-pointer"
                onClick={() => {
                  clearInputs();
                  setAddPackageModal(false);
                }}
              >
                <span className="z-40 font-sen">Cancel</span>
                <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>

              <button
                type="submit"
                className="w-full flex justify-center cta-btn bg-yard-primary text-[#EEEEE6] group relative overflow-hidden rounded-[5px] cursor-pointer"
              >
                <span className="z-40 font-sen">Add package</span>
                <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/*Add space Modal*/}
      <Modal isOpen={addSpaceModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Add a new space
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => {
                clearInputs();
                setAddSpaceModal(false);
              }}
            >
              <Image
                src={"/icons/cancel.svg"}
                width={16}
                height={16}
                alt="Close Icon"
                className="z-40"
              />
              <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
            </div>
          </div>
        </section>

        <div className="w-full flex items-start my-4 2xl:my-8 gap-10">
          {/*Form*/}
          <form
            className="w-full flex flex-col gap-5 h-[555px] overflow-y-scroll"
            onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmitSpace(e)}
          >
            <label
              htmlFor="media"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="bg-cover bg-center"
              style={{
                backgroundImage: `url(${preview ? URL.createObjectURL(preview) : null})`,
              }}
            >
              <div className="flex flex-col h-[200px] items-center justify-center border-[1px] border-dashed border-[#BFBFBF] py-3 px-5 cursor-pointer rounded2px">
                {preview == undefined ? (
                  <>
                    <Image
                      src={"/icons/upload.svg"}
                      width={18}
                      height={18}
                      alt="Upload Icon"
                    />
                    <p className="w-[126px] text-xs text-[#999999] text-center leading-5 tracking-[0.5px] mt-4 mb-1">
                      Choose an image or drag &amp; drop them here
                    </p>

                    <p className="w-[126px] text-[10px] text-[#BFBFBF] text-center leading-5 tracking-[0.5px]">
                      JPEG &amp; PNG up to 10mb
                    </p>
                  </>
                ) : null}
              </div>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setPreview(e.target.files?.[0])}
                id="media"
                className="hidden"
              />
            </label>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="spaceName"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter space name
                </label>
                <input
                  type="text"
                  id="spaceName"
                  name="spaceName"
                  onChange={(e) => (inputs.name = e.target.value)}
                  placeholder="Enter space name"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="desc"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter description
                </label>
                <textarea
                  id="desc"
                  name="desc"
                  onChange={(e) => (inputs.description = e.target.value)}
                  placeholder="150 words"
                  className="w-full h-[147px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                ></textarea>
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="spacePrice"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter space price per person
                </label>
                <input
                  type="text"
                  id="spacePrice"
                  name="spacePrice"
                  value={inputs.pricePerHour
                    ? Number(inputs.pricePerHour.replace(/,/g, "")).toLocaleString()
                    : ""}
                  onChange={(e) => setInputs({ ...inputs, pricePerHour: e.target.value })}
                  placeholder="Space price"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="spaceCapacity"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter space capacity
                </label>
                <input
                  type="number"
                  id="spaceCapacity"
                  name="spaceCapacity"
                  onChange={(e) => (inputs.capacity = e.target.value)}
                  placeholder="Space capacity"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="spaceLocation"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter space location{" "}
                  <small className="italic">(Hall 3, floor 2)</small>
                </label>
                <input
                  type="text"
                  id="spaceLocation"
                  name="spaceLocation"
                  onChange={(e) => (inputs.address = e.target.value)}
                  placeholder="Space location"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="spaceSpecs"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter space specs{" "}
                  <small className="italic">
                    (Add a comma to seperate specs)
                  </small>
                </label>
                <input
                  type="text"
                  id="spaceSpecs"
                  name="spaceSpecs"
                  onChange={(e) => (inputs.specs = e.target.value)}
                  placeholder="games and dates, Game hall special, Game hall special"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <div className="w-full flex items-center gap-5 mt-3">
              <button
                type="button"
                className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] cursor-pointer"
                onClick={() => {
                  clearInputs();
                  setAddPackageModal(false);
                }}
              >
                <span className="z-40 font-sen">Cancel</span>
                <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>

              <button
                type="submit"
                className="w-full flex justify-center cta-btn bg-yard-primary text-[#EEEEE6] group relative overflow-hidden rounded-[5px] cursor-pointer"
              >
                <span className="z-40 font-sen">Add space</span>
                <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/*Update Package Modal*/}
      <Modal isOpen={updatePackageModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Update package
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => {
                clearInputs();
                setUpdatePackageModal(false);
              }}
            >
              <Image
                src={"/icons/cancel.svg"}
                width={16}
                height={16}
                alt="Close Icon"
                className="z-40"
              />
              <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
            </div>
          </div>
        </section>

        <div className="w-full flex items-start my-4 2xl:my-8 gap-10">
          {/*Form*/}
          <form
            className="w-full flex flex-col gap-5 h-[555px] overflow-y-scroll"
            onSubmit={(e: FormEvent<HTMLFormElement>) => handleUpdate(e)}
          >
            <label
              htmlFor="media"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="bg-cover bg-center"
              style={{
                backgroundImage: `url(${preview ? URL.createObjectURL(preview) : inputs.imageUrl})`,
              }}
            >
              <div className="flex flex-col h-[200px] items-center justify-center border-[1px] border-dashed border-[#BFBFBF] py-3 px-5 cursor-pointer rounded2px">
                {preview == undefined ? (
                  <>
                    <Image
                      src={"/icons/upload.svg"}
                      width={18}
                      height={18}
                      alt="Upload Icon"
                    />
                    <p className="w-[126px] text-xs text-[#999999] text-center leading-5 tracking-[0.5px] mt-4 mb-1">
                      Choose an image or drag &amp; drop them here
                    </p>

                    <p className="w-[126px] text-[10px] text-[#BFBFBF] text-center leading-5 tracking-[0.5px]">
                      JPEG &amp; PNG up to 10mb
                    </p>
                  </>
                ) : null}
              </div>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setPreview(e.target.files?.[0])}
                id="media"
                className="hidden"
              />
            </label>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="packageName"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter package name
                </label>
                <input
                  type="text"
                  id="packageName"
                  name="packageName"
                  value={inputs.name}
                  onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                  placeholder="Enter package name"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="desc"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter description
                </label>
                <textarea
                  id="desc"
                  name="desc"
                  value={inputs.description}
                  onChange={(e) => setInputs({ ...inputs, description: e.target.value })}
                  placeholder="150 words"
                  className="w-full h-[147px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                ></textarea>
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="packagePrice"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter package price
                </label>
                <input
                  type="text"
                  id="packagePrice"
                  name="packagePrice"
                  value={inputs.price ? Number(inputs.price.toString().replace(/,/g, "")).toLocaleString() : ""}
                  onChange={(e) => setInputs({ ...inputs, price: e.target.value })}
                  placeholder="Package price"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="packageSpecs"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter package specs{" "}
                  <small className="italic">
                    (Add a comma to seperate specs)
                  </small>
                </label>
                <input
                  type="text"
                  id="packageSpecs"
                  name="packageSpecs"
                  value={inputs.specs}
                  onChange={(e) => setInputs({ ...inputs, specs: e.target.value })}
                  placeholder="games and dates, Game hall special, Game hall special"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <div className="w-full flex items-center gap-5 mt-3">
              <button
                type="button"
                className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] cursor-pointer"
                onClick={() => {
                  clearInputs();
                  setAddPackageModal(false);
                }}
              >
                <span className="z-40 font-sen">Cancel</span>
                <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>

              <button
                type="submit"
                className="w-full flex justify-center cta-btn bg-yard-primary text-[#EEEEE6] group relative overflow-hidden rounded-[5px] cursor-pointer"
              >
                <span className="z-40 font-sen">Update package</span>
                <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/*Update Service Modal*/}
      <Modal isOpen={updateServiceModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Update service
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => {
                clearInputs();
                setUpdateServiceModal(false);
              }}
            >
              <Image
                src={"/icons/cancel.svg"}
                width={16}
                height={16}
                alt="Close Icon"
                className="z-40"
              />
              <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
            </div>
          </div>
        </section>

        <div className="w-full flex items-start my-4 2xl:my-8 gap-10">
          {/*Form*/}
          <form
            className="w-full flex flex-col gap-5"
            onSubmit={(e: FormEvent<HTMLFormElement>) => handleUpdate(e)}
          >
            <label
              htmlFor="media"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="bg-cover bg-center"
              style={{
                backgroundImage: `url(${preview ? URL.createObjectURL(preview) : inputs.imageUrl})`,
              }}
            >
              <div className="flex flex-col h-[200px] items-center justify-center border-[1px] border-dashed border-[#BFBFBF] py-3 px-5 cursor-pointer rounded2px">
                {preview == undefined ? (
                  <>
                    <Image
                      src={"/icons/upload.svg"}
                      width={18}
                      height={18}
                      alt="Upload Icon"
                    />
                    <p className="w-[126px] text-xs text-[#999999] text-center leading-5 tracking-[0.5px] mt-4 mb-1">
                      Choose an image or drag &amp; drop them here
                    </p>

                    <p className="w-[126px] text-[10px] text-[#BFBFBF] text-center leading-5 tracking-[0.5px]">
                      JPEG &amp; PNG up to 10mb
                    </p>
                  </>
                ) : null}
              </div>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setPreview(e.target.files?.[0])}
                id="media"
                className="hidden"
              />
            </label>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="serviceName"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter service name
                </label>
                <input
                  type="text"
                  id="serviceName"
                  name="serviceName"
                  value={inputs.name}
                  onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                  placeholder="Enter service name"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="desc"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter description
                </label>
                <textarea
                  id="desc"
                  name="desc"
                  value={inputs.description}
                  onChange={(e) => setInputs({ ...inputs, description: e.target.value })}
                  placeholder="150 words"
                  className="w-full h-[147px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                ></textarea>
              </div>
            </div>

            <div className="w-full flex items-center gap-5 mt-3">
              <button
                type="button"
                className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] cursor-pointer"
                onClick={() => {
                  clearInputs();
                  setUpdateServiceModal(false);
                }}
              >
                <span className="z-40 font-sen">Cancel</span>
                <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>

              <button
                type="submit"
                className="w-full flex justify-center cta-btn bg-yard-primary text-[#EEEEE6] group relative overflow-hidden rounded-[5px] cursor-pointer"
              >
                <span className="z-40 font-sen">Update service</span>
                <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </main>
  );
}
