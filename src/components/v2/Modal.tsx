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

    if (!isOpen) return null;

    // Portal to document.body so `fixed` positioning isn't hijacked by an
    // animated ancestor (e.g. a framer-motion element with a transform, which
    // becomes the containing block for fixed descendants).
    return createPortal(
        <div onClick={handleClose} className="w-screen top-0 left-0 h-screen fixed bg-black/60 backdrop-blur-[1px] z-100 flex items-center justify-center">
            <div onClick={(e)=> e.stopPropagation()} className="w-fit h-fit scale-100 duration-500 flex flex-col items-center justify-center">
                {children}
            </div>
        </div>,
        document.body
    );
}