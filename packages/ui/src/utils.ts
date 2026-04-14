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
export function getOptimizedImageUrl(
  url: string,
  width: number = 800
): string {
  if (!url) return '';
  // Si ce n'est pas une URL Cloudinary, on ne touche à rien
  if (!url.includes('res.cloudinary.com')) return url;

  // Si des transformations sont déjà présentes, ne pas en ajouter
  if (url.includes('/f_auto') || url.includes(',f_auto')) return url;

  // Injecter les transformations après /upload/
  return url.replace(
    '/upload/',
    `/upload/f_auto,q_auto,w_${width}/`
  );
}
