import { IPackageFun } from "@/app/v2/packages/page";
import { create } from "zustand";
interface BookingStore {
    selectedPackage: IPackageFun | null;
    setSelectedPackage: (pkg: IPackageFun) => void;
    clearSelectedPackage: () => void;
    selectedDate: Date | null;
    setDate: (date: Date)=> void;
    clearDate: ()=> void;
}



export const useBookingStore = create<BookingStore>((set) => ({
    selectedPackage: null,
    setDate: (date: Date)=> set({selectedDate: date, selectedPackage: null}),
    selectedDate: null,
    setSelectedPackage: (pkg: IPackageFun) => set({
        selectedPackage: pkg,
        selectedDate: null
    }),
    clearSelectedPackage: () => set({ selectedPackage: null }),
    clearDate: () => set({ selectedDate: null })
}));