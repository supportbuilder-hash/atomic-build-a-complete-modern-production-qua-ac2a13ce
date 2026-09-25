"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Calendar, Clock, MapPin, Star, Search, Filter, ChevronDown, CheckCircle, XCircle, AlertCircle, ArrowRight, RotateCcw, MessageSquare, Download, Eye } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { staggerContainer, fadeInUp } from "@/lib/motion";

const STATUS_FILTERS = ["All", "Upcoming", "In Progress", "Completed", "Cancelled"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "price-low", label: "Price: Low to High" },
] as const;

type SortOption = (typeof SORT_OPTIONS)[number]["value"];

interface BookingItem {
  id: string;
  bookingRef: string;
  providerName: string;
  providerAvatar: string;
  providerRating: number;
  service: string;
  category: string;
  date: string;
  timeSlot: string;
  address: string;
  status: "upcoming" | "in-progress" | "completed" | "cancelled";
  price: number;
  canReview: boolean;
  canRebook: boolean;
  canTrack: boolean;
  canCancel: boolean;
  reviewLeft?: boolean;
  paymentMethod: string;
}

const MOCK_BOOKINGS: BookingItem[] = [
  {
    id: "bk-001",
    bookingRef: "FX-20240118-001",
    providerName: "Marcus Rivera",
    providerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Handyman",
    providerRating: 4.92,
    service: "Full Electrical Inspection",
    category: "Electrician",
    date: "Jan 22, 2025",
    timeSlot: "10:00 AM – 12:00 PM",
    address: "142 Maple Street, Austin, TX 78701",
    status: "upcoming",
    price: 149,
    canReview: false,
    canRebook: false,
    canTrack: true,
    canCancel: true,
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "bk-002",
    bookingRef: "FX-20240117-002",
    providerName: "Priya Sharma",
    providerAvatar: "/images/plumber-priya-sharma-profile.jpg",
    providerRating: 4.88,
    service: "Pipe Leak Repair",
    category: "Plumber",
    date: "Jan 20, 2025",
    timeSlot: "2:00 PM – 4:00 PM",
    address: "142 Maple Street, Austin, TX 78701",
    status: "in-progress",
    price: 210,
    canReview: false,
    canRebook: false,
    canTrack: true,
    canCancel: false,
    paymentMethod: "Mastercard •••• 8891",
  },
  {
    id: "bk-003",
    bookingRef: "FX-20240110-003",
    providerName: "James Okafor",
    providerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James%20Okafor",
    providerRating: 4.75,
    service: "AC Tune-Up & Filter Replacement",
    category: "AC & HVAC",
    date: "Jan 10, 2025",
    timeSlot: "9:00 AM – 11:00 AM",
    address: "142 Maple Street, Austin, TX 78701",
    status: "completed",
    price: 185,
    canReview: true,
    canRebook: true,
    canTrack: false,
    canCancel: false,
    reviewLeft: false,
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "bk-004",
    bookingRef: "FX-20240105-004",
    providerName: "Sofia Mendez",
    providerAvatar: "/images/cleaning-sofia-mendez-profile.jpg",
    providerRating: 4.97,
    service: "Deep Home Cleaning",
    category: "Cleaning",
    date: "Jan 5, 2025",
    timeSlot: "8:00 AM – 12:00 PM",
    address: "142 Maple Street, Austin, TX 78701",
    status: "completed",
    price: 320,
    canReview: true,
    canRebook: true,
    canTrack: false,
    canCancel: false,
    reviewLeft: true,
    paymentMethod: "PayPal",
  },
  {
    id: "bk-005",
    bookingRef: "FX-20231228-005",
    providerName: "Derek Huang",
    providerAvatar: "/images/handyman-derek-huang-profile.jpg",
    providerRating: 4.81,
    service: "Furniture Assembly & Wall Mounting",
    category: "Handyman",
    date: "Dec 28, 2024",
    timeSlot: "1:00 PM – 3:00 PM",
    address: "142 Maple Street, Austin, TX 78701",
    status: "completed",
    price: 130,
    canReview: true,
    canRebook: true,
    canTrack: false,
    canCancel: false,
    reviewLeft: true,
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "bk-006",
    bookingRef: "FX-20231220-006",
    providerName: "Aisha Patel",
    providerAvatar: "/images/painter-aisha-patel-profile.jpg",
    providerRating: 4.69,
    service: "Interior Room Painting",
    category: "Painting",
    date: "Dec 20, 2024",
    timeSlot: "9:00 AM – 5:00 PM",
    address: "142 Maple Street, Austin, TX 78701",
    status: "cancelled",
    price: 480,
    canReview: false,
    canRebook: true,
    canTrack: false,
    canCancel: false,
    paymentMethod: "Mastercard •••• 8891",
  },
];

const SUMMARY_STATS = [
  { label: "Total Bookings", value: "14", icon: Calendar, color: "text-[var(--accent)]", bg: "bg-[var(--accent)]/10" },
  { label: "Completed", value: "11", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Upcoming", value: "2", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Total Spent", value: "$1,842", icon: Download, color: "text-violet-500", bg: "bg-violet-500/10" },
];

const STATUS_CONFIG: Record<
  BookingItem["status"],
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  upcoming: { label: "Upcoming", color: "text-blue-600", bg: "bg-blue-50 border-blue-200", icon: Clock },
  "in-progress": { label: "In Progress", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: AlertCircle },
  completed: { label: "Completed", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "text-red-500", bg: "bg-red-50 border-red-200", icon: XCircle },
};

function StatusBadge({ status }: { status: BookingItem["status"] }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        cfg.bg,
        cfg.color
      )}
    >
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

function BookingCard({ booking }: { booking: BookingItem }) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 8px 32px -8px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between gap-4 border-b border-[hsl(var(--border))] px-5 py-3">
        <span className="text-xs font-mono text-[hsl(var(--muted-foreground))]">{booking.bookingRef}</span>
        <StatusBadge status={booking.status} />
      </div>

      {/* Card Body */}
      <div className="p-5">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={booking.providerAvatar}
              alt={booking.providerName}
              className="h-14 w-14 rounded-xl object-cover ring-2 ring-[hsl(var(--border))]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.providerName)}&background=random`;
              }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-[hsl(var(--foreground))] leading-tight">{booking.providerName}</h3>
                <p className="text-sm text-[var(--accent)] font-medium mt-0.5">{booking.service}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold text-[hsl(var(--foreground))]">${booking.price}</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))]">{booking.paymentMethod}</div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              <span className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                <Calendar className="h-3.5 w-3.5" />
                {booking.date}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                <Clock className="h-3.5 w-3.5" />
                {booking.timeSlot}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate max-w-[180px]">{booking.address}</span>
              </span>
            </div>

            {/* Rating row for completed */}
            {booking.status === "completed" && (
              <div className="mt-2 flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium text-[hsl(var(--foreground))]">{booking.providerRating}</span>
                <span className="text-xs text-[hsl(var(--muted-foreground))]">provider rating</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[hsl(var(--border))] pt-4">
          {booking.canTrack && (
            <Link
              href={`/tracking/${booking.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-foreground)] transition-all hover:opacity-90"
            >
              <Eye className="h-3.5 w-3.5" />
              Track Booking
            </Link>
          )}
          {booking.canReview && !booking.reviewLeft && (
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-amber-600">
              <Star className="h-3.5 w-3.5" />
              Leave Review
            </button>
          )}
          {booking.reviewLeft && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-600">
              <CheckCircle className="h-3.5 w-3.5" />
              Review Submitted
            </span>
          )}
          {booking.canRebook && (
            <Link
              href={`/book/${booking.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1.5 text-xs font-semibold text-[hsl(var(--foreground))] transition-all hover:bg-[hsl(var(--muted))]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Rebook
            </Link>
          )}
          <Link
            href={`/customer/messages`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1.5 text-xs font-semibold text-[hsl(var(--foreground))] transition-all hover:bg-[hsl(var(--muted))]"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Message
          </Link>
          {booking.canCancel && (
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-all hover:bg-red-100">
              <XCircle className="h-3.5 w-3.5" />
              Cancel
            </button>
          )}
          <Link
            href={`/customer/payments`}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1.5 text-xs font-semibold text-[hsl(var(--muted-foreground))] transition-all hover:bg-[hsl(var(--muted))]"
          >
            <Download className="h-3.5 w-3.5" />
            Receipt
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function CustomerBookingsPage() {
  const t = useTranslations();
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const filtered = MOCK_BOOKINGS.filter((b) => {
    const matchesStatus =
      activeFilter === "All" ||
      (activeFilter === "Upcoming" && b.status === "upcoming") ||
      (activeFilter === "In Progress" && b.status === "in-progress") ||
      (activeFilter === "Completed" && b.status === "completed") ||
      (activeFilter === "Cancelled" && b.status === "cancelled");

    const matchesSearch =
      searchQuery === "" ||
      b.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingRef.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "oldest") return a.id.localeCompare(b.id);
    return b.id.localeCompare(a.id);
  });

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Newest First";

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] pb-20">
      {/* Page Header */}
      <Reveal>
        <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                  {t("bookings.heading")}
                </h1>
                <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                  {t("bookings.subheading")}
                </p>
              </div>
              <Link
                href="/find-professionals"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-foreground)] shadow-sm transition-all hover:opacity-90"
              >
                {t("bookings.newBookingCta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8 space-y-8">
        {/* Summary Stats */}
        <Reveal>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {SUMMARY_STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                >
                  <div className={cn("inline-flex rounded-lg p-2 mb-3", stat.bg)}>
                    <Icon className={cn("h-4 w-4", stat.color)} />
                  </div>
                  <div className={cn("text-2xl font-bold", stat.color)}>{stat.value}</div>
                  <div className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </Reveal>

        {/* Filters & Search */}
        <Reveal>
          <div className="space-y-3">
            {/* Search + Sort Row */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                <input
                  type="text"
                  placeholder={t("bookings.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-2.5 pl-9 pr-4 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 transition-all"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--foreground))] transition-all hover:bg-[hsl(var(--muted))]"
                >
                  <Filter className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                  {currentSortLabel}
                  <ChevronDown className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                </button>
                {showSortDropdown && (
                  <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-lg overflow-hidden">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setShowSortDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[hsl(var(--muted))]",
                          sortBy === opt.value
                            ? "font-semibold text-[var(--accent)]"
                            : "text-[hsl(var(--foreground))]"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {STATUS_FILTERS.map((filter) => {
                const count =
                  filter === "All"
                    ? MOCK_BOOKINGS.length
                    : MOCK_BOOKINGS.filter((b) => {
                        if (filter === "Upcoming") return b.status === "upcoming";
                        if (filter === "In Progress") return b.status === "in-progress";
                        if (filter === "Completed") return b.status === "completed";
                        if (filter === "Cancelled") return b.status === "cancelled";
                        return false;
                      }).length;

                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      "flex-shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                      activeFilter === filter
                        ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-sm"
                        : "border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
                    )}
                  >
                    {filter}
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-xs font-bold",
                        activeFilter === filter
                          ? "bg-white/20 text-[var(--accent-foreground)]"
                          : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Bookings List */}
        <Reveal>
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))] py-20 text-center">
              <Calendar className="h-12 w-12 text-[hsl(var(--muted-foreground))]/40 mb-4" />
              <h3 className="text-base font-semibold text-[hsl(var(--foreground))]">
                {t("bookings.emptyTitle")}
              </h3>
              <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))] max-w-xs">
                {t("bookings.emptyDescription")}
              </p>
              <Link
                href="/find-professionals"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-foreground)] transition-all hover:opacity-90"
              >
                {t("bookings.findProfessionalsCta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {sorted.map((booking, i) => (
                <motion.div key={booking.id} variants={fadeInUp} custom={i}>
                  <BookingCard booking={booking} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </Reveal>

        {/* Load More */}
        {sorted.length > 0 && (
          <Reveal>
            <div className="flex justify-center pt-2">
              <button className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-2.5 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-all hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]">
                {t("bookings.loadMore")}
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
        )}
      </div>
    </main>
  );
}