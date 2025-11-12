"use client";
{
  /*eslint-disable @next/next/no-img-element*/
}
import { IGallery } from "@/types/Gallery";
import { ITag } from "@/types/Tag";
import { getGallery, getTags } from "@/util";
import moment from "moment";
import Link from "next/link";
import React from "react";
import Modal from "../Modal";

export default function Grid() {
  const [gallery, setGallery] = React.useState<IGallery[]>([]);
  const [_gallery, setTempGallery] = React.useState<IGallery[]>([]);
  const [tags, setTags] = React.useState<ITag[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [shareModal, setShareModal] = React.useState<boolean>(false);
  const [selectedGallery, setSelectedGallery] = React.useState<IGallery | null>(
    null,
  );
  const [shareUrl, setShareUrl] = React.useState<string>("");

  const handleGallery = (value: string) => {
    // Remove async, not needed
    if (value === "all") {
      setGallery(_gallery);
    } else {
      const filteredGallery = _gallery.filter(
        (image) => image.category === value, // Add optional chaining
      );
      setGallery(filteredGallery);
    }
  };

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [galleryRes, tagsRes] = await Promise.all([
          getGallery(),
          getTags(),
        ]);

        setGallery(galleryRes?.data?.gallery || []);
        setTempGallery(galleryRes?.data?.gallery || []);
        setTags(tagsRes?.data?.tags || []);
      } catch (error) {
        console.error("Error loading data:", error);
        setGallery([]);
        setTempGallery([]);
        setTags([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <main>
      <div className="flex mx-auto border-[1px] border-[#999999] w-[240px] h-[44px] rounded2px p-3">
        <select
          onChange={(e) => handleGallery(e.target.value)}
          className="w-full outline-none text-[#999999] text-sm"
        >
          <option value="all">All Filters</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.name}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      <section className="w-full flex flex-wrap items-center my-5 md:mt-10 gap-1">
        {gallery.length > 0 &&
          gallery.map((image) => (
            <div
              key={image.id}
              className="relative overflow-hidden group w-max flex-grow"
            >
              <img
                src={image.imageUrl}
                alt="Gallery"
                className="h-[260px] 2xl:h-[300px] w-full object-cover"
              />
              {/*Inner Hover - same as before*/}
              <div className="absolute w-full h-full p-4 bg-[#090F10CC] top-48 md:top-0 left-0 transition-all duration-500 md:translate-y-full group-hover:translate-y-0 opacity-80">
                <p className="text-yard-milk transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 absolute top-2 md:top-auto md:bottom-12 md:relative md:mt-12">
                  {moment(image.mediaDate).format("d/MM/YYYY")}
                  <img
                    src={"/featured-line.svg"}
                    alt="featured-line"
                    className="-mt-2 w-22 md:-translate-x-full transition-all delay-300 duration-500 group-hover:translate-x-0"
                  />
                </p>
                <Link
                  href={`${image.event == null ? "#" : `/event/${encodeURIComponent(image.event.id as string)}`}`}
                  className="w-max h-max group absolute top-8 md:top-auto md:bottom-10 md:relative text-yard-milk font-playfair font-[700] text-xl md:text-[28px] leading-[36px] tracking-[-0.1px]"
                >
                  {image.title}
                  <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-gray-600 transition-all duration-500 group-hover:w-full"></span>
                </Link>
                <p className="paragraph hidden md:block text-gray-200 w-[340px] transition-all delay-300 duration-500 translate-y-full group-hover:translate-y-0 -mt-7">
                  {image.description}
                </p>
                <div
                  className="w-7 h-7 md:w-9 md:h-9 border-2 border-yard-milk flex justify-center items-center rounded2px absolute top-7 md:top-auto md:bottom-5 transition-all delay-300 duration-500 md:translate-y-full group-hover:translate-y-0 right-5 md:left-5 cursor-pointer"
                  onClick={() => {
                    setSelectedGallery(image);
                    setShareModal(true);
                    const origin = window.location.origin;
                    const shareUrl = `${origin}/gallery/${image.title}`;
                    setShareUrl(shareUrl);
                  }}
                >
                  <img src={"/icons/share.svg"} alt="share icon" />
                </div>
              </div>
            </div>
          ))}
      </section>

      {/*pagination*/}
      <div className="flex justify-center items-center mt-10 gap-4">
        <button className="w-[145px] h-9 rounded2px bg-[#EDF0EE] text-[#D3D3D0] text-[16px] p-2 flex items-center gap-1">
          <img src={"/icons/arrow-left.svg"} alt="icon-left" />
          Previous
        </button>
        <button className="w-[145px] h-9 rounded2px bg-[#EDF0EE] text-[#222D24] text-[16px] p-2 flex items-center gap-1">
          Next Page
          <img src={"/icons/arrow-right.svg"} alt="icon-left" />
        </button>
      </div>

      {/*Share Gallery Modal*/}
      <Modal isOpen={shareModal} useDefaultWidth>
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
          <button
            className="w-[50px] h-[50px] bg-[#EDF0EE] p-[11.11px] flex items-center justify-center rounded-[2.78px] text-[#EEEEE6] group relative overflow-hidden cursor-pointer"
            onClick={() => {
              window.open(
                `https://wa.me/?text=${selectedGallery?.title}%20${shareUrl}`,
                "_blank",
                "width=600,height=400",
              );
            }}
          >
            <img
              src={"/icons/whatsapp.svg"}
              width={23}
              height={23}
              className="z-40"
              alt="WhatsApp Icon"
            />
            <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>

          <button
            className="w-[50px] h-[50px] bg-[#EDF0EE] p-[11.11px] flex items-center justify-center rounded-[2.78px] text-[#EEEEE6] group relative overflow-hidden cursor-pointer"
            onClick={() => {
              window.open(
                ` https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
                "_blank",
                "width=600,height=400",
              );
            }}
          >
            <img
              src={"/icons/facebook.svg"}
              width={23}
              height={23}
              className="z-40"
              alt="Facebook Icon"
            />
            <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>

          <button
            className="w-[50px] h-[50px] bg-[#EDF0EE] p-[11.11px] flex items-center justify-center rounded-[2.78px] text-[#EEEEE6] group relative overflow-hidden cursor-pointer"
            onClick={() => {
              window.open(
                `https://twitter.com/intent/tweet?url=${shareUrl}&text=${selectedGallery?.title}`,
                "_blank",
                "width=600,height=400",
              );
            }}
          >
            <img
              src={"/icons/x.svg"}
              width={23}
              height={23}
              className="z-40"
              alt="X Icon"
            />
            <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>

          <button
            className="w-[50px] h-[50px] bg-[#EDF0EE] p-[11.11px] flex items-center justify-center rounded-[2.78px] text-[#EEEEE6] group relative overflow-hidden cursor-pointer"
            onClick={() => {
              window.open(
                `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
                "_blank",
                "width=600,height=400",
              );
            }}
          >
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
          className="w-full flex justify-center cta-btn bg-base-100 text-yard-primary group relative overflow-hidden rounded-[5px] mt-5 cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(shareUrl.replaceAll(" ", "-"));
            toast.success(`${selectedGallery?.title} copied to clipboard`);
          }}
        >
          <span className="z-40">Copy link</span>
          <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
        </button>
      </Modal>
    </main>
  );
}
