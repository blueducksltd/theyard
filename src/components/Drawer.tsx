"use client";

interface IDrawerProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  width?: string;
  position?: "left" | "right";
}

export default function Drawer({
  isOpen,
  onClose,
  children,
  width = "w-80",
  position = "right",
}: IDrawerProps) {
  return (
    <div className={`drawer ${position === "right" ? "drawer-end" : ""}`}>
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        readOnly
      />
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={onClose}
        ></label>
        <div
          className={`menu bg-white min-h-full ${width} p-4 flex flex-col items-start justify-start rounded-l-xl`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
