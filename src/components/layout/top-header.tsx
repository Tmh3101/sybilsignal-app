"use client";

import { Terminal, Sun, Moon, Search } from "lucide-react";
import { useThemeStore } from "@/store/theme-store";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SearchForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("wallet") || ""
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/inspector?wallet=${searchValue.trim()}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="group relative mx-8 max-w-md flex-1"
    >
      <Search
        className="group-focus-within:text-accent-cyan absolute top-1/2 left-3 -translate-y-1/2 text-slate-500 transition-colors"
        size={16}
      />
      <input
        type="text"
        placeholder="ENTER WALLET_ID OR HANDLE..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="bg-background border-border focus:border-accent-cyan focus:ring-accent-cyan/20 w-full rounded-sm border px-10 py-2 font-mono text-xs tracking-widest uppercase transition-all placeholder:text-slate-600 focus:ring-1 focus:outline-none"
      />
    </form>
  );
};

export const TopHeader = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering theme toggle after mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <header className="bg-surface border-border relative z-10 flex h-16 items-center justify-between overflow-hidden border-b px-10 shadow-sm transition-colors duration-300">
      {/* Subtle scanline effect overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.005),rgba(0,0,255,0.01))] bg-[length:100%_2px,3px_100%] opacity-20" />

      <div className="relative flex items-center gap-6">
        <div className="border-border bg-background rounded-sm border p-2 shadow-inner">
          <Terminal
            className="text-accent-cyan drop-shadow-[0_0_5px_rgba(var(--accent-cyan),0.4)]"
            size={20}
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-foreground text-xl leading-tight font-bold tracking-[0.3em] uppercase italic">
            SYBIL <span className="text-accent-cyan">OVERWATCH</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="bg-accent-green h-1.5 w-1.5 animate-pulse rounded-full shadow-[0_0_5px_var(--accent-green)]" />
            <span className="font-mono text-[8px] tracking-widest text-slate-500 uppercase">
              Global Discovery Active
            </span>
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="bg-surface-secondary/50 mx-8 h-10 max-w-md flex-1 animate-pulse rounded-sm" />
        }
      >
        <SearchForm />
      </Suspense>

      <div className="flex items-center gap-8">
        {mounted && (
          <button
            onClick={toggleTheme}
            className="border-border bg-background hover:bg-surface-secondary text-foreground rounded-sm border p-2 transition-all"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        )}
      </div>
    </header>
  );
};
