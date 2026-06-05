import React from "react";

const brands = [
  {
    name: "Samsung",
    render: () => (
      <svg
        viewBox="0 0 100 30"
        className="h-6 w-auto select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="50" cy="15" rx="48" ry="14" fill="#0A47A1" />
        <text
          x="50"
          y="20.5"
          fill="white"
          fontFamily="'Arial Black', Impact, sans-serif"
          fontWeight="900"
          fontSize="12"
          textAnchor="middle"
          letterSpacing="0.2"
        >
          SAMSUNG
        </text>
      </svg>
    ),
  },
  {
    name: "HP",
    render: () => (
      <svg
        viewBox="0 0 32 32"
        className="h-8 w-auto select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="16" cy="16" r="15" fill="#0096D6" />
        <text
          x="7"
          y="22"
          fill="white"
          fontFamily="'Arial', sans-serif"
          fontWeight="bold"
          fontSize="17"
          fontStyle="italic"
        >
          hp
        </text>
      </svg>
    ),
  },
  {
    name: "Bosch",
    render: () => (
      <svg
        viewBox="0 0 100 25"
        className="h-6 w-auto select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="18" height="18" rx="3" fill="#E30613" y="3" />
        <circle cx="9" cy="12" r="5" stroke="white" strokeWidth="2" />
        <text
          x="26"
          y="19"
          fill="#1F222A"
          fontFamily="'Arial Black', Impact, sans-serif"
          fontWeight="900"
          fontSize="15"
          letterSpacing="0.2"
        >
          BOSCH
        </text>
      </svg>
    ),
  },
  {
    name: "LG",
    render: () => (
      <svg
        viewBox="0 0 80 25"
        className="h-6 w-auto select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="11" fill="#A50034" />
        <path
          d="M12 6v6h6"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="8" cy="10" r="1.5" fill="white" />
        <text
          x="30"
          y="20"
          fill="#A50034"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="18"
          letterSpacing="0.5"
        >
          LG
        </text>
      </svg>
    ),
  },
  {
    name: "Apple",
    render: () => (
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-auto select-none"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.18.67-2.9 1.52-.63.73-1.18 1.87-1.03 2.98 1.1.09 2.22-.58 2.94-1.44z"
          fill="#000000"
        />
      </svg>
    ),
  },
  {
    name: "Sony",
    render: () => (
      <svg
        viewBox="0 0 80 20"
        className="h-5 w-auto select-none"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="0"
          y="16"
          fill="black"
          fontFamily="'Georgia', 'Times New Roman', serif"
          fontWeight="bold"
          fontSize="19"
          letterSpacing="1.5"
        >
          SONY
        </text>
      </svg>
    ),
  },
  {
    name: "Philips",
    render: () => (
      <svg
        viewBox="0 0 90 20"
        className="h-5 w-auto select-none"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="0"
          y="16"
          fill="#0B5A8C"
          fontFamily="'Arial Black', Impact, sans-serif"
          fontWeight="900"
          fontSize="15"
          letterSpacing="1"
        >
          PHILIPS
        </text>
      </svg>
    ),
  },
];

export function BrandCarousel() {
  // Duplicate array to ensure a seamless infinite scrolling transition
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <div className="bg-white py-12 border-t border-b border-gray-100 overflow-hidden relative select-none">
      {/* CSS infinite scroll styling */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.3333%); }
        }
        .marquee-container {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .marquee-container:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Soft gradient edges for a premium slider feel */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div className="container mx-auto px-4">
        <div className="marquee-container gap-12 md:gap-20">
          {duplicatedBrands.map((brand, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center h-12 w-28 flex-shrink-0 opacity-40 hover:opacity-100 transition-all duration-300 cursor-pointer group"
              style={{
                filter: "grayscale(100%)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "none";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "grayscale(100%)";
              }}
            >
              {brand.render()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
