"use client";

import React, { useEffect, useState } from "react";

const BOOT_MESSAGES = [
  "WAKING UP AI CORE...",
  "ALLOCATING GPU VRAM...",
  "LOADING GAT MODELS...",
  "ESTABLISHING NEURAL LINK...",
  "SYNCHRONIZING REPUTATION DATABASE...",
  "READY FOR ANALYSIS."
];

export const BootSequenceLoader = () => {
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < BOOT_MESSAGES.length) {
        setVisibleMessages((prev) => [...prev, BOOT_MESSAGES[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,black,transparent)] opacity-20" />
      
      <div className="relative z-10 w-full max-w-md space-y-2 p-6 font-mono">
        <div className="mb-4 flex items-center gap-2 text-accent-cyan">
          <div className="h-2 w-2 animate-pulse rounded-full bg-accent-cyan" />
          <span className="text-xs font-bold tracking-widest uppercase">[ SYSTEM BOOT SEQUENCE ]</span>
        </div>
        
        <div className="space-y-1">
          {visibleMessages.map((msg, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <span className="text-slate-500 shrink-0 select-none">{">"}</span>
              <span className={i === visibleMessages.length - 1 ? "animate-pulse text-accent-cyan" : "text-slate-300"}>
                {msg}
              </span>
            </div>
          ))}
          {visibleMessages.length < BOOT_MESSAGES.length && (
            <div className="flex gap-2">
               <span className="text-slate-500 shrink-0 select-none">{">"}</span>
               <span className="h-4 w-2 animate-[blink_1s_infinite] bg-accent-cyan" />
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-1">
          <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-tighter">
            <span>Progress</span>
            <span>{Math.round((visibleMessages.length / BOOT_MESSAGES.length) * 100)}%</span>
          </div>
          <div className="h-1 w-full bg-slate-900">
            <div 
              className="h-full bg-accent-cyan transition-all duration-500 ease-out shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
              style={{ width: `${(visibleMessages.length / BOOT_MESSAGES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
