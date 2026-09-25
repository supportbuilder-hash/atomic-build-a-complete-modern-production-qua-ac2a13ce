"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Upload, X, MapPin, Calendar, Clock, Star, Shield, Zap, Droplets, Wind, Sparkles, Hammer, Paintbrush, Settings, Lock, Leaf, Package, Wrench, AlertCircle, Camera, Home, Plus } from 'lucide-react';
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { slideInLeft, slideInRight } from "@/lib/motion";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PROVIDER = {
  id: "marcus-rivera",
  name: "Marcus Rivera",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Handyman",
  category: "Electrician",
  rating: 4.92,
  reviewCount: 318,
  experience: 12,
  priceFrom: 85,
  priceUnit: "hr",
  verified: true,
  badge: "Top Rated",
};

const SERVICES = [
  { id: "s1", name: "Electrical Inspection", price: 85, duration: "1–2 hrs", popular: true },
  { id: "s2", name: "Outlet & Switch Repair", price: 95, duration: "1 hr", popular: false },
  { id: "s3", name: "Circuit Breaker Replacement", price: 145, duration: "2–3 hrs", popular: true },
  { id: "s4", name: "Ceiling Fan Installation", price: 120, duration: "1–2 hrs", popular: false },
  { id: "s5", name: "Wiring & Rewiring", price: 200, duration: "3–5 hrs", popular: false },
  { id: "s6", name: "EV Charger Installation", price: 350, duration: "3–4 hrs", popular: true },
];

const AI_CHIPS = [
  "Flickering lights",
  "No power to outlet",
  "Tripping breaker",
  "Burning smell",
  "Sparking switch",
  "Outdoor lighting",
  "Panel upgrade",
  "Smart home setup",
];

const TIME_SLOTS = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM",
  "4:00 PM", "5:00 PM",
];

const SAVED_ADDRESSES = [
  { id: "a1", label: "Home", address: "142 Maple Street, Austin, TX 78701", icon: "home" },
  { id: "a2", label: "Office", address: "500 Congress Ave, Suite 400, Austin, TX 78701", icon: "office" },
];

const PLATFORM_FEE_RATE = 0.08;
const TAX_RATE = 0.0825;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDayStrip() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      key: d.toISOString().split("T")[0],
      day: days[d.getDay()],
      date: d.getDate(),
      month: months[d.getMonth()],
      isToday: i === 0,
    };
  });
}

const DAY_STRIP = getDayStrip();

// ─── Step Components ──────────────────────────────────────────────────────────

interface StepProps {
  onNext: () => void;
  onBack: () => void;
  state: BookingState;
  setState: React.Dispatch<React.SetStateAction<BookingState>>;
}

interface BookingState {
  selectedServices: string[];
  description: string;
  aiChips: string[];
  photos: string[];
  selectedDate: string;
  selectedTime: string;
  addressMode: "saved" | "new";
  selectedAddressId: string;
  newAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
  };
}

// Step 1: Service Selection
function StepServices({ onNext, state, setState }: StepProps) {
  const t = useTranslations();
  const toggle = (id: string) => {
    setState((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(id)
        ? prev.selectedServices.filter((s) => s !== id)
        : [...prev.selectedServices, id],
    }));
  };

  const canContinue = state.selectedServices.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] tracking-tight">
          {t("booking.step1.title")}
        </h2>
        <p className="mt-1 text-[hsl(var(--muted-foreground))]">
          {t("booking.step1.subtitle")}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {SERVICES.map((svc) => {
          const selected = state.selectedServices.includes(svc.id);
          return (
            <motion.button
              key={svc.id}
              onClick={() => toggle(svc.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                "relative flex items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200",
                selected
                  ? "border-[var(--accent)] bg-[var(--accent)]/8 shadow-[0_0_0_1px_var(--accent)]"
                  : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[var(--accent)]/50"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  selected
                    ? "border-[var(--accent)] bg-[var(--accent)]"
                    : "border-[hsl(var(--border))]"
                )}
              >
                {selected && <Check className="h-3 w-3 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[hsl(var(--foreground))]">{svc.name}</span>
                  {svc.popular && (
                    <span className="rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-xs font-medium text-[var(--accent)]">
                      {t("booking.step1.popular")}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-3 text-sm text-[hsl(var(--muted-foreground))]">
                  <span className="font-medium text-[hsl(var(--foreground))]">${svc.price}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {svc.duration}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {state.selectedServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-4"
        >
          <p className="text-sm font-medium text-[hsl(var(--foreground))]">
            {state.selectedServices.length} {t("booking.step1.servicesSelected")}
            {" · "}
            <span className="text-[var(--accent)]">
              ${SERVICES.filter((s) => state.selectedServices.includes(s.id))
                .reduce((sum, s) => sum + s.price, 0)}{" "}
              {t("booking.step1.estimated")}
            </span>
          </p>
        </motion.div>
      )}

      <div className="flex justify-end">
        <motion.button
          onClick={onNext}
          disabled={!canContinue}
          whileHover={canContinue ? { scale: 1.02 } : {}}
          whileTap={canContinue ? { scale: 0.98 } : {}}
          className={cn(
            "flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all duration-200",
            canContinue
              ? "bg-[var(--accent)] text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:opacity-90"
              : "cursor-not-allowed bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
          )}
        >
          {t("booking.next")}
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}

// Step 2: Problem Description + Photos
function StepDescription({ onNext, onBack, state, setState }: StepProps) {
  const t = useTranslations();
  const [dragOver, setDragOver] = useState(false);

  const toggleChip = (chip: string) => {
    setState((prev) => ({
      ...prev,
      aiChips: prev.aiChips.includes(chip)
        ? prev.aiChips.filter((c) => c !== chip)
        : [...prev.aiChips, chip],
    }));
    if (!state.description.includes(chip)) {
      setState((prev) => ({
        ...prev,
        description: prev.description
          ? `${prev.description}, ${chip.toLowerCase()}`
          : chip.toLowerCase(),
      }));
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (files.length > 0) {
      setState((prev) => ({
        ...prev,
        photos: [...prev.photos, ...files.map((f) => URL.createObjectURL(f))].slice(0, 4),
      }));
    }
  }, [setState]);

  const removePhoto = (idx: number) => {
    setState((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
    }));
  };

  const canContinue = state.description.trim().length >= 10;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] tracking-tight">
          {t("booking.step2.title")}
        </h2>
        <p className="mt-1 text-[hsl(var(--muted-foreground))]">
          {t("booking.step2.subtitle")}
        </p>
      </div>

      {/* AI Chips */}
      <div>
        <p className="mb-3 flex items-center gap-2 text-sm font-medium text-[hsl(var(--foreground))]">
          <Sparkles className="h-4 w-4 text-[var(--accent)]" />
          {t("booking.step2.quickSelect")}
        </p>
        <div className="flex flex-wrap gap-2">
          {AI_CHIPS.map((chip) => (
            <motion.button
              key={chip}
              onClick={() => toggleChip(chip)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-150",
                state.aiChips.includes(chip)
                  ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                  : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:border-[var(--accent)]/60"
              )}
            >
              {chip}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">
          {t("booking.step2.descLabel")}
        </label>
        <textarea
          value={state.description}
          onChange={(e) => setState((prev) => ({ ...prev, description: e.target.value }))}
          placeholder={t("booking.step2.descPlaceholder")}
          rows={4}
          className="w-full resize-none rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
        />
        <p className="mt-1 text-right text-xs text-[hsl(var(--muted-foreground))]">
          {state.description.length} {t("booking.step2.chars")}
        </p>
      </div>

      {/* Photo Upload */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">
          {t("booking.step2.photoLabel")}
        </label>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200",
            dragOver
              ? "border-[var(--accent)] bg-[var(--accent)]/5"
              : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[var(--accent)]/40"
          )}
        >
          <Camera className="mx-auto h-8 w-8 text-[hsl(var(--muted-foreground))]" />
          <p className="mt-2 text-sm font-medium text-[hsl(var(--foreground))]">
            {t("booking.step2.dropzone")}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
            {t("booking.step2.dropzoneHint")}
          </p>
          <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors">
            <Upload className="h-4 w-4" />
            {t("booking.step2.browse")}
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                setState((prev) => ({
                  ...prev,
                  photos: [...prev.photos, ...files.map((f) => URL.createObjectURL(f))].slice(0, 4),
                }));
              }}
            />
          </label>
        </div>

        {state.photos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {state.photos.map((src, idx) => (
              <div key={idx} className="relative h-20 w-20 overflow-hidden rounded-xl border border-[hsl(var(--border))]">
                <img src={src} alt={`Upload ${idx + 1}`} className="h-full w-full object-cover" />
                <button
                  onClick={() => removePhoto(idx)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] px-5 py-3 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("booking.back")}
        </button>
        <motion.button
          onClick={onNext}
          disabled={!canContinue}
          whileHover={canContinue ? { scale: 1.02 } : {}}
          whileTap={canContinue ? { scale: 0.98 } : {}}
          className={cn(
            "flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all duration-200",
            canContinue
              ? "bg-[var(--accent)] text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:opacity-90"
              : "cursor-not-allowed bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
          )}
        >
          {t("booking.next")}
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}

// Step 3: Date & Time
function StepDateTime({ onNext, onBack, state, setState }: StepProps) {
  const t = useTranslations();
  const canContinue = !!state.selectedDate && !!state.selectedTime;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] tracking-tight">
          {t("booking.step3.title")}
        </h2>
        <p className="mt-1 text-[hsl(var(--muted-foreground))]">
          {t("booking.step3.subtitle")}
        </p>
      </div>

      {/* Date Strip */}
      <div>
        <p className="mb-3 text-sm font-medium text-[hsl(var(--foreground))]">
          {t("booking.step3.selectDate")}
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {DAY_STRIP.map((d) => (
            <motion.button
              key={d.key}
              onClick={() => setState((prev) => ({ ...prev, selectedDate: d.key }))}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "flex min-w-[64px] flex-col items-center rounded-xl border px-3 py-3 transition-all duration-150",
                state.selectedDate === d.key
                  ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                  : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:border-[var(--accent)]/50"
              )}
            >
              <span className="text-xs font-medium opacity-70">{d.day}</span>
              <span className="mt-1 text-xl font-bold">{d.date}</span>
              <span className="text-xs opacity-70">{d.month}</span>
              {d.isToday && (
                <span className={cn(
                  "mt-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                  state.selectedDate === d.key
                    ? "bg-white/20 text-white"
                    : "bg-[var(--accent)]/15 text-[var(--accent)]"
                )}>
                  {t("booking.step3.today")}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      {state.selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="mb-3 text-sm font-medium text-[hsl(var(--foreground))]">
            {t("booking.step3.selectTime")}
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {TIME_SLOTS.map((slot) => {
              const unavailable = ["11:00 AM", "2:00 PM"].includes(slot);
              return (
                <motion.button
                  key={slot}
                  onClick={() => !unavailable && setState((prev) => ({ ...prev, selectedTime: slot }))}
                  whileHover={!unavailable ? { scale: 1.04 } : {}}
                  whileTap={!unavailable ? { scale: 0.96 } : {}}
                  disabled={unavailable}
                  className={cn(
                    "rounded-xl border py-2.5 text-sm font-medium transition-all duration-150",
                    unavailable
                      ? "cursor-not-allowed border-[hsl(var(--border))] bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] line-through opacity-50"
                      : state.selectedTime === slot
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                      : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:border-[var(--accent)]/50"
                  )}
                >
                  {slot}
                </motion.button>
              );
            })}
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
            <AlertCircle className="h-3.5 w-3.5" />
            {t("booking.step3.unavailableNote")}
          </p>
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] px-5 py-3 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("booking.back")}
        </button>
        <motion.button
          onClick={onNext}
          disabled={!canContinue}
          whileHover={canContinue ? { scale: 1.02 } : {}}
          whileTap={canContinue ? { scale: 0.98 } : {}}
          className={cn(
            "flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all duration-200",
            canContinue
              ? "bg-[var(--accent)] text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:opacity-90"
              : "cursor-not-allowed bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
          )}
        >
          {t("booking.next")}
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}

// Step 4: Address
function StepAddress({ onNext, onBack, state, setState }: StepProps) {
  const t = useTranslations();

  const canContinue =
    state.addressMode === "saved"
      ? !!state.selectedAddressId
      : state.newAddress.line1.trim().length > 0 &&
        state.newAddress.city.trim().length > 0 &&
        state.newAddress.zip.trim().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] tracking-tight">
          {t("booking.step4.title")}
        </h2>
        <p className="mt-1 text-[hsl(var(--muted-foreground))]">
          {t("booking.step4.subtitle")}
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-1">
        {(["saved", "new"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setState((prev) => ({ ...prev, addressMode: mode }))}
            className={cn(
              "flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-150",
              state.addressMode === mode
                ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            )}
          >
            {mode === "saved" ? t("booking.step4.savedAddresses") : t("booking.step4.newAddress")}
          </button>
        ))}
      </div>

      {state.addressMode === "saved" ? (
        <div className="space-y-3">
          {SAVED_ADDRESSES.map((addr) => (
            <motion.button
              key={addr.id}
              onClick={() => setState((prev) => ({ ...prev, selectedAddressId: addr.id }))}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-150",
                state.selectedAddressId === addr.id
                  ? "border-[var(--accent)] bg-[var(--accent)]/8 shadow-[0_0_0_1px_var(--accent)]"
                  : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[var(--accent)]/50"
              )}
            >
              <div className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                state.selectedAddressId === addr.id
                  ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                  : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
              )}>
                <Home className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-[hsl(var(--foreground))]">{addr.label}</p>
                <p className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))]">{addr.address}</p>
              </div>
              {state.selectedAddressId === addr.id && (
                <div className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </motion.button>
          ))}
          <button className="flex w-full items-center gap-3 rounded-xl border border-dashed border-[hsl(var(--border))] p-4 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:border-[var(--accent)]/50 hover:text-[var(--accent)] transition-colors">
            <Plus className="h-4 w-4" />
            {t("booking.step4.addNew")}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
              {t("booking.step4.line1")}
            </label>
            <input
              type="text"
              value={state.newAddress.line1}
              onChange={(e) => setState((prev) => ({ ...prev, newAddress: { ...prev.newAddress, line1: e.target.value } }))}
              placeholder={t("booking.step4.line1Placeholder")}
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
              {t("booking.step4.line2")}
            </label>
            <input
              type="text"
              value={state.newAddress.line2}
              onChange={(e) => setState((prev) => ({ ...prev, newAddress: { ...prev.newAddress, line2: e.target.value } }))}
              placeholder={t("booking.step4.line2Placeholder")}
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
                {t("booking.step4.city")}
              </label>
              <input
                type="text"
                value={state.newAddress.city}
                onChange={(e) => setState((prev) => ({ ...prev, newAddress: { ...prev.newAddress, city: e.target.value } }))}
                placeholder={t("booking.step4.cityPlaceholder")}
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
                {t("booking.step4.state")}
              </label>
              <input
                type="text"
                value={state.newAddress.state}
                onChange={(e) => setState((prev) => ({ ...prev, newAddress: { ...prev.newAddress, state: e.target.value } }))}
                placeholder="TX"
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
                {t("booking.step4.zip")}
              </label>
              <input
                type="text"
                value={state.newAddress.zip}
                onChange={(e) => setState((prev) => ({ ...prev, newAddress: { ...prev.newAddress, zip: e.target.value } }))}
                placeholder="78701"
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] px-5 py-3 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("booking.back")}
        </button>
        <motion.button
          onClick={onNext}
          disabled={!canContinue}
          whileHover={canContinue ? { scale: 1.02 } : {}}
          whileTap={canContinue ? { scale: 0.98 } : {}}
          className={cn(
            "flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all duration-200",
            canContinue
              ? "bg-[var(--accent)] text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:opacity-90"
              : "cursor-not-allowed bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
          )}
        >
          {t("booking.next")}
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}

// Step 5: Review & Confirm
function StepConfirm({ onBack, state }: Omit<StepProps, "onNext"> & { onConfirm: () => void }) {
  const t = useTranslations();

  const selectedServiceObjs = SERVICES.filter((s) => state.selectedServices.includes(s.id));
  const serviceTotal = selectedServiceObjs.reduce((sum, s) => sum + s.price, 0);
  const platformFee = Math.round(serviceTotal * PLATFORM_FEE_RATE);
  const tax = Math.round(serviceTotal * TAX_RATE);
  const total = serviceTotal + platformFee + tax;

  const addressDisplay =
    state.addressMode === "saved"
      ? SAVED_ADDRESSES.find((a) => a.id === state.selectedAddressId)?.address ?? ""
      : `${state.newAddress.line1}${state.newAddress.line2 ? `, ${state.newAddress.line2}` : ""}, ${state.newAddress.city}, ${state.newAddress.state} ${state.newAddress.zip}`;

  const formattedDate = state.selectedDate
    ? new Date(state.selectedDate + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] tracking-tight">
          {t("booking.step5.title")}
        </h2>
        <p className="mt-1 text-[hsl(var(--muted-foreground))]">
          {t("booking.step5.subtitle")}
        </p>
      </div>

      {/* Provider Card */}
      <div className="flex items-center gap-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
        <img
          src={PROVIDER.avatar}
          alt={PROVIDER.name}
          className="h-14 w-14 rounded-full object-cover ring-2 ring-[hsl(var(--border))]"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-[hsl(var(--foreground))]">{PROVIDER.name}</p>
            {PROVIDER.verified && (
              <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                <Shield className="h-3 w-3" />
                {t("booking.step5.verified")}
              </span>
            )}
          </div>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{PROVIDER.category}</p>
          <div className="mt-1 flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-[hsl(var(--foreground))]">{PROVIDER.rating}</span>
            <span className="text-xs text-[hsl(var(--muted-foreground))]">({PROVIDER.reviewCount} {t("booking.step5.reviews")})</span>
          </div>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Services */}
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            {t("booking.step5.services")}
          </p>
          <ul className="space-y-2">
            {selectedServiceObjs.map((svc) => (
              <li key={svc.id} className="flex items-center justify-between text-sm">
                <span className="text-[hsl(var(--foreground))]">{svc.name}</span>
                <span className="font-medium text-[hsl(var(--foreground))]">${svc.price}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Schedule & Location */}
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            {t("booking.step5.scheduleLocation")}
          </p>
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
            <div>
              <p className="text-sm font-medium text-[hsl(var(--foreground))]">{formattedDate}</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">{state.selectedTime}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
            <p className="text-sm text-[hsl(var(--foreground))]">{addressDisplay}</p>
          </div>
        </div>
      </div>

      {/* Problem Description */}
      {state.description && (
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            {t("booking.step5.problemDesc")}
          </p>
          <p className="text-sm text-[hsl(var(--foreground))]">{state.description}</p>
          {state.photos.length > 0 && (
            <div className="mt-3 flex gap-2">
              {state.photos.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Photo ${i + 1}`}
                  className="h-12 w-12 rounded-lg object-cover border border-[hsl(var(--border))]"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pricing Breakdown */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          {t("booking.step5.pricingBreakdown")}
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[hsl(var(--muted-foreground))]">{t("booking.step5.serviceFee")}</span>
            <span className="font-medium text-[hsl(var(--foreground))]">${serviceTotal}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[hsl(var(--muted-foreground))]">{t("booking.step5.platformFee")}</span>
            <span className="font-medium text-[hsl(var(--foreground))]">${platformFee}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[hsl(var(--muted-foreground))]">{t("booking.step5.tax")}</span>
            <span className="font-medium text-[hsl(var(--foreground))]">${tax}</span>
          </div>
          <div className="border-t border-[hsl(var(--border))] pt-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[hsl(var(--foreground))]">{t("booking.step5.total")}</span>
              <span className="text-xl font-bold text-[hsl(var(--foreground))]">${total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap gap-3">
        {[
          { icon: Shield, text: t("booking.step5.trust1") },
          { icon: Check, text: t("booking.step5.trust2") },
          { icon: Star, text: t("booking.step5.trust3") },
        ].map((badge) => (
          <div key={badge.text} className="flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))]">
            <badge.icon className="h-3.5 w-3.5 text-[var(--accent)]" />
            {badge.text}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] px-5 py-3 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("booking.back")}
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-3.5 font-bold text-white shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:bg-amber-600 transition-all duration-200"
        >
          <Check className="h-5 w-5" />
          {t("booking.step5.confirm")}
        </motion.button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const STEPS = [
  { key: "services", label: "Services" },
  { key: "description", label: "Details" },
  { key: "datetime", label: "Schedule" },
  { key: "address", label: "Address" },
  { key: "confirm", label: "Confirm" },
];

const INITIAL_STATE: BookingState = {
  selectedServices: [],
  description: "",
  aiChips: [],
  photos: [],
  selectedDate: "",
  selectedTime: "",
  addressMode: "saved",
  selectedAddressId: "a1",
  newAddress: { line1: "", line2: "", city: "", state: "", zip: "" },
};

export default function BookingPage() {
  const t = useTranslations();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [state, setState] = useState<BookingState>(INITIAL_STATE);
  const [confirmed, setConfirmed] = useState(false);

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const stepVariants = {
    hidden: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40, transition: { duration: 0.25, ease: "easeIn" } }),
  };

  if (confirmed) {
    return (
      <main className="min-h-screen bg-[hsl(var(--background))] px-4 py-16">
        <div className="mx-auto max-w-lg text-center">
          <Reveal>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
            >
              <Check className="h-10 w-10 text-green-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">
              {t("booking.confirmed.title")}
            </h1>
            <p className="mt-3 text-[hsl(var(--muted-foreground))]">
              {t("booking.confirmed.subtitle")}
            </p>
            <div className="mt-8 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-left">
              <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                {t("booking.confirmed.bookingId")}
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-[var(--accent)]">FX-2024-8847</p>
              <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">
                {t("booking.confirmed.emailNote")}
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href="/tracking/FX-2024-8847"
                className="flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 font-semibold text-white hover:opacity-90 transition-opacity"
              >
                {t("booking.confirmed.trackBooking")}
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="/customer/bookings"
                className="flex items-center justify-center gap-2 rounded-xl border border-[hsl(var(--border))] px-6 py-3 font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
              >
                {t("booking.confirmed.myBookings")}
              </a>
            </div>
          </Reveal>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <Reveal>
            <div className="flex items-center gap-3">
              <img
                src={PROVIDER.avatar}
                alt={PROVIDER.name}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-[hsl(var(--border))]"
              />
              <div>
                <h1 className="text-sm font-semibold text-[hsl(var(--foreground))]">
                  {t("booking.header.bookWith")} {PROVIDER.name}
                </h1>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {PROVIDER.category} · {t("booking.header.verified")}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex flex-1 items-center gap-1">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                      i < step
                        ? "bg-[var(--accent)] text-white"
                        : i === step
                        ? "bg-[var(--accent)] text-white ring-4 ring-[var(--accent)]/20"
                        : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                    )}
                  >
                    {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span
                    className={cn(
                      "hidden text-[10px] font-medium sm:block",
                      i <= step ? "text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))]"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 mb-4">
                    <div className="h-0.5 w-full rounded-full bg-[hsl(var(--muted))]">
                      <motion.div
                        className="h-full rounded-full bg-[var(--accent)]"
                        initial={{ width: "0%" }}
                        animate={{ width: i < step ? "100%" : "0%" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {step === 0 && (
              <StepServices onNext={goNext} onBack={goBack} state={state} setState={setState} />
            )}
            {step === 1 && (
              <StepDescription onNext={goNext} onBack={goBack} state={state} setState={setState} />
            )}
            {step === 2 && (
              <StepDateTime onNext={goNext} onBack={goBack} state={state} setState={setState} />
            )}
            {step === 3 && (
              <StepAddress onNext={goNext} onBack={goBack} state={state} setState={setState} />
            )}
            {step === 4 && (
              <StepConfirm
                onBack={goBack}
                state={state}
                setState={setState}
                onConfirm={() => setConfirmed(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}