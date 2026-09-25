"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, Star, CheckCircle, AlertCircle, ChevronRight, Heart, MessageSquare, CreditCard, TrendingUp, MapPin, Bell, User, Wrench, Zap, Droplets, Wind, Sparkles } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const spendingData = [
  { month: "Jul", amount: 120 },
  { month: "Aug", amount: 85 },
  { month: "Sep", amount: 210 },
  { month: "Oct", amount: 165 },
  { month: "Nov", amount: 90 },
  { month: "Dec", amount: 310 },
  { month: "Jan", amount: 245 },
];

const recentBookings = [
  {
    id: "bk-001",
    service: "Electrical Panel Inspection",
    provider: "Marcus Rivera",
    providerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Handyman",
    category: "Electrician",
    icon: Zap,
    date: "Jan 28, 2025",
    time: "10:00 AM",
    status: "completed",
    amount: 149,
    rating: 5,
  },
  {
    id: "bk-002",
    service: "Bathroom Pipe Repair",
    provider: "Sofia Chen",
    providerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus%20Rivera",
    category: "Plumber",
    icon: Droplets,
    date: "Feb 3, 2025",
    time: "2:00 PM",
    status: "upcoming",
    amount: 195,
    rating: null,
  },
  {
    id: "bk-003",
    service: "AC Tune-Up & Filter Change",
    provider: "James Okafor",
    providerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James%20Okafor",
    category: "AC & HVAC",
    icon: Wind,
    date: "Feb 10, 2025",
    time: "9:30 AM",
    status: "upcoming",
    amount: 120,
    rating: null,
  },
  {
    id: "bk-004",
    service: "Deep Home Cleaning",
    provider: "Priya Nair",
    providerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya%20Nair",
    category: "Cleaning",
    icon: Sparkles,
    date: "Jan 15, 2025",
    time: "11:00 AM",
    status: "completed",
    amount: 180,
    rating: 4,
  },
];

const savedProviders = [
  {
    id: "marcus-rivera",
    name: "Marcus Rivera",
    category: "Electrician",
    rating: 4.92,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Handyman",
  },
  {
    id: "sofia-chen",
    name: "Sofia Chen",
    category: "Plumber",
    rating: 4.88,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus%20Rivera",
  },
  {
    id: "james-okafor",
    name: "James Okafor",
    category: "AC & HVAC",
    rating: 4.85,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James%20Okafor",
  },
];

const notifications = [
  {
    id: "n1",
    message: "Sofia Chen confirmed your Feb 3 booking",
    time: "2h ago",
    type: "success",
    read: false,
  },
  {
    id: "n2",
    message: "Your payment of $149 was processed",
    time: "1d ago",
    type: "info",
    read: false,
  },
  {
    id: "n3",
    message: "Rate your recent cleaning service",
    time: "3d ago",
    type: "action",
    read: true,
  },
];

const quickActions = [
  { label: "Book a Service", href: "/find-professionals", icon: Wrench, color: "bg-[var(--accent)]/10 text-[var(--accent)]" },
  { label: "My Bookings", href: "/customer/bookings", icon: Calendar, color: "bg-blue-500/10 text-blue-500" },
  { label: "Messages", href: "/customer/messages", icon: MessageSquare, color: "bg-purple-500/10 text-purple-500" },
  { label: "Payments", href: "/customer/payments", icon: CreditCard, color: "bg-emerald-500/10 text-emerald-500" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  completed: { label: "Completed", className: "bg-emerald-500/10 text-emerald-600" },
  upcoming: { label: "Upcoming", className: "bg-blue-500/10 text-blue-600" },
  cancelled: { label: "Cancelled", className: "bg-red-500/10 text-red-500" },
  in_progress: { label: "In Progress", className: "bg-amber-500/10 text-amber-600" },
};

export default function CustomerDashboardPage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "completed">("all");

  const filteredBookings =
    activeTab === "all"
      ? recentBookings
      : recentBookings.filter((b) => b.status === activeTab);

  const totalSpent = recentBookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.amount, 0);

  const upcomingCount = recentBookings.filter((b) => b.status === "upcoming").length;
  const completedCount = recentBookings.filter((b) => b.status === "completed").length;

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] pb-20">
      {/* Page Header */}
      <Reveal>
        <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-[var(--accent)] shadow-md">
                  <img
                    src="https://picsum.photos/seed/76bd09b6f9c1/800/600"
                    alt="Alex Morgan"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Crect width='56' height='56' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='%236b7280'%3EAM%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {t("customerDashboard.greeting")}
                  </p>
                  <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                    {t("customerDashboard.userName")}
                  </h1>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                    <MapPin className="h-3 w-3" />
                    <span>{t("customerDashboard.userLocation")}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="relative rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2.5 text-[hsl(var(--muted-foreground))] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--accent)]" />
                </button>
                <Link
                  href="/customer/profile"
                  className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--foreground))] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  <User className="h-4 w-4" />
                  {t("customerDashboard.editProfile")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Row */}
        <Reveal>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              {
                label: t("customerDashboard.stats.totalSpent"),
                value: `$${totalSpent}`,
                icon: CreditCard,
                color: "text-[var(--accent)]",
                bg: "bg-[var(--accent)]/10",
                trend: "+12% this month",
              },
              {
                label: t("customerDashboard.stats.upcoming"),
                value: upcomingCount,
                icon: Calendar,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
                trend: "Next: Feb 3",
              },
              {
                label: t("customerDashboard.stats.completed"),
                value: completedCount,
                icon: CheckCircle,
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
                trend: "All time",
              },
              {
                label: t("customerDashboard.stats.savedPros"),
                value: savedProviders.length,
                icon: Heart,
                color: "text-rose-500",
                bg: "bg-rose-500/10",
                trend: "View all",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
                className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                      {stat.label}
                    </p>
                    <p className="mt-1.5 text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                      {stat.trend}
                    </p>
                  </div>
                  <div className={cn("rounded-xl p-2.5", stat.bg)}>
                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Spending Chart */}
            <Reveal>
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
                      {t("customerDashboard.chart.title")}
                    </h2>
                    <p className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))]">
                      {t("customerDashboard.chart.subtitle")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-[var(--accent)]/10 px-3 py-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-[var(--accent)]" />
                    <span className="text-xs font-semibold text-[var(--accent)]">+18%</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={spendingData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
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
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: "hsl(var(--foreground))",
                      }}
                      formatter={(value: number) => [`$${value}`, "Spent"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="var(--accent)"
                      strokeWidth={2.5}
                      fill="url(#spendGradient)"
                      dot={false}
                      activeDot={{ r: 5, fill: "var(--accent)", strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Reveal>

            {/* Recent Bookings */}
            <Reveal>
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-6 py-4">
                  <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
                    {t("customerDashboard.bookings.title")}
                  </h2>
                  <Link
                    href="/customer/bookings"
                    className="flex items-center gap-1 text-sm font-medium text-[var(--accent)] transition-opacity hover:opacity-75"
                  >
                    {t("customerDashboard.bookings.viewAll")}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-[hsl(var(--border))] px-6 pt-3">
                  {(["all", "upcoming", "completed"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "pb-3 px-3 text-sm font-medium capitalize transition-all duration-200 border-b-2",
                        activeTab === tab
                          ? "border-[var(--accent)] text-[var(--accent)]"
                          : "border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                      )}
                    >
                      {tab === "all"
                        ? t("customerDashboard.bookings.tabs.all")
                        : tab === "upcoming"
                        ? t("customerDashboard.bookings.tabs.upcoming")
                        : t("customerDashboard.bookings.tabs.completed")}
                    </button>
                  ))}
                </div>

                <div className="divide-y divide-[hsl(var(--border))]">
                  {filteredBookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Calendar className="mb-3 h-10 w-10 text-[hsl(var(--muted-foreground))]" />
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        {t("customerDashboard.bookings.empty")}
                      </p>
                    </div>
                  ) : (
                    filteredBookings.map((booking) => {
                      const Icon = booking.icon;
                      const status = statusConfig[booking.status];
                      return (
                        <motion.div
                          key={booking.id}
                          whileHover={{ backgroundColor: "hsl(var(--muted)/0.3)" }}
                          className="flex items-center gap-4 px-6 py-4 transition-colors duration-150"
                        >
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/10">
                            <Icon className="h-5 w-5 text-[var(--accent)]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-[hsl(var(--foreground))]">
                              {booking.service}
                            </p>
                            <div className="mt-0.5 flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                              <span>{booking.provider}</span>
                              <span>·</span>
                              <Clock className="h-3 w-3" />
                              <span>
                                {booking.date}, {booking.time}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                                status.className
                              )}
                            >
                              {status.label}
                            </span>
                            <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                              ${booking.amount}
                            </span>
                          </div>
                          {booking.status === "completed" && booking.rating === null && (
                            <Link
                              href={`/customer/bookings`}
                              className="ml-2 flex-shrink-0 rounded-lg bg-[var(--accent)]/10 px-3 py-1.5 text-xs font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/20"
                            >
                              {t("customerDashboard.bookings.rate")}
                            </Link>
                          )}
                          {booking.status === "upcoming" && (
                            <Link
                              href={`/tracking/${booking.id}`}
                              className="ml-2 flex-shrink-0 rounded-lg border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--foreground))] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                            >
                              {t("customerDashboard.bookings.track")}
                            </Link>
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Reveal>
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
                <h2 className="mb-4 text-base font-semibold text-[hsl(var(--foreground))]">
                  {t("customerDashboard.quickActions.title")}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => (
                    <motion.div key={action.label} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Link
                        href={action.href}
                        className="flex flex-col items-center gap-2.5 rounded-xl border border-[hsl(var(--border))] p-4 text-center transition-all duration-200 hover:border-[var(--accent)]/40 hover:shadow-sm"
                      >
                        <div className={cn("rounded-xl p-2.5", action.color)}>
                          <action.icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-medium leading-tight text-[hsl(var(--foreground))]">
                          {action.label}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Upcoming Booking Highlight */}
            <Reveal delay={0.05}>
              <div className="overflow-hidden rounded-2xl border border-[var(--accent)]/30 bg-gradient-to-br from-[var(--accent)]/10 to-[var(--accent)]/5 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                    {t("customerDashboard.nextBooking.label")}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">
                  {t("customerDashboard.nextBooking.service")}
                </h3>
                <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                  {t("customerDashboard.nextBooking.provider")}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-[var(--accent)]" />
                    <span>{t("customerDashboard.nextBooking.date")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-[var(--accent)]" />
                    <span>{t("customerDashboard.nextBooking.time")}</span>
                  </div>
                </div>
                <Link
                  href="/tracking/bk-002"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  {t("customerDashboard.nextBooking.trackCta")}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>

            {/* Saved Professionals */}
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
                    {t("customerDashboard.saved.title")}
                  </h2>
                  <Link
                    href="/customer/saved"
                    className="text-xs font-medium text-[var(--accent)] hover:opacity-75"
                  >
                    {t("customerDashboard.saved.viewAll")}
                  </Link>
                </div>
                <div className="space-y-3">
                  {savedProviders.map((pro) => (
                    <motion.div
                      key={pro.id}
                      whileHover={{ x: 2 }}
                      className="flex items-center gap-3"
                    >
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-[hsl(var(--border))]">
                        <img
                          src={pro.avatar}
                          alt={pro.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='14' fill='%236b7280'%3E?%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[hsl(var(--foreground))]">
                          {pro.name}
                        </p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                          {pro.category}
                        </p>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold text-[hsl(var(--foreground))]">
                          {pro.rating}
                        </span>
                      </div>
                      <Link
                        href={`/professionals/${pro.id}`}
                        className="flex-shrink-0 rounded-lg border border-[hsl(var(--border))] px-2.5 py-1 text-xs font-medium text-[hsl(var(--foreground))] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      >
                        {t("customerDashboard.saved.book")}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Notifications */}
            <Reveal delay={0.15}>
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
                    {t("customerDashboard.notifications.title")}
                  </h2>
                  <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-bold text-white">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                </div>
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        "flex items-start gap-3 rounded-xl p-3 transition-colors",
                        notif.read
                          ? "bg-transparent"
                          : "bg-[var(--accent)]/5"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full",
                          notif.type === "success"
                            ? "bg-emerald-500/10"
                            : notif.type === "action"
                            ? "bg-amber-500/10"
                            : "bg-blue-500/10"
                        )}
                      >
                        {notif.type === "success" ? (
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                        ) : notif.type === "action" ? (
                          <Star className="h-3.5 w-3.5 text-amber-500" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5 text-blue-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs leading-relaxed text-[hsl(var(--foreground))]">
                          {notif.message}
                        </p>
                        <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
                          {notif.time}
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </main>
  );
}