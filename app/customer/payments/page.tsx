"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CreditCard, Download, Filter, Search, CheckCircle, Clock, XCircle, ArrowUpRight, ArrowDownLeft, Receipt, Shield, ChevronDown, Star, Calendar } from 'lucide-react';
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

const spendingData = [
  { month: "Jul", amount: 120 },
  { month: "Aug", amount: 85 },
  { month: "Sep", amount: 210 },
  { month: "Oct", amount: 165 },
  { month: "Nov", amount: 290 },
  { month: "Dec", amount: 180 },
  { month: "Jan", amount: 340 },
];

interface Transaction {
  id: string;
  providerName: string;
  providerAvatar: string;
  service: string;
  date: string;
  amount: number;
  status: "completed" | "pending" | "refunded" | "failed";
  paymentMethod: string;
  receiptId: string;
  rating?: number;
}

const transactions: Transaction[] = [
  {
    id: "txn-001",
    providerName: "Marcus Rivera",
    providerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Handyman",
    service: "Electrical Panel Upgrade",
    date: "2025-01-18",
    amount: 320,
    status: "completed",
    paymentMethod: "Visa •••• 4242",
    receiptId: "RCP-2025-0118-001",
    rating: 5,
  },
  {
    id: "txn-002",
    providerName: "Priya Sharma",
    providerAvatar: "/images/plumber-priya-sharma-profile.jpg",
    service: "Bathroom Pipe Repair",
    date: "2025-01-12",
    amount: 185,
    status: "completed",
    paymentMethod: "Mastercard •••• 8810",
    receiptId: "RCP-2025-0112-002",
    rating: 4,
  },
  {
    id: "txn-003",
    providerName: "James Okafor",
    providerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James%20Okafor",
    service: "AC Servicing & Filter Replacement",
    date: "2025-01-08",
    amount: 140,
    status: "pending",
    paymentMethod: "Visa •••• 4242",
    receiptId: "RCP-2025-0108-003",
  },
  {
    id: "txn-004",
    providerName: "Sofia Mendez",
    providerAvatar: "/images/cleaning-sofia-mendez-profile.jpg",
    service: "Deep Home Cleaning",
    date: "2024-12-28",
    amount: 95,
    status: "completed",
    paymentMethod: "PayPal",
    receiptId: "RCP-2024-1228-004",
    rating: 5,
  },
  {
    id: "txn-005",
    providerName: "Derek Huang",
    providerAvatar: "/images/handyman-derek-huang-profile.jpg",
    service: "Furniture Assembly",
    date: "2024-12-20",
    amount: 75,
    status: "refunded",
    paymentMethod: "Visa •••• 4242",
    receiptId: "RCP-2024-1220-005",
  },
  {
    id: "txn-006",
    providerName: "Amara Nwosu",
    providerAvatar: "/images/painter-amara-nwosu-profile.jpg",
    service: "Interior Wall Painting (2 rooms)",
    date: "2024-12-14",
    amount: 420,
    status: "completed",
    paymentMethod: "Mastercard •••• 8810",
    receiptId: "RCP-2024-1214-006",
    rating: 5,
  },
  {
    id: "txn-007",
    providerName: "Carlos Vega",
    providerAvatar: "/images/pest-control-carlos-vega-profile.jpg",
    service: "Pest Control Treatment",
    date: "2024-12-05",
    amount: 110,
    status: "completed",
    paymentMethod: "PayPal",
    receiptId: "RCP-2024-1205-007",
    rating: 4,
  },
  {
    id: "txn-008",
    providerName: "Lena Fischer",
    providerAvatar: "/images/appliance-lena-fischer-profile.jpg",
    service: "Washing Machine Repair",
    date: "2024-11-29",
    amount: 160,
    status: "failed",
    paymentMethod: "Visa •••• 4242",
    receiptId: "RCP-2024-1129-008",
  },
];

const savedCards = [
  { id: "card-1", type: "Visa", last4: "4242", expiry: "08/27", isDefault: true },
  { id: "card-2", type: "Mastercard", last4: "8810", expiry: "03/26", isDefault: false },
];

const STATUS_CONFIG = {
  completed: {
    label: "Completed",
    icon: CheckCircle,
    className: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "text-amber-600 bg-amber-50 border-amber-100",
  },
  refunded: {
    label: "Refunded",
    icon: ArrowDownLeft,
    className: "text-blue-600 bg-blue-50 border-blue-100",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "text-red-600 bg-red-50 border-red-100",
  },
};

const FILTER_OPTIONS = ["All", "Completed", "Pending", "Refunded", "Failed"] as const;
type FilterOption = (typeof FILTER_OPTIONS)[number];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            "h-3 w-3",
            s <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"
          )}
        />
      ))}
    </div>
  );
}

export default function CustomerPaymentsPage() {
  const t = useTranslations();
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTxn, setExpandedTxn] = useState<string | null>(null);

  const totalSpent = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = transactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  const refundedAmount = transactions
    .filter((t) => t.status === "refunded")
    .reduce((sum, t) => sum + t.amount, 0);

  const completedCount = transactions.filter((t) => t.status === "completed").length;

  const filtered = transactions.filter((txn) => {
    const matchesFilter =
      activeFilter === "All" ||
      txn.status === activeFilter.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      txn.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.receiptId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] pb-20">
      {/* Page Header */}
      <Reveal>
        <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                  {t("payments.heading")}
                </h1>
                <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                  {t("payments.subheading")}
                </p>
              </div>
              <button className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] transition-all duration-200 hover:bg-[hsl(var(--muted))] sm:mt-0">
                <Download className="h-4 w-4" />
                {t("payments.exportAll")}
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Stat Cards */}
        <Reveal>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              {
                label: t("payments.stats.totalSpent"),
                value: `$${totalSpent.toLocaleString("en-US")}`,
                icon: ArrowUpRight,
                iconClass: "text-[var(--accent)] bg-[var(--accent)]/10",
                sub: t("payments.stats.totalSpentSub"),
              },
              {
                label: t("payments.stats.pending"),
                value: `$${pendingAmount.toLocaleString("en-US")}`,
                icon: Clock,
                iconClass: "text-amber-500 bg-amber-50",
                sub: t("payments.stats.pendingSub"),
              },
              {
                label: t("payments.stats.refunded"),
                value: `$${refundedAmount.toLocaleString("en-US")}`,
                icon: ArrowDownLeft,
                iconClass: "text-blue-500 bg-blue-50",
                sub: t("payments.stats.refundedSub"),
              },
              {
                label: t("payments.stats.completed"),
                value: completedCount.toString(),
                icon: CheckCircle,
                iconClass: "text-emerald-500 bg-emerald-50",
                sub: t("payments.stats.completedSub"),
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: "easeOut" }}
                className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                      {stat.label}
                    </p>
                    <p className="mt-1.5 text-2xl font-bold text-[hsl(var(--foreground))]">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
                      {stat.sub}
                    </p>
                  </div>
                  <div className={cn("rounded-xl p-2.5", stat.iconClass)}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* Spending Chart + Saved Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Chart */}
          <Reveal className="lg:col-span-2">
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
                    {t("payments.chart.title")}
                  </h2>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    {t("payments.chart.subtitle")}
                  </p>
                </div>
                <span className="rounded-full border border-[hsl(var(--border))] px-3 py-1 text-xs font-medium text-[hsl(var(--muted-foreground))]">
                  {t("payments.chart.period")}
                </span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={spendingData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#spendGrad)"
                    dot={{ fill: "var(--accent)", r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "var(--accent)", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Reveal>

          {/* Saved Payment Methods */}
          <Reveal>
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
                  {t("payments.methods.title")}
                </h2>
                <Shield className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              </div>
              <div className="space-y-3">
                {savedCards.map((card) => (
                  <div
                    key={card.id}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3.5 transition-all duration-200",
                      card.isDefault
                        ? "border-[var(--accent)]/30 bg-[var(--accent)]/5"
                        : "border-[hsl(var(--border))] bg-[hsl(var(--background))]"
                    )}
                  >
                    <div className="flex h-9 w-14 items-center justify-center rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                      <CreditCard className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                        {card.type} •••• {card.last4}
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        {t("payments.methods.expires")} {card.expiry}
                      </p>
                    </div>
                    {card.isDefault && (
                      <span className="rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)]">
                        {t("payments.methods.default")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full rounded-xl border border-dashed border-[hsl(var(--border))] py-2.5 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]">
                + {t("payments.methods.addNew")}
              </button>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-[hsl(var(--muted))]/50 px-3 py-2.5">
                <Shield className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
                  {t("payments.methods.secureNote")}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Transaction History */}
        <Reveal>
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
            {/* Table Header */}
            <div className="border-b border-[hsl(var(--border))] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
                    {t("payments.history.title")}
                  </h2>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    {filtered.length} {t("payments.history.transactions")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t("payments.history.searchPlaceholder")}
                      className="h-9 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] pl-8 pr-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 w-48"
                    />
                  </div>
                  {/* Filter dropdown visual */}
                  <div className="flex items-center gap-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2">
                    <Filter className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
                    <ChevronDown className="h-3 w-3 text-[hsl(var(--muted-foreground))]" />
                  </div>
                </div>
              </div>
              {/* Filter Pills */}
              <div className="mt-3 flex flex-wrap gap-2">
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setActiveFilter(opt)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200",
                      activeFilter === opt
                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                        : "border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))] hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction List */}
            <div className="divide-y divide-[hsl(var(--border))]">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Receipt className="h-10 w-10 text-[hsl(var(--muted-foreground))]/40 mb-3" />
                  <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                    {t("payments.history.empty")}
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    {t("payments.history.emptyHint")}
                  </p>
                </div>
              ) : (
                filtered.map((txn) => {
                  const statusCfg = STATUS_CONFIG[txn.status];
                  const StatusIcon = statusCfg.icon;
                  const isExpanded = expandedTxn === txn.id;

                  return (
                    <div key={txn.id}>
                      <button
                        onClick={() => setExpandedTxn(isExpanded ? null : txn.id)}
                        className="w-full text-left px-5 py-4 hover:bg-[hsl(var(--muted))]/40 transition-colors duration-150"
                      >
                        <div className="flex items-center gap-4">
                          {/* Avatar */}
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[hsl(var(--border))]">
                            <img
                              src={txn.providerAvatar}
                              alt={txn.providerName}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(txn.providerName)}&background=random`;
                              }}
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-[hsl(var(--foreground))]">
                                  {txn.service}
                                </p>
                                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                  {txn.providerName}
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-1 shrink-0">
                                <span
                                  className={cn(
                                    "text-sm font-bold",
                                    txn.status === "refunded"
                                      ? "text-blue-600"
                                      : txn.status === "failed"
                                      ? "text-red-500"
                                      : "text-[hsl(var(--foreground))]"
                                  )}
                                >
                                  {txn.status === "refunded" ? "-" : ""}$
                                  {txn.amount.toLocaleString("en-US")}
                                </span>
                                <span
                                  className={cn(
                                    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                                    statusCfg.className
                                  )}
                                >
                                  <StatusIcon className="h-2.5 w-2.5" />
                                  {statusCfg.label}
                                </span>
                              </div>
                            </div>
                            <div className="mt-1 flex items-center gap-3">
                              <span className="flex items-center gap-1 text-[11px] text-[hsl(var(--muted-foreground))]">
                                <Calendar className="h-3 w-3" />
                                {formatDate(txn.date)}
                              </span>
                              <span className="text-[11px] text-[hsl(var(--muted-foreground))]">
                                {txn.paymentMethod}
                              </span>
                              {txn.rating && <StarRating rating={txn.rating} />}
                            </div>
                          </div>

                          <ChevronDown
                            className={cn(
                              "h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))] transition-transform duration-200",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </div>
                      </button>

                      {/* Expanded Receipt Detail */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="overflow-hidden border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 px-5 py-4"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Receipt className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                                <span className="text-xs font-medium text-[hsl(var(--foreground))]">
                                  {t("payments.receipt.id")}: {txn.receiptId}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
                                <div>
                                  <span className="text-[hsl(var(--muted-foreground))]">
                                    {t("payments.receipt.service")}:
                                  </span>{" "}
                                  <span className="font-medium text-[hsl(var(--foreground))]">
                                    {txn.service}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[hsl(var(--muted-foreground))]">
                                    {t("payments.receipt.provider")}:
                                  </span>{" "}
                                  <span className="font-medium text-[hsl(var(--foreground))]">
                                    {txn.providerName}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[hsl(var(--muted-foreground))]">
                                    {t("payments.receipt.date")}:
                                  </span>{" "}
                                  <span className="font-medium text-[hsl(var(--foreground))]">
                                    {formatDate(txn.date)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[hsl(var(--muted-foreground))]">
                                    {t("payments.receipt.method")}:
                                  </span>{" "}
                                  <span className="font-medium text-[hsl(var(--foreground))]">
                                    {txn.paymentMethod}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[hsl(var(--muted-foreground))]">
                                    {t("payments.receipt.subtotal")}:
                                  </span>{" "}
                                  <span className="font-medium text-[hsl(var(--foreground))]">
                                    ${(txn.amount * 0.9).toFixed(2)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[hsl(var(--muted-foreground))]">
                                    {t("payments.receipt.serviceFee")}:
                                  </span>{" "}
                                  <span className="font-medium text-[hsl(var(--foreground))]">
                                    ${(txn.amount * 0.1).toFixed(2)}
                                  </span>
                                </div>
                                <div className="col-span-2 border-t border-[hsl(var(--border))] pt-1.5">
                                  <span className="text-[hsl(var(--muted-foreground))]">
                                    {t("payments.receipt.total")}:
                                  </span>{" "}
                                  <span className="font-bold text-[hsl(var(--foreground))]">
                                    ${txn.amount.toLocaleString("en-US")}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button className="inline-flex items-center gap-1.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-xs font-medium text-[hsl(var(--foreground))] transition-all duration-200 hover:bg-[hsl(var(--muted))]">
                                <Download className="h-3.5 w-3.5" />
                                {t("payments.receipt.download")}
                              </button>
                              {txn.status === "completed" && !txn.rating && (
                                <button className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent)] px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:opacity-90">
                                  <Star className="h-3.5 w-3.5" />
                                  {t("payments.receipt.leaveReview")}
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}