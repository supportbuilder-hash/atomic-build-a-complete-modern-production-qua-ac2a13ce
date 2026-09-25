"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Zap, Droplets, Wind, Sparkles, Hammer, Paintbrush, Shield, Settings, Lock, Leaf, Package, Wrench, Search, MapPin, Star, BadgeCheck, ChevronRight, ArrowRight, SlidersHorizontal, X } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/motion";
import { ServiceCategory, Provider } from "@/lib/data";
type serviceCategories = any;
const serviceCategories: any = [];
type featuredProviders = any;
const featuredProviders: any = [];
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap, Droplets, Wind, Sparkles, Hammer, Paintbrush, Shield,
  Settings, Lock, Leaf, Package, Wrench,
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  electrician: "Panel upgrades, wiring, outlets, lighting installation, and emergency repairs.",
  plumber: "Leak fixes, pipe installation, drain cleaning, water heater service.",
  hvac: "AC installation, tune-ups, duct cleaning, heating system repair.",
  cleaning: "Deep cleaning, move-in/out, recurring maid service, post-construction.",
  carpentry: "Custom furniture, cabinetry, deck building, door and window framing.",
  painting: "Interior and exterior painting, wallpaper removal, texture finishes.",
  "pest-control": "Termite treatment, rodent control, bed bug extermination, prevention.",
  "appliance-repair": "Washer, dryer, refrigerator, dishwasher, oven repair and maintenance.",
  "home-security": "Camera installation, alarm systems, smart locks, monitoring setup.",
  landscaping: "Lawn care, tree trimming, irrigation, garden design, seasonal cleanup.",
  moving: "Local and long-distance moving, packing, furniture assembly, storage.",
  handyman: "General repairs, furniture assembly, mounting, caulking, odd jobs.",
};

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "providers", label: "Most Providers" },
  { value: "az", label: "A to Z" },
];

const QUICK_TAGS = [
  "AC Repair", "Electrician", "Plumber", "House Cleaning",
  "Pest Control", "Handyman", "Painting", "Landscaping",
];

export default function ServicesPage() {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...serviceCategories];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (CATEGORY_DESCRIPTIONS[c.slug] ?? "").toLowerCase().includes(q)
      );
    }
    if (sort === "providers") list.sort((a, b) => b.count - a.count);
    else if (sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [search, sort]);

  return (
    <main className="min-h-screen bg-[hsl(var(--background))]">
      {/* ── Hero / Search Bar ── */}
      <Reveal>
        <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--background))] via-[var(--accent)]/5 to-[hsl(var(--background))] pt-20 pb-10">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] rounded-full bg-[var(--accent)]/10 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--accent)] mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                {t("services.badge")}
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[hsl(var(--foreground))] text-balance">
                {t("services.hero.title")}
              </h1>
              <p className="mt-3 text-base sm:text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto text-pretty">
                {t("services.hero.subtitle")}
              </p>
            </motion.div>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("services.search.placeholder")}
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] pl-10 pr-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="relative sm:w-52">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t("services.location.placeholder")}
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] pl-10 pr-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition-all"
                />
              </div>
              <Link
                href={`/find-professionals${search ? `?q=${encodeURIComponent(search)}` : ""}${location ? `&loc=${encodeURIComponent(location)}` : ""}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-black hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                {t("services.search.cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Quick tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.22 }}
              className="mt-5 flex flex-wrap justify-center gap-2"
            >
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearch(tag)}
                  className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))] hover:border-[var(--accent)]/50 hover:text-[hsl(var(--foreground))] transition-colors"
                >
                  {tag}
                </button>
              ))}
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* ── Sticky filter bar ── */}
      <div className="sticky top-0 z-30 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 py-3">
          <p className="text-sm text-[hsl(var(--muted-foreground))] shrink-0">
            <span className="font-semibold text-[hsl(var(--foreground))]">{filtered.length}</span>{" "}
            {t("services.filter.resultCount")}
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[hsl(var(--muted-foreground))] hidden sm:inline">{t("services.filter.sortLabel")}</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                showFilters
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {t("services.filter.button")}
            </button>
          </div>
        </div>
        {showFilters && (
          <div className="border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 px-4 sm:px-6 lg:px-8 py-3">
            <div className="mx-auto max-w-7xl flex flex-wrap gap-2 items-center">
              <span className="text-xs font-medium text-[hsl(var(--muted-foreground))]">{t("services.filter.quickFilter")}</span>
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setSearch(tag); setShowFilters(false); }}
                  className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1 text-xs font-medium text-[hsl(var(--muted-foreground))] hover:border-[var(--accent)]/50 hover:text-[hsl(var(--foreground))] transition-colors"
                >
                  {tag}
                </button>
              ))}
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="ml-auto flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  {t("services.filter.clearAll")}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Categories Grid ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        {filtered.length === 0 ? (
          <Reveal>
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Search className="h-12 w-12 text-[hsl(var(--muted-foreground))]/40 mb-4" />
              <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">{t("services.empty.title")}</h2>
              <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{t("services.empty.subtitle")}</p>
              <button
                onClick={() => setSearch("")}
                className="mt-5 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90 transition-opacity"
              >
                {t("services.empty.cta")}
              </button>
            </div>
          </Reveal>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </motion.div>
        )}
      </section>

      {/* ── Stats strip ── */}
      <Reveal>
        <section className="border-y border-[hsl(var(--border))] bg-[hsl(var(--card))]/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {(
                [
                  { value: "2,400+", label: t("services.stats.providers") },
                  { value: "12", label: t("services.stats.categories") },
                  { value: "98%", label: t("services.stats.satisfaction") },
                  { value: "60s", label: t("services.stats.booking") },
                ] as { value: string; label: string }[]
              ).map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-bold text-[hsl(var(--foreground))]">{s.value}</div>
                  <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Featured Professionals horizontal scroll ── */}
      <Reveal>
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-7">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                  {t("services.featured.title")}
                </h2>
                <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                  {t("services.featured.subtitle")}
                </p>
              </div>
              <Link
                href="/find-professionals"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:opacity-80 transition-opacity"
              >
                {t("services.featured.viewAll")}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              {featuredProviders.map((pro) => (
                <FeaturedProviderCard key={pro.id} provider={pro} />
              ))}
            </div>

            <div className="mt-5 sm:hidden text-center">
              <Link
                href="/find-professionals"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)]"
              >
                {t("services.featured.viewAll")}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── How to book CTA ── */}
      <Reveal>
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent)]/70 p-10 sm:p-14 text-center">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-black/10 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-black/10 blur-2xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black text-balance">
                {t("services.cta.title")}
              </h2>
              <p className="mt-3 text-base text-black/70 max-w-xl mx-auto text-pretty">
                {t("services.cta.subtitle")}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/find-professionals"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-7 py-3.5 text-sm font-semibold text-white hover:bg-black/80 transition-colors"
                >
                  {t("services.cta.primary")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/provider/verification"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black/20 bg-transparent px-7 py-3.5 text-sm font-semibold text-black hover:bg-black/10 transition-colors"
                >
                  {t("services.cta.secondary")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}

/* ── Category Card ── */
function CategoryCard({ category }: { category: ServiceCategory }) {
  const IconComp = ICON_MAP[category.icon] ?? Wrench;
  const description = CATEGORY_DESCRIPTIONS[category.slug] ?? "Professional service by verified experts.";

  return (
    <motion.div variants={fadeInUp}>
      <Link
        href={`/find-professionals?category=${category.slug}`}
        className="group flex flex-col h-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_32px_-8px_rgba(0,0,0,0.14)] hover:border-[var(--accent)]/40 transition-all duration-300"
      >
        {/* Icon */}
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/10 group-hover:bg-[var(--accent)]/20 transition-colors">
          <IconComp className="h-6 w-6 text-[var(--accent)]" />
        </div>

        {/* Name + count */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-semibold text-[hsl(var(--foreground))] group-hover:text-[var(--accent)] transition-colors leading-snug">
            {category.name}
          </h3>
          <span className="shrink-0 rounded-full bg-[hsl(var(--muted))]/60 px-2 py-0.5 text-xs font-medium text-[hsl(var(--muted-foreground))]">
            {category.count}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed flex-1">
          {description}
        </p>

        {/* CTA */}
        <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] group-hover:gap-2.5 transition-all">
          Browse Pros
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Featured Provider Card (horizontal scroll) ── */
function FeaturedProviderCard({ provider }: { provider: Provider }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="snap-start shrink-0 w-64 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] hover:border-[var(--accent)]/30 transition-colors"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="relative h-12 w-12 shrink-0">
          <img
            src={provider.avatar}
            alt={provider.name}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-[hsl(var(--border))]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=random`;
            }}
          />
          {provider.verified && (
            <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)]">
              <BadgeCheck className="h-3 w-3 text-black" />
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">{provider.name}</p>
          <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{provider.category}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-1">
        <Star className="h-3.5 w-3.5 fill-[var(--accent)] text-[var(--accent)]" />
        <span className="text-sm font-semibold text-[hsl(var(--foreground))]">{provider.rating.toFixed(2)}</span>
        <span className="text-xs text-[hsl(var(--muted-foreground))]">({provider.reviewCount})</span>
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-sm font-bold text-[hsl(var(--foreground))]">
          From ${provider.priceFrom}
          <span className="text-xs font-normal text-[hsl(var(--muted-foreground))]">/{provider.priceUnit}</span>
        </span>
        <span className="text-xs text-[hsl(var(--muted-foreground))]">{provider.distance} mi</span>
      </div>

      <Link
        href={`/professionals/${provider.id}`}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] py-2 text-xs font-semibold text-[hsl(var(--foreground))] hover:border-[var(--accent)]/50 hover:text-[var(--accent)] transition-colors"
      >
        View Profile
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </motion.div>
  );
}