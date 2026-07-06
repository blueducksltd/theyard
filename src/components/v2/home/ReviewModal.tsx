"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { createReview } from "@/util";
import { IReviewClient } from "@/types/Review";

const COMMENT_LIMIT = 200;

type Status = "idle" | "submitting" | "success";

export default function ReviewModal({
    isOpen,
    onClose,
    onSubmitted,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmitted?: (review: IReviewClient) => void;
}) {
    const [name, setName] = useState("");
    const [comment, setComment] = useState("");
    const [status, setStatus] = useState<Status>("idle");
    const dialogRef = useRef<HTMLDivElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const isBusy = status !== "idle";
    const canSubmit = name.trim().length > 0 && comment.trim().length > 0 && !isBusy;

    // Lock body scroll + reset form whenever the modal opens
    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = "hidden";
        setName("");
        setComment("");
        setStatus("idle");

        const focusTimer = window.setTimeout(() => nameInputRef.current?.focus(), 150);

        return () => {
            document.body.style.overflow = "";
            window.clearTimeout(focusTimer);
        };
    }, [isOpen]);

    // Escape to close, Tab to stay trapped within the dialog
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isBusy) {
                onClose();
                return;
            }

            if (e.key === "Tab" && dialogRef.current) {
                const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
                    'button, input, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusable.length === 0) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isBusy, onClose]);

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value.slice(0, COMMENT_LIMIT));
        const el = textareaRef.current;
        if (el) {
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        setStatus("submitting");
        try {
            const response = await createReview({ name: name.trim(), location: "", comment: comment.trim() });
            if (!response.success) throw new Error(response.message);

            setStatus("success");
            onSubmitted?.(response.data.review);
            window.setTimeout(() => onClose(), 900);
        } catch (error) {
            console.error(error);
            setStatus("idle");
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-100 flex items-end md:items-center justify-center bg-black/30 backdrop-blur-sm px-0 md:px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => !isBusy && onClose()}
                >
                    <motion.div
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="review-modal-title"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full md:max-w-[560px] max-h-[92vh] overflow-y-auto rounded-t-[24px] md:rounded-[24px] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] p-6 md:p-8"
                        initial={{ opacity: 0, y: 40, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 340, damping: 32, mass: 0.9 }}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 id="review-modal-title" className="font-playfair-display text-2xl font-semibold text-[#1D1D1F]">
                                    Write a Review
                                </h2>
                                <p className="font-sen text-[13px] text-[#86868B] mt-1">
                                    We&apos;d love to hear about your experience.
                                </p>
                            </div>
                            <motion.button
                                type="button"
                                aria-label="Close"
                                onClick={onClose}
                                disabled={isBusy}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="shrink-0 w-11 h-11 rounded-full bg-[#F2F2F4] hover:bg-[#E8E8EA] flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer"
                            >
                                <X size={18} className="text-[#1D1D1F]" />
                            </motion.button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="review-name" className="font-sen text-[13px] font-medium text-[#1D1D1F]">
                                    Your Name
                                </label>
                                <input
                                    ref={nameInputRef}
                                    id="review-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    disabled={isBusy}
                                    className="font-sen w-full h-[52px] rounded-2xl px-4 bg-[#F2F2F4] text-[15px] text-[#1D1D1F] placeholder:text-[#A1A1A6] outline-none border border-transparent transition-all duration-200 focus:bg-white focus:border-[#007AFF]/50 focus:ring-4 focus:ring-[#007AFF]/12 disabled:opacity-60"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="review-comment" className="font-sen text-[13px] font-medium text-[#1D1D1F]">
                                    Your Review
                                </label>
                                <div className="relative">
                                    <textarea
                                        ref={textareaRef}
                                        id="review-comment"
                                        value={comment}
                                        onChange={handleCommentChange}
                                        placeholder="Tell us about your experience..."
                                        disabled={isBusy}
                                        rows={4}
                                        maxLength={COMMENT_LIMIT}
                                        className="font-sen w-full min-h-[120px] resize-none rounded-2xl px-4 py-3.5 bg-[#F2F2F4] text-[15px] leading-relaxed text-[#1D1D1F] placeholder:text-[#A1A1A6] outline-none border border-transparent transition-all duration-200 focus:bg-white focus:border-[#007AFF]/50 focus:ring-4 focus:ring-[#007AFF]/12 disabled:opacity-60"
                                    />
                                    <span className="pointer-events-none absolute bottom-3 right-4 font-sen text-[11px] text-[#A1A1A6]">
                                        {comment.length}/{COMMENT_LIMIT}
                                    </span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="sticky bottom-0 -mx-6 md:mx-0 mt-2 flex items-center justify-end gap-3 bg-white px-6 md:px-0 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:pb-0">
                                <motion.button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isBusy}
                                    whileHover={{ y: -1 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="font-sen min-w-[44px] min-h-[44px] px-5 rounded-full bg-[#F2F2F4] text-[#1D1D1F] font-medium text-[14px] hover:bg-[#E8E8EA] transition-colors disabled:opacity-40 cursor-pointer"
                                >
                                    Cancel
                                </motion.button>

                                <motion.button
                                    type="submit"
                                    disabled={!canSubmit}
                                    whileHover={canSubmit ? { y: -1 } : undefined}
                                    whileTap={canSubmit ? { scale: 0.97 } : undefined}
                                    className="font-sen min-w-40 min-h-11 px-6 rounded-full bg-[#007AFF] text-white font-medium text-[14px] shadow-[0_8px_20px_-6px_rgba(0,122,255,0.5)] hover:shadow-[0_10px_24px_-6px_rgba(0,122,255,0.6)] transition-shadow disabled:opacity-40 disabled:shadow-none cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <AnimatePresence mode="wait" initial={false}>
                                        {status === "idle" && (
                                            <motion.span
                                                key="idle"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                Submit Review
                                            </motion.span>
                                        )}
                                        {status === "submitting" && (
                                            <motion.span
                                                key="submitting"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="flex items-center gap-2"
                                            >
                                                <Loader2 size={16} className="animate-spin" />
                                                Submitting...
                                            </motion.span>
                                        )}
                                        {status === "success" && (
                                            <motion.span
                                                key="success"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="flex items-center gap-2"
                                            >
                                                <Check size={16} />
                                                Submitted!
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
