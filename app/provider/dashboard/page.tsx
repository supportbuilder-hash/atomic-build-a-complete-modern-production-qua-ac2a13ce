"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, TrendingUp, Calendar, DollarSign, Clock, CheckCircle, AlertCircle, ChevronRight, ArrowUp, ArrowDown, Briefcase, MessageSquare, Eye, MoreVertical, MapPin, User } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const earningsData = [
  { month: "Jan", earnings: 2400, jobs: 18 },
  { month: "Feb", earnings: 3100, jobs: 23 },
  { month: "Mar", earnings: 2800, jobs: 21 },
  { month: "Apr", earnings: 3900, jobs: 29 },
  { month: "May", earnings: 4200, jobs: 31 },
  { month: "Jun", earnings: 3700, jobs: 27 },
  { month: "Jul", earnings: 4800, jobs: 35 },
  { month: "Aug", earnings: 5100, jobs: 38 },
  { month: "Sep", earnings: 4600, jobs: 34 },
  { month: "Oct", earnings: 5400, jobs: 40 },
  { month: "Nov", earnings: 4900, jobs: 36 },
  { month: "Dec", earnings: 5800, jobs: 43 },
];

const recentJobs = [
  {
    id: "JOB-1041",
    customer: "Sarah Mitchell",
    avatar: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/f27e1e6fdfee48ca8f8ad8eb077d30f1.png",
    service: "Full Electrical Inspection",
    address: "142 Maple Ave, Austin TX",
    date: "Today, 2:00 PM",
    amount: 185,
    status: "upcoming",
  },
  {
    id: "JOB-1040",
    customer: "David Chen",
    avatar: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/df612072f19e4296a7da120e3b7970c3.jpg",
    service: "Panel Upgrade & Rewiring",
    address: "87 Oak Street, Austin TX",
    date: "Today, 10:00 AM",
    amount: 420,
    status: "in-progress",
  },
  {
    id: "JOB-1039",
    customer: "Priya Sharma",
    avatar: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/10b27ae65171429aa4eea149bacaa0e7.png",
    service: "Outlet Installation (x4)",
    address: "23 Birch Lane, Austin TX",
    date: "Yesterday, 3:30 PM",
    amount: 240,
    status: "completed",
  },
  {
    id: "JOB-1038",
    customer: "James Okafor",
    avatar: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/caa8c800890d4e0f96ddb1db124c3805.png",
    service: "Circuit Breaker Replacement",
    address: "56 Cedar Blvd, Austin TX",
    date: "Dec 18, 11:00 AM",
    amount: 310,
    status: "completed",
  },
  {
    id: "JOB-1037",
    customer: "Linda Torres",
    avatar: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/23cbae9ecbc645148c32bd130e3f4eef.jpg",
    service: "Lighting Fixture Install",
    address: "9 Elm Court, Austin TX",
    date: "Dec 17, 9:00 AM",
    amount: 160,
    status: "completed",
  },
];

const pendingRequests = [
  {
    id: "REQ-221",
    customer: "Tom Nguyen",
    service: "Smart Home Wiring",
    date: "Dec 22, Flexible",
    budget: "$300–$500",
    distance: "2.4 mi",
  },
  {
    id: "REQ-220",
    customer: "Angela Brooks",
    service: "EV Charger Installation",
    date: "Dec 23, Morning",
    budget: "$400–$600",
    distance: "1.8 mi",
  },
  {
    id: "REQ-219",
    customer: "Kevin Park",
    service: "Ceiling Fan Replacement",
    date: "Dec 24, Afternoon",
    budget: "$120–$180",
    distance: "3.1 mi",
  },
];

const weeklyJobsData = [
  { day: "Mon", jobs: 3 },
  { day: "Tue", jobs: 5 },
  { day: "Wed", jobs: 4 },
  { day: "Thu", jobs: 6 },
  { day: "Fri", jobs: 7 },
  { day: "Sat", jobs: 5 },
  { day: "Sun", jobs: 2 },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  upcoming: {
    label: "Upcoming",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <Clock className="h-3 w-3" />,
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <AlertCircle className="h-3 w-3" />,
  },
  completed: {
    label: "Completed",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CheckCircle className="h-3 w-3" />,
  },
};

export default function ProviderDashboardPage() {
  const t = useTranslations();
  const [chartView, setChartView] = useState<"earnings" | "jobs">("earnings");
  const [activeJobMenu, setActiveJobMenu] = useState<string | null>(null);

  const stats = [
    {
      label: t("providerDashboard.stats.monthEarnings"),
      value: "$5,800",
      change: "+18%",
      up: true,
      icon: <DollarSign className="h-5 w-5" />,
      accent: true,
    },
    {
      label: t("providerDashboard.stats.jobsCompleted"),
      value: "43",
      change: "+12%",
      up: true,
      icon: <Briefcase className="h-5 w-5" />,
      accent: false,
    },
    {
      label: t("providerDashboard.stats.avgRating"),
      value: "4.92",
      change: "+0.04",
      up: true,
      icon: <Star className="h-5 w-5" />,
      accent: false,
    },
    {
      label: t("providerDashboard.stats.responseRate"),
      value: "97%",
      change: "-1%",
      up: false,
      icon: <MessageSquare className="h-5 w-5" />,
      accent: false,
    },
    {
      label: t("providerDashboard.stats.profileViews"),
      value: "1,284",
      change: "+34%",
      up: true,
      icon: <Eye className="h-5 w-5" />,
      accent: false,
    },
    {
      label: t("providerDashboard.stats.pendingRequests"),
      value: "3",
      change: "New",
      up: true,
      icon: <Calendar className="h-5 w-5" />,
      accent: false,
    },
  ];

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] pb-20">
      {/* Header */}
      <Reveal>
        <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Handyman"
                    alt="Marcus Rivera"
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-[var(--accent)]/30"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://ui-avatars.com/api/?name=Marcus+Rivera&background=22c55e&color=fff";
                    }}
                  />
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">
                    {t("providerDashboard.greeting")}
                  </h1>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {t("providerDashboard.subGreeting")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/provider/calendar"
                  className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  <Calendar className="h-4 w-4" />
                  {t("providerDashboard.viewCalendar")}
                </Link>
                <Link
                  href="/provider/jobs"
                  className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
                >
                  <Briefcase className="h-4 w-4" />
                  {t("providerDashboard.manageJobs")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
                className={cn(
                  "rounded-2xl border p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]",
                  stat.accent
                    ? "border-[var(--accent)]/20 bg-[var(--accent)]/5"
                    : "border-[hsl(var(--border))] bg-[hsl(var(--card))]"
                )}
              >
                <div
                  className={cn(
                    "mb-2 flex h-8 w-8 items-center justify-center rounded-lg",
                    stat.accent
                      ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                      : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                  )}
                >
                  {stat.icon}
                </div>
                <div
                  className={cn(
                    "text-2xl font-bold",
                    stat.accent
                      ? "text-[var(--accent)]"
                      : "text-[hsl(var(--foreground))]"
                  )}
                >
                  {stat.value}
                </div>
                <div className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
                  {stat.label}
                </div>
                <div
                  className={cn(
                    "mt-1.5 flex items-center gap-0.5 text-xs font-medium",
                    stat.up ? "text-emerald-600" : "text-rose-500"
                  )}
                >
                  {stat.up ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {stat.change} {t("providerDashboard.vsLastMonth")}
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* Charts Row */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Earnings Chart */}
          <Reveal className="lg:col-span-2">
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
                    {t("providerDashboard.chart.title")}
                  </h2>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    {t("providerDashboard.chart.subtitle")}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-lg border border-[hsl(var(--border))] p-1">
                  <button
                    onClick={() => setChartView("earnings")}
                    className={cn(
                      "rounded-md px-3 py-1 text-xs font-medium transition-all duration-200",
                      chartView === "earnings"
                        ? "bg-[var(--accent)] text-white"
                        : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                    )}
                  >
                    {t("providerDashboard.chart.earnings")}
                  </button>
                  <button
                    onClick={() => setChartView("jobs")}
                    className={cn(
                      "rounded-md px-3 py-1 text-xs font-medium transition-all duration-200",
                      chartView === "jobs"
                        ? "bg-[var(--accent)] text-white"
                        : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                    )}
                  >
                    {t("providerDashboard.chart.jobs")}
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={earningsData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="accentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={
                      chartView === "earnings"
                        ? (v: number) => `$${(v / 1000).toFixed(1)}k`
                        : (v: number) => `${v}`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) =>
                      chartView === "earnings"
                        ? [`$${value.toLocaleString("en-US")}`, "Earnings"]
                        : [value, "Jobs"]
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey={chartView === "earnings" ? "earnings" : "jobs"}
                    stroke="var(--accent)"
                    strokeWidth={2.5}
                    fill="url(#accentGrad)"
                    dot={false}
                    activeDot={{ r: 5, fill: "var(--accent)", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Reveal>

          {/* Weekly Jobs Bar Chart */}
          <Reveal>
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
                  {t("providerDashboard.weeklyChart.title")}
                </h2>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {t("providerDashboard.weeklyChart.subtitle")}
                </p>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyJobsData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [value, "Jobs"]}
                  />
                  <Bar
                    dataKey="jobs"
                    fill="var(--accent)"
                    radius={[6, 6, 0, 0]}
                    opacity={0.85}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-[hsl(var(--muted))]/50 px-4 py-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-[hsl(var(--foreground))]">32</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">
                    {t("providerDashboard.weeklyChart.totalJobs")}
                  </div>
                </div>
                <div className="h-8 w-px bg-[hsl(var(--border))]" />
                <div className="text-center">
                  <div className="text-lg font-bold text-[hsl(var(--foreground))]">4.6</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">
                    {t("providerDashboard.weeklyChart.avgPerDay")}
                  </div>
                </div>
                <div className="h-8 w-px bg-[hsl(var(--border))]" />
                <div className="text-center">
                  <div className="text-lg font-bold text-[var(--accent)]">
                    <TrendingUp className="inline h-4 w-4" /> 14%
                  </div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">
                    {t("providerDashboard.weeklyChart.vsLastWeek")}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Pending Requests */}
        <Reveal className="mt-8">
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-6 py-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
                  {t("providerDashboard.requests.title")}
                </h2>
                <span className="rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-xs font-semibold text-[var(--accent)]">
                  3 {t("providerDashboard.requests.newBadge")}
                </span>
              </div>
              <Link
                href="/provider/jobs"
                className="flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline"
              >
                {t("providerDashboard.requests.viewAll")}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-[hsl(var(--border))]">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--muted))]">
                      <User className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                          {req.customer}
                        </span>
                        <span className="text-xs text-[hsl(var(--muted-foreground))]">
                          {req.id}
                        </span>
                      </div>
                      <div className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))]">
                        {req.service}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {req.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {req.budget}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {req.distance}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:flex-shrink-0">
                    <button className="rounded-lg border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))] transition-all duration-200 hover:border-rose-300 hover:text-rose-600">
                      {t("providerDashboard.requests.decline")}
                    </button>
                    <button className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:opacity-90">
                      {t("providerDashboard.requests.accept")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Recent Jobs */}
        <Reveal className="mt-8">
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-6 py-4">
              <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
                {t("providerDashboard.recentJobs.title")}
              </h2>
              <Link
                href="/provider/jobs"
                className="flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline"
              >
                {t("providerDashboard.recentJobs.viewAll")}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-[hsl(var(--border))]">
              {recentJobs.map((job) => {
                const statusCfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG["completed"];
                return (
                  <div
                    key={job.id}
                    className="flex flex-col gap-3 px-6 py-4 transition-colors duration-150 hover:bg-[hsl(var(--muted))]/30 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={job.avatar}
                        alt={job.customer}
                        className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.customer)}&background=e5e7eb&color=374151`;
                        }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                            {job.customer}
                          </span>
                          <span className="text-xs text-[hsl(var(--muted-foreground))]">
                            {job.id}
                          </span>
                        </div>
                        <div className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))]">
                          {job.service}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {job.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.address}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-shrink-0">
                      <span className="text-sm font-bold text-[hsl(var(--foreground))]">
                        ${job.amount}
                      </span>
                      <span
                        className={cn(
                          "flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
                          statusCfg.color
                        )}
                      >
                        {statusCfg.icon}
                        {statusCfg.label}
                      </span>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveJobMenu(activeJobMenu === job.id ? null : job.id)
                          }
                          className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                          aria-label="Job options"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {activeJobMenu === job.id && (
                          <div className="absolute right-0 top-8 z-10 min-w-[140px] rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-1 shadow-lg">
                            <button className="w-full px-4 py-2 text-left text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]">
                              {t("providerDashboard.recentJobs.viewDetails")}
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]">
                              {t("providerDashboard.recentJobs.messageCustomer")}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Bottom Row: Profile Completion + Quick Links */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Profile Completion */}
          <Reveal>
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
              <h2 className="mb-1 text-base font-semibold text-[hsl(var(--foreground))]">
                {t("providerDashboard.profile.title")}
              </h2>
              <p className="mb-4 text-xs text-[hsl(var(--muted-foreground))]">
                {t("providerDashboard.profile.subtitle")}
              </p>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {t("providerDashboard.profile.completeness")}
                </span>
                <span className="text-sm font-bold text-[var(--accent)]">78%</span>
              </div>
              <div className="mb-5 h-2.5 w-full overflow-hidden rounded-full bg-[hsl(var(--muted))]">
                <motion.div
                  className="h-full rounded-full bg-[var(--accent)]"
                  initial={{ width: 0 }}
                  animate={{ width: "78%" }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                />
              </div>
              <div className="space-y-2.5">
                {[
                  { label: t("providerDashboard.profile.items.photo"), done: true },
                  { label: t("providerDashboard.profile.items.bio"), done: true },
                  { label: t("providerDashboard.profile.items.services"), done: true },
                  { label: t("providerDashboard.profile.items.portfolio"), done: false },
                  { label: t("providerDashboard.profile.items.insurance"), done: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full",
                        item.done
                          ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                          : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                      )}
                    >
                      {item.done ? (
                        <CheckCircle className="h-3.5 w-3.5" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-sm",
                        item.done
                          ? "text-[hsl(var(--foreground))]"
                          : "text-[hsl(var(--muted-foreground))]"
                      )}
                    >
                      {item.label}
                    </span>
                    {!item.done && (
                      <span className="ml-auto text-xs font-medium text-[var(--accent)]">
                        {t("providerDashboard.profile.add")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Quick Links */}
          <Reveal>
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
              <h2 className="mb-1 text-base font-semibold text-[hsl(var(--foreground))]">
                {t("providerDashboard.quickLinks.title")}
              </h2>
              <p className="mb-4 text-xs text-[hsl(var(--muted-foreground))]">
                {t("providerDashboard.quickLinks.subtitle")}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: t("providerDashboard.quickLinks.earnings"),
                    href: "/provider/earnings",
                    icon: <DollarSign className="h-5 w-5" />,
                    color: "text-emerald-600 bg-emerald-50",
                  },
                  {
                    label: t("providerDashboard.quickLinks.calendar"),
                    href: "/provider/calendar",
                    icon: <Calendar className="h-5 w-5" />,
                    color: "text-blue-600 bg-blue-50",
                  },
                  {
                    label: t("providerDashboard.quickLinks.messages"),
                    href: "/provider/messages",
                    icon: <MessageSquare className="h-5 w-5" />,
                    color: "text-violet-600 bg-violet-50",
                  },
                  {
                    label: t("providerDashboard.quickLinks.reviews"),
                    href: "/provider/reviews",
                    icon: <Star className="h-5 w-5" />,
                    color: "text-amber-600 bg-amber-50",
                  },
                  {
                    label: t("providerDashboard.quickLinks.jobs"),
                    href: "/provider/jobs",
                    icon: <Briefcase className="h-5 w-5" />,
                    color: "text-rose-600 bg-rose-50",
                  },
                  {
                    label: t("providerDashboard.quickLinks.analytics"),
                    href: "/provider/earnings",
                    icon: <TrendingUp className="h-5 w-5" />,
                    color: "text-cyan-600 bg-cyan-50",
                  },
                ].map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    className="flex items-center gap-3 rounded-xl border border-[hsl(var(--border))] p-3.5 transition-all duration-200 hover:border-[var(--accent)]/30 hover:shadow-sm"
                  >
                    <div className={cn("rounded-lg p-2", link.color)}>{link.icon}</div>
                    <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                      {link.label}
                    </span>
                    <ChevronRight className="ml-auto h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}