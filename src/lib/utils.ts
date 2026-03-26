import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolvePictureUrl(rawUrl?: string): string {
  const picture_url = String(rawUrl || "").trim();
  if (!picture_url) return "";

  let url = picture_url;

  // Convert lens:// to HTTPS via grove storage
  if (url.startsWith("lens://")) {
    url = url.replace("lens://", "https://api.grove.storage/");
  }

  // Only allow HTTPS URLs
  if (!url.startsWith("http")) {
    return "";
  }

  // Proxy through wsrv.nl for consistent sizing and format conversion
  const encodedUrl = encodeURIComponent(url);
  return `https://wsrv.nl/?url=${encodedUrl}&w=64&h=64&fit=cover&q=70`;
}
