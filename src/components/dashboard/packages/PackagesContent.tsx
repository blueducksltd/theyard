"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/components/Modal";
import { AddOnCategory, SafeAddOn } from "@/types/AddOn";
import { IPackage } from "@/types/Package";
import { IService } from "@/types/Service";
import {
  createAddon,
  createPackages,
  createServices,
  deleteAddon,
  deletePackages,
  deleteServices,
  getAddons,
  getPackages,
  getServices,
  updateAddon,
  updatePackage,
  updateService,
} from "@/util";
import { compressImage } from "@/util/helper";
import Image from "next/image";
import React, { DragEvent, FormEvent, useEffect } from "react";
import { toast } from "react-toastify";
import { DESCRIPTION_WORD_LIMIT, limitWords } from "../GalleryContent";

const DEFAULT_INPUTS = {
  name: "",
  description: "",
  price: "",
  capacity: "",
  guestLimit: "",
  extraGuestFee: "",
  specs: "",
  category: "decoration" as AddOnCategory,
  pricePerMin: "",
};

type ActionButtonVariant = "edit" | "delete";

const ACTION_BUTTON_STYLES: Record<ActionButtonVariant, string> = {
  edit: "bg-yard-primary text-white hover:bg-yard-dark-primary",
  delete: "bg-[#FDECEC] text-[#B42318] hover:bg-[#FBD5D5]",
};

const ACTION_BUTTON_ICON: Record<ActionButtonVariant, { src: string; alt: string }> = {
  edit: { src: "/icons/password-check.svg", alt: "Edit Icon" },
  delete: { src: "/icons/trash-black.svg", alt: "Delete Icon" },
};

function ActionButton({
  variant,
  onClick,
  children,
}: {
  variant: ActionButtonVariant;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const icon = ACTION_BUTTON_ICON[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded2px px-3 py-2 text-xs font-medium transition-colors duration-200 ${ACTION_BUTTON_STYLES[variant]}`}
    >
      <Image
        src={icon.src}
        width={17}
        height={17}
        alt={icon.alt}
        className="invert brightness-0"
      />
      <span>{children}</span>
    </button>
  );
}

export default function PackagesContent() {
  const [section, setSection] = React.useState<string>("services");
  const [addServiceModal, setAddServiceModal] = React.useState<boolean>(false);
  const [addPackageModal, setAddPackageModal] = React.useState<boolean>(false);
  const [addAddonModal, setAddAddonModal] = React.useState<boolean>(false);
  const [updatePackageModal, setUpdatePackageModal] = React.useState<boolean>(false);
  const [updateServiceModal, setUpdateServiceModal] = React.useState<boolean>(false);
  const [updateAddonModal, setUpdateAddonModal] = React.useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = React.useState<{
    id: string;
    type: "services" | "packages" | "addons";
    label: string;
  } | null>(null);
  const [preview, setPreview] = React.useState<File | undefined>(undefined);
  const [inputs, setInputs] = React.useState<Record<string, any>>({ ...DEFAULT_INPUTS });
  const [packages, setPackages] = React.useState<IPackage[]>([]);
  const [services, setServices] = React.useState<IService[]>([]);
  const [addons, setAddons] = React.useState<SafeAddOn[]>([]);

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
    setInputs({ ...DEFAULT_INPUTS });
    setPreview(undefined);
  };

  const formatAddonPrice = (addon: SafeAddOn) => {
    if (addon.category !== "game" && addon.price != null) {
      return `₦${addon.price.toLocaleString()}`;
    }
    if (addon.category === "game" && addon.pricePerMin != null) {
      return `₦${addon.pricePerMin.toLocaleString()}/min`;
    }
    return null;
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
    const payload: Record<string, any> = {
      ...inputs,
      image: (await compressImage(preview)) || "null",
    };

    if (payload.price) {
      payload.price = payload.price.toString().replace(/[.,]/g, "");
    }

    if (payload.extraGuestFee) {
      payload.extraGuestFee = payload.extraGuestFee.toString().replace(/[.,]/g, "");
    }

    const requiredFields =
      section === "services"
        ? ["name", "description"]
        : [
            "name",
            "description",
            "price",
            "capacity",
            "guestLimit",
            "extraGuestFee",
            "specs",
          ];

    const FIELD_LABELS: Record<string, string> = {
      name: "Name",
      description: "Description",
      price: "Price",
      capacity: "Base limit",
      guestLimit: "Guest limit",
      extraGuestFee: "Extra guest fee",
      specs: "Specs",
    };

    const firstMissingRequiredField = requiredFields.find((field) => {
      const value = payload[field];
      if (typeof value === "string") return value.trim() === "";
      return value == null;
    });

    if (firstMissingRequiredField) {
      toast.update(toastId, {
        render: `${FIELD_LABELS[firstMissingRequiredField] ?? "This field"} is required!`,
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
      return;
    }

    if (section === "packages") {
      const baseLimit = Number(payload.capacity);
      const guestLimit = Number(payload.guestLimit);

      if (Number.isNaN(baseLimit) || baseLimit < 1) {
        toast.update(toastId, {
          render: "Base limit must be at least 1.",
          type: "error",
          isLoading: false,
          autoClose: 8000,
        });
        return;
      }

      if (Number.isNaN(guestLimit) || guestLimit < baseLimit) {
        toast.update(toastId, {
          render: "Guest limit cannot be less than base limit.",
          type: "error",
          isLoading: false,
          autoClose: 8000,
        });
        return;
      }
    }

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value != null) {
        formData.append(key, String(value));
      }
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

  const handleSubmitAddon = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;

    const toastId = toast.loading("Adding add-on, please wait...", {
      position: "bottom-right",
    });

    const category = inputs.category as AddOnCategory;
    if (!inputs.name?.trim()) {
      toast.update(toastId, {
        render: "Add-on name is required!",
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
      return;
    }

    if (category !== "game" && (inputs.price === "" || inputs.price == null)) {
      toast.update(toastId, {
        render: "Price is required for this add-on!",
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
      return;
    }

    if (category === "game" && (inputs.pricePerMin === "" || inputs.pricePerMin == null)) {
      toast.update(toastId, {
        render: "Price per minute is required for game add-ons!",
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", inputs.name.trim());
    formData.append("category", category);
    if (inputs.description?.trim()) {
      formData.append("description", inputs.description.trim());
    }
    if (category !== "game") {
      formData.append("price", String(Number(inputs.price)));
    }
    if (category === "game") {
      formData.append("pricePerMin", String(Number(inputs.pricePerMin)));
    }
    if (preview) {
      formData.append("image", preview);
    }

    try {
      const response = await createAddon(formData);
      if (response.success == true) {
        formElement.reset();
        toast.update(toastId, {
          render: `${response.message}`,
          type: "success",
          isLoading: false,
          autoClose: 8000,
        });
        await fetchData();
        setAddAddonModal(false);
        clearInputs();
        return;
      }

      toast.update(toastId, {
        render: `${response.message}`,
        type: "warning",
        isLoading: false,
        autoClose: 8000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: `An error occurred. Please try again later. (${error})`,
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
    }
  };

  const handleUpdateAddon = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;

    if (!inputs.id) {
      toast.error("No add-on selected for update.", { position: "bottom-right" });
      return;
    }

    const toastId = toast.loading("Updating add-on, please wait...", {
      position: "bottom-right",
    });

    const category = inputs.category as AddOnCategory;
    if (!inputs.name?.trim()) {
      toast.update(toastId, {
        render: "Add-on name is required!",
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
      return;
    }

    if (category !== "game" && (inputs.price === "" || inputs.price == null)) {
      toast.update(toastId, {
        render: "Price is required for this add-on!",
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
      return;
    }

    if (category === "game" && (inputs.pricePerMin === "" || inputs.pricePerMin == null)) {
      toast.update(toastId, {
        render: "Price per minute is required for game add-ons!",
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", inputs.name.trim());
    formData.append("category", category);
    if (inputs.description?.trim()) {
      formData.append("description", inputs.description.trim());
    }
    if (category !== "game") {
      formData.append("price", String(Number(inputs.price)));
    }
    if (category === "game") {
      formData.append("pricePerMin", String(Number(inputs.pricePerMin)));
    }
    if (preview) {
      formData.append("image", preview);
    }

    try {
      const response = await updateAddon(formData, inputs.id);
      if (response.success == true) {
        formElement.reset();
        toast.update(toastId, {
          render: `${response.message}`,
          type: "success",
          isLoading: false,
          autoClose: 8000,
        });
        await fetchData();
        setUpdateAddonModal(false);
        clearInputs();
        return;
      }

      toast.update(toastId, {
        render: `${response.message}`,
        type: "warning",
        isLoading: false,
        autoClose: 8000,
      });
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

    if (inputs.extraGuestFee) {
      inputs.extraGuestFee = inputs.extraGuestFee.toString().replace(/[.,]/g, "");
    }

    if (section === "packages") {
      const baseLimit = Number(inputs.capacity);
      const guestLimit = Number(inputs.guestLimit);

      if (Number.isNaN(baseLimit) || baseLimit < 1) {
        toast.update(toastId, {
          render: "Base limit must be at least 1.",
          type: "error",
          isLoading: false,
          autoClose: 8000,
        });
        return;
      }

      if (Number.isNaN(guestLimit) || guestLimit < baseLimit) {
        toast.update(toastId, {
          render: "Guest limit cannot be less than base limit.",
          type: "error",
          isLoading: false,
          autoClose: 8000,
        });
        return;
      }
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
        window.location.reload();
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

  const closeDeleteModal = () => {
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const toastId = toast.loading("Deleting, please wait...", {
      position: "bottom-right",
    });
    let res;

    try {
      switch (deleteTarget.type) {
        case "packages":
          res = await deletePackages({ id: deleteTarget.id });
          break;
        case "services":
          res = await deleteServices({ id: deleteTarget.id });
          break;
        case "addons":
          res = await deleteAddon(deleteTarget.id);
          break;
        default:
          return;
      }

      if (res.success == true) {
        toast.update(toastId, {
          render: `${res.message}`,
          type: "success",
          isLoading: false,
          autoClose: 8000,
        });
        await fetchData();
        clearInputs();
        closeDeleteModal();
        return;
      }

      toast.update(toastId, {
        render: `${res.message}`,
        type: "warning",
        isLoading: false,
        autoClose: 8000,
      });
    } catch (e) {
      toast.update(toastId, {
        render: `An error occurred. Please try again later. (${e})`,
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
    }
  }

  const openDeleteModal = (type: "services" | "packages" | "addons", id: string, label: string) => {
    setDeleteTarget({ type, id, label });
  };

  const handleEditAddon = (addon: SafeAddOn) => {
    setInputs({
      id: addon.id,
      name: addon.name,
      category: addon.category,
      description: addon.description || "",
      price: addon.price != null ? String(addon.price) : "",
      pricePerMin: addon.pricePerMin != null ? String(addon.pricePerMin) : "",
      imageUrl: addon.imageUrl || "",
    });
    setPreview(undefined);
    setUpdateAddonModal(true);
  };

  const fetchData = async () => {
    const [packages, services, addons] = await Promise.all([
      getPackages(),
      getServices(),
      getAddons(),
    ]);

    setPackages(packages.data.packages);
    setServices(services.data.services);
    setAddons(addons.data.addOns);
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
              className={`w-full px-4 py-5 rounded-sm border-[1px] border-[#C7CFC9] ${section == "addons" ? "bg-[#E4E8E5]" : "bg-[#FFFFFF]"} flex flex-col gap-4 cursor-pointer duration-700 hover:scale-105 hover:shadow-lg`}
              onClick={() => setSection("addons")}
            >
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-[52px] leading-9 text-[#66655E]">
                  {addons.length}
                </h2>
              </div>
              <p className="font-medium leading-[22px] tracking-[0.5px] text-[#737373]">
                Available Add-ons
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
                  setSection("addons");
                  setAddAddonModal(true);
                }}
              >
                <button>Add-on</button>
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
                  <div className="flex items-center gap-2">
                    <ActionButton
                      variant="edit"
                      onClick={() => {
                        setInputs(service)
                        setUpdateServiceModal(true)
                      }}
                    >
                      Edit
                    </ActionButton>
                    <ActionButton
                      variant="delete"
                      onClick={() => openDeleteModal("services", service.id, service.name)}
                    >
                      Delete
                    </ActionButton>
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
                  <div className="flex items-center gap-2">
                    <ActionButton
                      variant="edit"
                      onClick={() => {
                        setInputs(pck)
                        setUpdatePackageModal(true)
                      }}
                    >
                      Edit
                    </ActionButton>
                    <ActionButton
                      variant="delete"
                      onClick={() => openDeleteModal("packages", pck.id, pck.name)}
                    >
                      Delete
                    </ActionButton>
                  </div>
                </div>
                <p className="font-medium text-xs leading-5 tracking-[0.5px] text-[#999999] line-clamp-3">
                  {pck.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {section == "addons" && (
        <section className="w-full p-4">
          <div className="flex gap-3 items-center">
            <h2 className="text-[#66655E] font-semibold text-[22px] leading-[30px]">
              All add-ons
            </h2>
            <p className="text-[#999999] font-medium leading-[22px] tracking-[0.5px]">
              {addons.length} available
            </p>
          </div>

          <div className="grid grid-cols-3 mt-5 gap-5">
            {addons.toReversed().map((addon) => {
              const priceLabel = formatAddonPrice(addon);
              return (
                <div key={addon.id} className="flex flex-col gap-3">
                  <div
                    className="w-full h-[224px] bg-cover bg-center rounded2px bg-[#EDF0EE] flex items-center justify-center"
                    style={addon.imageUrl ? { backgroundImage: `url(${addon.imageUrl})` } : undefined}
                  >
                    {!addon.imageUrl && (
                      <span className="text-4xl">✨</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[#66655E] text-[16px] font-semibold leading-6 tracking-[0.5px]">
                      {addon.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#EDF0EE] text-yard-primary font-medium capitalize shrink-0">
                        {addon.category}
                      </span>
                      <ActionButton variant="edit" onClick={() => handleEditAddon(addon)}>
                        Edit
                      </ActionButton>
                      <ActionButton
                        variant="delete"
                        onClick={() => openDeleteModal("addons", addon.id, addon.name)}
                      >
                        Delete
                      </ActionButton>
                    </div>
                  </div>
                  {priceLabel && (
                    <p className="font-semibold text-sm text-yard-primary">
                      {priceLabel}
                    </p>
                  )}
                  <p className="font-medium text-xs leading-5 tracking-[0.5px] text-[#999999] line-clamp-3">
                    {addon.description || "No description"}
                  </p>
                </div>
              );
            })}
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
                  value={inputs.name ?? ""}
                  onChange={(e) => {
                    const limited = limitWords(
                      e.target.value,
                      DESCRIPTION_WORD_LIMIT,
                    );

                    setInputs({ ...inputs, name: limited })
                  }}
                  placeholder="Enter 50 words"
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
                  value={inputs.description ?? ""}
                  onChange={(e) => {
                    {
                      const limited = limitWords(
                        e.target.value,
                        DESCRIPTION_WORD_LIMIT,
                      );

                      setInputs({ ...inputs, description: limited })
                    }

                  }}
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

      <Modal isOpen={updateAddonModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Update add-on
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => {
                clearInputs();
                setUpdateAddonModal(false);
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
          <form
            className="w-full flex flex-col gap-5 max-h-[70vh] overflow-y-scroll"
            onSubmit={(e: FormEvent<HTMLFormElement>) => handleUpdateAddon(e)}
          >
            <label
              htmlFor="updateAddonMedia"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="bg-cover bg-center"
              style={{
                backgroundImage: preview
                  ? `url(${URL.createObjectURL(preview)})`
                  : inputs.imageUrl
                    ? `url(${inputs.imageUrl})`
                    : undefined,
              }}
            >
              <div className="flex flex-col h-[200px] items-center justify-center border-[1px] border-dashed border-[#BFBFBF] py-3 px-5 cursor-pointer rounded2px">
                {preview == undefined && !inputs.imageUrl ? (
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
                      JPEG &amp; PNG up to 10mb (optional)
                    </p>
                  </>
                ) : null}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPreview(e.target.files?.[0])}
                id="updateAddonMedia"
                className="hidden"
              />
            </label>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label htmlFor="updateAddonName" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]">
                  Add-on name *
                </label>
                <input
                  type="text"
                  id="updateAddonName"
                  value={inputs.name || ""}
                  onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                  placeholder="e.g. Balloon decoration"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label htmlFor="updateAddonCategory" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]">
                  Category *
                </label>
                <select
                  id="updateAddonCategory"
                  value={inputs.category || "decoration"}
                  onChange={(e) => setInputs({ ...inputs, category: e.target.value as AddOnCategory, price: "", pricePerMin: "" })}
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none bg-white"
                >
                  <option value="decoration">Decoration</option>
                  <option value="food">Food</option>
                  <option value="game">Game</option>
                </select>
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label htmlFor="updateAddonDesc" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]">
                  Description
                </label>
                <textarea
                  id="updateAddonDesc"
                  value={inputs.description || ""}
                  onChange={(e) => setInputs({ ...inputs, description: e.target.value })}
                  placeholder="Short description of the add-on"
                  className="w-full h-[120px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            {inputs.category !== "game" && (
              <div className="form-group flex flex-col md:flex-row items-start gap-6">
                <div className="w-full input-group flex flex-col gap-3">
                  <label htmlFor="updateAddonPrice" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    id="updateAddonPrice"
                    min={0}
                    value={inputs.price ?? ""}
                    onChange={(e) => setInputs({ ...inputs, price: e.target.value })}
                    placeholder="0"
                    className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  />
                </div>
              </div>
            )}

            {inputs.category === "game" && (
              <div className="form-group flex flex-col md:flex-row items-start gap-6">
                <div className="w-full input-group flex flex-col gap-3">
                  <label htmlFor="updateAddonPricePerMin" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]">
                    Price per minute (₦) *
                  </label>
                  <input
                    type="number"
                    id="updateAddonPricePerMin"
                    min={0}
                    value={inputs.pricePerMin ?? ""}
                    onChange={(e) => setInputs({ ...inputs, pricePerMin: e.target.value })}
                    placeholder="0"
                    className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  />
                </div>
              </div>
            )}

            <div className="w-full flex items-center gap-5 mt-3">
              <button
                type="button"
                className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] cursor-pointer"
                onClick={() => {
                  clearInputs();
                  setUpdateAddonModal(false);
                }}
              >
                <span className="z-40 font-sen">Cancel</span>
                <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>

              <button
                type="submit"
                className="w-full flex justify-center cta-btn bg-yard-primary text-[#EEEEE6] group relative overflow-hidden rounded-[5px] cursor-pointer"
              >
                <span className="z-40 font-sen">Update add-on</span>
                <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={deleteTarget !== null}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
                Delete {deleteTarget?.type === "addons" ? "add-on" : deleteTarget?.type === "services" ? "service" : "package"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#666]">
                {deleteTarget?.label
                  ? `${deleteTarget.label} will be removed permanently. This action cannot be undone.`
                  : "This item will be removed permanently. This action cannot be undone."}
              </p>
            </div>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden shrink-0"
              onClick={closeDeleteModal}
            >
              <Image
                src="/icons/cancel.svg"
                width={16}
                height={16}
                alt="Close Icon"
                className="z-40"
              />
              <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-[#E4E8E5] bg-[#FDFBF9] p-4">
            <p className="text-sm leading-6 text-[#666]">
              Confirming this will permanently delete the selected item from the dashboard.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={closeDeleteModal}
              className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] cursor-pointer"
            >
              <span className="z-40 font-sen">Cancel</span>
              <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="w-full flex justify-center cta-btn bg-[#B42318] text-[#EEEEE6] group relative overflow-hidden rounded-[5px] cursor-pointer"
            >
              <span className="z-40 font-sen">Delete</span>
              <div className="absolute top-0 left-0 bg-[#912018] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>
          </div>
        </section>
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
                  value={inputs.name || ""}
                  type="text"
                  id="packageName"
                  name="packageName"
                  onChange={(e) => {

                    const limited = limitWords(
                      e.target.value,
                      50,
                    );

                    setInputs({ ...inputs, name: limited })
                  }}
                  placeholder="50 Words"
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
                  value={inputs.description || ""}
                  id="desc"
                  name="desc"
                  onChange={(e) => {
                    const limited = limitWords(
                      e.target.value,
                      DESCRIPTION_WORD_LIMIT,
                    );
                    setInputs(prev => ({ ...prev, description: limited }))

                  }}
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
                  htmlFor="capacity"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter base limit
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={inputs.capacity ?? ""}
                  onChange={(e) => setInputs({ ...inputs, capacity: e.target.value })}
                  placeholder="Base limit (100)"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="guestLimit"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter guest limit
                </label>
                <input
                  type="number"
                  id="guestLimit"
                  name="guestLimit"
                  value={inputs.guestLimit ?? ""}
                  onChange={(e) => setInputs({ ...inputs, guestLimit: e.target.value })}
                  placeholder="Guest limit (120)"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="extraGuestFee"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter Extra Guest Fee
                </label>
                <input
                  type="text"
                  id="extraGuestFee"
                  name="extraGuestFee"
                  value={inputs.extraGuestFee ? Number(inputs.extraGuestFee.toString().replace(/,/g, "")).toLocaleString() : ""}
                  onChange={(e) => setInputs({ ...inputs, extraGuestFee: e.target.value })}
                  placeholder="Extra Guest Fee"
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
                  onChange={(e) => setInputs({ ...inputs, specs: e.target.value })}
                  placeholder="games and dates, Game hall special, Game hall special"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  value={inputs.specs || ""}
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

      {/*Add add-on Modal*/}
      <Modal isOpen={addAddonModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Add a new add-on
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => {
                clearInputs();
                setAddAddonModal(false);
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
          <form
            className="w-full flex flex-col gap-5 max-h-[70vh] overflow-y-scroll"
            onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmitAddon(e)}
          >
            <label
              htmlFor="addonMedia"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="bg-cover bg-center"
              style={{
                backgroundImage: preview ? `url(${URL.createObjectURL(preview)})` : undefined,
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
                      JPEG &amp; PNG up to 10mb (optional)
                    </p>
                  </>
                ) : null}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPreview(e.target.files?.[0])}
                id="addonMedia"
                className="hidden"
              />
            </label>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label htmlFor="addonName" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]">
                  Add-on name * <small>20 words max</small>
                </label>
                <input
                  type="text"
                  id="addonName"
                  name="addonName"
                  value={inputs.name || ""}
                  onChange={(e) => {
                    const limited = limitWords(
                      e.target.value,
                      20
                    )
                    setInputs({ ...inputs, name: limited })
                  }}
                  placeholder="e.g. Balloon decoration"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label htmlFor="addonCategory" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]">
                  Category *
                </label>
                <select
                  id="addonCategory"
                  name="addonCategory"
                  value={inputs.category || "decoration"}
                  onChange={(e) => setInputs({ ...inputs, category: e.target.value as AddOnCategory, price: "", pricePerMin: "" })}
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none bg-white"
                >
                  <option value="decoration">Decoration</option>
                  <option value="food">Food</option>
                  <option value="game">Game</option>
                </select>
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label htmlFor="addonDesc" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]">
                  Description
                </label>
                <textarea
                  id="addonDesc"
                  name="addonDesc"
                  value={inputs.description || ""}
                  onChange={(e) => {
                    const limited = limitWords(
                      e.target.value,
                      DESCRIPTION_WORD_LIMIT
                    )
                    setInputs({ ...inputs, name: limited })
                  }}
                  placeholder="Short description of the add-on"
                  className="w-full h-[120px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            {inputs.category !== "game" && (
              <div className="form-group flex flex-col md:flex-row items-start gap-6">
                <div className="w-full input-group flex flex-col gap-3">
                  <label htmlFor="addonPrice" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    id="addonPrice"
                    name="addonPrice"
                    min={0}
                    value={inputs.price ?? ""}
                    onChange={(e) => setInputs({ ...inputs, price: e.target.value })}
                    placeholder="0"
                    className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  />
                </div>
              </div>
            )}

            {inputs.category === "game" && (
              <div className="form-group flex flex-col md:flex-row items-start gap-6">
                <div className="w-full input-group flex flex-col gap-3">
                  <label htmlFor="addonPricePerMin" className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]">
                    Price per minute (₦) *
                  </label>
                  <input
                    type="number"
                    id="addonPricePerMin"
                    name="addonPricePerMin"
                    min={0}
                    value={inputs.pricePerMin ?? ""}
                    onChange={(e) => setInputs({ ...inputs, pricePerMin: e.target.value })}
                    placeholder="0"
                    className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                  />
                </div>
              </div>
            )}

            <div className="w-full flex items-center gap-5 mt-3">
              <button
                type="button"
                className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] cursor-pointer"
                onClick={() => {
                  clearInputs();
                  setAddAddonModal(false);
                }}
              >
                <span className="z-40 font-sen">Cancel</span>
                <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>

              <button
                type="submit"
                className="w-full flex justify-center cta-btn bg-yard-primary text-[#EEEEE6] group relative overflow-hidden rounded-[5px] cursor-pointer"
              >
                <span className="z-40 font-sen">Add add-on</span>
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
                  value={inputs.name || ""}
                  onChange={(e) => {
                    const limited = limitWords(
                      e.target.value,
                      50,
                    );

                    setInputs({ ...inputs, name: limited })
                  }}
                  placeholder="50 Words"
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
                  value={inputs.description || ""}
                  onChange={(e) => {
                    const limited = limitWords(
                      e.target.value,
                      DESCRIPTION_WORD_LIMIT,
                    );

                    setInputs({ ...inputs, description: limited })
                  }}
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
                  htmlFor="updateCapacity"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter base limit
                </label>
                <input
                  type="number"
                  id="updateCapacity"
                  name="updateCapacity"
                  value={inputs.capacity ?? ""}
                  onChange={(e) => setInputs({ ...inputs, capacity: e.target.value })}
                  placeholder="Base limit (100)"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="guestLimit"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter guest limit
                </label>
                <input
                  type="number"
                  id="guestLimit"
                  name="guestLimit"
                  value={inputs.guestLimit ?? ""}
                  onChange={(e) => setInputs({ ...inputs, guestLimit: e.target.value })}
                  placeholder="Guest limit (120)"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row iqtems-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="extraGuestFee"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter Extra Guest Fee
                </label>
                <input
                  type="text"
                  id="extraGuestFee"
                  name="extraGuestFee"
                  value={inputs.extraGuestFee ? Number(inputs.extraGuestFee.toString().replace(/,/g, "")).toLocaleString() : ""}
                  onChange={(e) => setInputs({ ...inputs, extraGuestFee: e.target.value.replace(",", "") })}
                  placeholder="Extra Guest Fee"
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
                  value={inputs.specs || ""}
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
                  value={inputs.name || ""}
                  onChange={(e) => {
                    const limited = limitWords(
                      e.target.value,
                      50,
                    );

                    setInputs({ ...inputs, name: limited })
                  }}
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
                  value={inputs.description || ""}
                  onChange={(e) => {
                    const limited = limitWords(
                      e.target.value,
                      DESCRIPTION_WORD_LIMIT,
                    );

                    setInputs({ ...inputs, description: limited })
                  }
                  }
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
