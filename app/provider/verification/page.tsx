"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CheckCircle, Clock, Upload, Shield, Star, FileText, Camera, AlertCircle, ChevronRight, Check, X, Info, Zap, Award, TrendingUp, Lock } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";

const STEPS = [
  { id: 1, label: "Basic Info", icon: FileText },
  { id: 2, label: "ID Verification", icon: Shield },
  { id: 3, label: "Certifications", icon: Award },
  { id: 4, label: "Portfolio", icon: Camera },
  { id: 5, label: "Review", icon: CheckCircle },
];

const BENEFITS = [
  {
    icon: Shield,
    title: "Verified Badge",
    desc: "A blue checkmark on your profile builds instant trust with customers.",
  },
  {
    icon: Star,
    title: "Priority Ranking",
    desc: "Verified pros appear higher in search results and get 3x more bookings.",
  },
  {
    icon: TrendingUp,
    title: "Higher Earnings",
    desc: "Verified providers earn on average 40% more per month than unverified ones.",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    desc: "Unlock instant-book requests without needing to manually accept each job.",
  },
  {
    icon: Lock,
    title: "Dispute Protection",
    desc: "Verified pros get priority support and full protection in payment disputes.",
  },
  {
    icon: Award,
    title: "Pro Certification",
    desc: "Earn category-specific badges (e.g. Master Electrician) for extra credibility.",
  },
];

const SERVICE_CATEGORIES = [
  "Electrician",
  "Plumber",
  "AC & HVAC",
  "Cleaning",
  "Carpentry",
  "Painting",
  "Pest Control",
  "Appliance Repair",
  "Home Security",
  "Landscaping",
  "Moving & Packing",
  "Handyman",
];

const EXPERIENCE_OPTIONS = [
  "Less than 1 year",
  "1-2 years",
  "3-5 years",
  "6-10 years",
  "10+ years",
];

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  category: string;
  experience: string;
  bio: string;
  idType: string;
  idNumber: string;
  idFrontUploaded: boolean;
  idBackUploaded: boolean;
  selfieUploaded: boolean;
  certName: string;
  certIssuer: string;
  certYear: string;
  certUploaded: boolean;
  portfolioImages: number;
  agreeTerms: boolean;
  agreeBackground: boolean;
}

const initialForm: FormData = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  category: "",
  experience: "",
  bio: "",
  idType: "national-id",
  idNumber: "",
  idFrontUploaded: false,
  idBackUploaded: false,
  selfieUploaded: false,
  certName: "",
  certIssuer: "",
  certYear: "",
  certUploaded: false,
  portfolioImages: 0,
  agreeTerms: false,
  agreeBackground: false,
};

function UploadBox({
  label,
  uploaded,
  onUpload,
  hint,
}: {
  label: string;
  uploaded: boolean;
  onUpload: () => void;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onUpload}
      className={cn(
        "w-full rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200",
        uploaded
          ? "border-[var(--accent)] bg-[var(--accent)]/5"
          : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/3"
      )}
    >
      {uploaded ? (
        <div className="flex flex-col items-center gap-2">
          <CheckCircle className="h-8 w-8 text-[var(--accent)]" />
          <span className="text-sm font-medium text-[var(--accent)]">Uploaded</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
          <span className="text-sm font-medium text-[hsl(var(--foreground))]">{label}</span>
          {hint && <span className="text-xs text-[hsl(var(--muted-foreground))]">{hint}</span>}
        </div>
      )}
    </button>
  );
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-between">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        return (
          <div key={step.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isCompleted
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : isActive
                    ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))]"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  isActive
                    ? "text-[var(--accent)]"
                    : isCompleted
                    ? "text-[hsl(var(--foreground))]"
                    : "text-[hsl(var(--muted-foreground))]"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1 transition-all duration-300",
                  currentStep > step.id
                    ? "bg-[var(--accent)]"
                    : "bg-[hsl(var(--border))]"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Step1({
  form,
  setForm,
}: {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
          Basic Information
        </h2>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          Tell us about yourself so customers can find and trust you.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
            Full Name
          </label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            placeholder="e.g. Marcus Rivera"
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
            Email Address
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
            Phone Number
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="+1 (555) 000-0000"
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
            City / Area
          </label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            placeholder="e.g. Austin, TX"
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
            Primary Service Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-2.5 text-sm text-[hsl(var(--foreground))] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
          >
            <option value="">Select a category</option>
            {SERVICE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
            Years of Experience
          </label>
          <select
            value={form.experience}
            onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-2.5 text-sm text-[hsl(var(--foreground))] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
          >
            <option value="">Select experience</option>
            {EXPERIENCE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
          Professional Bio
        </label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          rows={4}
          placeholder="Describe your expertise, specialties, and what makes you stand out. Customers read this before booking."
          className="w-full resize-none rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
        />
        <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
          {form.bio.length}/500 characters. Aim for at least 100.
        </p>
      </div>
    </div>
  );
}

function Step2({
  form,
  setForm,
}: {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
          Identity Verification
        </h2>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          We verify your identity to protect customers and build trust. Your data is encrypted and never shared.
        </p>
      </div>
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-950/30">
        <div className="flex gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Accepted documents: National ID, Passport, or Driver&apos;s License. Files must be clear, unobstructed, and under 10MB.
          </p>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
          Document Type
        </label>
        <div className="flex flex-wrap gap-3">
          {[
            { value: "national-id", label: "National ID" },
            { value: "passport", label: "Passport" },
            { value: "drivers-license", label: "Driver's License" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, idType: opt.value }))}
              className={cn(
                "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                form.idType === opt.value
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:border-[var(--accent)]/50"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
          Document Number
        </label>
        <input
          type="text"
          value={form.idNumber}
          onChange={(e) => setForm((f) => ({ ...f, idNumber: e.target.value }))}
          placeholder="Enter your document number"
          className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <UploadBox
          label="Front of Document"
          uploaded={form.idFrontUploaded}
          onUpload={() => setForm((f) => ({ ...f, idFrontUploaded: !f.idFrontUploaded }))}
          hint="JPG, PNG or PDF, max 10MB"
        />
        <UploadBox
          label="Back of Document"
          uploaded={form.idBackUploaded}
          onUpload={() => setForm((f) => ({ ...f, idBackUploaded: !f.idBackUploaded }))}
          hint="JPG, PNG or PDF, max 10MB"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
          Selfie with Document
        </label>
        <UploadBox
          label="Take or upload a selfie holding your document"
          uploaded={form.selfieUploaded}
          onUpload={() => setForm((f) => ({ ...f, selfieUploaded: !f.selfieUploaded }))}
          hint="Face and document must both be clearly visible"
        />
      </div>
    </div>
  );
}

function Step3({
  form,
  setForm,
}: {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
          Certifications &amp; Licenses
        </h2>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          Add your professional certifications to unlock category-specific badges and boost your ranking.
        </p>
      </div>
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
        <p className="mb-3 text-sm font-medium text-[hsl(var(--foreground))]">
          Why add certifications?
        </p>
        <ul className="space-y-2">
          {[
            "Earn category badges (e.g. Licensed Electrician, Certified HVAC Tech)",
            "Appear in filtered searches for certified professionals",
            "Charge premium rates with verified credentials",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-[hsl(var(--muted-foreground))]">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
            Certification Name
          </label>
          <input
            type="text"
            value={form.certName}
            onChange={(e) => setForm((f) => ({ ...f, certName: e.target.value }))}
            placeholder="e.g. Licensed Master Electrician"
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
            Issuing Authority
          </label>
          <input
            type="text"
            value={form.certIssuer}
            onChange={(e) => setForm((f) => ({ ...f, certIssuer: e.target.value }))}
            placeholder="e.g. Texas State Board of Electricians"
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
            Year Issued
          </label>
          <input
            type="text"
            value={form.certYear}
            onChange={(e) => setForm((f) => ({ ...f, certYear: e.target.value }))}
            placeholder="e.g. 2019"
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
          />
        </div>
      </div>
      <UploadBox
        label="Upload Certificate / License Document"
        uploaded={form.certUploaded}
        onUpload={() => setForm((f) => ({ ...f, certUploaded: !f.certUploaded }))}
        hint="PDF, JPG or PNG, max 10MB"
      />
      <div className="rounded-xl border border-dashed border-[hsl(var(--border))] p-4 text-center">
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Have more certifications?{" "}
          <button type="button" className="font-medium text-[var(--accent)] hover:underline">
            + Add another certification
          </button>
        </p>
      </div>
    </div>
  );
}

function Step4({
  form,
  setForm,
}: {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  const portfolioSlots = [0, 1, 2, 3, 4, 5];
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
          Portfolio &amp; Work Samples
        </h2>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          Upload before/after photos of your best work. Profiles with portfolios get 5x more views.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {portfolioSlots.map((slot) => {
          const isUploaded = slot < form.portfolioImages;
          return (
            <button
              key={slot}
              type="button"
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  portfolioImages: isUploaded
                    ? Math.max(0, f.portfolioImages - 1)
                    : f.portfolioImages + 1,
                }))
              }
              className={cn(
                "aspect-square rounded-xl border-2 border-dashed transition-all duration-200 flex items-center justify-center",
                isUploaded
                  ? "border-[var(--accent)] bg-[var(--accent)]/10"
                  : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[var(--accent)]/50"
              )}
            >
              {isUploaded ? (
                <div className="flex flex-col items-center gap-1">
                  <CheckCircle className="h-6 w-6 text-[var(--accent)]" />
                  <span className="text-xs font-medium text-[var(--accent)]">Photo {slot + 1}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Camera className="h-6 w-6 text-[hsl(var(--muted-foreground))]" />
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">Add photo</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-[hsl(var(--muted-foreground))]">
        {form.portfolioImages} of 6 photos added. Minimum 2 required. JPG or PNG, max 8MB each.
      </p>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/30">
        <div className="flex gap-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Photos must show your actual work. Stock images or photos not of your work will result in rejection.
          </p>
        </div>
      </div>
    </div>
  );
}

function Step5({ form }: { form: FormData }) {
  const fields = [
    { label: "Full Name", value: form.fullName || "Not provided" },
    { label: "Email", value: form.email || "Not provided" },
    { label: "Phone", value: form.phone || "Not provided" },
    { label: "City", value: form.city || "Not provided" },
    { label: "Category", value: form.category || "Not provided" },
    { label: "Experience", value: form.experience || "Not provided" },
  ];

  const checks = [
    { label: "Identity document uploaded", done: form.idFrontUploaded && form.idBackUploaded },
    { label: "Selfie with document uploaded", done: form.selfieUploaded },
    { label: "Certification added", done: form.certUploaded },
    { label: "Portfolio photos added", done: form.portfolioImages >= 2 },
    { label: "Terms agreed", done: form.agreeTerms },
    { label: "Background check consented", done: form.agreeBackground },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
          Review &amp; Submit
        </h2>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          Review your information before submitting. Our team will verify your application within 24-48 hours.
        </p>
      </div>
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
        <h3 className="mb-3 text-sm font-semibold text-[hsl(var(--foreground))]">
          Your Information
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.label}>
              <span className="text-xs text-[hsl(var(--muted-foreground))]">{f.label}</span>
              <p className="text-sm font-medium text-[hsl(var(--foreground))]">{f.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
        <h3 className="mb-3 text-sm font-semibold text-[hsl(var(--foreground))]">
          Verification Checklist
        </h3>
        <ul className="space-y-2">
          {checks.map((c) => (
            <li key={c.label} className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full",
                  c.done
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                )}
              >
                {c.done ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <X className="h-3 w-3" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm",
                  c.done
                    ? "text-[hsl(var(--foreground))]"
                    : "text-[hsl(var(--muted-foreground))]"
                )}
              >
                {c.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
        <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">
          Agreements
        </h3>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={false}
            onChange={() => {}}
            className="mt-0.5 h-4 w-4 rounded border-[hsl(var(--border))] accent-[var(--accent)]"
          />
          <span className="text-sm text-[hsl(var(--muted-foreground))]">
            I agree to Fixly&apos;s{" "}
            <a href="#" className="text-[var(--accent)] hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[var(--accent)] hover:underline">
              Provider Agreement
            </a>
            .
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={false}
            onChange={() => {}}
            className="mt-0.5 h-4 w-4 rounded border-[hsl(var(--border))] accent-[var(--accent)]"
          />
          <span className="text-sm text-[hsl(var(--muted-foreground))]">
            I consent to a background check as part of the verification process.
          </span>
        </label>
      </div>
    </div>
  );
}

export default function ProviderVerificationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => {
    if (currentStep < STEPS.length) setCurrentStep((s) => s + 1);
    else setSubmitted(true);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[hsl(var(--background))]">
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <Reveal>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent)]/15"
            >
              <CheckCircle className="h-10 w-10 text-[var(--accent)]" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
              Application Submitted!
            </h1>
            <p className="mt-4 text-[hsl(var(--muted-foreground))]">
              Thank you for applying to become a verified Fixly professional. Our team will review your application and get back to you within 24-48 hours.
            </p>
            <div className="mt-8 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-left">
              <h2 className="mb-4 font-semibold text-[hsl(var(--foreground))]">What happens next?</h2>
              <ol className="space-y-3">
                {[
                  { step: "1", text: "Our team reviews your documents and certifications (24-48 hrs)." },
                  { step: "2", text: "We run a background check through our trusted partner." },
                  { step: "3", text: "You receive an email with your verification result." },
                  { step: "4", text: "Once approved, your profile goes live and you start receiving bookings." },
                ].map((item) => (
                  <li key={item.step} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-xs font-bold text-[var(--accent)]">
                      {item.step}
                    </span>
                    <span className="text-sm text-[hsl(var(--muted-foreground))]">{item.text}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href="/provider/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
              >
                Go to Dashboard
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-3 text-sm font-semibold text-[hsl(var(--foreground))] transition-all hover:bg-[hsl(var(--muted))]"
              >
                Back to Home
              </a>
            </div>
          </Reveal>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[hsl(var(--background))]">
      {/* Hero / Header */}
      <Reveal>
        <section className="border-b border-[hsl(var(--border))] bg-gradient-to-br from-[var(--accent)]/8 via-[hsl(var(--background))] to-[hsl(var(--background))] px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-sm font-medium text-[var(--accent)]">
              <Shield className="h-4 w-4" />
              Become a Verified Pro
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-5xl">
              Get Verified. Earn More.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-[hsl(var(--muted-foreground))]">
              Join thousands of trusted professionals on Fixly. Verification takes under 10 minutes and unlocks premium features, higher rankings, and more bookings.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-[hsl(var(--muted-foreground))]">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[var(--accent)]" />
                Under 10 minutes
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-[var(--accent)]" />
                Secure &amp; encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-[var(--accent)]" />
                24-48hr review
              </span>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Benefits */}
      <Reveal>
        <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <p className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
              Why get verified?
            </p>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {BENEFITS.map((b) => {
                const Icon = b.icon;
                return (
                  <motion.div
                    key={b.title}
                    variants={scaleIn}
                    className="flex items-start gap-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10">
                      <Icon className="h-5 w-5 text-[var(--accent)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[hsl(var(--foreground))]">{b.title}</p>
                      <p className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))]">{b.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* Multi-step form */}
      <Reveal>
        <section className="px-4 py-12">
          <div className="mx-auto max-w-2xl">
            {/* Step indicator */}
            <div className="mb-8">
              <StepIndicator currentStep={currentStep} />
            </div>

            {/* Form card */}
            <motion.div
              key={currentStep}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] sm:p-8"
            >
              {currentStep === 1 && <Step1 form={form} setForm={setForm} />}
              {currentStep === 2 && <Step2 form={form} setForm={setForm} />}
              {currentStep === 3 && <Step3 form={form} setForm={setForm} />}
              {currentStep === 4 && <Step4 form={form} setForm={setForm} />}
              {currentStep === 5 && <Step5 form={form} />}

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between border-t border-[hsl(var(--border))] pt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className={cn(
                    "rounded-xl border border-[hsl(var(--border))] px-5 py-2.5 text-sm font-medium transition-all",
                    currentStep === 1
                      ? "cursor-not-allowed opacity-40 text-[hsl(var(--muted-foreground))]"
                      : "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                  )}
                >
                  Back
                </button>
                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                  Step {currentStep} of {STEPS.length}
                </span>
                <motion.button
                  type="button"
                  onClick={handleNext}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all hover:opacity-90"
                >
                  {currentStep === STEPS.length ? "Submit Application" : "Continue"}
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>

            {/* Trust note */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
              <Lock className="h-3.5 w-3.5" />
              Your data is encrypted with 256-bit SSL and never sold to third parties.
            </div>
          </div>
        </section>
      </Reveal>

      {/* Stats bar */}
      <Reveal>
        <section className="border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))]/40 px-4 py-10">
          <div className="mx-auto max-w-4xl">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-2 gap-6 sm:grid-cols-4"
            >
              {[
                { value: "12,400+", label: "Verified Pros" },
                { value: "98%", label: "Approval Rate" },
                { value: "40%", label: "Avg. Earnings Boost" },
                { value: "24hrs", label: "Review Time" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-[var(--accent)] sm:text-3xl">
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
    </main>
  );
}