import { Link2, X } from 'lucide-react';
import React from 'react'
import { RiFacebookBoxFill, RiInstagramFill, RiTiktokLine, RiWhatsappLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { motion } from "motion/react";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    title: string;
}

const SHARE_TARGETS = [
    { id: 'copy', label: 'Copy Link', Icon: Link2, className: 'bg-gray-100 text-gray-700' },
    { id: 'facebook', label: 'Facebook', Icon: RiFacebookBoxFill, className: 'bg-[#1877F2] text-white' },
    { id: 'instagram', label: 'Instagram', Icon: RiInstagramFill, className: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white' },
    { id: 'tiktok', label: 'TikTok', Icon: RiTiktokLine, className: 'bg-black text-white' },
    { id: 'whatsapp', label: 'Whatsapp', Icon: RiWhatsappLine, className: 'bg-black text-white' },
] as const;

function ShareModal({ isOpen, onClose, url, title }: ShareModalProps) {
    if (!isOpen) return null;

    const handleShare = async (id: (typeof SHARE_TARGETS)[number]['id']) => {
        switch (id) {
            case "copy":
                try {
                    await navigator.clipboard.writeText(url);
                    toast.success('Link copied to clipboard');
                } catch {
                    toast.error('Could not copy link');
                }
                break;

            case "facebook":
                window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                    '_blank',
                    'noopener,noreferrer,width=600,height=600'
                );
                break;

            case "whatsapp":
                window.open(
                    `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
                    '_blank',
                    'noopener,noreferrer'
                );
                break;

            // Instagram and TikTok don't expose a web share endpoint for links —
            // best available UX is copying the link and prompting the user to paste it in-app.
            case "instagram":
                try {
                    await navigator.clipboard.writeText(url);
                    toast.info('Link copied — paste it into Instagram');
                } catch {
                    toast.error('Could not copy link');
                }
                break;

            case "tiktok":
                try {
                    await navigator.clipboard.writeText(url);
                    toast.info('Link copied — paste it into TikTok');
                } catch {
                    toast.error('Could not copy link');
                }
                break;
        }
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-100 flex items-end md:items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white w-full md:w-100 rounded-t-2xl md:rounded-lg p-5 flex flex-col gap-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h2 className="font-playfair-display text-primaryGreen font-medium truncate pr-4">
                        Share {title}
                    </h2>
                    <button type="button" onClick={onClose} aria-label="Close share modal" className="cursor-pointer shrink-0">
                        <X size={18} />
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    {SHARE_TARGETS.map(({ id, label, Icon, className }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => handleShare(id)}
                            className="flex flex-col items-center gap-2 cursor-pointer"
                        >
                            <span className={`w-12 h-12 rounded-full flex items-center justify-center ${className}`}>
                                <Icon size={20} />
                            </span>
                            <span className="text-xs font-lato text-[#1A1A1A]">{label}</span>
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

export default ShareModal;