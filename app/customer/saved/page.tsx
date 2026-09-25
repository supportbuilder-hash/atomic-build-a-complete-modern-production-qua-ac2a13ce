"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Search, Star, MapPin, Clock, BadgeCheck, Trash2, Calendar, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SavedProvider {
  id: string;
  name: string;
  avatar: string;
  category: string;
  rating: number;
  reviewCount: number;
  experience: number;
  priceFrom: number;
  priceUnit: string;
  distance: number;
  availability: string;
  verified: boolean;
  location: string;
  savedAt: string;
  note?: string;
}

const SAVED_PROVIDERS: SavedProvider[] = [
  {
    id: "marcus-rivera",
    name: "Marcus Rivera",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Handyman",
    category: "Electrician",
    rating: 4.92,
    reviewCount: 318,
    experience: 12,
    priceFrom: 85,
    priceUnit: "hr",
    distance: 1.2,
    availability: "Available Today",
    verified: true,
    location: "Austin, TX",
    savedAt: "2024-06-10",
    note: "Great for panel upgrades",
  },
  {
    id: "priya-nair",
    name: "Priya Nair",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya%20Nair",
    category: "Plumber",
    rating: 4.88,
    reviewCount: 204,
    experience: 9,
    priceFrom: 75,
    priceUnit: "hr",
    distance: 2.4,
    availability: "Available Tomorrow",
    verified: true,
    location: "Austin, TX",
    savedAt: "2024-06-08",
  },
  {
    id: "james-okafor",
    name: "James Okafor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James%20Okafor",
    category: "AC & HVAC",
    rating: 4.79,
    reviewCount: 156,
    experience: 7,
    priceFrom: 90,
    priceUnit: "hr",
    distance: 3.1,
    availability: "Available Today",
    verified: true,
    location: "Austin, TX",
    savedAt: "2024-06-05",
    note: "Serviced our Carrier unit before",
  },
  {
    id: "sofia-chen",
    name: "Sofia Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia%20Chen",
    category: "Cleaning",
    rating: 4.95,
    reviewCount: 512,
    experience: 6,
    priceFrom: 55,
    priceUnit: "hr",
    distance: 0.8,
    availability: "Available Today",
    verified: true,
    location: "Austin, TX",
    savedAt: "2024-06-01",
  },
  {
    id: "derek-walsh",
    name: "Derek Walsh",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Derek%20Walsh",
    category: "Handyman",
    rating: 4.71,
    reviewCount: 89,
    experience: 14,
    priceFrom: 65,
    priceUnit: "hr",
    distance: 4.5,
    availability: "Next Available: Mon",
    verified: false,
    location: "Austin, TX",
    savedAt: "2024-05-28",
    note: "Good for general repairs",
  },
  {
    id: "amara-diallo",
    name: "Amara Diallo",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amara%20Diallo",
    category: "Painting",
    rating: 4.84,
    reviewCount: 143,
    experience: 10,
    priceFrom: 70,
    priceUnit: "hr",
    distance: 2.9,
    availability: "Available Tomorrow",
    verified: true,
    location: "Austin, TX",
    savedAt: "2024-05-20",
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(SAVED_PROVIDERS.map((p) => p.category)))];

const SORT_OPTIONS = [
  { value: "saved-date", label: "Recently Saved" },
  { value: "rating", label: "Top Rated" },
  { value: "price-low", label: "Lowest Price" },
  { value: "distance", label: "Nearest" },
];

function AvailabilityDot({ availability }: { availability: string }) {
  const isToday = availability.toLowerCase().includes("today");
  const isTomorrow = availability.toLowerCase().includes("tomorrow");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        isToday
          ? "text-emerald-600"
          : isTomorrow
          ? "text-amber-600"
          : "text-slate-500"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isToday
            ? "bg-emerald-500"
            : isTomorrow
            ? "bg-amber-500"
            : "bg-slate-400"
        )}
      />
      {availability}
    </span>
  );
}

function NoteTag({ note }: { note: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]">
      {note}
    </span>
  );
}

export default function CustomerSavedPage() {
  const [savedIds, setSavedIds] = useState<Set<string>>(
    new Set(SAVED_PROVIDERS.map((p) => p.id))
  );
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("saved-date");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setRemovingId(null);
    }, 350);
  };

  const filtered = SAVED_PROVIDERS.filter((p) => {
    if (!savedIds.has(p.id)) return false;
    if (activeCategory !== "All" && p.category !== activeCategory) return false;
    if (
      search.trim() &&
      !p.name.toLowerCase().includes(search.toLowerCase()) &&
      !p.category.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price-low") return a.priceFrom - b.priceFrom;
    if (sortBy === "distance") return a.distance - b.distance;
    return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
  });

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Sort";

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Heart className="h-5 w-5 fill-[var(--accent)] text-[var(--accent)]" />
                <span className="text-sm font-medium text-[var(--accent)]">
                  Saved Professionals
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                Your Saved Pros
              </h1>
              <p className="mt-1 text-[hsl(var(--muted-foreground))]">
                {savedIds.size} professional{savedIds.size !== 1 ? "s" : ""}{" "}
                saved for quick booking
              </p>
            </div>
            <Link
              href="/find-professionals"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md"
            >
              <Search className="h-4 w-4" />
              Find More Pros
            </Link>
          </div>
        </Reveal>

        {/* Search + Filters */}
        <Reveal delay={0.05}>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                placeholder="Search saved professionals..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-2.5 pl-9 pr-4 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
              >
                <SlidersHorizontal className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                {currentSortLabel}
                <ChevronDown className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              </button>
              {showSortMenu && (
                <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-1 shadow-lg">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setShowSortMenu(false);
                      }}
                      className={cn(
                        "flex w-full items-center px-4 py-2 text-sm transition-colors hover:bg-[hsl(var(--muted))]",
                        sortBy === opt.value
                          ? "font-semibold text-[var(--accent)]"
                          : "text-[hsl(var(--foreground))]"
                      )}
                    >
                      {opt.value === sortBy && (
                        <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                      )}
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {/* Category pills */}
        <Reveal delay={0.08}>
          <div className="mb-8 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                  activeCategory === cat
                    ? "bg-[var(--accent)] text-white shadow-sm"
                    : "border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:border-[var(--accent)]/40 hover:text-[hsl(var(--foreground))]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Provider Cards Grid */}
        {filtered.length === 0 ? (
          <Reveal>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))] py-20 text-center">
              <Heart className="mb-4 h-12 w-12 text-[hsl(var(--muted-foreground))]/40" />
              <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                No saved professionals found
              </h3>
              <p className="mt-1 max-w-xs text-sm text-[hsl(var(--muted-foreground))]">
                {search || activeCategory !== "All"
                  ? "Try adjusting your filters or search query."
                  : "Start saving professionals you like while browsing."}
              </p>
              <Link
                href="/find-professionals"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
              >
                <Search className="h-4 w-4" />
                Browse Professionals
              </Link>
            </div>
          </Reveal>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((provider) => (
              <motion.div
                key={provider.id}
                variants={fadeInUp}
                animate={removingId === provider.id ? { opacity: 0, scale: 0.95 } : {}}
                transition={{ duration: 0.3 }}
                className={cn(
                  "group relative flex flex-col rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_32px_-8px_rgba(0,0,0,0.14)]"
                )}
              >
                {/* Remove button */}
                <button
                  onClick={() => handleRemove(provider.id)}
                  className="absolute right-4 top-4 rounded-full p-1.5 text-[hsl(var(--muted-foreground))] opacity-0 transition-all duration-200 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  aria-label={`Remove ${provider.name} from saved`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* Top row: avatar + info */}
                <div className="flex items-start gap-3">
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
                    <img
                      src={provider.avatar}
                      alt={provider.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=random`;
                      }}
                    />
                    {provider.verified && (
                      <span className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5 shadow-sm">
                        <BadgeCheck className="h-3.5 w-3.5 text-[var(--accent)]" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 pr-6">
                    <Link
                      href={`/professionals/${provider.id}`}
                      className="block truncate text-base font-semibold text-[hsl(var(--foreground))] hover:text-[var(--accent)]"
                    >
                      {provider.name}
                    </Link>
                    <span className="text-sm text-[hsl(var(--muted-foreground))]">
                      {provider.category}
                    </span>
                    <div className="mt-1 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                        {provider.rating.toFixed(2)}
                      </span>
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">
                        ({provider.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Meta row */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {provider.distance} mi away
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {provider.experience} yrs exp.
                  </span>
                </div>

                {/* Availability */}
                <div className="mt-2">
                  <AvailabilityDot availability={provider.availability} />
                </div>

                {/* Note tag */}
                {provider.note && (
                  <div className="mt-3">
                    <NoteTag note={provider.note} />
                  </div>
                )}

                {/* Divider */}
                <div className="my-4 border-t border-[hsl(var(--border))]" />

                {/* Price + Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-[hsl(var(--foreground))]">
                      ${provider.priceFrom}
                    </span>
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">
                      /{provider.priceUnit}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/professionals/${provider.id}`}
                      className="rounded-lg border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
                    >
                      View Profile
                    </Link>
                    <Link
                      href={`/book/${provider.id}`}
                      className="flex items-center gap-1 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-90"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      Book
                    </Link>
                  </div>
                </div>

                {/* Saved date */}
                <p className="mt-3 text-[10px] text-[hsl(var(--muted-foreground))]/60">
                  Saved{" "}
                  {new Date(provider.savedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bottom CTA */}
        {filtered.length > 0 && (
          <Reveal delay={0.1}>
            <div className="mt-12 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center">
              <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">
                Looking for someone new?
              </h2>
              <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                Browse thousands of verified professionals across 12 service
                categories in your area.
              </p>
              <Link
                href="/find-professionals"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
              >
                <Search className="h-4 w-4" />
                Explore All Professionals
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}