"use client";

import React from "react";

interface IndustrialCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const IndustrialCard: React.FC<IndustrialCardProps> = ({
  children,
  title,
  className = "",
}) => {
  return (
    <div
      className={`
      relative p-6 bg-surface 
      border border-slate-200/60 dark:border-slate-800/60 
      rounded-sm
      hover:-translate-y-0.5
      transition-all duration-300 ease-out
      overflow-hidden 
      ${className}
    `}
    >
      {/* 
         Mechanical screw points at corners 
         Simplified for a cleaner "Flat-Industrial" look 
      */}
      <div className="absolute top-2.5 left-2.5 w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-800 border border-slate-400/20 dark:border-slate-700/50" />
      <div className="absolute top-2.5 right-2.5 w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-800 border border-slate-400/20 dark:border-slate-700/50" />
      <div className="absolute bottom-2.5 left-2.5 w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-800 border border-slate-400/20 dark:border-slate-700/50" />
      <div className="absolute bottom-2.5 right-2.5 w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-800 border border-slate-400/20 dark:border-slate-700/50" />

      {/* Very subtle technical grid overlay */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(var(--border)_1px,_transparent_0)] bg-[length:20px_20px]" />

      {title && (
        <div className="mb-4 pb-2 border-b border-border/60">
          <h3 className="text-[10px] font-mono font-bold tracking-[0.2em] text-accent-cyan uppercase italic">
            {title}
          </h3>
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
};
