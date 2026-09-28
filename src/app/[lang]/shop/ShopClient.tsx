"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Star, 
  SlidersHorizontal, 
  X, 
  LayoutGrid, 
  List, 
  Check, 
  RotateCcw, 
  ShoppingBag, 
  ChevronDown 
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: string;
  brand: string;
  sizes: string[];
  colors: string[];
  ratings: number;
  reviewsCount: number;
  isOnSale: boolean;
  isAvailable: boolean;
  stock: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface ShopClientProps {
  initialProducts: Product[];
  categories: Category[];
  currency: string;
  availableBrands: string[];
  availableSizes: string[];
  availableColors: string[];
}

const getColorName = (hex: string) => {
  const map: Record<string, string> = {
    "#000000": "Black",
    "#ffffff": "White",
    "#8b4513": "Brown",
    "#ffd700": "Gold",
    "#b0e0e6": "Powder Blue",
    "#4682b4": "Steel Blue",
    "#ff0000": "Red",
    "#0000ff": "Blue",
    "#008000": "Green",
    "#ffff00": "Yellow",
    "#800080": "Purple",
    "#ffa500": "Orange",
    "#808080": "Gray",
  };
  return map[hex.toLowerCase()] || hex;
};

export default function ShopClient({ 
  initialProducts, 
  categories, 
  currency, 
  availableBrands, 
  availableSizes, 
  availableColors 
}: ShopClientProps) {
  const { t, getProductLink } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
  const [limit, setLimit] = useState(24);

  // Accordion collapse state for each filter section
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    price: false,
    availability: false,
    categories: false,
    collections: false,
    brands: false,
    sizes: true,
    colors: true,
  });

  const toggleSection = (key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // URL state
  const activeCategory = searchParams?.get("category") || "all";
  const activeSort = searchParams?.get("sort") || "newest";
  const activeMinPrice = searchParams?.get("minPrice") || "";
  const activeMaxPrice = searchParams?.get("maxPrice") || "";
  const activeOnSale = searchParams?.get("isOnSale") === "true";
  const activeFeatured = searchParams?.get("isFeatured") === "true";
  const activeInStock = searchParams?.get("inStock") === "true";
  const activeSize = searchParams?.get("size") || "";
  const activeColor = searchParams?.get("color") || "";
  const activeBrand = searchParams?.get("brand") || "";
  const activeCollection = searchParams?.get("collection") || "";

  // Local state for price inputs
  const [minPriceInput, setMinPriceInput] = useState(activeMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(activeMaxPrice);

  // Sync inputs with URL params
  useEffect(() => {
    setMinPriceInput(activeMinPrice);
    setMaxPriceInput(activeMaxPrice);
  }, [activeMinPrice, activeMaxPrice]);

  const renderPrices = (product: Product, isList: boolean = false) => {
    const isSale = product.isOnSale && typeof product.salePrice === "number";
    const priceStyle = isList ? { fontSize: "18px", fontWeight: "800", color: "#0f172a" } : { fontSize: "16px", fontWeight: "800", color: "#0f172a" };

    if (isSale) {
      const current = Math.min(product.price, product.salePrice!);
      const old = Math.max(product.price, product.salePrice!);
      return (
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "4px" }}>
          <span style={{ ...priceStyle, color: "#10b981" }}>{currency}{current.toFixed(2)}</span>
          <span style={{ fontSize: "12px", textDecoration: "line-through", color: "#94a3b8" }}>{currency}{old.toFixed(2)}</span>
        </div>
      );
    }
    return (
      <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "4px" }}>
        <span style={priceStyle}>{currency}{product.price.toFixed(2)}</span>
      </div>
    );
  };

  // Prevent body scroll when mobile filter drawer is open
  useEffect(() => {
    if (filtersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [filtersOpen]);

  // Helper to push URL changes
  const updateFilters = (params: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams?.entries() || []));

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "") {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });

    router.push(`/shop?${current.toString()}`);
  };

  const handleCategoryChange = (slug: string) => {
    updateFilters({ category: slug === activeCategory ? "all" : slug });
  };

  const handleSizeToggle = (sizeVal: string) => {
    const currentSizes = activeSize ? activeSize.split(",") : [];
    const newSizes = currentSizes.includes(sizeVal)
      ? currentSizes.filter(s => s !== sizeVal)
      : [...currentSizes, sizeVal];
    updateFilters({ size: newSizes.length > 0 ? newSizes.join(",") : null });
  };

  const handleColorToggle = (colorVal: string) => {
    const currentColors = activeColor ? activeColor.split(",") : [];
    const newColors = currentColors.includes(colorVal)
      ? currentColors.filter(c => c !== colorVal)
      : [...currentColors, colorVal];
    updateFilters({ color: newColors.length > 0 ? newColors.join(",") : null });
  };

  const handleBrandToggle = (brandVal: string) => {
    const currentBrands = activeBrand ? activeBrand.split(",") : [];
    const newBrands = currentBrands.includes(brandVal)
      ? currentBrands.filter(b => b !== brandVal)
      : [...currentBrands, brandVal];
    updateFilters({ brand: newBrands.length > 0 ? newBrands.join(",") : null });
  };

  const handleCollectionToggle = (collVal: string) => {
    updateFilters({ collection: activeCollection === collVal ? null : collVal });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ sort: e.target.value });
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({
      minPrice: minPriceInput || null,
      maxPrice: maxPriceInput || null,
    });
  };

  // Active filter count badge
  const activeFilterCount = [
    activeCategory !== "all",
    activeOnSale,
    activeFeatured,
    activeInStock,
    !!activeMinPrice,
    !!activeMaxPrice,
    !!activeSize,
    !!activeColor,
    !!activeBrand,
    !!activeCollection,
  ].filter(Boolean).length;

  const handleClearAll = () => {
    router.push("/shop");
    setMinPriceInput("");
    setMaxPriceInput("");
  };

  const AccordionHeader = ({ 
    id, 
    title, 
    count 
  }: { 
    id: string; 
    title: string; 
    count?: number; 
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(id)}
      className="hv-accordion-header-btn"
      aria-expanded={!collapsed[id]}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span className="hv-filter-subtitle">{title}</span>
        {typeof count === "number" && count > 0 && (
          <span className="hv-section-count-badge">{count}</span>
        )}
      </div>
      <ChevronDown
        size={16}
        className={`hv-chevron ${collapsed[id] ? "collapsed" : ""}`}
      />
    </button>
  );

  const FilterPanel = () => {
    const selectedSizes = activeSize ? activeSize.split(",") : [];
    const selectedColors = activeColor ? activeColor.split(",") : [];
    const selectedBrands = activeBrand ? activeBrand.split(",") : [];

    return (
      <div className="hv-filter-container">
        <div className="hv-filter-header">
          <h3 className="hv-filter-title">{t("Filters")}</h3>
          {activeFilterCount > 0 && (
            <button onClick={handleClearAll} className="hv-clear-all-btn">
              {t("Clear All")} ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Categories Section */}
        <div className="hv-filter-section">
          <AccordionHeader 
            id="categories" 
            title={t("Categories")} 
            count={activeCategory !== "all" ? 1 : 0} 
          />
          {!collapsed.categories && (
            <div className="hv-accordion-body">
              <label className="hv-checkbox-label">
                <input
                  type="checkbox"
                  checked={activeCategory === "all"}
                  onChange={() => updateFilters({ category: "all" })}
                  className="hv-checkbox"
                />
                <span>{t("All Categories") || "All Categories"}</span>
              </label>
              {categories.map((cat) => (
                <label key={cat._id} className="hv-checkbox-label">
                  <input
                    type="checkbox"
                    checked={activeCategory.toLowerCase() === cat.slug.toLowerCase()}
                    onChange={() => handleCategoryChange(cat.slug)}
                    className="hv-checkbox"
                  />
                  <span>{t(cat.name)}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Section */}
        <div className="hv-filter-section">
          <AccordionHeader 
            id="price" 
            title={t("Price Range")} 
            count={activeMinPrice || activeMaxPrice ? 1 : 0} 
          />
          {!collapsed.price && (
            <div className="hv-accordion-body">
              <form onSubmit={handlePriceApply} className="hv-price-form">
                <div className="hv-price-inputs">
                  <div className="hv-price-field">
                    <span className="hv-price-currency">{currency}</span>
                    <input
                      type="number"
                      value={minPriceInput}
                      onChange={(e) => setMinPriceInput(e.target.value)}
                      placeholder={t("Min") || "Min"}
                      className="hv-price-input"
                    />
                  </div>
                  <span className="hv-price-separator">-</span>
                  <div className="hv-price-field">
                    <span className="hv-price-currency">{currency}</span>
                    <input
                      type="number"
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                      placeholder={t("Max") || "Max"}
                      className="hv-price-input"
                    />
                  </div>
                </div>
                <button type="submit" className="hv-apply-btn">
                  {t("Apply Filter") || "Apply Price"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Availability Section */}
        <div className="hv-filter-section">
          <AccordionHeader 
            id="availability" 
            title={t("Availability")} 
            count={[activeInStock, activeOnSale, activeFeatured].filter(Boolean).length} 
          />
          {!collapsed.availability && (
            <div className="hv-accordion-body">
              <label className="hv-checkbox-label">
                <input
                  type="checkbox"
                  checked={activeInStock}
                  onChange={(e) => updateFilters({ inStock: e.target.checked ? "true" : null })}
                  className="hv-checkbox"
                />
                <span>{t("In Stock Only")}</span>
              </label>
              <label className="hv-checkbox-label">
                <input
                  type="checkbox"
                  checked={activeOnSale}
                  onChange={(e) => updateFilters({ isOnSale: e.target.checked ? "true" : null })}
                  className="hv-checkbox"
                />
                <span>{t("On Sale")}</span>
              </label>
              <label className="hv-checkbox-label">
                <input
                  type="checkbox"
                  checked={activeFeatured}
                  onChange={(e) => updateFilters({ isFeatured: e.target.checked ? "true" : null })}
                  className="hv-checkbox"
                />
                <span>{t("Featured Only")}</span>
              </label>
            </div>
          )}
        </div>

        {/* Collections Section */}
        <div className="hv-filter-section">
          <AccordionHeader 
            id="collections" 
            title={t("Collections")} 
            count={activeCollection ? 1 : 0} 
          />
          {!collapsed.collections && (
            <div className="hv-accordion-body">
              {[
                { label: "New Arrivals", value: "new-arrivals" },
                { label: "Best Sellers", value: "best-sellers" },
                { label: "Winter Clearance", value: "winter-clearance" },
                { label: "Featured Products", value: "featured" },
              ].map((c) => (
                <label key={c.value} className="hv-checkbox-label">
                  <input
                    type="checkbox"
                    checked={activeCollection === c.value}
                    onChange={() => handleCollectionToggle(c.value)}
                    className="hv-checkbox"
                  />
                  <span>{t(c.label)}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Brands Section */}
        {availableBrands.length > 0 && (
          <div id="brands-filter" className="hv-filter-section">
            <AccordionHeader 
              id="brands" 
              title={t("Brands")} 
              count={selectedBrands.length} 
            />
            {!collapsed.brands && (
              <div className="hv-accordion-body">
                {availableBrands.map((br) => {
                  const isSelected = selectedBrands.includes(br);
                  return (
                    <label key={br} className="hv-checkbox-label">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleBrandToggle(br)}
                        className="hv-checkbox"
                      />
                      <span>{br}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Sizes Section */}
        {availableSizes.length > 0 && (
          <div className="hv-filter-section">
            <AccordionHeader 
              id="sizes" 
              title={t("Sizes")} 
              count={selectedSizes.length} 
            />
            {!collapsed.sizes && (
              <div className="hv-accordion-body">
                <div className="hv-size-grid">
                  {availableSizes.map((sz) => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleSizeToggle(sz)}
                        className={`hv-size-box ${isSelected ? "selected" : ""}`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Colors Swatches Section */}
        {availableColors.length > 0 && (
          <div className="hv-filter-section">
            <AccordionHeader 
              id="colors" 
              title={t("Colors")} 
              count={selectedColors.length} 
            />
            {!collapsed.colors && (
              <div className="hv-accordion-body">
                <div className="hv-color-grid">
                  {availableColors.map((hex) => {
                    const isSelected = selectedColors.includes(hex);
                    const readableName = getColorName(hex);
                    const isWhite = hex.toLowerCase() === "#ffffff" || hex.toLowerCase() === "#fff";
                    return (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => handleColorToggle(hex)}
                        title={readableName}
                        className={`hv-color-swatch ${isSelected ? "selected" : ""}`}
                        style={{
                          backgroundColor: hex,
                          border: isWhite ? "1px solid #cbd5e1" : "none",
                        }}
                      >
                        {isSelected && (
                          <Check 
                            size={12} 
                            color={isWhite || hex.toLowerCase() === "#ffd700" || hex.toLowerCase() === "#b0e0e6" ? "#000" : "#fff"} 
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const paginatedProducts = initialProducts.slice(0, limit);

  return (
    <div className="hv-shop-container">
      {/* Dynamic Scoped CSS for Perfect Mobile Responsiveness & Accordions */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hv-shop-container {
          padding: 30px 24px;
          max-width: 1440px;
          margin: 0 auto;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        .hv-quick-filter-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
          padding: 14px 20px;
          background-color: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .hv-quick-filter-bar::-webkit-scrollbar {
          display: none;
        }
        .hv-quick-filters-label {
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          flex-shrink: 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .hv-quick-filter-list {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
        .hv-quick-filter-btn {
          padding: 7px 15px;
          border-radius: 50px;
          border: 1px solid #e2e8f0;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
          white-space: nowrap;
          cursor: pointer;
          background: #ffffff;
          color: #1e293b;
        }
        .hv-quick-filter-btn.active {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }
        .hv-shop-layout {
          display: flex;
          gap: 36px;
          position: relative;
        }

        /* Desktop Sidebar: Visible on Desktop, Hidden on Mobile */
        .hv-desktop-sidebar {
          display: block;
          width: 270px;
          flex-shrink: 0;
        }

        /* Mobile Trigger Button: Hidden on Desktop, Visible on Mobile */
        .hv-mobile-filter-btn {
          display: none;
        }

        /* Floating Filter Pill: Hidden on Desktop */
        .hv-floating-filter-pill {
          display: none;
        }

        /* Filter Accordion Styles */
        .hv-filter-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .hv-filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 8px;
          border-bottom: 2px solid #0f172a;
        }
        .hv-filter-title {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .hv-clear-all-btn {
          font-size: 12px;
          color: #ef4444;
          font-weight: 700;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
        }
        .hv-filter-section {
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 18px;
        }
        .hv-accordion-header-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          background: transparent;
          border: none;
          padding: 4px 0 10px 0;
          cursor: pointer;
          text-align: left;
        }
        .hv-filter-subtitle {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin: 0;
        }
        .hv-section-count-badge {
          background: #0f172a;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          padding: 1px 7px;
          border-radius: 9999px;
        }
        .hv-chevron {
          color: #64748b;
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hv-chevron.collapsed {
          transform: rotate(-90deg);
        }
        .hv-accordion-body {
          padding-top: 6px;
          animation: hvFadeIn 0.2s ease;
        }
        @keyframes hvFadeIn {
          from { opacity: 0; transform: translateY(-3px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hv-checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #334155;
          margin-bottom: 9px;
          cursor: pointer;
          user-select: none;
        }
        .hv-checkbox {
          width: 16px;
          height: 16px;
          accent-color: #0f172a;
          cursor: pointer;
        }
        .hv-price-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .hv-price-inputs {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hv-price-field {
          position: relative;
          flex: 1;
        }
        .hv-price-currency {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 13px;
          color: #94a3b8;
        }
        .hv-price-input {
          width: 100%;
          padding: 8px 8px 8px 24px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 13px;
          color: #334155;
          outline: none;
          box-sizing: border-box;
        }
        .hv-price-separator {
          color: #94a3b8;
        }
        .hv-apply-btn {
          background-color: #0f172a;
          color: white;
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          text-align: center;
          transition: background 0.15s;
        }
        .hv-size-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }
        .hv-size-box {
          padding: 7px 4px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          background: #f1f5f9;
          color: #334155;
          border: 1px solid #e2e8f0;
          text-align: center;
        }
        .hv-size-box.selected {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }
        .hv-color-grid {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .hv-color-swatch {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s;
        }
        .hv-color-swatch.selected {
          box-shadow: 0 0 0 2px #fff, 0 0 0 4px #0f172a;
        }

        /* Products Grid & Cards */
        .hv-main-content {
          flex: 1;
          min-width: 0;
        }
        .hv-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .hv-collection-title {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .hv-results-count {
          font-size: 13px;
          color: #64748b;
          margin-top: 4px;
        }
        .hv-toolbar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .hv-layout-toggles {
          display: flex;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          overflow: hidden;
          background: white;
        }
        .hv-layout-toggle-btn {
          padding: 8px 12px;
          display: flex;
          align-items: center;
          cursor: pointer;
          background: white;
          border: none;
        }
        .hv-select-wrapper {
          position: relative;
        }
        .hv-select {
          appearance: none;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 8px 30px 8px 14px;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          background: white;
          cursor: pointer;
          outline: none;
        }
        .hv-select-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
        }
        .hv-product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 24px;
        }
        .hv-product-card {
          display: flex;
          flex-direction: column;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          text-decoration: none;
          color: inherit;
        }
        .hv-product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -10px rgba(0,0,0,0.12);
          border-color: #cbd5e1;
        }
        .hv-card-img-container {
          height: 250px;
          position: relative;
          background: #f8fafc;
          overflow: hidden;
        }
        .hv-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .hv-product-card:hover .hv-card-img {
          transform: scale(1.04);
        }
        .hv-sale-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #10b981;
          color: white;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 6px;
          letter-spacing: 0.5px;
        }
        .hv-best-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #0f172a;
          color: #f8fafc;
          font-size: 9px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 6px;
          letter-spacing: 0.5px;
        }
        .hv-card-info {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }
        .hv-card-category {
          font-size: 10px;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 1px;
        }
        .hv-card-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          line-height: 1.35;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .hv-list-view {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .hv-list-card {
          display: flex;
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
        }
        .hv-list-card-img {
          width: 220px;
          height: 220px;
          object-fit: cover;
          background: #f8fafc;
          flex-shrink: 0;
        }
        .hv-list-card-body {
          flex: 1;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        /* Mobile Filter Drawer Elements */
        .hv-filter-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          z-index: 99998;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .hv-filter-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }
        .hv-filter-drawer {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 88%;
          max-width: 380px;
          height: 100%;
          background: #ffffff;
          z-index: 99999;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          transform: translateX(-100%);
          transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hv-filter-drawer.open {
          transform: translateX(0);
        }
        .hv-filter-drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 20px;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }
        .hv-filter-badge-pill {
          background: #0f172a;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 9999px;
        }
        .hv-close-drawer-btn {
          background: transparent;
          border: none;
          padding: 6px;
          cursor: pointer;
          color: #475569;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hv-close-drawer-btn:hover {
          background: #e2e8f0;
        }
        .hv-filter-drawer-body {
          padding: 20px;
          overflow-y: auto;
          flex: 1;
          -webkit-overflow-scrolling: touch;
        }
        .hv-filter-drawer-footer {
          display: flex;
          gap: 12px;
          padding: 16px 20px;
          border-top: 1px solid #e2e8f0;
          background: #ffffff;
          box-shadow: 0 -4px 12px rgba(0,0,0,0.03);
        }
        .hv-drawer-reset-btn {
          flex: 1;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          font-weight: 700;
          font-size: 13px;
          color: #475569;
          background: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hv-drawer-apply-btn {
          flex: 2;
          padding: 12px;
          border-radius: 10px;
          background: #0f172a;
          color: #ffffff;
          font-weight: 700;
          font-size: 14px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.25);
        }

        /* RESPONSIVE MEDIA QUERIES FOR MOBILE/TABLET */
        @media (max-width: 992px) {
          .hv-desktop-sidebar {
            display: none !important;
          }
          .hv-shop-layout {
            flex-direction: column !important;
            gap: 0 !important;
          }
          .hv-mobile-filter-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            padding: 13px 20px;
            border-radius: 12px;
            border: 1px solid #0f172a;
            background: #0f172a;
            color: #ffffff;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            margin-bottom: 20px;
            box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);
            transition: all 0.2s ease;
          }
          .hv-floating-filter-pill {
            display: inline-flex !important;
            position: fixed;
            bottom: 22px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9990;
            align-items: center;
            gap: 8px;
            background: #0f172a;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 700;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 16px rgba(56, 189, 248, 0.35);
            cursor: pointer;
            backdrop-filter: blur(8px);
            white-space: nowrap;
          }
          .hv-product-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 16px;
          }
          .hv-toolbar {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .hv-toolbar-actions {
            width: 100%;
            justify-content: space-between;
          }
        }

        @media (max-width: 580px) {
          .hv-shop-container {
            padding: 16px 12px 90px;
          }
          .hv-quick-filter-bar {
            margin-bottom: 14px;
            padding: 10px 14px;
          }
          .hv-product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .hv-card-img-container {
            height: 170px !important;
          }
          .hv-card-info {
            padding: 10px !important;
          }
          .hv-card-title {
            font-size: 13px !important;
            height: 36px;
            white-space: normal !important;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .hv-list-card {
            flex-direction: column !important;
          }
          .hv-list-card-img {
            width: 100% !important;
            height: 190px !important;
          }
          .hv-collection-title {
            font-size: 22px;
          }
        }
      `}} />

      {/* Quick top category filters */}
      <div className="hv-quick-filter-bar">
        <div className="hv-quick-filters-label">{t("Quick Filters:") || "Quick Filters:"}</div>
        <div className="hv-quick-filter-list">
          <button
            onClick={() => updateFilters({ category: "all" })}
            className={`hv-quick-filter-btn ${activeCategory === "all" ? "active" : ""}`}
          >
            {t("All")}
          </button>
          {categories.map((cat) => {
            const isActive = activeCategory.toLowerCase() === cat.slug.toLowerCase();
            return (
              <button
                key={cat._id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`hv-quick-filter-btn ${isActive ? "active" : ""}`}
              >
                {t(cat.name)}
              </button>
            );
          })}
          <button
            onClick={() => updateFilters({ isOnSale: activeOnSale ? null : "true" })}
            className={`hv-quick-filter-btn ${activeOnSale ? "active" : ""}`}
          >
            {t("Sale") || "Sale"}
          </button>
          <button
            onClick={() => updateFilters({ collection: activeCollection === "best-sellers" ? null : "best-sellers" })}
            className={`hv-quick-filter-btn ${activeCollection === "best-sellers" ? "active" : ""}`}
          >
            {t("Best Seller") || "Best Seller"}
          </button>
        </div>
      </div>

      <div className="hv-shop-layout">
        {/* Mobile Filter Button (Top Trigger) */}
        <button
          onClick={() => setFiltersOpen(true)}
          className="hv-mobile-filter-btn"
          type="button"
        >
          <SlidersHorizontal size={17} />
          <span>{t("Filters & Refinements")}</span>
          {activeFilterCount > 0 && (
            <span className="hv-filter-badge-pill">{activeFilterCount}</span>
          )}
        </button>

        {/* Floating Mobile Filter Pill (Thumb Access on Scroll) */}
        <button
          onClick={() => setFiltersOpen(true)}
          className="hv-floating-filter-pill"
          type="button"
        >
          <SlidersHorizontal size={15} />
          <span>{t("Filter Products")}</span>
          {activeFilterCount > 0 && (
            <span style={{
              background: "#38bdf8",
              color: "#0f172a",
              borderRadius: "9999px",
              padding: "1px 7px",
              fontSize: "11px",
              fontWeight: "800",
            }}>{activeFilterCount}</span>
          )}
        </button>

        {/* Mobile Filter Drawer Overlay */}
        <div
          className={`hv-filter-overlay ${filtersOpen ? "open" : ""}`}
          onClick={() => setFiltersOpen(false)}
        />

        {/* Mobile Filter Drawer */}
        <div
          className={`hv-filter-drawer ${filtersOpen ? "open" : ""}`}
        >
          <div className="hv-filter-drawer-header">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <SlidersHorizontal size={18} color="#0f172a" />
              <h3 style={{ margin: 0, fontWeight: "800", fontSize: "17px", color: "#0f172a" }}>
                {t("Filters")}
              </h3>
              {activeFilterCount > 0 && (
                <span className="hv-filter-badge-pill">{activeFilterCount} active</span>
              )}
            </div>
            <button
              onClick={() => setFiltersOpen(false)}
              className="hv-close-drawer-btn"
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          </div>
          <div className="hv-filter-drawer-body">
            <FilterPanel />
          </div>
          <div className="hv-filter-drawer-footer">
            <button
              onClick={handleClearAll}
              className="hv-drawer-reset-btn"
            >
              <RotateCcw size={14} style={{ marginRight: 6 }} />
              {t("Clear All")}
            </button>
            <button
              onClick={() => setFiltersOpen(false)}
              className="hv-drawer-apply-btn"
            >
              {t("Show Results")} ({initialProducts.length})
            </button>
          </div>
        </div>

        {/* Desktop Sidebar (Strictly hidden on mobile <= 992px) */}
        <aside className="hv-desktop-sidebar">
          <FilterPanel />
        </aside>

        {/* Main Product Area */}
        <main className="hv-main-content">
          {/* Toolbar */}
          <div className="hv-toolbar">
            <div>
              <h2 className="hv-collection-title">{t("Shop Collection")}</h2>
              <p className="hv-results-count">
                {t("Showing")} 1-{paginatedProducts.length} {t("of") || "of"} {initialProducts.length} {t("products")}
              </p>
            </div>
            
            <div className="hv-toolbar-actions">
              {/* Layout Mode */}
              <div className="hv-layout-toggles">
                <button 
                  onClick={() => setLayoutMode("grid")}
                  className="hv-layout-toggle-btn"
                  style={{ color: layoutMode === "grid" ? "#0f172a" : "#94a3b8" }}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setLayoutMode("list")}
                  className="hv-layout-toggle-btn"
                  style={{ color: layoutMode === "list" ? "#0f172a" : "#94a3b8" }}
                  aria-label="List view"
                >
                  <List size={18} />
                </button>
              </div>

              {/* Items Per Page */}
              <div className="hv-select-wrapper">
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="hv-select"
                >
                  <option value={12}>12 {t("per page") || "per page"}</option>
                  <option value={24}>24 {t("per page") || "per page"}</option>
                  <option value={48}>48 {t("per page") || "per page"}</option>
                </select>
                <ChevronDown size={14} className="hv-select-icon" />
              </div>

              {/* Sorting */}
              <div className="hv-select-wrapper">
                <select
                  value={activeSort}
                  onChange={handleSortChange}
                  className="hv-select"
                >
                  <option value="newest">{t("Newest Arrivals")}</option>
                  <option value="price_asc">{t("Price: Low to High")}</option>
                  <option value="price_desc">{t("Price: High to Low")}</option>
                </select>
                <ChevronDown size={14} className="hv-select-icon" />
              </div>
            </div>
          </div>

          {/* Product Grid / List Rendering */}
          {initialProducts.length === 0 ? (
            <div style={{
              padding: "70px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              borderRadius: "16px",
              border: "1px dashed #cbd5e1",
            }}>
              <ShoppingBag size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
              <p style={{ fontSize: "16px", color: "#475569", fontWeight: "600", margin: "0 0 16px 0" }}>
                {t("No products match your selected filters.")}
              </p>
              <button
                onClick={handleClearAll}
                style={{
                  backgroundColor: "#0f172a",
                  color: "white",
                  padding: "10px 24px",
                  borderRadius: "50px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                {t("Reset Filters")}
              </button>
            </div>
          ) : layoutMode === "grid" ? (
            <div className="hv-product-grid">
              {paginatedProducts.map((product) => (
                <Link href={getProductLink(product)} key={product._id} className="hv-product-card">
                  <div className="hv-card-img-container">
                    <img src={product.images[0]} alt={product.name} className="hv-card-img" loading="lazy" />
                    
                    {/* Badge Overlays */}
                    {product.isOnSale && <span className="hv-sale-badge">{t("Sale") || "SALE"}</span>}
                    {product.ratings >= 4.8 && <span className="hv-best-badge">{t("Best Seller") || "BEST SELLER"}</span>}
                  </div>
                  <div className="hv-card-info">
                    <span className="hv-card-category">{t(product.category).toUpperCase()}</span>
                    <h3 className="hv-card-title">{product.name}</h3>
                    
                    {/* Rating stars */}
                    <div style={{ display: "flex", alignItems: "center", gap: "2px", margin: "2px 0" }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          fill={i < Math.floor(product.ratings) ? "#fbbf24" : "none"}
                          stroke="#fbbf24"
                        />
                      ))}
                      <span style={{ fontSize: "11px", color: "#64748b", marginLeft: "4px" }}>
                        ({product.reviewsCount})
                      </span>
                    </div>

                    {renderPrices(product)}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="hv-list-view">
              {paginatedProducts.map((product) => (
                <Link href={getProductLink(product)} key={product._id} className="hv-list-card">
                  <img src={product.images[0]} alt={product.name} className="hv-list-card-img" loading="lazy" />
                  <div className="hv-list-card-body">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                      <div>
                        <span className="hv-card-category">{t(product.category).toUpperCase()}</span>
                        <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: "4px 0 0 0" }}>
                          {product.name}
                        </h3>
                      </div>
                      {renderPrices(product, true)}
                    </div>

                    {/* Ratings */}
                    <div style={{ display: "flex", alignItems: "center", gap: "2px", margin: "8px 0" }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < Math.floor(product.ratings) ? "#fbbf24" : "none"}
                          stroke="#fbbf24"
                        />
                      ))}
                      <span style={{ fontSize: "11px", color: "#64748b", marginLeft: "4px" }}>
                        ({product.reviewsCount} {t("reviews") || "reviews"})
                      </span>
                    </div>

                    <p style={{
                      fontSize: "13px",
                      color: "#475569",
                      margin: "8px 0 16px 0",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: "1.5",
                    }}>
                      {product.description}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
                      <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>
                        {t("Brand") || "Brand"}: {product.brand}
                      </span>
                      <span style={{
                        backgroundColor: "#0f172a",
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: "50px",
                        fontSize: "12px",
                        fontWeight: "700",
                      }}>
                        {t("View Details")}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
