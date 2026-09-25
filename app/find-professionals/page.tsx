"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Search, MapPin, Star, Shield, Clock, ChevronDown, ChevronUp, SlidersHorizontal, X, Heart, Calendar, Zap, ArrowRight, CheckCircle, Filter } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { Provider } from "@/lib/data";
type featuredProviders = any;
const featuredProviders: any = [];
import { cn } from "@/lib/utils";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/motion";

// ─── Extended mock provider data ────────────────────────────────────────────

const ALL_PROVIDERS: Provider[] = [
  ...featuredProviders,
  {
    id: "sofia-chen",
    name: "Sofia Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia%20Chen",
    category: "Cleaning",
    rating: 4.88,
    reviewCount: 204,
    experience: 6,
    priceFrom: 45,
    priceUnit: "hr",
    distance: 1.8,
    availability: "Today",
    verified: true,
    badge: "Top Rated",
    location: "Midtown",
  },
  {
    id: "james-okafor",
    name: "James Okafor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James%20Okafor",
    category: "Plumber",
    rating: 4.79,
    reviewCount: 142,
    experience: 9,
    priceFrom: 80,
    priceUnit: "hr",
    distance: 3.4,
    availability: "Tomorrow",
    verified: true,
    location: "Eastside",
  },
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya%20Sharma",
    category: "Painting",
    rating: 4.95,
    reviewCount: 87,
    experience: 11,
    priceFrom: 55,
    priceUnit: "hr",
    distance: 5.1,
    availability: "This Week",
    verified: true,
    badge: "Expert",
    location: "Westpark",
  },
  {
    id: "derek-walsh",
    name: "Derek Walsh",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Derek%20Walsh",
    category: "Handyman",
    rating: 4.71,
    reviewCount: 263,
    experience: 14,
    priceFrom: 60,
    priceUnit: "hr",
    distance: 2.2,
    availability: "Today",
    verified: false,
    location: "Northgate",
  },
  {
    id: "amara-diallo",
    name: "Amara Diallo",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amara%20Diallo",
    category: "AC & HVAC",
    rating: 4.83,
    reviewCount: 176,
    experience: 8,
    priceFrom: 95,
    priceUnit: "hr",
    distance: 4.7,
    availability: "Tomorrow",
    verified: true,
    location: "Southbay",
  },
  {
    id: "lena-kowalski",
    name: "Lena Kowalski",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lena%20Kowalski",
    category: "Cleaning",
    rating: 4.66,
    reviewCount: 98,
    experience: 4,
    priceFrom: 38,
    priceUnit: "hr",
    distance: 0.9,
    availability: "Today",
    verified: true,
    location: "Downtown",
  },
  {
    id: "raj-patel",
    name: "Raj Patel",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Raj%20Patel",
    category: "Electrician",
    rating: 4.74,
    reviewCount: 211,
    experience: 12,
    priceFrom: 75,
    priceUnit: "hr",
    distance: 6.3,
    availability: "This Week",
    verified: true,
    location: "Riverside",
  },
  {
    id: "nina-foster",
    name: "Nina Foster",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nina%20Foster",
    category: "Landscaping",
    rating: 4.91,
    reviewCount: 134,
    experience: 7,
    priceFrom: 50,
    priceUnit: "hr",
    distance: 3.9,
    availability: "Tomorrow",
    verified: true,
    badge: "Top Rated",
    location: "Greenfield",
  },
];

const CATEGORIES = [
  "All",
  "Electrician",
  "Plumber",
  "AC & HVAC",
  "Cleaning",
  "Carpentry",
  "Painting",
  "Handyman",
  "Landscaping",
] as const;

type SortOption = "recommended" | "top-rated" | "lowest-price" | "nearest" | "most-experienced";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "top-rated", label: "Top Rated" },
  { value: "lowest-price", label: "Lowest Price" },
  { value: "nearest", label: "Nearest" },
  { value: "most-experienced", label: "Most Experienced" },
];

// ─── Skeleton card ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="h-16 w-16 rounded-xl bg-[hsl(var(--muted))]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-[hsl(var(--muted))]" />
          <div className="h-3 w-20 rounded bg-[hsl(var(--muted))]" />
          <div className="h-3 w-24 rounded bg-[hsl(var(--muted))]" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-8 flex-1 rounded-lg bg-[hsl(var(--muted))]" />
        <div className="h-8 flex-1 rounded-lg bg-[hsl(var(--muted))]" />
      </div>
    </div>
  );
}

// ─── Provider card ───────────────────────────────────────────────────────────

interface ProviderCardProps {
  provider: Provider;
  saved: boolean;
  onToggleSave: (id: string) => void;
}

function ProviderCard({ provider, saved, onToggleSave }: ProviderCardProps) {
  const availabilityColor =
    provider.availability === "Today"
      ? "bg-emerald-500/10 text-emerald-600"
      : provider.availability === "Tomorrow"
      ? "bg-amber-500/10 text-amber-600"
      : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]";

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -3, boxShadow: "0 8px 32px -8px rgba(0,0,0,0.14)" }}
      transition={{ duration: 0.2 }}
      className="group relative rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300"
    >
      {/* Save button */}
      <button
        onClick={() => onToggleSave(provider.id)}
        aria-label={saved ? "Unsave professional" : "Save professional"}
        className="absolute right-4 top-4 rounded-full p-1.5 transition-colors hover:bg-[hsl(var(--muted))]"
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            saved ? "fill-rose-500 text-rose-500" : "text-[hsl(var(--muted-foreground))]"
          )}
        />
      </button>

      {/* Header */}
      <div className="flex gap-4">
        <div className="relative h-16 w-16 flex-shrink-0">
          <img
            src={provider.avatar}
            alt={provider.name}
            className="h-16 w-16 rounded-xl object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=random&size=64`;
            }}
          />
          {provider.verified && (
            <span className="absolute -bottom-1 -right-1 rounded-full bg-[var(--accent)] p-0.5">
              <CheckCircle className="h-3.5 w-3.5 text-black" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 pr-6">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="truncate text-base font-semibold text-[hsl(var(--foreground))]">
              {provider.name}
            </h3>
            {provider.badge && (
              <span className="rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent-dark,#b45309)]">
                {provider.badge}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))]">{provider.category}</p>

          {/* Rating */}
          <div className="mt-1 flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
              {provider.rating.toFixed(2)}
            </span>
            <span className="text-xs text-[hsl(var(--muted-foreground))]">
              ({provider.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-[hsl(var(--muted))]/50 p-3">
        <div className="text-center">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Experience</p>
          <p className="mt-0.5 text-sm font-semibold text-[hsl(var(--foreground))]">
            {provider.experience}y
          </p>
        </div>
        <div className="border-x border-[hsl(var(--border))] text-center">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">From</p>
          <p className="mt-0.5 text-sm font-semibold text-[hsl(var(--foreground))]">
            ${provider.priceFrom}/{provider.priceUnit}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Distance</p>
          <p className="mt-0.5 text-sm font-semibold text-[hsl(var(--foreground))]">
            {provider.distance} mi
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
            availabilityColor
          )}
        >
          <Clock className="h-3 w-3" />
          {provider.availability}
        </span>
        <div className="flex gap-2">
          <Link
            href={`/professionals/${provider.id}`}
            className="rounded-lg border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
          >
            View Profile
          </Link>
          <Link
            href={`/book/${provider.id}`}
            className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-black transition-opacity hover:opacity-90"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Filters sidebar ─────────────────────────────────────────────────────────

interface FiltersState {
  location: string;
  priceMin: number;
  priceMax: number;
  minRating: number;
  availableToday: boolean;
  verifiedOnly: boolean;
  maxDistance: number;
  minExperience: number;
}

const DEFAULT_FILTERS: FiltersState = {
  location: "",
  priceMin: 0,
  priceMax: 200,
  minRating: 0,
  availableToday: false,
  verifiedOnly: false,
  maxDistance: 20,
  minExperience: 0,
};

interface FiltersSidebarProps {
  filters: FiltersState;
  onChange: (f: FiltersState) => void;
  onReset: () => void;
  activeCount: number;
}

function FiltersSidebar({ filters, onChange, onReset, activeCount }: FiltersSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    location: true,
    price: true,
    rating: true,
    availability: true,
    distance: false,
    experience: false,
  });

  const toggle = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const set = useCallback(
    <K extends keyof FiltersState>(key: K, value: FiltersState[K]) =>
      onChange({ ...filters, [key]: value }),
    [filters, onChange]
  );

  return (
    <aside className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[var(--accent)]" />
          <span className="font-semibold text-[hsl(var(--foreground))]">Filters</span>
          {activeCount > 0 && (
            <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold text-black">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-[hsl(var(--muted-foreground))] underline-offset-2 hover:underline"
          >
            Reset all
          </button>
        )}
      </div>

      <div className="mt-5 space-y-4 divide-y divide-[hsl(var(--border))]">
        {/* Location */}
        <div className="pt-4 first:pt-0">
          <button
            onClick={() => toggle("location")}
            className="flex w-full items-center justify-between text-sm font-medium text-[hsl(var(--foreground))]"
          >
            Location
            {openSections.location ? (
              <ChevronUp className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            )}
          </button>
          {openSections.location && (
            <div className="mt-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="City, ZIP, or neighborhood"
                  className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] py-2 pl-9 pr-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
                />
              </div>
            </div>
          )}
        </div>

        {/* Price range */}
        <div className="pt-4">
          <button
            onClick={() => toggle("price")}
            className="flex w-full items-center justify-between text-sm font-medium text-[hsl(var(--foreground))]"
          >
            Price Range ($/hr)
            {openSections.price ? (
              <ChevronUp className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            )}
          </button>
          {openSections.price && (
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))]">
                <span>${filters.priceMin}</span>
                <span>${filters.priceMax}+</span>
              </div>
              <input
                type="range"
                min={0}
                max={200}
                step={5}
                value={filters.priceMax}
                onChange={(e) => set("priceMax", Number(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={filters.priceMin}
                  onChange={(e) => set("priceMin", Number(e.target.value))}
                  placeholder="Min"
                  className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1.5 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
                />
                <input
                  type="number"
                  value={filters.priceMax}
                  onChange={(e) => set("priceMax", Number(e.target.value))}
                  placeholder="Max"
                  className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1.5 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
                />
              </div>
            </div>
          )}
        </div>

        {/* Min rating */}
        <div className="pt-4">
          <button
            onClick={() => toggle("rating")}
            className="flex w-full items-center justify-between text-sm font-medium text-[hsl(var(--foreground))]"
          >
            Minimum Rating
            {openSections.rating ? (
              <ChevronUp className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            )}
          </button>
          {openSections.rating && (
            <div className="mt-3 flex gap-1.5">
              {[0, 3, 3.5, 4, 4.5].map((r) => (
                <button
                  key={r}
                  onClick={() => set("minRating", r)}
                  className={cn(
                    "flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors",
                    filters.minRating === r
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[hsl(var(--foreground))]"
                      : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[var(--accent)]/50"
                  )}
                >
                  {r === 0 ? "Any" : `${r}+`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Availability */}
        <div className="pt-4">
          <button
            onClick={() => toggle("availability")}
            className="flex w-full items-center justify-between text-sm font-medium text-[hsl(var(--foreground))]"
          >
            Availability
            {openSections.availability ? (
              <ChevronUp className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            )}
          </button>
          {openSections.availability && (
            <div className="mt-3 space-y-2">
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-[hsl(var(--border))] px-3 py-2 hover:bg-[hsl(var(--muted))]/50">
                <span className="flex items-center gap-2 text-sm text-[hsl(var(--foreground))]">
                  <Zap className="h-3.5 w-3.5 text-emerald-500" />
                  Available Today
                </span>
                <input
                  type="checkbox"
                  checked={filters.availableToday}
                  onChange={(e) => set("availableToday", e.target.checked)}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-[hsl(var(--border))] px-3 py-2 hover:bg-[hsl(var(--muted))]/50">
                <span className="flex items-center gap-2 text-sm text-[hsl(var(--foreground))]">
                  <Shield className="h-3.5 w-3.5 text-[var(--accent)]" />
                  Verified Only
                </span>
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={(e) => set("verifiedOnly", e.target.checked)}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
              </label>
            </div>
          )}
        </div>

        {/* Max distance */}
        <div className="pt-4">
          <button
            onClick={() => toggle("distance")}
            className="flex w-full items-center justify-between text-sm font-medium text-[hsl(var(--foreground))]"
          >
            Max Distance
            {openSections.distance ? (
              <ChevronUp className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            )}
          </button>
          {openSections.distance && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))]">
                <span>Within {filters.maxDistance} miles</span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                step={1}
                value={filters.maxDistance}
                onChange={(e) => set("maxDistance", Number(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
              <div className="flex justify-between text-[10px] text-[hsl(var(--muted-foreground))]">
                <span>1 mi</span>
                <span>50 mi</span>
              </div>
            </div>
          )}
        </div>

        {/* Min experience */}
        <div className="pt-4">
          <button
            onClick={() => toggle("experience")}
            className="flex w-full items-center justify-between text-sm font-medium text-[hsl(var(--foreground))]"
          >
            Experience
            {openSections.experience ? (
              <ChevronUp className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            )}
          </button>
          {openSections.experience && (
            <div className="mt-3 flex gap-1.5 flex-wrap">
              {[0, 2, 5, 8, 10].map((y) => (
                <button
                  key={y}
                  onClick={() => set("minExperience", y)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    filters.minExperience === y
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[hsl(var(--foreground))]"
                      : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[var(--accent)]/50"
                  )}
                >
                  {y === 0 ? "Any" : `${y}+ yrs`}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function FindProfessionalsPage() {
  const t = useTranslations();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [isLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.location) count++;
    if (filters.priceMax < 200) count++;
    if (filters.minRating > 0) count++;
    if (filters.availableToday) count++;
    if (filters.verifiedOnly) count++;
    if (filters.maxDistance < 20) count++;
    if (filters.minExperience > 0) count++;
    return count;
  }, [filters]);

  const filteredAndSorted = useMemo(() => {
    let result = ALL_PROVIDERS.filter((p) => {
      if (activeCategory !== "All" && p.category !== activeCategory) return false;
      if (
        searchQuery &&
        !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      if (p.priceFrom < filters.priceMin || p.priceFrom > filters.priceMax) return false;
      if (filters.minRating > 0 && p.rating < filters.minRating) return false;
      if (filters.availableToday && p.availability !== "Today") return false;
      if (filters.verifiedOnly && !p.verified) return false;
      if (p.distance > filters.maxDistance) return false;
      if (p.experience < filters.minExperience) return false;
      return true;
    });

    switch (sortBy) {
      case "top-rated":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case "lowest-price":
        result = [...result].sort((a, b) => a.priceFrom - b.priceFrom);
        break;
      case "nearest":
        result = [...result].sort((a, b) => a.distance - b.distance);
        break;
      case "most-experienced":
        result = [...result].sort((a, b) => b.experience - a.experience);
        break;
      default:
        result = [...result].sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount);
    }

    return result;
  }, [activeCategory, searchQuery, sortBy, filters]);

  return (
    <main className="min-h-screen bg-[hsl(var(--background))]">
      {/* ── Page header ── */}
      <Reveal>
        <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                  <Link href="/" className="hover:text-[hsl(var(--foreground))]">
                    Home
                  </Link>
                  <ChevronDown className="h-3 w-3 -rotate-90" />
                  <span className="text-[hsl(var(--foreground))]">Find Professionals</span>
                </div>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl">
                  {t("findPros.heading")}
                </h1>
                <p className="mt-1.5 text-[hsl(var(--muted-foreground))]">
                  {t("findPros.subheading")}
                </p>
              </div>

              {/* Search bar */}
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("findPros.searchPlaceholder")}
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] py-2.5 pl-10 pr-10 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category tabs */}
            <div className="mt-6 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "flex-shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200",
                    activeCategory === cat
                      ? "border-[var(--accent)] bg-[var(--accent)] text-black"
                      : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:border-[var(--accent)]/50 hover:text-[hsl(var(--foreground))]"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Body: sidebar + results ── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden w-72 flex-shrink-0 lg:block">
            <div className="sticky top-24">
              <FiltersSidebar
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters(DEFAULT_FILTERS)}
                activeCount={activeFilterCount}
              />
            </div>
          </div>

          {/* Results area */}
          <div className="min-w-0 flex-1">
            {/* Results toolbar */}
            <Reveal>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Mobile filter toggle */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm font-medium text-[hsl(var(--foreground))] lg:hidden"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-bold text-black">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    <span className="font-semibold text-[hsl(var(--foreground))]">
                      {filteredAndSorted.length}
                    </span>{" "}
                    {t("findPros.resultsLabel")}
                  </p>
                </div>

                {/* Sort tabs */}
                <div className="flex gap-1 overflow-x-auto rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={cn(
                        "flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",
                        sortBy === opt.value
                          ? "bg-[var(--accent)] text-black shadow-sm"
                          : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <Reveal>
                <div className="mb-4 flex flex-wrap gap-2">
                  {filters.verifiedOnly && (
                    <span className="flex items-center gap-1 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1 text-xs font-medium text-[hsl(var(--foreground))]">
                      <Shield className="h-3 w-3 text-[var(--accent)]" />
                      Verified Only
                      <button onClick={() => setFilters((f) => ({ ...f, verifiedOnly: false }))}>
                        <X className="ml-1 h-3 w-3 text-[hsl(var(--muted-foreground))]" />
                      </button>
                    </span>
                  )}
                  {filters.availableToday && (
                    <span className="flex items-center gap-1 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1 text-xs font-medium text-[hsl(var(--foreground))]">
                      <Clock className="h-3 w-3 text-emerald-500" />
                      Available Today
                      <button onClick={() => setFilters((f) => ({ ...f, availableToday: false }))}>
                        <X className="ml-1 h-3 w-3 text-[hsl(var(--muted-foreground))]" />
                      </button>
                    </span>
                  )}
                  {filters.minRating > 0 && (
                    <span className="flex items-center gap-1 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1 text-xs font-medium text-[hsl(var(--foreground))]">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {filters.minRating}+ stars
                      <button onClick={() => setFilters((f) => ({ ...f, minRating: 0 }))}>
                        <X className="ml-1 h-3 w-3 text-[hsl(var(--muted-foreground))]" />
                      </button>
                    </span>
                  )}
                  {filters.priceMax < 200 && (
                    <span className="flex items-center gap-1 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1 text-xs font-medium text-[hsl(var(--foreground))]">
                      Up to ${filters.priceMax}/hr
                      <button onClick={() => setFilters((f) => ({ ...f, priceMax: 200 }))}>
                        <X className="ml-1 h-3 w-3 text-[hsl(var(--muted-foreground))]" />
                      </button>
                    </span>
                  )}
                  {filters.maxDistance < 20 && (
                    <span className="flex items-center gap-1 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1 text-xs font-medium text-[hsl(var(--foreground))]">
                      Within {filters.maxDistance} mi
                      <button onClick={() => setFilters((f) => ({ ...f, maxDistance: 20 }))}>
                        <X className="ml-1 h-3 w-3 text-[hsl(var(--muted-foreground))]" />
                      </button>
                    </span>
                  )}
                  {filters.minExperience > 0 && (
                    <span className="flex items-center gap-1 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1 text-xs font-medium text-[hsl(var(--foreground))]">
                      {filters.minExperience}+ yrs exp
                      <button onClick={() => setFilters((f) => ({ ...f, minExperience: 0 }))}>
                        <X className="ml-1 h-3 w-3 text-[hsl(var(--muted-foreground))]" />
                      </button>
                    </span>
                  )}
                </div>
              </Reveal>
            )}

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredAndSorted.length === 0 ? (
              <Reveal>
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))] py-20 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--muted))]">
                    <Search className="h-7 w-7 text-[hsl(var(--muted-foreground))]" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[hsl(var(--foreground))]">
                    {t("findPros.emptyTitle")}
                  </h3>
                  <p className="mt-1.5 max-w-sm text-sm text-[hsl(var(--muted-foreground))]">
                    {t("findPros.emptyBody")}
                  </p>
                  <button
                    onClick={() => {
                      setFilters(DEFAULT_FILTERS);
                      setActiveCategory("All");
                      setSearchQuery("");
                    }}
                    className="mt-5 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                  >
                    {t("findPros.emptyReset")}
                  </button>
                </div>
              </Reveal>
            ) : (
              <motion.div
                key={`${activeCategory}-${sortBy}-${activeFilterCount}`}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-2"
              >
                {filteredAndSorted.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    saved={savedIds.has(provider.id)}
                    onToggleSave={toggleSave}
                  />
                ))}
              </motion.div>
            )}

            {/* Load more hint */}
            {filteredAndSorted.length > 0 && (
              <Reveal>
                <div className="mt-10 flex flex-col items-center gap-3 text-center">
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {t("findPros.showingAll", { count: filteredAndSorted.length })}
                  </p>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--foreground))] underline-offset-4 hover:underline"
                  >
                    {t("findPros.browseCategories")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filters drawer ── */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-50 w-80 overflow-y-auto bg-[hsl(var(--background))] p-5 shadow-2xl lg:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-semibold text-[hsl(var(--foreground))]">Filters</span>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="rounded-lg p-1.5 hover:bg-[hsl(var(--muted))]"
                >
                  <X className="h-5 w-5 text-[hsl(var(--foreground))]" />
                </button>
              </div>
              <FiltersSidebar
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters(DEFAULT_FILTERS)}
                activeCount={activeFilterCount}
              />
              <div className="mt-6">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-black"
                >
                  {t("findPros.applyFilters")} ({filteredAndSorted.length} results)
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── CTA banner ── */}
      <Reveal>
        <section className="border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] py-14">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[hsl(var(--foreground))]">
              <Calendar className="h-3.5 w-3.5 text-[var(--accent)]" />
              {t("findPros.ctaBadge")}
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-3xl">
              {t("findPros.ctaHeading")}
            </h2>
            <p className="mt-3 text-[hsl(var(--muted-foreground))]">
              {t("findPros.ctaBody")}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/services"
                className="rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
              >
                {t("findPros.ctaPrimary")}
              </Link>
              <Link
                href="/#how-it-works"
                className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-6 py-3 text-sm font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
              >
                {t("findPros.ctaSecondary")}
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}