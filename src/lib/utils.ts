import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getUrl(path?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const normalizedPath =
    path && !path.startsWith("/") ? `/${path}` : path || "";

  return `${baseUrl}${normalizedPath}`;
}
