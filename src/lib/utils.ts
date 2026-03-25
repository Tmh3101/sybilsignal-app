import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolvePictureUrl(rawUrl?: string): string {
  if (!rawUrl) return "";

  let url = rawUrl.trim();

  // Convert lens:// to HTTPS via grove storage
  if (url.startsWith("lens://")) {
    url = url.replace("lens://", "https://api.grove.storage/");
  }

  // Only allow HTTPS URLs
  if (!url.startsWith("http")) {
    return "";
  }

  // Proxy through wsrv.nl for consistent sizing and format conversion
  // Using a slightly larger size (128x128) for high-DPI displays
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=128&h=128&fit=cover&q=75`;
}
