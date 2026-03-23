"use client";

import { Terminal, ShieldCheck, Cpu, Power, Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/store/theme-store";
import { useEffect, useState } from "react";

export const TopHeader = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-10 shadow-sm z-10 relative overflow-hidden transition-colors duration-300">
      {/* Subtle scanline effect overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.005),rgba(0,0,255,0.01))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />

      <div className="flex items-center gap-6 relative">
        <div className="p-2 border border-border bg-background shadow-inner rounded-sm">
          <Terminal
            className="text-accent-cyan drop-shadow-[0_0_5px_rgba(var(--accent-cyan),0.4)]"
            size={20}
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-[0.3em] uppercase text-foreground italic leading-tight">
            SYBIL <span className="text-accent-cyan">OVERWATCH</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_5px_var(--accent-green)] animate-pulse" />
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
              Global Discovery Active
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {mounted && (
          <button
            onClick={toggleTheme}
            className="p-2 border border-border bg-background hover:bg-surface-secondary transition-all rounded-sm text-foreground"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        )}

        {/* <div className="flex items-center gap-3">
          <Cpu size={16} className="text-slate-500" />
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-slate-500 uppercase">
              Core Load
            </span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-1.5 rounded-sm ${i <= 2 ? "bg-accent-cyan" : "bg-border"}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="h-8 w-px bg-border mx-2" />

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-surface-secondary px-4 py-2 rounded-sm border border-border">
            <ShieldCheck size={18} className="text-accent-cyan" />
            <span className="text-[10px] text-foreground font-mono uppercase tracking-[0.1em] font-bold">
              SECURE-NODE
            </span>
          </div>

          <button className="p-2 text-accent-red/60 hover:text-accent-red hover:bg-surface-secondary transition-all border border-transparent hover:border-border rounded-sm">
            <Power size={18} />
          </button>
        </div> */}
      </div>
    </header>
  );
};
