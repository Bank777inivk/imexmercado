import React from "react";
import {
  ShoppingCart,
  User,
  MagnifyingGlass,
  List,
  Heart,
} from "@phosphor-icons/react";
import { subscribeToCollection } from "@imexmercado/firebase";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "@imexmercado/firebase";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { getOptimizedImageUrl } from "@imexmercado/ui";
import { useLocale } from "../../hooks/useLocale";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const { totalItems, totalPrice, setDrawerOpen } = useCart();
  const { wishlist } = useWishlist();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categories, setCategories] = React.useState<any[]>([]);
  const [allProducts, setAllProducts] = React.useState<any[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const navigate = useNavigate();
  const location = useLocation();
  const { localLink } = useLocale();
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    const searchParamsObj = new URLSearchParams(location.search);
    const searchVal = searchParamsObj.get("search");
    if (searchVal) {
      setSearchQuery(searchVal);
    } else {
      setSearchQuery("");
    }
    setIsOpen(false);
  }, [location.pathname, location.search]);

  const queryCat = searchParams.get("category");

  const resolvedCategoryName = React.useMemo(() => {
    if (!queryCat) return "all";
    const found = categories.find(
      (cat) =>
        cat.name?.toLowerCase() === queryCat.toLowerCase() ||
        cat.namePT?.toLowerCase() === queryCat.toLowerCase(),
    );
    return found ? found.name : queryCat;
  }, [queryCat, categories]);

  const getCategoryName = React.useCallback(
    (cat: any) => {
      const currentLang = i18n.language || "pt";
      let name = currentLang === "pt" ? cat.namePT || cat.name : cat.name;
      if (name === cat.name) {
        name = t(`categories.${cat.short || cat.name}`, cat.name);
      }
      return name;
    },
    [i18n.language, t],
  );

  const desktopRef = React.useRef<HTMLFormElement>(null);
  const mobileRef = React.useRef<HTMLFormElement>(null);
  const mobileInputRef = React.useRef<HTMLInputElement>(null);
  const [dropdownPos, setDropdownPos] = React.useState<{ top?: number; bottom?: number; left: number; width: number; maxHeight?: number } | null>(null);

  React.useEffect(() => {
    const unsubscribe = subscribeToCollection("categories", (data) => {
      const uniqueCats: any[] = [];
      const seenNames = new Set<string>();
      data.forEach((cat) => {
        if (cat.name) {
          const cleanName = cat.name.trim();
          if (!seenNames.has(cleanName.toLowerCase())) {
            seenNames.add(cleanName.toLowerCase());
            uniqueCats.push(cat);
          }
        }
      });
      setCategories(uniqueCats.sort((a, b) => (a.order || 0) - (b.order || 0)));
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    const unsubscribe = subscribeToCollection("products", (data) => {
      setAllProducts(data);
    });
    return () => unsubscribe();
  }, []);

  // Recalculate dropdown position when keyboard opens/closes or page scrolls
  const updateDropdownPos = React.useCallback(() => {
    if (mobileInputRef.current) {
      const rect = mobileInputRef.current.getBoundingClientRect();
      const maxH = Math.max(120, rect.top - 12);
      setDropdownPos({
        left: rect.left,
        width: rect.width,
        maxHeight: maxH,
      });
    }
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        desktopRef.current &&
        !desktopRef.current.contains(event.target as Node) &&
        mobileRef.current &&
        !mobileRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Recalculate dropdown position when virtual keyboard opens/closes (mobile)
  React.useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onViewportChange = () => {
      updateDropdownPos();
    };
    vv.addEventListener("resize", onViewportChange);
    vv.addEventListener("scroll", onViewportChange);
    return () => {
      vv.removeEventListener("resize", onViewportChange);
      vv.removeEventListener("scroll", onViewportChange);
    };
  }, [updateDropdownPos]);

  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return categories
      .filter((cat) => {
        const name = getCategoryName(cat).toLowerCase();
        const orig = cat.name.toLowerCase();
        return name.includes(q) || orig.includes(q);
      })
      .slice(0, 3);
  }, [searchQuery, categories, getCategoryName]);

  const filteredProducts = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allProducts
      .filter(
        (prod) =>
          prod.name.toLowerCase().includes(q) ||
          (prod.category && prod.category.toLowerCase().includes(q)),
      )
      .slice(0, 5);
  }, [searchQuery, allProducts]);

  const filteredKeywords = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const wordsSet = new Set<string>();

    if (filteredProducts.length > 0) {
      wordsSet.add(searchQuery.trim());
    }

    allProducts.forEach((prod) => {
      const words = prod.name.split(/\s+/);
      words.forEach((word: string) => {
        const clean = word
          .toLowerCase()
          .replace(/[^a-zA-Z0-9éèàâêîôûùçœæ]/g, "");
        if (clean.startsWith(q) && clean.length > q.length) {
          wordsSet.add(clean);
        }
      });
    });

    return Array.from(wordsSet).slice(0, 4);
  }, [searchQuery, allProducts, filteredProducts]);

  const suggestions = React.useMemo(() => {
    const list: any[] = [];
    let globalIndex = 0;

    filteredCategories.forEach((cat) => {
      list.push({
        type: "category",
        id: cat.id,
        name: cat.name,
        label: getCategoryName(cat),
        url: localLink(`/boutique?category=${encodeURIComponent(cat.name)}`),
        index: globalIndex++,
      });
    });

    filteredKeywords.forEach((kw) => {
      if (!list.some((item) => item.label.toLowerCase() === kw.toLowerCase())) {
        list.push({
          type: "keyword",
          name: kw,
          label: kw,
          url: localLink(`/boutique?search=${encodeURIComponent(kw)}`),
          index: globalIndex++,
        });
      }
    });

    filteredProducts.forEach((prod) => {
      list.push({
        type: "product",
        id: prod.id,
        name: prod.name,
        label: prod.name,
        image: prod.image,
        price: prod.price,
        category: prod.category,
        url: localLink(`/boutique?product=${prod.id}`),
        index: globalIndex++,
      });
    });

    return list;
  }, [filteredCategories, filteredKeywords, filteredProducts]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length,
      );
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        const selected = suggestions[selectedIndex];
        handleSelectSuggestion(selected);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelectSuggestion = (item: any) => {
    setSearchQuery(item.label);
    setIsOpen(false);
    navigate(item.url);
  };

  const renderDropdownContent = () => {
    if (suggestions.length === 0) {
      return (
        <div className="p-4 text-center text-gray-400">
          {t("header.no_results")} «{" "}
          <span className="text-white font-semibold">{searchQuery}</span> »
        </div>
      );
    }

    const categoriesGroup = suggestions.filter(
      (item) => item.type === "category",
    );
    const keywordsGroup = suggestions.filter((item) => item.type === "keyword");
    const productsGroup = suggestions.filter((item) => item.type === "product");

    return (
      <div className="divide-y divide-[#2D3039]">
        {categoriesGroup.length > 0 && (
          <div className="py-2">
            <div className="px-4 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {t("header.categories")}
            </div>
            {categoriesGroup.map((item) => renderItem(item))}
          </div>
        )}
        {keywordsGroup.length > 0 && (
          <div className="py-2">
            <div className="px-4 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {t("header.suggestions")}
            </div>
            {keywordsGroup.map((item) => renderItem(item))}
          </div>
        )}
        {productsGroup.length > 0 && (
          <div className="py-2">
            <div className="px-4 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {t("header.products")}
            </div>
            {productsGroup.map((item) => renderItem(item))}
          </div>
        )}
      </div>
    );
  };

  const renderItem = (item: any) => {
    const isSelected = item.index === selectedIndex;
    return (
      <div
        key={`${item.type}-${item.id || item.label}`}
        onClick={() => handleSelectSuggestion(item)}
        onMouseEnter={() => setSelectedIndex(item.index)}
        className={`px-4 py-2 flex items-center gap-3 cursor-pointer transition-colors ${
          isSelected
            ? "bg-[#2D3039] text-white"
            : "text-gray-300 hover:bg-[#2D3039]/50"
        }`}
      >
        {item.type === "category" && (
          <>
            <List size={16} className="text-primary flex-shrink-0" />
            <span className="font-medium text-white">{item.label}</span>
          </>
        )}
        {item.type === "keyword" && (
          <>
            <MagnifyingGlass
              size={16}
              className="text-gray-400 flex-shrink-0"
            />
            <span>{item.label}</span>
          </>
        )}
        {item.type === "product" && (
          <>
            <img
              src={getOptimizedImageUrl(item.image, 100)}
              alt={item.name}
              className="w-8 h-8 object-cover rounded bg-gray-800 flex-shrink-0"
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/100x100/1F222A/adb5bd?text=N/A";
              }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white truncate text-xs">
                {item.name}
              </h4>
              <span className="text-[9px] text-gray-500 block uppercase tracking-wider">
                {item.category}
              </span>
            </div>
            <span className="text-primary font-bold text-xs flex-shrink-0">
              €{item.price}
            </span>
          </>
        )}
      </div>
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsOpen(false);
      navigate(
        localLink(`/boutique?search=${encodeURIComponent(searchQuery)}`),
      );
    }
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDrawerOpen(true);
  };

  return (
    <header className="bg-[#1A1A1A] text-white">
      <style>{`
        .search-suggestions-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .search-suggestions-scrollbar::-webkit-scrollbar-track {
          background: #1F222A;
          border-radius: 4px;
        }
        .search-suggestions-scrollbar::-webkit-scrollbar-thumb {
          background: #3E424B;
          border-radius: 4px;
        }
        .search-suggestions-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #FF6B00;
        }
      `}</style>

      {/* 
        ========================================
        DESKTOP HEADER : h-[80px]
        ========================================
      */}
      <div className="w-full px-2 md:px-4 lg:px-6 h-[80px] hidden md:flex items-center gap-6">
        {/* Logo */}
        <Link
          to={localLink("/")}
          className="font-extrabold text-2xl tracking-tight whitespace-nowrap flex-shrink-0 w-[250px] hover:text-primary transition-colors"
        >
          <span className="text-primary">i</span>mexmercado
          <div className="text-[10px] font-normal text-gray-400 tracking-widest uppercase -mt-1">
            all in one store
          </div>
        </Link>

        {/* Search Bar Desktop */}
        <form
          onSubmit={handleSearch}
          className="flex-1 flex items-center max-w-2xl relative"
          ref={desktopRef}
        >
          <select
            className="h-11 px-3 bg-gray-100 border-r border-gray-300 text-gray-600 text-xs rounded-l-sm focus:outline-none cursor-pointer"
            value={resolvedCategoryName}
            onChange={(e) => {
              if (e.target.value === "all") {
                navigate(localLink("/boutique"));
              } else {
                navigate(
                  localLink(
                    `/boutique?category=${encodeURIComponent(e.target.value)}`,
                  ),
                );
              }
            }}
          >
            <option value="all">{t("header.all_categories")}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {getCategoryName(cat)}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => {
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t("header.search_placeholder")}
            className="flex-1 h-11 px-4 text-sm text-gray-800 focus:outline-none"
          />
          <button
            type="submit"
            className="h-11 px-5 bg-primary hover:bg-primary-dark transition-colors flex items-center justify-center rounded-r-sm"
          >
            <MagnifyingGlass size={20} weight="bold" className="text-white" />
          </button>

          {/* Suggestions Dropdown Desktop */}
          {isOpen && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1F222A] border border-[#2D3039] rounded-md shadow-2xl z-50 max-h-[380px] overflow-y-auto overflow-x-hidden text-sm search-suggestions-scrollbar">
              {renderDropdownContent()}
            </div>
          )}
        </form>

        {/* Right — Account + Cart */}
        <div className="flex items-center gap-5 ml-auto">
          {/* Account */}
          <Link
            to={localLink(user ? "/compte" : "/connexion")}
            className="flex items-center gap-2 cursor-pointer group hover:opacity-80 transition-opacity"
          >
            <User size={26} />
            <div className="flex flex-col text-xs leading-tight">
              <span className="text-gray-400">
                {user ? t("header.welcome") : t("header.login")}
              </span>
              <span className="font-bold truncate max-w-[100px]">
                {user
                  ? user.displayName?.split(" ")[0] || t("header.my_account")
                  : t("header.my_account")}
              </span>
            </div>
          </Link>

          {/* Wishlist */}
          <Link
            to={localLink("/favoris")}
            className="flex items-center gap-2 cursor-pointer group hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <Heart size={26} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </div>
            <div className="flex flex-col text-xs leading-tight">
              <span className="text-gray-400">{t("header.favorites")}</span>
              <span className="font-bold">{t("header.my_list")}</span>
            </div>
          </Link>

          {/* Cart */}
          <button
            onClick={handleCartClick}
            className="flex items-center gap-2 cursor-pointer group hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <ShoppingCart size={26} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </div>
            <div className="flex flex-col text-left text-xs leading-tight">
              <span className="text-gray-400">{t("header.cart")}</span>
              <span className="font-bold text-primary">
                €{totalPrice.toFixed(2)}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 
        ========================================
        MOBILE HEADER : App-like layout
        ========================================
      */}
      <div className="md:hidden flex flex-col pt-3 pb-3">
        {/* Row 1: 3-Column Grid for perfect centering */}
        <div className="px-4 grid grid-cols-3 items-center h-12">
          {/* Left: Hamburger */}
          <div className="flex justify-start">
            <button
              onClick={onMenuClick}
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-white"
            >
              <List size={28} weight="bold" />
            </button>
          </div>

          {/* Center: Logo */}
          <div className="flex justify-center">
            <Link
              to={localLink("/")}
              className="font-black text-xl tracking-tighter whitespace-nowrap"
            >
              IMEX<span className="text-primary">MERCADO</span>
            </Link>
          </div>

          {/* Right: Favoris/Cart */}
          <div className="flex justify-end items-center gap-1">
            <Link
              to={localLink("/favoris")}
              className="relative w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full"
            >
              <Heart size={24} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button
              onClick={handleCartClick}
              className="relative w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Mobile Search Bar */}
        <div className="px-4 mt-2">
          <form
            onSubmit={handleSearch}
            className="flex items-center w-full relative"
            ref={mobileRef}
          >
            <input
              ref={mobileInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);
                setSelectedIndex(-1);
                updateDropdownPos();
              }}
              onFocus={() => {
                setIsOpen(true);
                setSelectedIndex(-1);
                // Small delay to let keyboard animate open before measuring
                setTimeout(updateDropdownPos, 100);
                setTimeout(updateDropdownPos, 350);
              }}
              onKeyDown={handleKeyDown}
              placeholder={t("header.search_placeholder")}
              className="w-full h-10 pl-4 pr-12 text-sm text-gray-900 bg-white rounded-xl focus:outline-none shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-1 w-8 h-8 bg-primary flex items-center justify-center rounded-lg active:scale-95 transition-all"
            >
              <MagnifyingGlass size={16} weight="bold" className="text-white" />
            </button>

            {/* Suggestions Dropdown Mobile — positioned absolute relative to form to always show above the input */}
            {isOpen && searchQuery.trim().length > 0 && (
              <div
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 8px)",
                  left: 0,
                  width: "100%",
                  maxHeight: dropdownPos?.maxHeight || 250,
                  zIndex: 9999,
                }}
                className="bg-[#1F222A] border border-[#2D3039] rounded-xl shadow-2xl overflow-y-auto overflow-x-hidden text-sm search-suggestions-scrollbar"
              >
                {renderDropdownContent()}
              </div>
            )}
          </form>
        </div>
      </div>
    </header>
  );
}
