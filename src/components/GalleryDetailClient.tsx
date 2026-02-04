/*eslint-disable @next/next/no-img-element*/
"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Modal from "@/components/Modal";
import { IGallery } from "@/types/Gallery";
import { loadFromLS } from "@/util/helper";
import moment from "moment";
import React from "react";
import { toast } from "react-toastify";

interface IProps {
    title: string;
}

const GalleryDetailClient = ({ title: initialTitle }: IProps) => {
    const [galleryItem, setGalleryItem] = React.useState<IGallery | null>(null);
    const [shareModal, setShareModal] = React.useState<boolean>(false);
    const [shareUrl, setShareUrl] = React.useState<string>("");

    React.useEffect(() => {
        const selected = loadFromLS("selectedGallery");
        if (selected) {
            setGalleryItem(selected);
            if (typeof window !== "undefined") {
                const origin = window.location.origin;
                setShareUrl(`${origin}/gallery/${selected.title}`);
            }
        }
    }, []);

    const handleShare = (platform: string) => {
        if (!galleryItem) return;

        const url = shareUrl.replaceAll(" ", "-");
        const text = encodeURIComponent(galleryItem.title);

        let shareLink = "";

        switch (platform) {
            case "whatsapp":
                shareLink = `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`;
                break;
            case "facebook":
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case "twitter":
                shareLink = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`;
                break;
            case "linkedin":
                shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            default:
                return;
        }

        window.open(shareLink, "_blank", "noopener,noreferrer");
    };

    if (!galleryItem) {
        return (
            <main className={"w-full h-screen bg-yard-white flex flex-col"}>
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-yard-primary font-playfair text-2xl">Loading Gallery Item...</p>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className={"w-full h-max bg-yard-white"}>
            <Navbar />
            {/*Content */}
            <section className={"py-20 px-4 md:px-16 w-full"}>
                <main className="pt-10 md:my-4 md:py-16">
                    <header
                        className="w-full h-[300px] md:h-[700px] bg-cover bg-center rounded-[10px] overflow-hidden shadow-lg relative group"
                        style={{
                            backgroundImage: `url(${galleryItem.imageUrl || "/gallery/gallery.svg"})`,
                        }}
                    >
                        <div
                            className="w-10 h-10 md:w-12 md:h-12 border-2 border-yard-milk flex justify-center items-center rounded2px absolute bottom-5 right-5 cursor-pointer bg-black/20 hover:bg-black/40 transition-all z-10"
                            onClick={() => setShareModal(true)}
                        >
                            <img src={"/icons/share.svg"} alt="share icon" className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                    </header>

                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mt-8 md:mt-10">
                            <h2 className="text-yard-primary font-playfair font-bold text-[32px] md:text-[40px] leading-tight">
                                {galleryItem.title || initialTitle}
                            </h2>
                            <span className="font-[400] leading-[22px] font-lato text-[16px] text-gray-500 mt-2 md:mt-0">
                                {moment(galleryItem.mediaDate).format("DD MMMM YYYY")}
                            </span>
                        </div>

                        <div className="w-24 h-1 bg-yard-primary mb-8 mt-4 rounded-full"></div>

                        <div className="bg-[#F9FAFB] p-6 md:p-10 rounded-[15px] border border-[#EEEEEE]">
                            <p className="paragraph text-lg leading-relaxed text-gray-700">
                                {galleryItem.description}
                            </p>
                        </div>

                        <div className="mt-12 flex flex-wrap items-center gap-4">
                            <span className="px-4 py-2 bg-yard-primary text-white text-sm font-lato rounded-full">
                                {galleryItem.category}
                            </span>
                            {galleryItem.event && (
                                <span className="px-4 py-2 bg-[#EDF0EE] text-yard-primary text-sm font-lato rounded-full border border-yard-primary/10">
                                    Associated Event
                                </span>
                            )}
                            <button
                                onClick={() => setShareModal(true)}
                                className="px-4 py-2 bg-[#F3F4F6] text-gray-600 text-sm font-lato rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"
                            >
                                <img src="/icons/share.svg" alt="share" className="w-4 h-4 opacity-70" />
                                Share this image
                            </button>
                        </div>
                    </div>
                </main>
            </section>

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
                            <img src={"/icons/cancel.svg"} alt="Close Icon" className="z-40" />
                            <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
                        </div>
                    </div>
                </section>
                <div className="flex gap-5 mt-8 justify-center w-full">
                    {[
                        { id: "whatsapp", icon: "/icons/whatsapp.svg", name: "WhatsApp" },
                        { id: "facebook", icon: "/icons/facebook.svg", name: "Facebook" },
                        { id: "twitter", icon: "/icons/x.svg", name: "X" },
                        { id: "linkedin", icon: "/icons/linkedin.svg", name: "LinkedIn" },
                    ].map((platform) => (
                        <button
                            key={platform.id}
                            className="w-[50px] h-[50px] bg-[#EDF0EE] p-[11.11px] flex items-center justify-center rounded-[2.78px] group relative overflow-hidden cursor-pointer"
                            onClick={() => handleShare(platform.id)}
                        >
                            <img src={platform.icon} width={23} height={23} className="z-40" alt={`${platform.name} Icon`} />
                            <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    className="w-full flex justify-center cta-btn bg-base-100 text-yard-primary group relative overflow-hidden rounded-[5px] mt-5 cursor-pointer py-3"
                    onClick={() => {
                        navigator.clipboard.writeText(shareUrl.replaceAll(" ", "-"));
                        toast.success(`${galleryItem?.title} copied to clipboard`);
                    }}
                >
                    <span className="z-40">Copy link</span>
                    <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
                </button>
            </Modal>

            <Footer />
        </main>
    );
};

export default GalleryDetailClient;

