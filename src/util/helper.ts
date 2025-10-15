/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */

export const saveToLS = (key: string, value: any) => {
  typeof window !== "undefined"
    ? localStorage.setItem(key, JSON.stringify(value))
    : null;
};

export const loadFromLS = (key: string) => {
  const item = typeof window !== "undefined" ? localStorage.getItem(key) : null;
  return item ? JSON.parse(item) : null;
};
