"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut, LayoutDashboard, LogIn, UserPlus, Menu, X, Package, Heart, Bell } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Navbar() {
  const { cartCount, user, logout, t } = useApp();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowDropdown(false);
    setShowNotifications(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Hide Navbar on Admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isHomeActive = pathname === "/" || pathname === "/en" || pathname === "/en/" || pathname === "";

  const navLinks = [
    { href: "/", label: "Home", active: isHomeActive },
    { href: "#consultation", label: "Inquiry Services Page", active: false },
    { href: "#pricing", label: "Plans & Pricing", active: false },
    { href: "#blog", label: "Blog", active: false },
    { href: "#notifications", label: "Notifications", active: false, isAction: true, action: () => setShowNotifications(prev => !prev) },
    { href: "/account/orders", label: "My Subscriptions", active: pathname?.includes("/orders") },
  ];

  return (
    <>
      <header className="hv-site-header">
        <div className="hv-header-inner">
          {/* Mobile hamburger */}
          <button
            className="hv-mobile-toggle"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Framed Logo */}
          <Link href="/" className="hv-logo-link">
            <img 
              src="/huonvision-logo.png" 
              alt="HuonVision" 
              className="hv-logo-img"
              onError={(e) => {
                // Fallback to static wix if needed
                (e.currentTarget as HTMLImageElement).src = "https://static.wixstatic.com/media/88a5c5_ed38a0f979fb4a23b892256d412e0d86~mv2.png";
              }}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hv-desktop-nav">
            {navLinks.map((link) => (
              link.isAction ? (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="hv-nav-link"
                  type="button"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`hv-nav-link ${link.active ? "hv-nav-active" : ""}`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* Right Action Icons: Orange Avatar & Shopping Bag */}
          <div className="hv-header-actions">
            {/* Notifications Popover if clicked */}
            {showNotifications && (
              <div className="hv-notifications-card">
                <div className="hv-notif-header">
                  <span className="font-semibold text-sm text-slate-800">Notifications</span>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-3 text-xs text-slate-600">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 mb-2">
                    <p className="font-medium text-slate-800 mb-0.5">Welcome to HuonVision</p>
                    <p className="text-slate-500 text-[11px]">Explore our 6 Strategic Capability Pillars &amp; Solutions Catalog.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                    <p className="font-medium text-emerald-900 mb-0.5">Green Strategy 2026</p>
                    <p className="text-emerald-700 text-[11px]">Operational Decarbonization Roadmap is now available.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Avatar with Orange Circle */}
            <div className="relative">
              <button
                className="hv-avatar-btn"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-label="User Profile"
              >
                <User size={18} strokeWidth={2.5} />
              </button>

              {showDropdown && (
                <div className="hv-profile-dropdown">
                  {user ? (
                    <>
                      <div className="hv-dropdown-header">
                        <p className="font-semibold text-sm text-slate-900">@{user.username}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/account/profile"
                        className="hv-dropdown-item"
                        onClick={() => setShowDropdown(false)}
                      >
                        <User size={15} className="mr-2 text-slate-500" />
                        Profile Settings
                      </Link>
                      <Link
                        href="/account/orders"
                        className="hv-dropdown-item"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Package size={15} className="mr-2 text-slate-500" />
                        My Subscriptions &amp; Orders
                      </Link>
                      <Link
                        href="/account/wishlist"
                        className="hv-dropdown-item"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Heart size={15} className="mr-2 text-slate-500" />
                        Saved Solutions
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          className="hv-dropdown-item font-medium text-emerald-700 hover:text-emerald-800"
                          onClick={() => setShowDropdown(false)}
                        >
                          <LayoutDashboard size={15} className="mr-2 text-emerald-600" />
                          Admin Console
                        </Link>
                      )}
                      <div className="border-t border-slate-100 my-1" />
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          logout();
                        }}
                        className="hv-dropdown-item text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={15} className="mr-2" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="hv-dropdown-item"
                        onClick={() => setShowDropdown(false)}
                      >
                        <LogIn size={15} className="mr-2 text-slate-500" />
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        className="hv-dropdown-item"
                        onClick={() => setShowDropdown(false)}
                      >
                        <UserPlus size={15} className="mr-2 text-slate-500" />
                        Register Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Bag Icon with Centered Count */}
            <Link href="/cart" className="hv-cart-btn" aria-label="Shopping Cart">
              <svg 
                width="24" 
                height="26" 
                viewBox="0 0 24 26" 
                fill="none" 
                stroke="#0f172a" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="hv-bag-svg"
              >
                <path d="M6 3 3 7.5v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-15L18 3Z"/>
                <path d="M3 7.5h18"/>
                <path d="M16 11.5a4 4 0 0 1-8 0"/>
              </svg>
              <span className="hv-cart-inner-count">
                {cartCount || 0}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`hv-mobile-overlay ${mobileMenuOpen ? "active" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <aside className={`hv-mobile-drawer ${mobileMenuOpen ? "active" : ""}`}>
        <div className="hv-mobile-drawer-header">
          <img 
            src="/huonvision-logo.png" 
            alt="HuonVision" 
            className="h-[36px] w-auto object-contain" 
          />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 text-slate-600 hover:text-slate-900"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="hv-mobile-nav-list">
          {navLinks.map((link) => (
            link.isAction ? (
              <button
                key={link.label}
                onClick={() => {
                  setMobileMenuOpen(false);
                  link.action();
                }}
                className="hv-mobile-nav-link text-left"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className={`hv-mobile-nav-link ${link.active ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>

        <div className="hv-mobile-auth-section">
          {user ? (
            <>
              <div className="p-3 bg-slate-50 rounded-lg mb-2">
                <p className="font-semibold text-sm text-slate-800">@{user.username}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
              <Link href="/account/profile" className="hv-mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                Profile
              </Link>
              <Link href="/account/orders" className="hv-mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                My Subscriptions &amp; Orders
              </Link>
              {user.role === "admin" && (
                <Link href="/admin" className="hv-mobile-nav-link text-emerald-600" onClick={() => setMobileMenuOpen(false)}>
                  Admin Console
                </Link>
              )}
              <button
                onClick={() => { setMobileMenuOpen(false); logout(); }}
                className="hv-mobile-nav-link text-red-600 text-left w-full mt-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" className="hv-mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Link href="/signup" className="hv-mobile-nav-link font-medium text-emerald-700" onClick={() => setMobileMenuOpen(false)}>
                Register Account
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
