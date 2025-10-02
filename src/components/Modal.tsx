"use client";

interface IProps {
  isOpen: boolean;
  // onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, children }: IProps) {
  return (
    <>
      {/*<button
        className="btn"
        onClick={() => document.getElementById("my_modal_2").showModal()}
      >
        open modal
      </button>*/}
      <dialog
        id="my_modal_2"
        className={`modal flex flex-col md:flex-row justify-center px-4 py-10 md:p-10 ${isOpen ? "modal-open" : ""}`}
      >
        <div className="flex flex-col items-start px-10 py-5 justify-start bg-yard-white rounded-lg w-full md:w-[800px]">
          {children}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
