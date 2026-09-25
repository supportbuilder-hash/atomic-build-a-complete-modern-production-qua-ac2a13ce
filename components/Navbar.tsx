"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Menu, X, Wrench, ChevronDown } from 'lucide-react';
import { navLinks } from "@/lib/data";
import { navbarVariants } from "@/lib/motion";

export default function Navbar() {
  const t = useTranslations();
  const navT = t.raw("nav") as Record<string, string>;
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      if (pathname === "/") {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const getHref = (href: string) => {
    if (href.startsWith("#")) {
      return pathname === "/" ? href : `/${href}`;
    }
    return href;
  };

  return (
    <motion.header
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--card)]/95 backdrop-blur-md shadow-[0_2px_12px_0_rgba(79,70,229,0.07),0_1px_3px_0_rgba(15,14,26,0.06)] border-b border-[var(--border)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group focus-visible:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-sm group-hover:bg-[var(--primary-hover)] transition-colors duration-200">
              <Wrench className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="font-display font-800 text-xl tracking-tight text-[var(--foreground)]">
              Fix<span className="text-[var(--primary)]">ly</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href !== "/" && link.href.startsWith("/")
                  ? pathname.startsWith(link.href)
                  : pathname === link.href;

              return (
                <Link
                  key={link.key}
                  href={getHref(link.href)}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-1 ${
                    isActive
                      ? "text-[var(--primary)] bg-[var(--primary)]/8"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                  }`}
                >
                  {navT[link.key] ?? link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-[var(--primary)]/8 -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/customer/dashboard"
              className="px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors duration-200 rounded-lg hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            >
              {navT["signIn"] ?? "Sign In"}
            </Link>
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link
                href="/find-professionals"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-xl transition-all duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
              >
                {navT["bookNow"] ?? "Book a Pro"}
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden overflow-hidden bg-[var(--card)] border-t border-[var(--border)]"
          >
            <nav
              className="px-4 py-4 flex flex-col gap-1"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link) => {
                const isActive =
                  link.href !== "/" && link.href.startsWith("/")
                    ? pathname.startsWith(link.href)
                    : pathname === link.href;

                return (
                  <Link
                    key={link.key}
                    href={getHref(link.href)}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-[var(--primary)] bg-[var(--primary)]/8 font-semibold"
                        : "text-[var(--foreground)] hover:bg-[var(--muted)]"
                    }`}
                  >
                    {navT[link.key] ?? link.label}
                  </Link>
                );
              })}

              <div className="mt-3 pt-3 border-t border-[var(--border)] flex flex-col gap-2">
                <Link
                  href="/customer/dashboard"
                  className="px-4 py-3 rounded-xl text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors duration-200 text-center"
                >
                  {navT["signIn"] ?? "Sign In"}
                </Link>
                <Link
                  href="/find-professionals"
                  className="px-4 py-3 rounded-xl text-sm font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors duration-200 text-center"
                >
                  {navT["bookNow"] ?? "Book a Pro"}
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}