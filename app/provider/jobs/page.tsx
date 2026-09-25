"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Briefcase, MapPin, Clock, DollarSign, Star, CheckCircle, XCircle, AlertCircle, ChevronDown, Search, Filter, Eye, MessageSquare, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { staggerContainer, fadeInUp } from "@/lib/motion";

type JobStatus = "new" | "accepted" | "in_progress" | "completed" | "cancelled";

interface Job {
  id: string;
  customerName: string;
  customerAvatar: string;
  service: string;
  category: string;
  description: string;
  location: string;
  distance: number;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  budget: number;
  status: JobStatus;
  postedAt: string;
  urgent: boolean;
  rating?: number;
  review?: string;
}

const MOCK_JOBS: Job[] = [
  {
    id: "job-001",
    customerName: "Sarah Mitchell",
    customerAvatar: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/f27e1e6fdfee48ca8f8ad8eb077d30f1.png",
    service: "Electrical Panel Upgrade",
    category: "Electrician",
    description: "Need to upgrade my 100A panel to 200A. House was built in 1985 and the panel is outdated. Looking for a licensed electrician who can handle permits.",
    location: "Austin, TX 78701",
    distance: 2.4,
    scheduledDate: "2024-07-15",
    scheduledTime: "09:00 AM",
    duration: 4,
    budget: 1800,
    status: "new",
    postedAt: "2 hours ago",
    urgent: true,
  },
  {
    id: "job-002",
    customerName: "David Chen",
    customerAvatar: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/df612072f19e4296a7da120e3b7970c3.jpg",
    service: "Outlet Installation",
    category: "Electrician",
    description: "Need 4 new outlets installed in my home office. Currently only have 2 and running too many extension cords. Prefer GFCI outlets.",
    location: "Austin, TX 78704",
    distance: 3.8,
    scheduledDate: "2024-07-16",
    scheduledTime: "02:00 PM",
    duration: 2,
    budget: 320,
    status: "accepted",
    postedAt: "5 hours ago",
    urgent: false,
  },
  {
    id: "job-003",
    customerName: "Maria Gonzalez",
    customerAvatar: "/images/customer-maria-gonzalez.jpg",
    service: "Ceiling Fan Installation",
    category: "Electrician",
    description: "Installing 3 ceiling fans in bedrooms. Existing light fixtures in place, just need fans swapped in. Fans already purchased.",
    location: "Austin, TX 78745",
    distance: 5.1,
    scheduledDate: "2024-07-14",
    scheduledTime: "10:00 AM",
    duration: 3,
    budget: 450,
    status: "in_progress",
    postedAt: "1 day ago",
    urgent: false,
  },
  {
    id: "job-004",
    customerName: "James Thornton",
    customerAvatar: "/images/customer-james-thornton.jpg",
    service: "Wiring Inspection",
    category: "Electrician",
    description: "Purchased an older home and want a full electrical inspection before moving in. Need a detailed report for insurance purposes.",
    location: "Austin, TX 78723",
    distance: 4.2,
    scheduledDate: "2024-07-10",
    scheduledTime: "11:00 AM",
    duration: 2,
    budget: 280,
    status: "completed",
    postedAt: "5 days ago",
    urgent: false,
    rating: 5,
    review: "Marcus was incredibly thorough and professional. Found several issues we weren't aware of and explained everything clearly.",
  },
  {
    id: "job-005",
    customerName: "Priya Patel",
    customerAvatar: "/images/customer-priya-patel.jpg",
    service: "EV Charger Installation",
    category: "Electrician",
    description: "Need a Level 2 EV charger installed in my garage. Have a Tesla Model 3. Need 240V/50A circuit run from the main panel.",
    location: "Austin, TX 78759",
    distance: 7.3,
    scheduledDate: "2024-07-08",
    scheduledTime: "09:00 AM",
    duration: 3,
    budget: 650,
    status: "completed",
    postedAt: "1 week ago",
    urgent: false,
    rating: 4,
    review: "Great work overall. Charger works perfectly. Took a bit longer than estimated but quality was excellent.",
  },
  {
    id: "job-006",
    customerName: "Robert Kim",
    customerAvatar: "/images/customer-robert-kim.jpg",
    service: "Emergency Power Outage",
    category: "Electrician",
    description: "Half my house lost power suddenly. Breakers look fine but no power to kitchen and living room. Need urgent help.",
    location: "Austin, TX 78731",
    distance: 1.9,
    scheduledDate: "2024-07-13",
    scheduledTime: "03:00 PM",
    duration: 2,
    budget: 200,
    status: "cancelled",
    postedAt: "2 days ago",
    urgent: true,
  },
  {
    id: "job-007",
    customerName: "Linda Foster",
    customerAvatar: "/images/customer-linda-foster.jpg",
    service: "Smart Home Wiring",
    category: "Electrician",
    description: "Looking to wire my new construction home for smart home integration. Need Cat6 ethernet, speaker wire, and smart switch wiring throughout.",
    location: "Austin, TX 78717",
    distance: 9.6,
    scheduledDate: "2024-07-18",
    scheduledTime: "08:00 AM",
    duration: 8,
    budget: 2400,
    status: "new",
    postedAt: "30 minutes ago",
    urgent: false,
  },
];

const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  new: {
    label: "New Request",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
  },
  accepted: {
    label: "Accepted",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
  in_progress: {
    label: "In Progress",
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-200",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  completed: {
    label: "Completed",
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-500",
    bg: "bg-red-50 border-red-200",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
};

const FILTER_TABS: { key: string; label: string; statuses: JobStatus[] | "all" }[] = [
  { key: "all", label: "All Jobs", statuses: "all" },
  { key: "new", label: "New Requests", statuses: ["new"] },
  { key: "active", label: "Active", statuses: ["accepted", "in_progress"] },
  { key: "completed", label: "Completed", statuses: ["completed"] },
  { key: "cancelled", label: "Cancelled", statuses: ["cancelled"] },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "budget_high", label: "Highest Budget" },
  { value: "budget_low", label: "Lowest Budget" },
  { value: "nearest", label: "Nearest" },
  { value: "scheduled", label: "Scheduled Date" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-3.5 w-3.5",
            star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
          )}
        />
      ))}
    </div>
  );
}

function JobCard({ job, onAccept, onDecline, onView }: {
  job: Job;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onView: (id: string) => void;
}) {
  const statusCfg = STATUS_CONFIG[job.status];

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 8px 32px -8px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <img
              src={job.customerAvatar}
              alt={job.customerName}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-[hsl(var(--border))]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.customerName)}&background=random`;
              }}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-[hsl(var(--foreground))] text-sm">{job.customerName}</span>
              {job.urgent && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 border border-red-200 px-2 py-0.5 text-xs font-medium text-red-600">
                  <AlertCircle className="h-3 w-3" /> Urgent
                </span>
              )}
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{job.postedAt}</p>
          </div>
        </div>
        <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium flex-shrink-0", statusCfg.bg, statusCfg.color)}>
          {statusCfg.icon}
          {statusCfg.label}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-[hsl(var(--foreground))] text-base leading-snug">{job.service}</h3>
        <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))] leading-relaxed line-clamp-2">{job.description}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
          <MapPin className="h-3.5 w-3.5 text-[var(--accent)] flex-shrink-0" />
          <span className="truncate">{job.distance} mi away</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
          <Calendar className="h-3.5 w-3.5 text-[var(--accent)] flex-shrink-0" />
          <span className="truncate">{new Date(job.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
          <Clock className="h-3.5 w-3.5 text-[var(--accent)] flex-shrink-0" />
          <span className="truncate">{job.scheduledTime}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--foreground))]">
          <DollarSign className="h-3.5 w-3.5 text-[var(--accent)] flex-shrink-0" />
          <span>${job.budget.toLocaleString("en-US")}</span>
        </div>
      </div>

      {job.status === "completed" && job.rating && (
        <div className="mt-4 rounded-xl bg-[hsl(var(--muted))]/40 border border-[hsl(var(--border))] p-3">
          <div className="flex items-center gap-2 mb-1">
            <StarRating rating={job.rating} />
            <span className="text-xs font-medium text-[hsl(var(--foreground))]">{job.rating}.0</span>
          </div>
          {job.review && (
            <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed line-clamp-2 italic">"{job.review}"</p>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onView(job.id)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--foreground))] transition-all hover:bg-[hsl(var(--muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <Eye className="h-3.5 w-3.5" /> View Details
        </button>
        <button
          className="inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--foreground))] transition-all hover:bg-[hsl(var(--muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <MessageSquare className="h-3.5 w-3.5" /> Message
        </button>
        {job.status === "new" && (
          <>
            <button
              onClick={() => onAccept(job.id)}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <CheckCircle className="h-3.5 w-3.5" /> Accept Job
            </button>
            <button
              onClick={() => onDecline(job.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-all hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <XCircle className="h-3.5 w-3.5" /> Decline
            </button>
          </>
        )}
        {job.status === "accepted" && (
          <button className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
            <ArrowRight className="h-3.5 w-3.5" /> Start Job
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function ProviderJobsPage() {
  const t = useTranslations();
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const handleAccept = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: "accepted" as JobStatus } : j))
    );
  };

  const handleDecline = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: "cancelled" as JobStatus } : j))
    );
  };

  const handleView = (id: string) => {
    setSelectedJob(selectedJob === id ? null : id);
  };

  const filteredJobs = jobs.filter((job) => {
    const tab = FILTER_TABS.find((t) => t.key === activeTab);
    const matchesTab =
      !tab || tab.statuses === "all" || (Array.isArray(tab.statuses) && tab.statuses.includes(job.status));
    const matchesSearch =
      !searchQuery ||
      job.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "budget_high") return b.budget - a.budget;
    if (sortBy === "budget_low") return a.budget - b.budget;
    if (sortBy === "nearest") return a.distance - b.distance;
    if (sortBy === "scheduled") return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
    return 0;
  });

  const stats = {
    total: jobs.length,
    newRequests: jobs.filter((j) => j.status === "new").length,
    active: jobs.filter((j) => j.status === "accepted" || j.status === "in_progress").length,
    completed: jobs.filter((j) => j.status === "completed").length,
    totalEarned: jobs.filter((j) => j.status === "completed").reduce((sum, j) => sum + j.budget, 0),
    avgRating:
      jobs.filter((j) => j.rating).reduce((sum, j) => sum + (j.rating ?? 0), 0) /
      (jobs.filter((j) => j.rating).length || 1),
  };

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Sort";

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-8">

        {/* Page Header */}
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                {t("providerJobs.heading")}
              </h1>
              <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                {t("providerJobs.subheading")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {stats.newRequests > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-3 py-1.5 text-sm font-semibold text-[var(--accent)]">
                  <AlertCircle className="h-4 w-4" />
                  {stats.newRequests} {t("providerJobs.newBadge")}
                </span>
              )}
            </div>
          </div>
        </Reveal>

        {/* Stats Row */}
        <Reveal delay={0.05}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-8"
          >
            {[
              { label: t("providerJobs.stats.totalJobs"), value: stats.total, icon: <Briefcase className="h-4 w-4" />, accent: false },
              { label: t("providerJobs.stats.activeJobs"), value: stats.active, icon: <TrendingUp className="h-4 w-4" />, accent: false },
              { label: t("providerJobs.stats.completed"), value: stats.completed, icon: <CheckCircle className="h-4 w-4" />, accent: false },
              { label: t("providerJobs.stats.earned"), value: `$${stats.totalEarned.toLocaleString("en-US")}`, icon: <DollarSign className="h-4 w-4" />, accent: true },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className={cn(
                  "rounded-2xl border p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
                  stat.accent
                    ? "border-[var(--accent)]/20 bg-[var(--accent)]/5"
                    : "border-[hsl(var(--border))] bg-[hsl(var(--card))]"
                )}
              >
                <div className={cn("flex items-center gap-1.5 text-xs font-medium mb-2", stat.accent ? "text-[var(--accent)]" : "text-[hsl(var(--muted-foreground))]")}>
                  {stat.icon}
                  {stat.label}
                </div>
                <div className={cn("text-2xl font-bold", stat.accent ? "text-[var(--accent)]" : "text-[hsl(var(--foreground))]")}>
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Reveal>

        {/* Filters & Search */}
        <Reveal delay={0.1}>
          <div className="mb-6 space-y-3">
            {/* Tab Filters */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
              {FILTER_TABS.map((tab) => {
                const count =
                  tab.statuses === "all"
                    ? jobs.length
                    : jobs.filter((j) => Array.isArray(tab.statuses) && tab.statuses.includes(j.status)).length;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                      activeTab === tab.key
                        ? "bg-[var(--accent)] text-white shadow-sm"
                        : "border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                    )}
                  >
                    {tab.label}
                    <span className={cn("rounded-full px-1.5 py-0.5 text-xs font-semibold", activeTab === tab.key ? "bg-white/20 text-white" : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]")}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search + Sort */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("providerJobs.searchPlaceholder")}
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] pl-9 pr-4 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm font-medium text-[hsl(var(--foreground))] transition-all hover:bg-[hsl(var(--muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <Filter className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                  <span className="hidden sm:inline">{currentSortLabel}</span>
                  <ChevronDown className={cn("h-4 w-4 text-[hsl(var(--muted-foreground))] transition-transform", showSortDropdown && "rotate-180")} />
                </button>
                {showSortDropdown && (
                  <div className="absolute right-0 top-full mt-1 z-20 w-48 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.15)] overflow-hidden">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); }}
                        className={cn(
                          "w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[hsl(var(--muted))]",
                          sortBy === opt.value ? "font-semibold text-[var(--accent)]" : "text-[hsl(var(--foreground))]"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Jobs List */}
        {sortedJobs.length === 0 ? (
          <Reveal>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))] py-16 text-center">
              <Briefcase className="h-10 w-10 text-[hsl(var(--muted-foreground))]/40 mb-3" />
              <p className="font-semibold text-[hsl(var(--foreground))]">{t("providerJobs.empty.title")}</p>
              <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{t("providerJobs.empty.desc")}</p>
            </div>
          </Reveal>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {sortedJobs.map((job, i) => (
              <motion.div key={job.id} variants={fadeInUp}>
                <JobCard
                  job={job}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onView={handleView}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load More */}
        {sortedJobs.length > 0 && (
          <Reveal delay={0.1}>
            <div className="mt-8 flex justify-center">
              <button className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-2.5 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-all hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                {t("providerJobs.loadMore")}
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
        )}
      </div>
    </main>
  );
}