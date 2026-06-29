import { PackageWithFun } from "@/app/v2/packages/page";
import { create } from "zustand";
interface BookingStore {
    selectedPackage: PackageWithFun | null;
    setSelectedPackage: (pkg: PackageWithFun) => void;
    clearSelectedPackage: () => void;
    selectedDate: Date | null;
    setDate: (date: Date)=> void;
    clearDate: ()=> void;
}



export const useBookingStore = create<BookingStore>((set) => ({
    selectedPackage: null,
    setDate: (date: Date)=> set({selectedDate: date, selectedPackage: null}),
    selectedDate: null,
    setSelectedPackage: (pkg: PackageWithFun) => set({
        selectedPackage: pkg,
        selectedDate: null
    }),
    clearSelectedPackage: () => set({ selectedPackage: null }),
    clearDate: () => set({ selectedDate: null })
}));