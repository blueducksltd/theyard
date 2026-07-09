"use client";
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react";

export default function Loading() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [])

  useEffect(() => {
    if (!mounted) {
      document.body.style.overflow = "auto"
    }

    if (mounted) {
      document.body.style.overflow = "hidden"

    }
  }, [mounted])
  return (
    <div className="h-screen fixed z-100 w-full flex items-center justify-center bg-primaryGreen">
      <motion.div
        className="h-10 w-10 border-2 border-white/30 border-t-white rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}
