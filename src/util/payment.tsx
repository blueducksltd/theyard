/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

let PaystackPopClass: any = null;

// Load Paystack on client side
if (typeof window !== "undefined") {
  import("@paystack/inline-js").then((module) => {
    PaystackPopClass = module.default;
  });
}

export function initiatePayment(
  email: string,
  amount: number,
  onSuccess?: (transaction: any) => void,
  onCancel?: () => void,
): boolean {
  if (!PaystackPopClass) {
    console.log("Paystack not loaded yet");
    return false;
  }

  try {
    const paystack = new PaystackPopClass();
    paystack.newTransaction({
      key: process.env.NEXT_PUBLIC_API_PAYSTACK_PUBLIC_KEY!,
      email: email,
      amount: amount * 100,
      onSuccess: (transaction: any) => {
        console.log("Payment successful", transaction);
        onSuccess?.(transaction);
      },
      onCancel: () => {
        console.log("Payment cancelled");
        onCancel?.();
      },
    });
    return true;
  } catch (error) {
    console.error("Payment initiation failed:", error);
    return false;
  }
}
