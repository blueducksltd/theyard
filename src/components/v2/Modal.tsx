import { useEffect } from "react";

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

    return (
        <div onClick={handleClose} className="w-screen top-0 left-0 h-screen fixed bg-black/20 z-100 flex items-center justify-center">
            <div onClick={(e)=> e.stopPropagation()} className="w-fit h-fit scale-100 duration-500 flex flex-col items-center justify-center">
                {children}
            </div>
        </div>
    );
}