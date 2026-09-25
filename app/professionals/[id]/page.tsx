"use client";

import { useState, useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { Star, MapPin, Clock, Shield, ChevronLeft, ChevronRight, Check, Phone, MessageSquare, Calendar, Award, Briefcase, ThumbsUp, Camera, ArrowRight, Zap } from 'lucide-react';
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";
type featuredProviders = any;
const featuredProviders: any = [];

// ─── Mock provider data ───────────────────────────────────────────────────────

const PROVIDER = {
  id: "marcus-rivera",
  name: "Marcus Rivera",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Handyman",
  coverImage: "/images/electrician-work-site-cover.jpg",
  category: "Electrician",
  tagline: "Licensed Master Electrician with 12 years of residential and commercial experience.",
  bio: "I started Rivera Electric after spending a decade working for large contractors across the city. My goal is simple: bring big-company quality with small-business care. Every job I take on gets my full attention, from a single outlet replacement to a full panel upgrade. I hold a Master Electrician license, carry full liability insurance, and all my work is code-compliant and inspected.",
  rating: 4.92,
  reviewCount: 318,
  experience: 12,
  priceFrom: 85,
  priceUnit: "hr",
  distance: 2.4,
  availability: "Today",
  verified: true,
  badge: "Top Pro",
  location: "Austin, TX",
  responseTime: "Under 1 hour",
  completionRate: 99,
  repeatClients: 74,
  phone: "+1 (512) 555-0182",
  serviceArea: ["Austin", "Round Rock", "Cedar Park", "Pflugerville", "Georgetown"],
  languages: ["English", "Spanish"],
  licenseNumber: "TECL-29847",
  insuranceVerified: true,
  backgroundChecked: true,
  memberSince: "2019",
};

const SERVICES = [
  { id: "s1", name: "Electrical Inspection", duration: "1–2 hrs", price: 120, unit: "flat" },
  { id: "s2", name: "Outlet / Switch Replacement", duration: "30–60 min", price: 85, unit: "per outlet" },
  { id: "s3", name: "Panel Upgrade (100A → 200A)", duration: "4–6 hrs", price: 1800, unit: "flat" },
  { id: "s4", name: "Ceiling Fan Installation", duration: "1–1.5 hrs", price: 150, unit: "flat" },
  { id: "s5", name: "EV Charger Installation", duration: "2–3 hrs", price: 450, unit: "flat" },
  { id: "s6", name: "Recessed Lighting (per fixture)", duration: "45 min", price: 95, unit: "per fixture" },
  { id: "s7", name: "Smoke / CO Detector Install", duration: "30 min", price: 65, unit: "per unit" },
  { id: "s8", name: "Whole-Home Surge Protection", duration: "1 hr", price: 280, unit: "flat" },
];

const PORTFOLIO = [
  { id: "p1", src: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/a5918b7c9d7a40f28ab746f0036d641d.jpg", caption: "200A Panel Upgrade" },
  { id: "p2", src: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/1d2c56c3db404fbc8635a0fe9e6dd3f1.jpg", caption: "EV Charger Install" },
  { id: "p3", src: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/d7ef22da5ddd47b69d0d3cc75a791db4.jpg", caption: "Recessed Lighting" },
  { id: "p4", src: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/e4fb1d1461934ff9a85b993dd9c645df.jpg", caption: "Ceiling Fan Install" },
  { id: "p5", src: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/4da12de8fad04463816dfc3c2621deea.png", caption: "Kitchen Outlet Upgrade" },
  { id: "p6", src: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/9400a20a471841e792b581102f8b2b7a.jpg", caption: "Smart Home Wiring" },
];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_SLOTS = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

// Deterministic availability: available = true for most, a few blocked
const AVAILABILITY: Record<string, Record<string, boolean>> = {
  Mon: { "8:00 AM": true, "9:00 AM": true, "10:00 AM": false, "11:00 AM": true, "1:00 PM": true, "2:00 PM": false, "3:00 PM": true, "4:00 PM": true },
  Tue: { "8:00 AM": false, "9:00 AM": true, "10:00 AM": true, "11:00 AM": true, "1:00 PM": false, "2:00 PM": true, "3:00 PM": true, "4:00 PM": false },
  Wed: { "8:00 AM": true, "9:00 AM": false, "10:00 AM": true, "11:00 AM": false, "1:00 PM": true, "2:00 PM": true, "3:00 PM": false, "4:00 PM": true },
  Thu: { "8:00 AM": true, "9:00 AM": true, "10:00 AM": true, "11:00 AM": true, "1:00 PM": true, "2:00 PM": true, "3:00 PM": true, "4:00 PM": false },
  Fri: { "8:00 AM": false, "9:00 AM": true, "10:00 AM": false, "11:00 AM": true, "1:00 PM": true, "2:00 PM": false, "3:00 PM": true, "4:00 PM": true },
  Sat: { "8:00 AM": true, "9:00 AM": true, "10:00 AM": true, "11:00 AM": false, "1:00 PM": false, "2:00 PM": true, "3:00 PM": false, "4:00 PM": false },
  Sun: { "8:00 AM": false, "9:00 AM": false, "10:00 AM": true, "11:00 AM": true, "1:00 PM": false, "2:00 PM": false, "3:00 PM": false, "4:00 PM": false },
};

const REVIEWS = [
  {
    id: "r1",
    author: "Sarah K.",
    avatar: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/c80e718479ed43c7b254d4402935cd66.png",
    date: "Nov 12, 2024",
    rating: 5,
    text: "Marcus was fantastic. He arrived on time, explained everything clearly, and the panel upgrade was done in one day. My home feels so much safer now. Will definitely book again.",
    quality: 5,
    professionalism: 5,
    punctuality: 5,
    value: 4,
    service: "Panel Upgrade",
  },
  {
    id: "r2",
    author: "David L.",
    avatar: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/23d89b3aee964b2dbc4a9775d7883eac.png",
    date: "Oct 28, 2024",
    rating: 5,
    text: "Installed an EV charger in my garage. Super clean work, no mess left behind. He even helped me understand the best charging schedule for my car. Highly recommend.",
    quality: 5,
    professionalism: 5,
    punctuality: 4,
    value: 5,
    service: "EV Charger Installation",
  },
  {
    id: "r3",
    author: "Priya M.",
    avatar: "https://picsum.photos/seed/caa586dabc7e/800/600",
    date: "Oct 14, 2024",
    rating: 5,
    text: "Replaced all the outlets in my kitchen and added GFCI protection. Fast, professional, and reasonably priced. The work passed inspection on the first try.",
    quality: 5,
    professionalism: 5,
    punctuality: 5,
    value: 5,
    service: "Outlet Replacement",
  },
  {
    id: "r4",
    author: "James T.",
    avatar: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/d453a14f45a64086ba5dff68ef9e040a.png",
    date: "Sep 30, 2024",
    rating: 4,
    text: "Good work overall. Took a bit longer than estimated but the quality was excellent. Marcus communicated well throughout and cleaned up after himself.",
    quality: 5,
    professionalism: 4,
    punctuality: 3,
    value: 4,
    service: "Recessed Lighting",
  },
  {
    id: "r5",
    author: "Linda R.",
    avatar: "https://sundaysky.com/wp-content/uploads/2025/12/AI-Avatars__HERO_-1024x576.webp",
    date: "Sep 15, 2024",
    rating: 5,
    text: "Installed whole-home surge protection and three ceiling fans. Marcus was incredibly knowledgeable and patient with all my questions. Pricing was transparent with no surprises.",
    quality: 5,
    professionalism: 5,
    punctuality: 5,
    value: 5,
    service: "Surge Protection + Fans",
  },
];

const TABS = ["About", "Services", "Portfolio", "Availability", "Reviews"] as const;
type Tab = (typeof TABS)[number];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" };
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(sizes[size], i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-transparent text-amber-300")}
        />
      ))}
    </span>
  );
}

function SubRatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-sm text-[hsl(var(--muted-foreground))]">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-[hsl(var(--border))]">
        <div
          className="h-1.5 rounded-full bg-[var(--accent)]"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className="w-6 text-right text-sm font-medium">{value}.0</span>
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
      <Shield className="h-3 w-3" /> Verified
    </span>
  );
}

function TopProBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)] border border-[var(--accent)]/20">
      <Award className="h-3 w-3" /> Top Pro
    </span>
  );
}

// ─── Tab Sections ─────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <div className="space-y-8">
      {/* Bio */}
      <div>
        <h2 className="text-xl font-semibold mb-3">About Marcus</h2>
        <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">{PROVIDER.bio}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Briefcase, label: "Years Experience", value: `${PROVIDER.experience}+` },
          { icon: ThumbsUp, label: "Completion Rate", value: `${PROVIDER.completionRate}%` },
          { icon: Star, label: "Avg. Rating", value: PROVIDER.rating.toFixed(2) },
          { icon: Award, label: "Repeat Clients", value: `${PROVIDER.repeatClients}%` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]"
          >
            <stat.icon className="h-5 w-5 mx-auto mb-2 text-[var(--accent)]" />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Credentials */}
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-[hsl(var(--muted-foreground))]">Credentials</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "License", value: PROVIDER.licenseNumber },
            { label: "Member Since", value: PROVIDER.memberSince },
            { label: "Languages", value: PROVIDER.languages.join(", ") },
            { label: "Response Time", value: PROVIDER.responseTime },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="text-sm">
                <span className="font-medium">{c.label}:</span>{" "}
                <span className="text-[hsl(var(--muted-foreground))]">{c.value}</span>
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-500 shrink-0" />
            <span className="text-sm font-medium">Insurance Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-500 shrink-0" />
            <span className="text-sm font-medium">Background Checked</span>
          </div>
        </div>
      </div>

      {/* Service Area */}
      <div>
        <h3 className="font-semibold mb-3">Service Area</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {PROVIDER.serviceArea.map((area) => (
            <span
              key={area}
              className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1 text-sm"
            >
              {area}
            </span>
          ))}
        </div>
        {/* Map placeholder */}
        <div className="relative rounded-2xl overflow-hidden border border-[hsl(var(--border))] h-52 bg-[hsl(var(--muted))]">
          <img
            src="https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/41acdf135fad428b83f4f34d17104721.jpg"
            alt="Service area map for Austin TX"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="rounded-full bg-[var(--accent)] p-2 shadow-lg">
              <MapPin className="h-5 w-5 text-black" />
            </div>
            <span className="text-sm font-semibold bg-[hsl(var(--background))]/90 px-3 py-1 rounded-full">
              Austin, TX — 25 mi radius
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Services &amp; Pricing</h2>
      <p className="text-sm text-[hsl(var(--muted-foreground))]">
        All prices are estimates. Final quote provided after assessment.
      </p>
      <div className="rounded-2xl border border-[hsl(var(--border))] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50">
              <th className="text-left px-5 py-3 font-semibold">Service</th>
              <th className="text-left px-5 py-3 font-semibold hidden sm:table-cell">Duration</th>
              <th className="text-right px-5 py-3 font-semibold">Price</th>
              <th className="px-5 py-3 hidden sm:table-cell" />
            </tr>
          </thead>
          <tbody>
            {SERVICES.map((svc, i) => (
              <tr
                key={svc.id}
                className={cn(
                  "border-b border-[hsl(var(--border))] last:border-0 transition-colors hover:bg-[hsl(var(--muted))]/30",
                  i % 2 === 0 ? "bg-[hsl(var(--card))]" : "bg-[hsl(var(--background))]"
                )}
              >
                <td className="px-5 py-4 font-medium">{svc.name}</td>
                <td className="px-5 py-4 text-[hsl(var(--muted-foreground))] hidden sm:table-cell">{svc.duration}</td>
                <td className="px-5 py-4 text-right">
                  <span className="font-bold text-[var(--accent)]">${svc.price.toLocaleString("en-US")}</span>
                  <span className="text-xs text-[hsl(var(--muted-foreground))] ml-1">/ {svc.unit}</span>
                </td>
                <td className="px-5 py-4 hidden sm:table-cell">
                  <Link
                    href={`/book/${PROVIDER.id}?service=${svc.id}`}
                    className="text-xs font-semibold text-[var(--accent)] hover:underline"
                  >
                    Book
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-start gap-2 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/20 p-4">
        <Zap className="h-4 w-4 text-[var(--accent)] mt-0.5 shrink-0" />
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          <span className="font-semibold text-[hsl(var(--foreground))]">Free estimate</span> for jobs over $500. Marcus will assess the scope and provide a detailed quote before any work begins.
        </p>
      </div>
    </div>
  );
}

function PortfolioSection() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Portfolio</h2>
        <span className="text-sm text-[hsl(var(--muted-foreground))]">{PORTFOLIO.length} photos</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PORTFOLIO.map((item, i) => (
          <motion.button
            key={item.id}
            onClick={() => setSelected(item.id)}
            className={cn(
              "relative rounded-xl overflow-hidden border border-[hsl(var(--border))] group",
              i === 0 ? "col-span-2 row-span-2 aspect-square sm:aspect-auto sm:h-64" : "aspect-square"
            )}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={item.src}
              alt={item.caption}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-end p-3">
              <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 px-2 py-1 rounded-full">
                {item.caption}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelected(null)}
        >
          <motion.div
            className="relative max-w-2xl w-full rounded-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const item = PORTFOLIO.find((p) => p.id === selected);
              if (!item) return null;
              return (
                <>
                  <img src={item.src} alt={item.caption} className="w-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white font-semibold">{item.caption}</p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="absolute top-3 right-3 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors"
                    aria-label="Close photo"
                  >
                    <ChevronRight className="h-4 w-4 rotate-45" />
                  </button>
                </>
              );
            })()}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function AvailabilitySection() {
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">Availability This Week</h2>

      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {WEEK_DAYS.map((day) => {
          const slots = AVAILABILITY[day] ?? {};
          const available = Object.values(slots).filter(Boolean).length;
          return (
            <button
              key={day}
              onClick={() => { setSelectedDay(day); setSelectedSlot(null); }}
              className={cn(
                "flex flex-col items-center rounded-xl border px-4 py-3 min-w-[64px] transition-all duration-200",
                selectedDay === day
                  ? "border-[var(--accent)] bg-[var(--accent)] text-black shadow-md"
                  : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[var(--accent)]/50"
              )}
            >
              <span className="text-xs font-semibold">{day}</span>
              <span className={cn("text-xs mt-1", selectedDay === day ? "text-black/70" : "text-[hsl(var(--muted-foreground))]")}>
                {available} open
              </span>
            </button>
          );
        })}
      </div>

      {/* Time slots */}
      <div>
        <h3 className="text-sm font-semibold text-[hsl(var(--muted-foreground))] mb-3 uppercase tracking-wide">
          {selectedDay} — Select a time
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TIME_SLOTS.map((slot) => {
            const isAvailable = AVAILABILITY[selectedDay]?.[slot] ?? false;
            const isSelected = selectedSlot === slot;
            return (
              <button
                key={slot}
                disabled={!isAvailable}
                onClick={() => setSelectedSlot(isSelected ? null : slot)}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  !isAvailable
                    ? "border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 text-[hsl(var(--muted-foreground))]/40 cursor-not-allowed line-through"
                    : isSelected
                    ? "border-[var(--accent)] bg-[var(--accent)] text-black shadow-md"
                    : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[var(--accent)]/60 hover:bg-[var(--accent)]/5"
                )}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      {selectedSlot && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 p-4"
        >
          <div>
            <p className="font-semibold text-sm">Selected: {selectedDay} at {selectedSlot}</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">Proceed to booking to confirm this slot</p>
          </div>
          <Link
            href={`/book/${PROVIDER.id}`}
            className="rounded-xl bg-[var(--accent)] text-black text-sm font-semibold px-4 py-2 hover:opacity-90 transition-opacity"
          >
            Book Now
          </Link>
        </motion.div>
      )}

      <p className="text-xs text-[hsl(var(--muted-foreground))]">
        Times shown in Central Time (CT). Slots marked as unavailable are already booked.
      </p>
    </div>
  );
}

function ReviewsSection() {
  const avgQuality = REVIEWS.reduce((s, r) => s + r.quality, 0) / REVIEWS.length;
  const avgProfessionalism = REVIEWS.reduce((s, r) => s + r.professionalism, 0) / REVIEWS.length;
  const avgPunctuality = REVIEWS.reduce((s, r) => s + r.punctuality, 0) / REVIEWS.length;
  const avgValue = REVIEWS.reduce((s, r) => s + r.value, 0) / REVIEWS.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <span className="text-sm text-[hsl(var(--muted-foreground))]">{PROVIDER.reviewCount} total</span>
      </div>

      {/* Rating summary */}
      <div className="grid sm:grid-cols-2 gap-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
        <div className="flex flex-col items-center justify-center gap-1">
          <span className="text-6xl font-bold tracking-tight">{PROVIDER.rating}</span>
          <StarRating rating={PROVIDER.rating} size="lg" />
          <span className="text-sm text-[hsl(var(--muted-foreground))]">{PROVIDER.reviewCount} reviews</span>
        </div>
        <div className="space-y-3">
          <SubRatingBar label="Quality" value={Math.round(avgQuality)} />
          <SubRatingBar label="Professionalism" value={Math.round(avgProfessionalism)} />
          <SubRatingBar label="Punctuality" value={Math.round(avgPunctuality)} />
          <SubRatingBar label="Value" value={Math.round(avgValue)} />
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-4">
        {REVIEWS.map((review) => (
          <motion.div
            key={review.id}
            className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.06)]"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start gap-3">
              <img
                src={review.avatar}
                alt={review.author}
                className="h-10 w-10 rounded-full object-cover border border-[hsl(var(--border))] shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <span className="font-semibold text-sm">{review.author}</span>
                    <span className="ml-2 text-xs text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-2 py-0.5 rounded-full">
                      {review.service}
                    </span>
                  </div>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">{review.date}</span>
                </div>
                <div className="mt-1">
                  <StarRating rating={review.rating} size="sm" />
                </div>
                <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{review.text}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-[hsl(var(--muted-foreground))]">
                  <span>Quality: <strong className="text-[hsl(var(--foreground))]">{review.quality}/5</strong></span>
                  <span>Professionalism: <strong className="text-[hsl(var(--foreground))]">{review.professionalism}/5</strong></span>
                  <span>Punctuality: <strong className="text-[hsl(var(--foreground))]">{review.punctuality}/5</strong></span>
                  <span>Value: <strong className="text-[hsl(var(--foreground))]">{review.value}/5</strong></span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProviderProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("About");
  const [headerSticky, setHeaderSticky] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderSticky(window.scrollY > 320);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[hsl(var(--background))]">
      {/* ── Cover / Hero ─────────────────────────────────────────────────── */}
      <Reveal>
        <div className="relative h-52 sm:h-64 md:h-72 overflow-hidden">
          <img
            src={PROVIDER.coverImage}
            alt="Marcus Rivera at work"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
          <div className="absolute top-4 left-4">
            <Link
              href="/find-professionals"
              className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-black/60 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back to results
            </Link>
          </div>
        </div>
      </Reveal>

      {/* ── Profile Header ───────────────────────────────────────────────── */}
      <Reveal>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 pb-6 border-b border-[hsl(var(--border))]">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={PROVIDER.avatar}
                alt={PROVIDER.name}
                className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl object-cover border-4 border-[hsl(var(--background))] shadow-[0_4px_24px_rgba(0,0,0,0.18)]"
              />
              {PROVIDER.verified && (
                <div className="absolute -bottom-2 -right-2 rounded-full bg-emerald-500 p-1 border-2 border-[hsl(var(--background))]">
                  <Shield className="h-3.5 w-3.5 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{PROVIDER.name}</h1>
                <VerifiedBadge />
                {PROVIDER.badge && <TopProBadge />}
              </div>
              <p className="text-[hsl(var(--muted-foreground))] text-sm mb-2">{PROVIDER.tagline}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1 font-semibold">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {PROVIDER.rating}
                  <span className="font-normal text-[hsl(var(--muted-foreground))]">({PROVIDER.reviewCount})</span>
                </span>
                <span className="flex items-center gap-1 text-[hsl(var(--muted-foreground))]">
                  <MapPin className="h-4 w-4" /> {PROVIDER.location}
                </span>
                <span className="flex items-center gap-1 text-[hsl(var(--muted-foreground))]">
                  <Clock className="h-4 w-4" /> Responds {PROVIDER.responseTime}
                </span>
                <span className="flex items-center gap-1 text-[hsl(var(--muted-foreground))]">
                  <Briefcase className="h-4 w-4" /> {PROVIDER.experience} yrs exp
                </span>
              </div>
            </div>

            {/* CTA (desktop) */}
            <div className="hidden sm:flex flex-col gap-2 shrink-0">
              <Link
                href={`/book/${PROVIDER.id}`}
                className="rounded-xl bg-[var(--accent)] text-black font-semibold px-6 py-3 text-sm hover:opacity-90 transition-opacity shadow-[0_2px_8px_rgba(0,0,0,0.12)] text-center"
              >
                Book Now — from ${PROVIDER.priceFrom}/{PROVIDER.priceUnit}
              </Link>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2 text-sm font-medium hover:bg-[hsl(var(--muted))] transition-colors">
                  <MessageSquare className="h-4 w-4" /> Message
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2 text-sm font-medium hover:bg-[hsl(var(--muted))] transition-colors">
                  <Phone className="h-4 w-4" /> Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── Sticky Tab Bar ───────────────────────────────────────────────── */}
      <div
        ref={tabsRef}
        className={cn(
          "sticky top-0 z-30 bg-[hsl(var(--background))]/95 backdrop-blur-md border-b border-[hsl(var(--border))] transition-shadow duration-200",
          headerSticky && "shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
        )}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto py-1 scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative shrink-0 px-4 py-3 text-sm font-medium transition-colors duration-200",
                  activeTab === tab
                    ? "text-[hsl(var(--foreground))]"
                    : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-[var(--accent)] rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
          {/* Main content */}
          <div>
            <Reveal>
              {activeTab === "About" && <AboutSection />}
              {activeTab === "Services" && <ServicesSection />}
              {activeTab === "Portfolio" && <PortfolioSection />}
              {activeTab === "Availability" && <AvailabilitySection />}
              {activeTab === "Reviews" && <ReviewsSection />}
            </Reveal>
          </div>

          {/* Sidebar */}
          <Reveal delay={0.1}>
            <div className="space-y-4 lg:sticky lg:top-20">
              {/* Book card */}
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)]">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-2xl font-bold">${PROVIDER.priceFrom}</span>
                  <span className="text-sm text-[hsl(var(--muted-foreground))]">/ {PROVIDER.priceUnit}</span>
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mb-4">Starting price. Final quote after assessment.</p>
                <Link
                  href={`/book/${PROVIDER.id}`}
                  className="block w-full rounded-xl bg-[var(--accent)] text-black font-semibold py-3 text-sm text-center hover:opacity-90 transition-opacity shadow-[0_2px_8px_rgba(0,0,0,0.10)] mb-3"
                >
                  Book Now
                </Link>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[hsl(var(--border))] py-2.5 text-sm font-medium hover:bg-[hsl(var(--muted))] transition-colors">
                    <MessageSquare className="h-4 w-4" /> Message
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[hsl(var(--border))] py-2.5 text-sm font-medium hover:bg-[hsl(var(--muted))] transition-colors">
                    <Phone className="h-4 w-4" /> Call
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-[hsl(var(--border))] space-y-2">
                  {[
                    { icon: Shield, text: "Verified & insured" },
                    { icon: Clock, text: `Available ${PROVIDER.availability}` },
                    { icon: ThumbsUp, text: `${PROVIDER.completionRate}% completion rate` },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                      <item.icon className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Similar providers */}
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
                <h3 className="font-semibold text-sm mb-3">Similar Electricians</h3>
                <div className="space-y-3">
                  {featuredProviders
                    .filter((p) => p.category === "Electrician" && p.id !== PROVIDER.id)
                    .slice(0, 3)
                    .map((p) => (
                      <Link
                        key={p.id}
                        href={`/professionals/${p.id}`}
                        className="flex items-center gap-3 group"
                      >
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="h-10 w-10 rounded-full object-cover border border-[hsl(var(--border))]"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium group-hover:text-[var(--accent)] transition-colors truncate">{p.name}</p>
                          <div className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {p.rating} · ${p.priceFrom}/{p.priceUnit}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[hsl(var(--muted-foreground))] group-hover:text-[var(--accent)] transition-colors shrink-0" />
                      </Link>
                    ))}
                </div>
                <Link
                  href="/find-professionals?category=electrician"
                  className="mt-3 block text-center text-xs font-semibold text-[var(--accent)] hover:underline"
                >
                  View all electricians
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── Mobile sticky CTA ────────────────────────────────────────────── */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[hsl(var(--background))]/95 backdrop-blur-md border-t border-[hsl(var(--border))] p-3 flex gap-2">
        <Link
          href={`/book/${PROVIDER.id}`}
          className="flex-1 rounded-xl bg-[var(--accent)] text-black font-semibold py-3 text-sm text-center hover:opacity-90 transition-opacity"
        >
          Book Now — ${PROVIDER.priceFrom}/{PROVIDER.priceUnit}
        </Link>
        <button className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3">
          <MessageSquare className="h-5 w-5" />
        </button>
      </div>
    </main>
  );
}