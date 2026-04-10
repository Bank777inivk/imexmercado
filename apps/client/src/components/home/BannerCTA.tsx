import React from 'react';

interface BannerCTAProps {
  bgColor: string;
  title: string;
  subtitle: string;
  ctaText: string;
  imageSrc: string;
  imageAlt: string;
  reversed?: boolean;
}

export function BannerCTA({ bgColor, title, subtitle, ctaText, imageSrc, imageAlt, reversed = false }: BannerCTAProps) {
  return (
    <section className={`${bgColor} py-0 overflow-hidden`}>
      <div className={`container mx-auto flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center`}>
        {/* Text */}
        <div className="flex-1 p-10 md:p-16 text-white">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 opacity-80">{subtitle}</p>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-6">{title}</h2>
          <a
            href="#"
            className="inline-block bg-white text-gray-900 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-md text-sm"
          >
            {ctaText}
          </a>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center items-end overflow-hidden max-h-64 md:max-h-80">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover opacity-90"
          />
        </div>
      </div>
    </section>
  );
}
