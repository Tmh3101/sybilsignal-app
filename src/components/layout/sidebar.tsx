"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radar, FlaskConical, Fingerprint, Activity } from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Profile Inspector", href: "/inspector", icon: Radar },
    { name: "Discovery Lab", href: "/discovery", icon: FlaskConical },
  ];

  return (
    <aside className="w-72 h-full bg-surface border-r border-border flex flex-col shadow-xl z-20 transition-colors duration-300">
      <div className="p-8 border-b border-border flex flex-col gap-1">
        <h2 className="text-accent-cyan font-bold tracking-[0.2em] flex items-center gap-3 text-xl italic">
          <Fingerprint
            size={28}
            className="text-accent-cyan drop-shadow-[0_0_8px_rgba(var(--accent-cyan),0.5)]"
          />
          SYBIL ENGINE
        </h2>
        <span className="text-[10px] text-slate-500 font-mono tracking-tighter opacity-50 uppercase">
          Autonomous Detection Protocol v.4.0
        </span>
      </div>

      <nav className="flex-1 p-6 space-y-4">
        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-6 border-b border-border pb-2">
          Navigation Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-4 p-4 rounded-sm transition-all border ${
                isActive
                  ? "bg-surface-secondary border-border text-accent-cyan"
                  : "text-slate-500 border-transparent hover:border-border hover:text-foreground hover:bg-surface-secondary/50"
              }`}
            >
              <Icon
                size={20}
                className={`${isActive ? "text-accent-cyan" : "group-hover:text-foreground"}`}
              />
              <span className="font-mono text-xs font-bold tracking-wider uppercase">
                {item.name}
              </span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_var(--accent-cyan)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* <div className="p-6 mt-auto border-t border-border bg-surface-secondary/20">
        <div className="flex items-center gap-3 text-slate-500 mb-4">
          <Activity size={14} className="text-accent-green" />
          <span className="text-[10px] font-mono uppercase tracking-tighter">
            System Health: Nominal
          </span>
        </div>
        <div className="p-3 bg-background/50 rounded-sm border border-border shadow-inner">
          <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1">
            <span>Uptime</span>
            <span>99.99%</span>
          </div>
          <div className="w-full h-1 bg-border rounded-full overflow-hidden">
            <div className="w-[99.99%] h-full bg-accent-cyan" />
          </div>
        </div>
      </div> */}
    </aside>
  );
};
