import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Optimise automatiquement les images hébergées sur Cloudinary.
 * - f_auto : format automatique (WebP pour Chrome, AVIF pour Firefox...)
 * - q_auto : compression intelligente (60-80% plus léger)
 * - w_XXX  : redimensionnement à la largeur demandée
 *
 * Les URLs non-Cloudinary (Unsplash, placehold.co...) sont retournées intactes.
 */
export function getOptimizedImageUrl(url: string, width: number = 800): string {
  if (!url) return "";
  // Si ce n'est pas une URL Cloudinary, on ne touche à rien
  if (!url.includes("res.cloudinary.com")) return url;

  // Si des transformations sont déjà présentes, ne pas en ajouter
  if (url.includes("/f_auto") || url.includes(",f_auto")) return url;

  // Injecter les transformations après /upload/
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}

export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const adjustColor = (hex: string, amount: number) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const r = Math.max(0, Math.min(255, rgb.r + amount));
  const g = Math.max(0, Math.min(255, rgb.g + amount));
  const b = Math.max(0, Math.min(255, rgb.b + amount));
  return rgbToHex(r, g, b);
};
