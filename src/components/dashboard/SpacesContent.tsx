/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { FormEvent, useEffect } from "react";
import Modal from "../Modal";
import { SafeSpace } from "@/types/Space";
import { createSpace, deleteSpaces, getSpaces, updateSpace } from "@/util";
import { toast } from "react-toastify";
import Image from "next/image";

type ActionButtonVariant = "edit" | "delete";

const ACTION_BUTTON_STYLES: Record<ActionButtonVariant, string> = {
  edit: "bg-yard-primary text-white hover:bg-yard-dark-primary",
  delete: "bg-[#FDECEC] text-[#B42318] hover:bg-[#FBD5D5]",
};

const ACTION_BUTTON_ICON: Record<ActionButtonVariant, { src: string; alt: string }> = {
  edit: { src: "/icons/password-check.svg", alt: "Edit Icon" },
  delete: { src: "/icons/trash-black.svg", alt: "Delete Icon" },
};

function ActionButton({
  variant,
  onClick,
  children,
}: {
  variant: ActionButtonVariant;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const icon = ACTION_BUTTON_ICON[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded2px px-3 py-2 text-xs font-medium transition-colors duration-200 ${ACTION_BUTTON_STYLES[variant]}`}
    >
      <Image
        src={icon.src}
        width={17}
        height={17}
        alt={icon.alt}
        className="invert brightness-0"
      />
      <span>{children}</span>
    </button>
  );
}

const DEFAULT_INPUTS = {
  name: "",
  guestLimit: "50",
};

export default function SpacesContent() {
  const [spaces, setSpaces] = React.useState<SafeSpace[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [addModalOpen, setAddModalOpen] = React.useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = React.useState<boolean>(false);
  const [selectedSpace, setSelectedSpace] = React.useState<SafeSpace | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; label: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const [inputs, setInputs] = React.useState<{ name: string; guestLimit: string }>(DEFAULT_INPUTS);

  const clearInputs = () => {
    setInputs(DEFAULT_INPUTS);
    setSelectedSpace(null);
  };

  const fetchSpaces = async () => {
    try {
      const response = await getSpaces();
      if (response?.data?.spaces) {
        setSpaces(response.data.spaces);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load spaces.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  // ─── Add ───────────────────────────────────────────────────────────────────
  const handleAddSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputs.name.trim()) return toast.error("Space name is required.");
    if (!inputs.guestLimit || Number(inputs.guestLimit) < 1) {
      return toast.error("Please enter a valid guest limit (minimum 1).");
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Creating space...", { position: "bottom-right" });

    try {
      const formData = new FormData();
      formData.append("name", inputs.name.trim());
      formData.append("guestLimit", inputs.guestLimit);

      const response = await createSpace(formData);
      if (response.success) {
        toast.update(toastId, {
          render: "Space created successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          position: "bottom-right",
        });
        setAddModalOpen(false);
        clearInputs();
        await fetchSpaces();
      } else {
        toast.update(toastId, {
          render: response.message || "Failed to create space.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          position: "bottom-right",
        });
      }
    } catch (error: any) {
      toast.update(toastId, {
        render: error?.response?.data?.message || "Failed to create space.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        position: "bottom-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Edit ──────────────────────────────────────────────────────────────────
  const openEditModal = (space: SafeSpace) => {
    setSelectedSpace(space);
    setInputs({
      name: space.name || "",
      guestLimit: String(space.guestLimit ?? 50),
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSpace) return;
    if (!inputs.name.trim()) return toast.error("Space name is required.");
    if (!inputs.guestLimit || Number(inputs.guestLimit) < 1) {
      return toast.error("Please enter a valid guest limit.");
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Updating space...", { position: "bottom-right" });

    try {
      const formData = new FormData();
      formData.append("name", inputs.name.trim());
      formData.append("guestLimit", inputs.guestLimit);

      const response = await updateSpace(formData, selectedSpace.id);
      if (response.success) {
        toast.update(toastId, {
          render: "Space updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          position: "bottom-right",
        });
        setEditModalOpen(false);
        clearInputs();
        await fetchSpaces();
      } else {
        toast.update(toastId, {
          render: response.message || "Failed to update space.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          position: "bottom-right",
        });
      }
    } catch (error: any) {
      toast.update(toastId, {
        render: error?.response?.data?.message || "Failed to update space.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        position: "bottom-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    const toastId = toast.loading("Deleting space...", { position: "bottom-right" });

    try {
      const response = await deleteSpaces({ id: deleteTarget.id });
      if (response.success) {
        toast.update(toastId, {
          render: "Space deleted successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          position: "bottom-right",
        });
        setDeleteTarget(null);
        await fetchSpaces();
      } else {
        toast.update(toastId, {
          render: response.message || "Failed to delete space.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          position: "bottom-right",
        });
      }
    } catch (error: any) {
      toast.update(toastId, {
        render: error?.response?.data?.message || "Failed to delete space.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        position: "bottom-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 py-4 md:h-[600px] 2xl:h-[770px] overflow-y-auto">
      <section className="flex flex-col gap-5">
        {/* Header row */}
        <div className="flex items-center justify-between p-5 gap-5">
          {/* Count card */}
          <div className="w-[745px] flex gap-5">
            <div className="w-full px-4 py-5 rounded-sm border-[1px] border-[#C7CFC9] bg-[#E4E8E5] flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-[52px] leading-9 text-[#66655E]">
                  {loading ? "—" : spaces.length}
                </h2>
              </div>
              <p className="font-medium leading-[22px] tracking-[0.5px] text-[#737373]">
                Available spaces
              </p>
            </div>
          </div>

          {/* Add button */}
          <button
            type="button"
            onClick={() => {
              clearInputs();
              setAddModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-[4px] border-[1px] border-yard-primary p-3 text-yard-primary cursor-pointer group relative overflow-hidden"
          >
            <Image
              src={"/icons/add.svg"}
              width={16}
              height={16}
              className="z-40"
              alt="Add Icon"
            />
            <span className="leading-6 tracking-[0.5px] text-[16px] z-40">
              Add a space
            </span>
            <div className="absolute top-0 left-0 bg-[#E4E8E5] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
          </button>
        </div>
      </section>

      {/* Spaces list */}
      <section className="w-full p-4">
        <div className="flex gap-3 items-center">
          <h2 className="text-[#66655E] font-semibold text-[22px] leading-[30px]">
            All spaces
          </h2>
          <p className="text-[#999999] font-medium leading-[22px] tracking-[0.5px]">
            {spaces.length} available
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-yard-primary border-t-transparent"></div>
          </div>
        ) : spaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-[#C7CFC9] bg-white p-12 text-center mt-5">
            <Image src="/icons/box-tick.svg" width={48} height={48} alt="Empty" className="opacity-40" />
            <h3 className="mt-4 text-[#66655E] font-semibold text-base">No spaces created yet</h3>
            <p className="mt-1 text-[#999999] font-medium text-sm leading-[22px] tracking-[0.5px]">
              Click &quot;Add a space&quot; to create your first venue space.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 mt-5 gap-5">
            {spaces.toReversed().map((space) => (
              <div key={space.id} className="flex flex-col gap-3">
                {/* Placeholder banner */}
                <div className="w-full h-[224px] bg-[#EDF0EE] rounded2px flex items-center justify-center">
                  <span className="text-4xl">🏟️</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[#66655E] text-[16px] font-semibold leading-6 tracking-[0.5px]">
                      {space.name}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#EDF0EE] text-yard-primary font-medium w-max">
                      {space.guestLimit ?? 50} guests/day limit
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <ActionButton
                      variant="edit"
                      onClick={() => openEditModal(space)}
                    >
                      Edit
                    </ActionButton>
                    <ActionButton
                      variant="delete"
                      onClick={() => setDeleteTarget({ id: space.id, label: space.name })}
                    >
                      Delete
                    </ActionButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Add Space Modal ── */}
      <Modal isOpen={addModalOpen}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Add a new space
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => {
                clearInputs();
                setAddModalOpen(false);
              }}
            >
              <Image
                src={"/icons/cancel.svg"}
                width={16}
                height={16}
                alt="Close Icon"
                className="z-40"
              />
              <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
            </div>
          </div>
        </section>

        <div className="w-full flex items-start my-4 2xl:my-8 gap-10">
          <form
            className="w-full flex flex-col gap-5"
            onSubmit={handleAddSubmit}
          >
            {/* Space Name */}
            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="spaceName"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Space name *
                </label>
                <input
                  type="text"
                  id="spaceName"
                  required
                  value={inputs.name}
                  onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                  placeholder="e.g. Outdoor Space, Private Space"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            {/* Guest Limit */}
            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="guestLimit"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Daily guest limit *
                </label>
                <input
                  type="number"
                  id="guestLimit"
                  min="1"
                  required
                  value={inputs.guestLimit}
                  onChange={(e) => setInputs({ ...inputs, guestLimit: e.target.value })}
                  placeholder="e.g. 50"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
                <p className="text-xs text-[#999999] leading-5 tracking-[0.5px]">
                  When total booked guests for this space reach this number on a given day, no more bookings are allowed.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full flex items-center gap-5 mt-3">
              <button
                type="button"
                className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] cursor-pointer"
                onClick={() => {
                  clearInputs();
                  setAddModalOpen(false);
                }}
              >
                <span className="z-40 font-sen">Cancel</span>
                <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center cta-btn bg-yard-primary text-[#EEEEE6] group relative overflow-hidden rounded-[5px] cursor-pointer disabled:opacity-50"
              >
                <span className="z-40 font-sen">{isSubmitting ? "Saving..." : "Add space"}</span>
                <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* ── Edit Space Modal ── */}
      <Modal isOpen={editModalOpen}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
              Edit space
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => {
                clearInputs();
                setEditModalOpen(false);
              }}
            >
              <Image
                src={"/icons/cancel.svg"}
                width={16}
                height={16}
                alt="Close Icon"
                className="z-40"
              />
              <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
            </div>
          </div>
        </section>

        <div className="w-full flex items-start my-4 2xl:my-8 gap-10">
          <form
            className="w-full flex flex-col gap-5"
            onSubmit={handleEditSubmit}
          >
            {/* Space Name */}
            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="editSpaceName"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Space name *
                </label>
                <input
                  type="text"
                  id="editSpaceName"
                  required
                  value={inputs.name}
                  onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                  placeholder="e.g. Outdoor Space"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
              </div>
            </div>

            {/* Guest Limit */}
            <div className="form-group flex flex-col md:flex-row items-start gap-6">
              <div className="w-full input-group flex flex-col gap-3">
                <label
                  htmlFor="editGuestLimit"
                  className="w-max leading-6 tracking-[0.5px] text-[#1A1A1A]"
                >
                  Daily guest limit *
                </label>
                <input
                  type="number"
                  id="editGuestLimit"
                  min="1"
                  required
                  value={inputs.guestLimit}
                  onChange={(e) => setInputs({ ...inputs, guestLimit: e.target.value })}
                  placeholder="e.g. 50"
                  className="w-full h-[52px] rounded2px p-3 border-[1px] border-[#BFBFBF] transition-colors duration-500 focus:border-yard-dark-primary outline-none placeholder:text-[14px]"
                />
                <p className="text-xs text-[#999999] leading-5 tracking-[0.5px]">
                  When total booked guests for this space reach this number on a given day, no more bookings are allowed.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full flex items-center gap-5 mt-3">
              <button
                type="button"
                className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] cursor-pointer"
                onClick={() => {
                  clearInputs();
                  setEditModalOpen(false);
                }}
              >
                <span className="z-40 font-sen">Cancel</span>
                <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center cta-btn bg-yard-primary text-[#EEEEE6] group relative overflow-hidden rounded-[5px] cursor-pointer disabled:opacity-50"
              >
                <span className="z-40 font-sen">{isSubmitting ? "Updating..." : "Update space"}</span>
                <div className="absolute top-0 left-0 bg-yard-dark-primary w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal isOpen={!!deleteTarget}>
        <section className="w-full">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-[#B42318]">
              Delete space
            </h2>
            <div
              className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
              onClick={() => setDeleteTarget(null)}
            >
              <Image
                src={"/icons/cancel.svg"}
                width={16}
                height={16}
                alt="Close Icon"
                className="z-40"
              />
              <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
            </div>
          </div>
        </section>

        <div className="w-full my-4 2xl:my-8">
          <p className="leading-6 tracking-[0.5px] text-[#1A1A1A]">
            Are you sure you want to delete{" "}
            <strong>&quot;{deleteTarget?.label}&quot;</strong>? This action cannot be undone.
          </p>

          <div className="w-full flex items-center gap-5 mt-6">
            <button
              type="button"
              className="w-full flex justify-center cta-btn border-[#8C5C5C] bg-base-100 text-[#8C5C5C] group relative overflow-hidden rounded-[5px] cursor-pointer"
              onClick={() => setDeleteTarget(null)}
            >
              <span className="z-40 font-sen">Cancel</span>
              <div className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleDeleteConfirm}
              className="w-full flex justify-center cta-btn bg-[#B42318] text-white group relative overflow-hidden rounded-[5px] cursor-pointer disabled:opacity-50"
            >
              <span className="z-40 font-sen">{isSubmitting ? "Deleting..." : "Delete space"}</span>
              <div className="absolute top-0 left-0 bg-[#8C1A12] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></div>
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
