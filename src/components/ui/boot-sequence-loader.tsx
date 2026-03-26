"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export const BootSequenceLoader = () => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-[#050608]/80 backdrop-blur-sm">
      <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] bg-center opacity-10" />
      <div className="relative z-10">
        <Loader2 className="text-accent-cyan animate-spin" size={48} />
      </div>
    </div>
  );
};
