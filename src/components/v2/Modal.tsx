import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, children, handleClose }: { isOpen: boolean; children: React.ReactNode, handleClose: ()=>void; }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        // Cleanup: restore scroll on unmount
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen, handleClose]);

    if (!isOpen) return null;

    // Portal to document.body so `fixed` positioning isn't hijacked by an
    // animated ancestor (e.g. a framer-motion element with a transform, which
    // becomes the containing block for fixed descendants).
    return createPortal(
        <div onClick={handleClose} role="dialog" aria-modal="true" className="w-screen top-0 left-0 h-screen fixed bg-black/60 backdrop-blur-[1px] z-100 flex items-center justify-center">
            {/* No overflow-* here: clipping one axis clips both, which would hide
                children positioned outside the wrapper (e.g. the lightbox's
                md:-left-16 / md:-right-16 nav buttons). Panels scroll themselves. */}
            <div onClick={(e)=> e.stopPropagation()} className="w-fit h-fit max-h-screen flex flex-col items-center justify-center">
                {children}
            </div>
        </div>,
        document.body
    );
}