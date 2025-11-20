/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import imageCompression from "browser-image-compression";

export const saveToLS = (key: string, value: any) => {
  typeof window !== "undefined"
    ? localStorage.setItem(key, JSON.stringify(value))
    : null;
};

export const loadFromLS = (key: string) => {
  const item = typeof window !== "undefined" ? localStorage.getItem(key) : null;
  return item ? JSON.parse(item) : null;
};

export const compressImage = async (file: File) => {
  return await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 2000,
    useWebWorker: true,
  });
};
