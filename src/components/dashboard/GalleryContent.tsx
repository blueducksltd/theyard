/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import React, { FormEvent } from "react";
import Modal from "../Modal";
import Link from "next/link";
import { IGallery } from "@/types/Gallery";
import {
  createGallery,
  createTag,
  deleteGallery,
  getEvents,
  getGallery,
  getTags,
  updateGallery,
} from "@/util";
import moment from "moment";
import { ITag } from "@/types/Tag";
import { toast } from "react-toastify";
import { IEvent } from "@/types/Event";

export default function GalleryContent() {
  const [mediaModal, setMediaModal] = React.useState<boolean>(false);
  const [editModal, setEditModal] = React.useState<boolean>(false);
  const [shareModal, setShareModal] = React.useState<boolean>(false);
  const [tagModal, setTagModal] = React.useState<boolean>(false);
  const [picModal, setPicModal] = React.useState<boolean>(false);
  const [confModal, setConfModal] = React.useState<boolean>(false);
  const [galleries, setGalleries] = React.useState<IGallery[]>([]);
  const [totalNum, setTotalNum] = React.useState<Record<string, number>>({});
  const [tags, setTags] = React.useState<ITag[]>([]);
  const [events, setEvents] = React.useState<IEvent[]>([]);
  const [defaultGallery, setDefaultGallery] = React.useState<IGallery[]>([]);
  const [tagInput, setTagInput] = React.useState<string>("");
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [selectedTag, setSelectedTag] = React.useState<string>("");
  const [mediaDate, setMediaDate] = React.useState<string>("");
  const [viewImage, setViewImage] = React.useState<IGallery>();
  const [dateFilter, setDateFilter] = React.useState<string>("");
  const [galleryInputs, setGalleryInputs] = React.useState<Record<string, any>>(
    {},
  );

  const handleFilterByCategory = (purpose: string) => {
    if (purpose == "all") {
      setDateFilter("");
      return setGalleries(defaultGallery);
    }

    const _galleries = defaultGallery.filter(
      (gallery) => gallery.category.toLowerCase() === purpose,
    );
    if (_galleries.length > 0) {
      setGalleries(_galleries);
    } else {
      toast.info(`No gallery with category "${purpose}"`, {
        position: "bottom-right",
      });
    }
  };

  const handleFilterByDate = (date: string) => {
    if (date) {
      setDateFilter(date);
      const _galleries = galleries.filter(
        (gallery) => moment(gallery.mediaDate).format("YYYY-MM-DD") === date,
      );
      if (_galleries.length > 0) {
        setGalleries(_galleries);
      } else {
        toast.info(`No gallery found on ${moment(date).format("LL")}`, {
          position: "bottom-right",
        });
      }
    }
  };

  const clearInputs = () => {
    setGalleryInputs({});
    setSelectedFiles([]);
    setSelectedTag("");
    setMediaDate("");
    setViewImage(undefined);
  };

  const handleSubmitGallery = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const toastId = toast.loading("Uploading image(s)...", {
      position: "bottom-right",
    });

    if (selectedFiles.length === 0) {
      return toast.update(toastId, {
        render: "Please provide an image!",
        type: "error",
        isLoading: false,
        autoClose: 6000,
      });
    }

    if (selectedTag === "" || selectedTag === null) {
      return toast.update(toastId, {
        render: "Please select tag for image(s)",
        type: "error",
        isLoading: false,
        autoClose: 6000,
      });
    }

    //Initialize inputs
    // galleryInputs.images = selectedFiles[0];
    // galleryInputs.images = selectedFiles;
    galleryInputs.mediaDate = mediaDate;
    galleryInputs.category = selectedTag;

    if (Object.keys(galleryInputs).length < 5) {
      return toast.update(toastId, {
        render: "All inputs are needed!",
        type: "error",
        isLoading: false,
        autoClose: 6000,
      });
    }

    Object.values(galleryInputs).map((val) => {
      if (val === "" || val === null) {
        return toast.update(toastId, {
          render: "All inputs are needed!",
          type: "error",
          isLoading: false,
          autoClose: 6000,
        });
      }
    });

    const formData = new FormData();
    Object.entries(galleryInputs).map(([key, value]) => {
      formData.append(key, value);
    });

    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await createGallery(formData);
      if (response.success == true) {
        formEl.reset();
        // Handle success
        toast.update(toastId, {
          render: `Image(s) uploaded successfully!`,
          type: "success",
          isLoading: false,
          autoClose: 6000,
        });
        const newData: IGallery[] = response.data.gallery;
        newData.forEach((gallery) => {
          galleries.push(gallery);
        });
        setMediaModal(false);
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

  const handleUpdateGallery = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const toastId = toast.loading("Updating image(s)...", {
      position: "bottom-right",
    });

    if (selectedTag === "" || selectedTag === null) {
      return toast.update(toastId, {
        render: "Please select tag for image(s)",
        type: "error",
        isLoading: false,
        autoClose: 6000,
      });
    }

    //Initialize inputs
    galleryInputs.images = selectedFiles[0];
    galleryInputs.mediaDate = mediaDate;
    galleryInputs.category = selectedTag;

    Object.values(galleryInputs).map((val) => {
      if (val === "" || val === null) {
        return toast.update(toastId, {
          render: "All inputs are needed!",
          type: "error",
          isLoading: false,
          autoClose: 6000,
        });
      }
    });

    // const formData = new FormData();
    // Object.entries(galleryInputs).map(([key, value]) => {
    //   formData.append(key, value);
    // });

    try {
      const response = await updateGallery(
        viewImage?.id as string,
        galleryInputs,
      );
      if (response.success == true) {
        formEl.reset();
        // Handle success
        toast.update(toastId, {
          render: `Image(s) updated successfully!`,
          type: "success",
          isLoading: false,
          autoClose: 6000,
        });

        const updatedData = response.data.galleries[0];
        const updatedGalleries = galleries.map((gallery) =>
          gallery.id === updatedData.id ? updatedData : gallery,
        );

        setGalleries(updatedGalleries);
        setEditModal(false);
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

  // Create a new tag
  const handleSubmitTag = async () => {
    const toastId = toast.loading("Creating tag...", {
      position: "bottom-right",
    });
    if (tagInput == "" || tagInput == null) {
      return toast.update(toastId, {
        render: "Please provide tag name!",
        type: "error",
        isLoading: false,
        autoClose: 6000,
      });
    }

    try {
      const response = await createTag(tagInput);
      if (response.success == true) {
        toast.update(toastId, {
          render: `${response.message}`,
          type: "success",
          isLoading: false,
          autoClose: 6000,
        });
        setTagInput("");
      } else {
        toast.update(toastId, {
          render: `${response.message}`,
          type: "warning",
          isLoading: false,
          autoClose: 6000,
        });
      }
    } catch (error) {
      return toast.update(toastId, {
        render: `There was an error trying to create tag, please try again! ${error}`,
        type: "error",
        isLoading: false,
        autoClose: 6000,
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      processFiles(Array.from(files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) {
      processFiles(Array.from(files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const processFiles = (files: File[]) => {
    // Calculate total after adding new files
    const totalFiles = selectedFiles.length + files.length;

    if (totalFiles > 5) {
      return toast.info("You cannot select more than 5 images in total", {
        position: "bottom-right",
      });
    }

    // Validate size for new files only
    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB limit`, {
          position: "bottom-right",
        });
        return false;
      }
      return true;
    });

    // Add to existing files instead of replacing
    setSelectedFiles([...selectedFiles, ...validFiles]);
  };

  // Delete Image
  const handleDeleteImage = async (id?: string) => {
    if (id) {
      const toastId = toast.loading("Deleting image...", {
        position: "bottom-right",
      });

      const data = { id };
      try {
        const response = await deleteGallery(data);
        if (response.success == true) {
          toast.update(toastId, {
            render: `Image deleted successfully!`,
            type: "success",
            isLoading: false,
            autoClose: 6000,
          });
          const newData = galleries.filter(
            (gallery) => (gallery.id as string) !== id,
          );
          setGalleries(newData);
          setConfModal(false);
          setPicModal(false);
        } else {
          toast.update(toastId, {
            render: `${response.message}`,
            type: "error",
            isLoading: false,
            autoClose: 6000,
          });
          setConfModal(false);
        }
      } catch (error) {
        toast.update(toastId, {
          render: `An error occured while deleting image, please try again! ${error}`,
          type: "error",
          isLoading: false,
          autoClose: 6000,
        });
        setConfModal(false);
      }
    }
  };

  React.useEffect(() => {
    (async () => {
      const [fetchTags] = await Promise.all([getTags()]);
      setTags(fetchTags.data.tags);
    })();
    //clean up
    return () => {
      console.log("");
    };
  }, [tagInput]);

  React.useEffect(() => {
    const toastId = toast.loading("Loading data...", {
      position: "bottom-right",
    });

    (async () => {
      const [fetchGallery, fetchEvents] = await Promise.all([
        getGallery(),
        getEvents(),
      ]);

      const galleryData: IGallery[] = fetchGallery.data.gallery;

      const totalImage = galleryData.filter(
        (gallery) =>
          gallery.imageUrl.split(".").pop()?.toLowerCase() == "webp" ||
          gallery.imageUrl.split(".").pop()?.toLowerCase() == "jpg" ||
          gallery.imageUrl.split(".").pop()?.toLowerCase() == "png" ||
          gallery.imageUrl.split(".").pop()?.toLowerCase() == "jpeg",
      );

      const totalVideo = galleryData.filter(
        (gallery) =>
          gallery.imageUrl.split(".").pop()?.toLowerCase() == "mp4" ||
          gallery.imageUrl.split(".").pop()?.toLowerCase() == "webm" ||
          gallery.imageUrl.split(".").pop()?.toLowerCase() == "png",
      );

      setTotalNum({
        images: totalImage.length,
        videos: totalVideo.length,
      });

      setGalleries(galleryData);
      setEvents(fetchEvents.data.events);
      setDefaultGallery(galleryData);

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
    <main className="flex-1 py-4 px-5 md:h-[600px] 2xl:h-[770px] overflow-y-auto">
      <section className="flex items-center justify-between border-[1px] border-[#E4E8E5] bg-[#FFFFFF] py-5 px-4 rounded-[4px]">
        <div className="flex flex-col gap-2">
          <h2 className="text-[#66655E] font-bold text-[32px] leading-10">
            Media
          </h2>

          <div className="flex items-center text-[#999999]">
            <p className="pr-2">{totalNum.images} Photos</p>
            {/*Divider*/}
            <div className="w-[1px] h-3 bg-[#C7CFC9] hidden md:block"></div>
            <p className="pl-2">{totalNum.videos} Videos</p>
          </div>
        </div>

        <div className="flex gap-3 h-10">
          <div className="w-[193px] flex rounded2px border-[1px] border-[#999999] px-3">
            <img
              src={"/icons/event.svg"}
              width={16}
              height={16}
              alt="Event Icon"
            />
            <select
              className=" text-[#999999] z-40 outline-none"
              onChange={(e) => handleFilterByCategory(e.target.value)}
            >
              <option value={"all"} disabled>
                Purpose of event
              </option>
              <option value={"all"}>All/Others</option>
              {tags.map((tag) => (
                <option key={tag.id as string} value={tag.name.toLowerCase()}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>

          <label
            htmlFor="date"
            className="w-[193px] flex rounded2px border-[1px] border-[#999999] px-3"
          >
            <img
              src={"/icons/calendar2.svg"}
              width={16}
              height={16}
              alt="Event Icon"
            />
            <input
              id="date"
              type="date"
              value={dateFilter}
              onChange={(e) => handleFilterByDate(e.target.value)}
              onClick={(e) => (e.target as HTMLInputElement).showPicker()}
              className="input text-[#999999] [&::-webkit-calendar-picker-indicator]:hidden [&::-moz-calendar-picker-indicator]:hidden"
            />
          </label>
        </div>

        <div className="flex items-center gap-3 h-10 cursor-pointer">
          <div
            className="w-max h-10 items-center flex rounded2px border-[1px] border-[#999999] px-3 gap-2.5 group relative overflow-hidden"
            onClick={() => setMediaModal(true)}
          >
            <img
              src={"/icons/add.svg"}
              width={16}
              height={16}
              className="z-40"
              alt="Event Icon"
            />
            <p className="z-40 text-yard-primary text-[16px] leading-6 tracking-[0.5px]">
              Upload media
            </p>
            <div className="absolute top-0 left-0 bg-[#E4E8E5] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </div>

          <div className="dropdown dropdown-bottom dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="w-9 h-9 p-2 bg-[#EDF0EE] flex items-center justify-center group relative overflow-hidden"
            >
              <img
                src={"/icons/more.svg"}
                width={16}
                height={16}
                className="z-40"
                alt="More Icon"
              />
              <div className="absolute top-0 left-0 bg-[#E4E8E5] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </div>
            {/*Dropdown content*/}
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-white rounded-lg z-1 w-52 p-2 shadow-sm mt-2"
            >
              <li
                className="text-[#595959] text-sm leading-[22px] tracking-[0.5px] duration-1000 hover:bg-[#E4E8E5] rounded"
                onClick={() => setShareModal(true)}
              >
                <button>Share Gallery</button>
              </li>
              <li
                className="text-[#595959] text-sm leading-[22px] tracking-[0.5px] duration-1000 hover:bg-[#E4E8E5] rounded"
                onClick={() => setTagModal(true)}
              >
                <button>Create tags</button>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/*Gallery Section*/}
      <section className="flex flex-wrap mt-5 gap-5">
        {/* Single Image */}
        {galleries &&
          galleries.toReversed().map((gallery) => (
            <div key={gallery.id as string} className="inline-block grow">
              <div className="relative h-[227px]">
                <img src="/gallery/gallery3.svg" alt="" className="invisible" />
                <div
                  onClick={() => {
                    setViewImage(gallery);
                    setPicModal(true);
                  }}
                  className="absolute inset-0 bg-cover bg-center rounded-[4px] cursor-pointer"
                  style={{ backgroundImage: `url(${gallery.imageUrl})` }}
                ></div>
              </div>

              <div className="flex items-start justify-between mt-3">
                <div className="flex flex-col">
                  <h4 className="text-[#66655E] font-semibold leading-6 tracking-[0.5px]">
                    {gallery.title}
                  </h4>
                  <small className="text-[#999999] font-medium">
                    {moment(gallery.mediaDate).fromNow()}
                  </small>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Image
                      src={"/icons/share2.svg"}
                      width={14}
                      height={14}
                      alt="Share Icon"
                    />
                    <span className="font-sen font-medium text-[#55544E] text-[14px] leading-3.5 tracking-[0.4px]">
                      Share
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-1.5 cursor-pointer"
                    onClick={() => {
                      setViewImage(gallery);
                      setConfModal(true);
                    }}
                  >
                    <Image
                      src={"/icons/trash-black.svg"}
                      width={14}
                      height={14}
                      alt="Share Icon"
                    />
                    <span className="font-sen font-medium text-[#55544E] text-[14px] leading-3.5 tracking-[0.4px]">
                      Delete
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </section>

      {/*Modals*/}

      {/*Share Gallery Modal*/}
      <Modal isOpen={shareModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Share Gallery
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setShareModal(false)}
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
        <div className="flex gap-5 mt-8 justify-center w-full">
          <button className="w-[50px] h-[50px] bg-[#EDF0EE] p-[11.11px] flex items-center justify-center rounded-[2.78px] text-[#EEEEE6] group relative overflow-hidden cursor-pointer">
            <img
              src={"/icons/whatsapp.svg"}
              width={23}
              height={23}
              className="z-40"
              alt="WhatsApp Icon"
            />
            <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>

          <button className="w-[50px] h-[50px] bg-[#EDF0EE] p-[11.11px] flex items-center justify-center rounded-[2.78px] text-[#EEEEE6] group relative overflow-hidden cursor-pointer">
            <img
              src={"/icons/facebook.svg"}
              width={23}
              height={23}
              className="z-40"
              alt="Facebook Icon"
            />
            <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>

          <button className="w-[50px] h-[50px] bg-[#EDF0EE] p-[11.11px] flex items-center justify-center rounded-[2.78px] text-[#EEEEE6] group relative overflow-hidden cursor-pointer">
            <img
              src={"/icons/instagram.svg"}
              width={23}
              height={23}
              className="z-40"
              alt="Instagram Icon"
            />
            <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>

          <button className="w-[50px] h-[50px] bg-[#EDF0EE] p-[11.11px] flex items-center justify-center rounded-[2.78px] text-[#EEEEE6] group relative overflow-hidden cursor-pointer">
            <img
              src={"/icons/x.svg"}
              width={23}
              height={23}
              className="z-40"
              alt="X Icon"
            />
            <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>

          <button className="w-[50px] h-[50px] bg-[#EDF0EE] p-[11.11px] flex items-center justify-center rounded-[2.78px] text-[#EEEEE6] group relative overflow-hidden cursor-pointer">
            <img
              src={"/icons/linkedin.svg"}
              width={23}
              height={23}
              className="z-40"
              alt="Linkedin Icon"
            />
            <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center cta-btn bg-base-100 text-yard-primary group relative overflow-hidden rounded-[5px] mt-5"
        >
          <span className="z-40">Copy link</span>
          <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
        </button>
      </Modal>

      {/*Create Tag Modal*/}
      <Modal isOpen={tagModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Create tag
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setTagModal(false)}
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
        <form className="w-full flex flex-col gap-4 mt-8">
          <div className="form-group flex flex-col md:flex-row items-start gap-6">
            <div className="w-full input-group flex flex-col gap-3">
              <label
                htmlFor="title"
                className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
              >
                Enter tag name
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Enter tag name"
                className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSubmitTag()}
            className="w-full flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden rounded-[5px]"
          >
            <span className="z-40">Create tag</span>
            <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>
        </form>
      </Modal>

      {/*Image Modal*/}
      <Modal isOpen={picModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
                {viewImage?.title}
              </h2>
              <p className="text-[#999999] text-[16px] leading-6 tracking-[0.5px]">
                {moment(viewImage?.mediaDate).format("LL")}
              </p>
            </div>

            {/*Actions*/}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1 group relative cursor-pointer">
                <Image
                  src={"/icons/share2.svg"}
                  width={16}
                  height={16}
                  alt="Share Icon"
                />
                <span className="font-sen font-medium text-[#55544E] leading-6 tracking-[0.4px]">
                  Share
                </span>
                <div className="yard-link-line bg-yard-primary"></div>
              </div>
              <div className="dropdown dropdown-bottom dropdown-center">
                <div
                  tabIndex={0}
                  role="button"
                  className=" p-2 flex items-center justify-center group relative overflow-hidden cursor-pointer"
                >
                  <Image
                    src={"/icons/more2.svg"}
                    width={16}
                    height={16}
                    className="z-40"
                    alt="More Icon"
                  />
                  <div className="absolute top-0 left-0 bg-[#E4E8E5] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
                </div>
                {/*Dropdown content*/}
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-white rounded-lg z-1 w-32 p-2 shadow-sm mt-2"
                >
                  <li
                    className="text-[#595959] text-sm leading-[22px] tracking-[0.5px] duration-1000 hover:bg-[#E4E8E5] rounded"
                    onClick={() => {
                      setSelectedTag(viewImage?.category as string);
                      setMediaDate(
                        moment(viewImage?.mediaDate).format("YYYY-MM-DD"),
                      );
                      // setSelectedFiles([viewImage?.imageUrl]);
                      setPicModal(false);
                      setEditModal(true);
                    }}
                  >
                    <button>Edit</button>
                  </li>

                  <li className="text-[#595959] text-sm leading-[22px] tracking-[0.5px] duration-1000 hover:bg-[#E4E8E5] rounded">
                    {viewImage?.event !== null ? (
                      <Link href={`/event/${viewImage?.event.title}`}>
                        Event
                      </Link>
                    ) : (
                      <button
                        onClick={() =>
                          toast.info("No event associated with this image", {
                            position: "bottom-right",
                          })
                        }
                        className="cursor-pointer" // Add same styling as Link
                      >
                        Event
                      </button>
                    )}
                  </li>

                  <li
                    className="text-[#595959] text-sm leading-[22px] tracking-[0.5px] duration-1000 hover:bg-[#E4E8E5] rounded"
                    onClick={() => {
                      setConfModal(true);
                    }}
                  >
                    <button>Delete</button>
                  </li>
                </ul>
              </div>
              <div
                className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
                onClick={() => setPicModal(false)}
              >
                <img
                  src={"/icons/cancel.svg"}
                  alt="Close Icon"
                  className="z-40"
                />
                <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
              </div>
            </div>
          </div>
        </section>
        <p className="mt-5 text-[#999999] tracking-[0.4px] truncate w-full">
          {viewImage?.description}
        </p>

        <div
          className="w-full h-[471px] bg-cover bg-center mt-4 rounded-lg"
          style={{ backgroundImage: `url(${viewImage?.imageUrl})` }}
        ></div>
      </Modal>

      {/*Modals*/}
      <Modal isOpen={mediaModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Upload Media
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => {
                clearInputs();
                setMediaModal(false);
              }}
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
        <div className="w-full max-w-[1000px] overflow-x-auto">
          <div className="flex gap-5 mt-8 pb-2">
            {tags.map((tag) => (
              <button
                key={tag.id as string}
                onClick={() => {
                  setSelectedTag(tag.name);
                  galleryInputs.category = tag.name;
                }}
                className={`min-w-[124px] ${selectedTag === tag.name ? "bg-yard-primary text-[#EEEEE6]" : "bg-[#EDF0EE] text-yard-primary"} p-2.5 rounded-sm font-medium font-sen text-[15px] border-[1px] border-[#C7CFC9] whitespace-nowrap cursor-pointer`}
              >
                {tag.name} {/* Don't hardcode "Wedding" */}
              </button>
            ))}
            <button
              onClick={() => {
                setSelectedTag("other");
                galleryInputs.category = "other";
              }}
              className={`min-w-[124px] ${selectedTag === "other" ? "bg-yard-primary text-[#EEEEE6]" : "bg-[#EDF0EE] text-yard-primary"} p-2.5 rounded-sm font-medium font-sen text-[15px] border-[1px] border-[#C7CFC9] whitespace-nowrap cursor-pointer`}
            >
              Other
            </button>
          </div>
        </div>

        {/*Media*/}
        <div className="flex items-start my-4 2xl:my-8 gap-10">
          <div className="w-[166px] flex flex-col items-center gap-5">
            <div>
              <label
                htmlFor="media"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="w-full stack stack-top">
                  {selectedFiles.length > 0 ? (
                    selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="relative flex flex-col h-[213px] items-center justify-center border-[1px] border-solid border-[#BFBFBF] rounded2px overflow-hidden card"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Optional: Remove button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault(); // Prevent default behavior
                            e.stopPropagation(); // Stop event from bubbling to label
                            setSelectedFiles(
                              selectedFiles.filter((_, i) => i !== index),
                            );
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                        {/* Optional: File name */}
                        <p className="absolute bottom-2 left-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded truncate">
                          {file.name}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col h-[213px] items-center justify-center border-[1px] border-dashed border-[#BFBFBF] py-3 px-5 cursor-pointer rounded2px">
                      <Image
                        src={"/icons/upload.svg"}
                        width={18}
                        height={18}
                        alt="Upload Icon"
                      />
                      <p className="w-[126px] text-xs text-[#999999] text-center leading-5 tracking-[0.5px] mt-4 mb-1">
                        Choose up to 5 images or drag &amp; drop them here
                      </p>
                      <p className="w-[126px] text-[10px] text-[#BFBFBF] text-center leading-5 tracking-[0.5px]">
                        JPEG &amp; PNG up to 10mb
                      </p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*,video/*"
                  id="media"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              {selectedFiles.length > 0 && (
                <small className="font-sen text-yard-primary text-xs">
                  {selectedFiles.length} selected
                </small>
              )}
            </div>

            <div className="bg-[#8A38F51A] flex items-start rounded-[5px] p-2.5 gap-1">
              <img
                src={"/icons/party.svg"}
                width={16}
                height={16}
                alt="Party Icon"
              />
              <p className="text-[#999999] leading-[22px] tracking-[0.5px] text-sm">
                Please link media to the event it orignate from
              </p>
            </div>
          </div>

          {/*Divider*/}
          <div className="w-[1px] h-[450px] bg-[#EDF0EE] hidden md:block"></div>

          {/*Form*/}
          <form
            className="w-[454px] flex flex-col gap-4"
            onSubmit={handleSubmitGallery}
          >
            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="title"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter title of media
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  onChange={(e) => (galleryInputs.title = e.target.value)}
                  placeholder="Enter title of media"
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
                  onChange={(e) => (galleryInputs.description = e.target.value)}
                  placeholder="150 words"
                  className="w-full h-[147px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                ></textarea>
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex border-[1px] border-[#BFBFBF] h-[52px] rounded2px p-3 items-center">
                <Image
                  src={"/icons/event.svg"}
                  width={16}
                  height={16}
                  alt="Event Icon"
                />

                <select
                  id="event"
                  name="event"
                  defaultValue={"null"}
                  onChange={(e) => (galleryInputs.eventId = e.target.value)}
                  className="w-full p-3 text-[#999999] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                >
                  <option disabled>Connect media to an event</option>
                  <option value="null">No event attached</option>
                  {events.map((event) => (
                    <option key={event.id as string} value={event.id as string}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group flex items-center gap-3">
              <div className="w-full input-group flex border-[1px] border-[#BFBFBF] h-[52px] rounded2px p-3 items-center">
                <Image
                  src={"/icons/calendar2.svg"}
                  width={16}
                  height={16}
                  alt="Event Icon"
                />

                <input
                  type="date"
                  name="date"
                  value={mediaDate}
                  onChange={(e) => setMediaDate(e.target.value)}
                  onBlur={(e) => setMediaDate(e.target.value)}
                  onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                  className="w-full p-3 text-[#999999] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px] [&::-webkit-calendar-picker-indicator]:hidden [&::-moz-calendar-picker-indicator]:hidden"
                />
              </div>
              <label
                htmlFor="today"
                className="w-[209px] flex gap-3 bg-[#C7CFC9] items-center rounded-[4px] h-[52px] px-2.5 border-[1px] border-[#C7CFC9] transition-colors duration-500 hover:border-yard-dark-primary hover:bg-[#EDF0EE] has-[:checked]:bg-[#EDF0EE] cursor-pointer"
              >
                <input
                  type="radio"
                  id="today"
                  value={"today"}
                  onChange={() => setMediaDate(moment().format("YYYY-MM-DD"))}
                  name="today"
                  className="radio radio-sm peer border-2 border-yard-primary checked:border-yard-dark-primary checked:text-yard-dark-primary"
                />
                <div>
                  <h3 className="text-xl text-yard-primary leading-9">Today</h3>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden rounded-[5px] cursor-pointer"
            >
              <span className="z-40">Upload</span>
              <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>
          </form>
        </div>
      </Modal>

      {/*Edit Modal*/}
      <Modal isOpen={editModal}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Edit Media
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => {
                clearInputs();
                setEditModal(false);
              }}
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
        <div className="w-full max-w-[1000px] overflow-x-auto">
          <div className="flex gap-5 mt-8 pb-2">
            {tags
              .sort((a, b) => {
                if (a.name === viewImage?.category) return -1;
                if (b.name === viewImage?.category) return 1;
                return 0;
              })
              .map((tag) => (
                <button
                  key={tag.id as string}
                  onClick={() => {
                    setSelectedTag(tag.name);
                    galleryInputs.category = tag.name;
                  }}
                  className={`min-w-[124px] ${
                    selectedTag === tag.name
                      ? "bg-yard-primary text-[#EEEEE6]"
                      : "bg-[#EDF0EE] text-yard-primary"
                  } p-2.5 rounded-sm font-medium font-sen text-[15px] border-[1px] border-[#C7CFC9] whitespace-nowrap cursor-pointer`}
                >
                  {tag.name}
                </button>
              ))}
            <button
              onClick={() => {
                setSelectedTag("other");
                galleryInputs.category = "other";
              }}
              className={`min-w-[124px] ${
                selectedTag === "other"
                  ? "bg-yard-primary text-[#EEEEE6]"
                  : "bg-[#EDF0EE] text-yard-primary"
              } p-2.5 rounded-sm font-medium font-sen text-[15px] border-[1px] border-[#C7CFC9] whitespace-nowrap cursor-pointer`}
            >
              Other
            </button>
          </div>
        </div>

        {/*Media*/}
        <div className="flex items-start my-4 2xl:my-8 gap-10">
          <div className="w-[166px] flex flex-col items-center gap-5">
            <div>
              <label
                htmlFor="media"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="w-full stack stack-top">
                  {selectedFiles.length > 0 ? (
                    selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="relative flex flex-col h-[213px] items-center justify-center border-[1px] border-solid border-[#BFBFBF] rounded2px overflow-hidden card"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Optional: Remove button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault(); // Prevent default behavior
                            e.stopPropagation(); // Stop event from bubbling to label
                            setSelectedFiles(
                              selectedFiles.filter((_, i) => i !== index),
                            );
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                        {/* Optional: File name */}
                        <p className="absolute bottom-2 left-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded truncate">
                          {file.name}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div
                      className="flex flex-col h-[213px] items-center justify-center border-[1px] border-dashed border-[#BFBFBF] bg-cover bg-center py-3 px-5 cursor-pointer rounded2px"
                      style={{ backgroundImage: `url(${viewImage?.imageUrl})` }}
                    >
                      <Image
                        src={"/icons/upload.svg"}
                        width={18}
                        height={18}
                        alt="Upload Icon"
                      />
                      <p className="w-[126px] text-xs text-[#999999] text-center leading-5 tracking-[0.5px] mt-4 mb-1">
                        Choose up to 5 images or drag &amp; drop them here
                      </p>
                      <p className="w-[126px] text-[10px] text-[#BFBFBF] text-center leading-5 tracking-[0.5px]">
                        JPEG &amp; PNG up to 10mb
                      </p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*,video/*"
                  id="media"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              {selectedFiles.length > 0 && (
                <small className="font-sen text-yard-primary text-xs">
                  {selectedFiles.length} selected
                </small>
              )}
            </div>

            <div className="bg-[#8A38F51A] flex items-start rounded-[5px] p-2.5 gap-1">
              <img
                src={"/icons/party.svg"}
                width={16}
                height={16}
                alt="Party Icon"
              />
              <p className="text-[#999999] leading-[22px] tracking-[0.5px] text-sm">
                Please link media to the event it orignate from
              </p>
            </div>
          </div>

          {/*Divider*/}
          <div className="w-[1px] h-[450px] bg-[#EDF0EE] hidden md:block"></div>

          {/*Form*/}
          <form
            className="w-[454px] flex flex-col gap-4"
            onSubmit={handleUpdateGallery}
          >
            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="title"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Enter title of media
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={viewImage?.title}
                  onChange={(e) => (galleryInputs.title = e.target.value)}
                  placeholder="Enter title of media"
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
                  defaultValue={viewImage?.description || ""}
                  onChange={(e) => (galleryInputs.description = e.target.value)}
                  placeholder="150 words"
                  className="w-full h-[147px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                ></textarea>
              </div>
            </div>

            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex border-[1px] border-[#BFBFBF] h-[52px] rounded2px p-3 items-center">
                <Image
                  src={"/icons/event.svg"}
                  width={16}
                  height={16}
                  alt="Event Icon"
                />

                <select
                  id="event"
                  name="event"
                  defaultValue={viewImage?.category || "null"}
                  onChange={(e) => (galleryInputs.eventId = e.target.value)}
                  className="w-full p-3 text-[#999999] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                >
                  <option value={"info"} disabled>
                    Connect media to an event
                  </option>
                  <option value="null">No event attached</option>
                  {events.map((event) => (
                    <option key={event.id as string} value={event.id as string}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group flex items-center gap-3">
              <div className="w-full input-group flex border-[1px] border-[#BFBFBF] h-[52px] rounded2px p-3 items-center">
                <Image
                  src={"/icons/calendar2.svg"}
                  width={16}
                  height={16}
                  alt="Event Icon"
                />

                <input
                  type="date"
                  name="date"
                  defaultValue={moment(viewImage?.mediaDate).format(
                    "YYYY-MM-DD",
                  )}
                  onChange={(e) => setMediaDate(e.target.value)}
                  onBlur={(e) => setMediaDate(e.target.value)}
                  onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                  className="w-full p-3 text-[#999999] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px] [&::-webkit-calendar-picker-indicator]:hidden [&::-moz-calendar-picker-indicator]:hidden"
                />
              </div>
              <label
                htmlFor="today"
                className="w-[209px] flex gap-3 bg-[#C7CFC9] items-center rounded-[4px] h-[52px] px-2.5 border-[1px] border-[#C7CFC9] transition-colors duration-500 hover:border-yard-dark-primary hover:bg-[#EDF0EE] has-[:checked]:bg-[#EDF0EE] cursor-pointer"
              >
                <input
                  type="radio"
                  id="today"
                  value={"today"}
                  onChange={() => setMediaDate(moment().format("YYYY-MM-DD"))}
                  name="today"
                  className="radio radio-sm peer border-2 border-yard-primary checked:border-yard-dark-primary checked:text-yard-dark-primary"
                />
                <div>
                  <h3 className="text-xl text-yard-primary leading-9">Today</h3>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center cta-btn bg-yard-primary text-yard-milk group relative overflow-hidden rounded-[5px] cursor-pointer"
            >
              <span className="z-40">Update Image</span>
              <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>
          </form>
        </div>
      </Modal>

      {/*Confirmation Modal*/}
      <Modal isOpen={confModal} useDefaultWidth>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Delete Media
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setConfModal(false)}
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
        <p className="text-[#737373] font-medium text-[25px] mt-5">
          Are you sure you want this media deleted?
        </p>

        <div className="w-full flex items-center gap-5">
          <button
            className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] mt-5 cursor-pointer"
            onClick={() => {
              setPicModal(false);
              setConfModal(false);
              setViewImage(undefined);
            }}
          >
            <span className="z-40 font-sen">Cancel</span>
            <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>

          <button
            onClick={() => handleDeleteImage(viewImage?.id as string)}
            className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-[#8C5C5C] text-[#EEEEE6] group relative overflow-hidden rounded-[5px] mt-5 cursor-pointer"
          >
            <span className="z-40 font-sen">Delete</span>
            <div className="absolute top-0 left-0 bg-[#6d4a4aa6] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>
        </div>
      </Modal>
    </main>
  );
}
