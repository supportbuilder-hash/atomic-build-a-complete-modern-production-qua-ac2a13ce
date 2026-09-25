"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, MapPin, Star, Shield, Clock, CheckCircle, ArrowRight, Zap, Droplets, Wind, Sparkles, Hammer, Paintbrush, Settings, Lock, Leaf, Package, Wrench, ChevronRight, Users, Calendar, ThumbsUp } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

const QUICK_TAGS = [
  "AC Repair",
  "Electrician",
  "Plumber",
  "House Cleaning",
  "Pest Control",
  "Handyman",
  "Painter",
  "Carpenter",
];

const CATEGORIES = [
  { name: "Electrician", icon: Zap, slug: "electrician", count: 284 },
  { name: "Plumber", icon: Droplets, slug: "plumber", count: 231 },
  { name: "AC & HVAC", icon: Wind, slug: "hvac", count: 198 },
  { name: "Cleaning", icon: Sparkles, slug: "cleaning", count: 412 },
  { name: "Carpentry", icon: Hammer, slug: "carpentry", count: 156 },
  { name: "Painting", icon: Paintbrush, slug: "painting", count: 189 },
  { name: "Appliance Repair", icon: Settings, slug: "appliance-repair", count: 167 },
  { name: "Home Security", icon: Lock, slug: "home-security", count: 112 },
  { name: "Landscaping", icon: Leaf, slug: "landscaping", count: 134 },
  { name: "Moving & Packing", icon: Package, slug: "moving", count: 98 },
  { name: "Handyman", icon: Wrench, slug: "handyman", count: 321 },
  { name: "Pest Control", icon: Shield, slug: "pest-control", count: 143 },
];

const FEATURED_PROVIDERS = [
  {
    id: "marcus-rivera",
    name: "Marcus Rivera",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Handyman",
    category: "Electrician",
    rating: 4.92,
    reviewCount: 318,
    experience: 11,
    priceFrom: 65,
    priceUnit: "hr",
    distance: 1.2,
    verified: true,
    badge: "Top Rated",
    location: "Downtown",
  },
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah%20Chen",
    category: "Plumber",
    rating: 4.88,
    reviewCount: 247,
    experience: 8,
    priceFrom: 55,
    priceUnit: "hr",
    distance: 2.4,
    verified: true,
    badge: "Fast Response",
    location: "Midtown",
  },
  {
    id: "james-okafor",
    name: "James Okafor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James%20Okafor",
    category: "AC & HVAC",
    rating: 4.95,
    reviewCount: 402,
    experience: 14,
    priceFrom: 75,
    priceUnit: "hr",
    distance: 3.1,
    verified: true,
    badge: "Most Booked",
    location: "Westside",
  },
  {
    id: "priya-nair",
    name: "Priya Nair",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya%20Nair",
    category: "Cleaning",
    rating: 4.85,
    reviewCount: 519,
    experience: 6,
    priceFrom: 40,
    priceUnit: "hr",
    distance: 0.8,
    verified: true,
    badge: "Top Rated",
    location: "Eastside",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Describe your job",
    description:
      "Tell us what needs fixing. Search by service type, add your location, and set your preferred date.",
    icon: Search,
  },
  {
    step: "02",
    title: "Pick your pro",
    description:
      "Browse verified profiles with real reviews, transparent pricing, and live availability. No surprises.",
    icon: Users,
  },
  {
    step: "03",
    title: "Book in seconds",
    description:
      "Confirm your slot, pay securely through Fixly, and get an instant booking confirmation.",
    icon: Calendar,
  },
  {
    step: "04",
    title: "Rate the work",
    description:
      "Once the job is done, leave a review. Your feedback keeps our pro network accountable.",
    icon: ThumbsUp,
  },
];

const STATS = [
  { value: "48,000+", label: "Jobs completed" },
  { value: "3,200+", label: "Verified professionals" },
  { value: "4.89", label: "Average rating" },
  { value: "62 sec", label: "Average booking time" },
];

const TESTIMONIALS = [
  {
    name: "Alicia Torres",
    location: "Austin, TX",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jobs%20completed",
    rating: 5,
    text: "My AC died on a Friday afternoon. I found a certified HVAC tech on Fixly, booked him for Saturday morning, and he had it running by noon. The whole process took under two minutes.",
    service: "AC Repair",
  },
  {
    name: "Derek Huang",
    location: "Chicago, IL",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Derek%20Huang",
    rating: 5,
    text: "I've used Fixly three times now for electrical work. Every pro has shown up on time, done clean work, and charged exactly what was quoted. That consistency is rare.",
    service: "Electrician",
  },
  {
    name: "Monica Patel",
    location: "Houston, TX",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Monica%20Patel",
    rating: 5,
    text: "The live tracking feature is a game changer. I knew exactly when my plumber was arriving, got a heads-up text, and the job was done before I had to leave for work.",
    service: "Plumbing",
  },
];

export default function HomePage() {
  const [searchService, setSearchService] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchService) params.set("q", searchService);
    if (searchLocation) params.set("location", searchLocation);
    window.location.href = `/find-professionals?${params.toString()}`;
  };

  return (
    <main className="overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center bg-[var(--brand-hero-bg)] overflow-hidden">
        {/* Background texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 60% 40%, var(--brand-glow) 0%, transparent 70%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.5) 39px,rgba(255,255,255,0.5) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,0.5) 39px,rgba(255,255,255,0.5) 40px)",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-sm font-medium text-[var(--accent)] mb-6">
                <Shield className="h-3.5 w-3.5" />
                Every professional is background-checked and verified
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.05] text-balance">
                Home repairs,<br />
                <span className="text-[var(--accent)]">done right.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-5 text-lg sm:text-xl text-white/70 leading-relaxed max-w-xl text-pretty">
                Find vetted electricians, plumbers, cleaners, and 9 other trades in your area. Compare prices, read real reviews, and book in under 60 seconds.
              </p>
            </Reveal>

            {/* Search box */}
            <Reveal delay={0.2}>
              <div className="mt-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-2 shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex flex-1 items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
                    <Search className="h-5 w-5 text-white/50 shrink-0" />
                    <input
                      type="text"
                      placeholder="What do you need fixed?"
                      value={searchService}
                      onChange={(e) => setSearchService(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none text-sm"
                    />
                  </div>
                  <div className="flex flex-1 items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
                    <MapPin className="h-5 w-5 text-white/50 shrink-0" />
                    <input
                      type="text"
                      placeholder="Your city or zip code"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none text-sm"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="rounded-xl bg-[var(--accent)] px-7 py-3 text-sm font-semibold text-black transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] shrink-0"
                  >
                    Search
                  </button>
                </div>
              </div>
            </Reveal>

            {/* Quick tags */}
            <Reveal delay={0.26}>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="text-sm text-white/40 self-center">Popular:</span>
                {QUICK_TAGS.map((tag) => (
                  <Link
                    key={tag}
                    href={`/find-professionals?q=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-white/15 bg-white/8 px-3.5 py-1 text-xs font-medium text-white/70 transition-all duration-200 hover:border-[var(--accent)]/50 hover:text-[var(--accent)] hover:bg-[var(--accent)]/10"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Hero image panel */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[42%] overflow-hidden">
          <img
            src="https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/ae48836a2b9b44859c15e1eb45212434.png"
            alt="Professional fixing a home appliance"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-hero-bg)] via-[var(--brand-hero-bg)]/30 to-transparent" />

          {/* Floating stat card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute bottom-16 left-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/20">
                <CheckCircle className="h-5 w-5 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-xs text-white/50">Last booked</p>
                <p className="text-sm font-semibold text-white">AC Repair · 4 min ago</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <Reveal>
        <section className="border-y border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {STATS.map((stat) => (
                <motion.div key={stat.label} variants={fadeInUp} className="text-center">
                  <div className="text-3xl font-bold text-[hsl(var(--foreground))] tracking-tight">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* ── SERVICE CATEGORIES ── */}
      <section id="services" className="py-24 md:py-32 bg-[hsl(var(--background))]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-2">
                  12 categories
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] text-balance">
                  Every trade, one platform
                </h2>
                <p className="mt-3 text-[hsl(var(--muted-foreground))] max-w-md leading-relaxed">
                  From a dripping faucet to a full rewire, Fixly has a vetted specialist for the job.
                </p>
              </div>
              <Link
                href="/services"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:gap-2.5 transition-all duration-200"
              >
                All services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.div key={cat.slug} variants={scaleIn}>
                  <Link
                    href={`/find-professionals?category=${cat.slug}`}
                    className="group flex flex-col items-center gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-center transition-all duration-200 hover:border-[var(--accent)]/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/10 group-hover:bg-[var(--accent)]/20 transition-colors duration-200">
                      <Icon className="h-6 w-6 text-[var(--accent)]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                        {cat.name}
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                        {cat.count} pros
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED PROVIDERS ── */}
      <section className="py-24 md:py-32 bg-[hsl(var(--muted))]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-2">
                  Handpicked this week
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] text-balance">
                  Top-rated pros near you
                </h2>
                <p className="mt-3 text-[hsl(var(--muted-foreground))] max-w-md leading-relaxed">
                  These professionals have the highest ratings, fastest response times, and most completed jobs on Fixly.
                </p>
              </div>
              <Link
                href="/find-professionals"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:gap-2.5 transition-all duration-200"
              >
                Browse all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {FEATURED_PROVIDERS.map((pro) => (
              <motion.div key={pro.id} variants={fadeInUp}>
                <Link
                  href={`/professionals/${pro.id}`}
                  className="group block rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)] hover:-translate-y-1"
                >
                  <div className="relative h-44 overflow-hidden bg-[hsl(var(--muted))]">
                    <img
                      src={pro.avatar}
                      alt={pro.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {pro.badge && (
                      <span className="absolute top-3 left-3 rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-xs font-semibold text-black">
                        {pro.badge}
                      </span>
                    )}
                    {pro.verified && (
                      <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm px-2 py-0.5 text-xs text-white">
                        <Shield className="h-3 w-3 text-[var(--accent)]" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-[hsl(var(--foreground))]">{pro.name}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                          {pro.category} · {pro.experience} yrs exp
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="h-3.5 w-3.5 fill-[var(--accent)] text-[var(--accent)]" />
                        <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                          {pro.rating}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))]">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {pro.distance} mi away
                      </span>
                      <span className="font-semibold text-[hsl(var(--foreground))]">
                        From ${pro.priceFrom}/{pro.priceUnit}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 md:py-32 bg-[hsl(var(--background))]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-2">
                Simple by design
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] text-balance">
                From search to booked in four steps
              </h2>
              <p className="mt-3 text-[hsl(var(--muted-foreground))] max-w-lg mx-auto leading-relaxed">
                No phone tag, no guessing on price. Fixly keeps the whole process transparent from the first search to the final invoice.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.step} delay={i * 0.1}>
                  <div className="relative">
                    {i < HOW_IT_WORKS.length - 1 && (
                      <div className="hidden lg:block absolute top-6 left-[calc(100%-1rem)] w-8 border-t-2 border-dashed border-[hsl(var(--border))] z-0" />
                    )}
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20">
                          <Icon className="h-5 w-5 text-[var(--accent)]" />
                        </div>
                        <span className="text-4xl font-black text-[hsl(var(--border))] leading-none select-none">
                          {step.step}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-[hsl(var(--foreground))] mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TRUST / VALUE PROPS ── */}
      <section className="py-24 md:py-32 bg-[var(--brand-dark)] text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-4">
                  Why Fixly
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance leading-tight">
                  We vet every pro before they take a single job
                </h2>
                <p className="mt-4 text-white/60 leading-relaxed">
                  Getting a stranger into your home takes trust. Every Fixly professional passes a background check, license verification, and a skills assessment before their profile goes live.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    { icon: Shield, text: "Background check on every professional" },
                    { icon: CheckCircle, text: "License and insurance verified" },
                    { icon: Star, text: "Ratings based on real, completed jobs only" },
                    { icon: Clock, text: "On-time guarantee or your booking fee back" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.text} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15">
                          <Icon className="h-4 w-4 text-[var(--accent)]" />
                        </div>
                        <span className="text-sm text-white/80">{item.text}</span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-10">
                  <Link
                    href="/find-professionals"
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-black transition-all duration-200 hover:brightness-110 hover:gap-3"
                  >
                    Find a professional <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
                <img
                  src="https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/778031ba983441ccb1bb9fc75d00ce78.jpeg"
                  alt="Verified Fixly professional at work"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/20 shrink-0">
                      <Shield className="h-5 w-5 text-[var(--accent)]" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50">Fixly Guarantee</p>
                      <p className="text-sm font-semibold text-white">
                        Full refund if the job is not completed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 md:py-32 bg-[hsl(var(--background))]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-2">
                Real customers
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] text-balance">
                What homeowners say
              </h2>
            </div>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeInUp}
                className={cn(
                  "rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 flex flex-col gap-4",
                  i === 1 && "md:mt-6"
                )}
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-[var(--accent)] text-[var(--accent)]" />
                  ))}
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-[hsl(var(--border))]">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-[hsl(var(--border))]"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{t.name}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      {t.location} · {t.service}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <Reveal>
        <section className="py-20 bg-[var(--accent)]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black text-balance">
              Your next home repair is one search away
            </h2>
            <p className="mt-4 text-black/60 max-w-xl mx-auto leading-relaxed">
              Join over 120,000 homeowners who use Fixly to get quality work done without the hassle of cold calls and no-shows.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/find-professionals"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-black/80 hover:gap-3"
              >
                Find a pro now <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/provider/verification"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black/20 bg-transparent px-7 py-3.5 text-sm font-semibold text-black transition-all duration-200 hover:bg-black/10"
              >
                Join as a professional
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}