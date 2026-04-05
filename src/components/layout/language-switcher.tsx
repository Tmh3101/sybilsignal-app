"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "vi" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="border-border bg-background hover:bg-surface-secondary text-foreground flex items-center justify-center rounded-sm border p-2 shadow-sm transition-all"
      title={`Switch to ${locale === "en" ? "Vietnamese" : "English"}`}
    >
      <Globe size={16} />
      <span className="sr-only">Switch Language</span>
    </button>
  );
}
