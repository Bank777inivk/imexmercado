import React from 'react';

const brands = [
  { name: 'Samsung', logo: 'https://placehold.co/120x60/ffffff/999999?text=SAMSUNG' },
  { name: 'HP', logo: 'https://placehold.co/120x60/ffffff/999999?text=HP' },
  { name: 'Bosch', logo: 'https://placehold.co/120x60/ffffff/999999?text=BOSCH' },
  { name: 'LG', logo: 'https://placehold.co/120x60/ffffff/999999?text=LG' },
  { name: 'Apple', logo: 'https://placehold.co/120x60/ffffff/999999?text=APPLE' },
  { name: 'Sony', logo: 'https://placehold.co/120x60/ffffff/999999?text=SONY' },
  { name: 'Philips', logo: 'https://placehold.co/120x60/ffffff/999999?text=PHILIPS' },
];

export function BrandCarousel() {
  return (
    <div className="bg-white py-10 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 overflow-x-auto scrollbar-hide">
          {brands.map((brand, idx) => (
            <div key={idx} className="min-w-[120px] flex-shrink-0 flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all cursor-pointer">
              <img src={brand.logo} alt={brand.name} className="h-8 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
