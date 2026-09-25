"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, ArrowUpRight, ArrowDownRight, CheckCircle, Clock, XCircle, ChevronDown, Star, Briefcase } from 'lucide-react';
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
  Legend,
} from "recharts";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/motion";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MONTHLY_EARNINGS = [
  { month: "Jan", gross: 3200, net: 2720, jobs: 18 },
  { month: "Feb", gross: 2800, net: 2380, jobs: 15 },
  { month: "Mar", gross: 4100, net: 3485, jobs: 23 },
  { month: "Apr", gross: 3750, net: 3188, jobs: 21 },
  { month: "May", gross: 4600, net: 3910, jobs: 26 },
  { month: "Jun", gross: 5200, net: 4420, jobs: 29 },
  { month: "Jul", gross: 4900, net: 4165, jobs: 27 },
  { month: "Aug", gross: 5800, net: 4930, jobs: 32 },
  { month: "Sep", gross: 5100, net: 4335, jobs: 28 },
  { month: "Oct", gross: 6200, net: 5270, jobs: 35 },
  { month: "Nov", gross: 5700, net: 4845, jobs: 31 },
  { month: "Dec", gross: 6800, net: 5780, jobs: 38 },
];

const WEEKLY_EARNINGS = [
  { month: "Mon", gross: 420, net: 357, jobs: 2 },
  { month: "Tue", gross: 680, net: 578, jobs: 3 },
  { month: "Wed", gross: 310, net: 264, jobs: 2 },
  { month: "Thu", gross: 890, net: 757, jobs: 4 },
  { month: "Fri", gross: 1100, net: 935, jobs: 5 },
  { month: "Sat", gross: 1350, net: 1148, jobs: 6 },
  { month: "Sun", gross: 750, net: 638, jobs: 3 },
];

const SERVICE_BREAKDOWN = [
  { name: "Electrical Wiring", revenue: 18400, jobs: 42, avg: 438 },
  { name: "Panel Upgrades", revenue: 12600, jobs: 14, avg: 900 },
  { name: "Outlet Installation", revenue: 8200, jobs: 58, avg: 141 },
  { name: "Lighting Setup", revenue: 6100, jobs: 35, avg: 174 },
  { name: "Safety Inspection", revenue: 4800, jobs: 32, avg: 150 },
];

const RECENT_TRANSACTIONS = [
  {
    id: "TXN-8821",
    customer: "Sarah Mitchell",
    service: "Panel Upgrade",
    date: "Dec 18, 2024",
    gross: 950,
    fee: 95,
    net: 855,
    status: "paid",
    rating: 5,
  },
  {
    id: "TXN-8820",
    customer: "James Okafor",
    service: "Electrical Wiring",
    date: "Dec 17, 2024",
    gross: 480,
    fee: 48,
    net: 432,
    status: "paid",
    rating: 5,
  },
  {
    id: "TXN-8819",
    customer: "Linda Zhao",
    service: "Outlet Installation",
    date: "Dec 16, 2024",
    gross: 160,
    fee: 16,
    net: 144,
    status: "paid",
    rating: 4,
  },
  {
    id: "TXN-8818",
    customer: "Robert Patel",
    service: "Safety Inspection",
    date: "Dec 15, 2024",
    gross: 150,
    fee: 15,
    net: 135,
    status: "pending",
    rating: null,
  },
  {
    id: "TXN-8817",
    customer: "Angela Torres",
    service: "Lighting Setup",
    date: "Dec 14, 2024",
    gross: 220,
    fee: 22,
    net: 198,
    status: "paid",
    rating: 5,
  },
  {
    id: "TXN-8816",
    customer: "David Kim",
    service: "Panel Upgrade",
    date: "Dec 13, 2024",
    gross: 900,
    fee: 90,
    net: 810,
    status: "paid",
    rating: 4,
  },
  {
    id: "TXN-8815",
    customer: "Maria Santos",
    service: "Electrical Wiring",
    date: "Dec 12, 2024",
    gross: 510,
    fee: 51,
    net: 459,
    status: "refunded",
    rating: null,
  },
  {
    id: "TXN-8814",
    customer: "Tom Nguyen",
    service: "Outlet Installation",
    date: "Dec 11, 2024",
    gross: 140,
    fee: 14,
    net: 126,
    status: "paid",
    rating: 5,
  },
];

const PLATFORM_FEE_RATE = 0.1;
const PAYOUT_SCHEDULE = "Every Monday";
const NEXT_PAYOUT_DATE = "Dec 23, 2024";
const NEXT_PAYOUT_AMOUNT = 1740;

type Period = "weekly" | "monthly";
type TransactionStatus = "paid" | "pending" | "refunded";

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  trend,
  trendValue,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 8px 32px -8px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-2xl border p-5 flex flex-col gap-3",
        accent
          ? "bg-[var(--accent)] border-[var(--accent)] text-white"
          : "bg-[hsl(var(--card))] border-[hsl(var(--border))]"
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-sm font-medium",
            accent ? "text-white/80" : "text-[hsl(var(--muted-foreground))]"
          )}
        >
          {label}
        </span>
        <div
          className={cn(
            "h-9 w-9 rounded-xl flex items-center justify-center",
            accent ? "bg-white/20" : "bg-[var(--accent)]/10"
          )}
        >
          <Icon
            className={cn("h-5 w-5", accent ? "text-white" : "text-[var(--accent)]")}
          />
        </div>
      </div>
      <div>
        <div
          className={cn(
            "text-2xl font-bold tracking-tight",
            accent ? "text-white" : "text-[hsl(var(--foreground))]"
          )}
        >
          {value}
        </div>
        {sub && (
          <div
            className={cn(
              "text-xs mt-0.5",
              accent ? "text-white/70" : "text-[hsl(var(--muted-foreground))]"
            )}
          >
            {sub}
          </div>
        )}
      </div>
      {trend && trendValue && (
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trend === "up"
              ? accent
                ? "text-white/90"
                : "text-emerald-600"
              : trend === "down"
              ? accent
                ? "text-white/90"
                : "text-red-500"
              : accent
              ? "text-white/70"
              : "text-[hsl(var(--muted-foreground))]"
          )}
        >
          {trend === "up" ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : trend === "down" ? (
            <ArrowDownRight className="h-3.5 w-3.5" />
          ) : null}
          {trendValue} vs last period
        </div>
      )}
    </motion.div>
  );
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  const config = {
    paid: {
      label: "Paid",
      icon: CheckCircle,
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    pending: {
      label: "Pending",
      icon: Clock,
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    refunded: {
      label: "Refunded",
      icon: XCircle,
      className: "bg-red-50 text-red-600 border-red-200",
    },
  };
  const { label, icon: Icon, className } = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function StarRating({ rating }: { rating: number | null }) {
  if (rating === null) return <span className="text-xs text-[hsl(var(--muted-foreground))]">—</span>;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3 w-3",
            i < rating ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"
          )}
        />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProviderEarningsPage() {
  const t = useTranslations();
  const [period, setPeriod] = useState<Period>("monthly");
  const [txFilter, setTxFilter] = useState<"all" | TransactionStatus>("all");

  const chartData = period === "monthly" ? MONTHLY_EARNINGS : WEEKLY_EARNINGS;

  const filteredTransactions =
    txFilter === "all"
      ? RECENT_TRANSACTIONS
      : RECENT_TRANSACTIONS.filter((tx) => tx.status === txFilter);

  const totalGross = MONTHLY_EARNINGS.reduce((s, m) => s + m.gross, 0);
  const totalNet = MONTHLY_EARNINGS.reduce((s, m) => s + m.net, 0);
  const totalJobs = MONTHLY_EARNINGS.reduce((s, m) => s + m.jobs, 0);
  const avgPerJob = Math.round(totalGross / totalJobs);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                {t("providerEarnings.heading")}
              </h1>
              <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                {t("providerEarnings.subheading")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors">
                <Calendar className="h-4 w-4" />
                {t("providerEarnings.filterYear")}
                <ChevronDown className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                <Download className="h-4 w-4" />
                {t("providerEarnings.exportBtn")}
              </button>
            </div>
          </div>
        </Reveal>

        {/* ── Payout Banner ── */}
        <Reveal delay={0.05}>
          <div className="mb-8 rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-[var(--accent)]/15 flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-6 w-6 text-[var(--accent)]" />
              </div>
              <div>
                <div className="text-xs font-medium text-[var(--accent)] uppercase tracking-wide">
                  {t("providerEarnings.nextPayout")}
                </div>
                <div className="text-xl font-bold text-[hsl(var(--foreground))] mt-0.5">
                  ${NEXT_PAYOUT_AMOUNT.toLocaleString("en-US")}
                </div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">
                  {t("providerEarnings.payoutSchedule", {
                    schedule: PAYOUT_SCHEDULE,
                    date: NEXT_PAYOUT_DATE,
                  })}
                </div>
              </div>
            </div>
            <button className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
              {t("providerEarnings.viewPayoutDetails")}
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </Reveal>

        {/* ── Stat Cards ── */}
        <Reveal delay={0.08}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8"
          >
            {[
              {
                label: t("providerEarnings.stats.totalEarned"),
                value: `$${totalNet.toLocaleString("en-US")}`,
                sub: t("providerEarnings.stats.netAfterFees"),
                trend: "up" as const,
                trendValue: "+18%",
                icon: DollarSign,
                accent: true,
              },
              {
                label: t("providerEarnings.stats.grossRevenue"),
                value: `$${totalGross.toLocaleString("en-US")}`,
                sub: t("providerEarnings.stats.beforeFees"),
                trend: "up" as const,
                trendValue: "+18%",
                icon: TrendingUp,
              },
              {
                label: t("providerEarnings.stats.jobsCompleted"),
                value: totalJobs.toString(),
                sub: t("providerEarnings.stats.thisYear"),
                trend: "up" as const,
                trendValue: "+12%",
                icon: Briefcase,
              },
              {
                label: t("providerEarnings.stats.avgPerJob"),
                value: `$${avgPerJob}`,
                sub: t("providerEarnings.stats.perBooking"),
                trend: "up" as const,
                trendValue: "+5%",
                icon: TrendingUp,
              },
            ].map((card) => (
              <motion.div key={card.label} variants={fadeInUp}>
                <StatCard {...card} />
              </motion.div>
            ))}
          </motion.div>
        </Reveal>

        {/* ── Earnings Chart ── */}
        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
                  {t("providerEarnings.chart.title")}
                </h2>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
                  {t("providerEarnings.chart.subtitle")}
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/40 p-1">
                {(["weekly", "monthly"] as Period[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={cn(
                      "rounded-lg px-4 py-1.5 text-sm font-medium transition-all",
                      period === p
                        ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm"
                        : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                    )}
                  >
                    {p === "weekly"
                      ? t("providerEarnings.chart.weekly")
                      : t("providerEarnings.chart.monthly")}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "13px",
                  }}
                  formatter={(value: number, name: string) => [
                    `$${value.toLocaleString("en-US")}`,
                    name === "gross" ? "Gross" : "Net",
                  ]}
                />
                <Legend
                  formatter={(value) => (value === "gross" ? "Gross Revenue" : "Net Earnings")}
                  wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
                />
                <Area
                  type="monotone"
                  dataKey="gross"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  fill="url(#grossGrad)"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="net"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#netGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Reveal>

        {/* ── Two-column: Service Breakdown + Fee Info ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Service Breakdown Bar Chart */}
          <Reveal delay={0.1} className="lg:col-span-2">
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 h-full">
              <h2 className="text-base font-semibold text-[hsl(var(--foreground))] mb-1">
                {t("providerEarnings.breakdown.title")}
              </h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
                {t("providerEarnings.breakdown.subtitle")}
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={SERVICE_BREAKDOWN}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "13px",
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString("en-US")}`, "Revenue"]}
                  />
                  <Bar dataKey="revenue" fill="var(--accent)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>

              {/* Service table */}
              <div className="mt-4 divide-y divide-[hsl(var(--border))]">
                {SERVICE_BREAKDOWN.map((svc) => (
                  <div key={svc.name} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="font-medium text-[hsl(var(--foreground))]">{svc.name}</span>
                    <div className="flex items-center gap-6 text-[hsl(var(--muted-foreground))]">
                      <span>{svc.jobs} {t("providerEarnings.breakdown.jobs")}</span>
                      <span className="text-[hsl(var(--foreground))] font-semibold">
                        ${svc.revenue.toLocaleString("en-US")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Fee & Payout Info */}
          <Reveal delay={0.12}>
            <div className="flex flex-col gap-4">
              {/* Platform Fee Card */}
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
                <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-3">
                  {t("providerEarnings.feeInfo.title")}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[hsl(var(--muted-foreground))]">
                      {t("providerEarnings.feeInfo.platformFee")}
                    </span>
                    <span className="font-semibold text-[hsl(var(--foreground))]">
                      {(PLATFORM_FEE_RATE * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[hsl(var(--muted-foreground))]">
                      {t("providerEarnings.feeInfo.payoutSchedule")}
                    </span>
                    <span className="font-semibold text-[hsl(var(--foreground))]">
                      {PAYOUT_SCHEDULE}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[hsl(var(--muted-foreground))]">
                      {t("providerEarnings.feeInfo.payoutMethod")}
                    </span>
                    <span className="font-semibold text-[hsl(var(--foreground))]">
                      {t("providerEarnings.feeInfo.bankTransfer")}
                    </span>
                  </div>
                  <div className="h-px bg-[hsl(var(--border))]" />
                  <div className="flex justify-between text-sm">
                    <span className="text-[hsl(var(--muted-foreground))]">
                      {t("providerEarnings.feeInfo.totalFeesPaid")}
                    </span>
                    <span className="font-semibold text-red-500">
                      -${(totalGross - totalNet).toLocaleString("en-US")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[hsl(var(--muted-foreground))]">
                      {t("providerEarnings.feeInfo.totalNetEarned")}
                    </span>
                    <span className="font-bold text-emerald-600">
                      ${totalNet.toLocaleString("en-US")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Card */}
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
                <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-3">
                  {t("providerEarnings.performance.title")}
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      label: t("providerEarnings.performance.avgRating"),
                      value: "4.92",
                      icon: Star,
                      color: "text-amber-500",
                    },
                    {
                      label: t("providerEarnings.performance.completionRate"),
                      value: "98.2%",
                      icon: CheckCircle,
                      color: "text-emerald-600",
                    },
                    {
                      label: t("providerEarnings.performance.repeatCustomers"),
                      value: "64%",
                      icon: TrendingUp,
                      color: "text-[var(--accent)]",
                    },
                    {
                      label: t("providerEarnings.performance.responseTime"),
                      value: "< 1 hr",
                      icon: Clock,
                      color: "text-blue-500",
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
                        <item.icon className={cn("h-4 w-4", item.color)} />
                        {item.label}
                      </div>
                      <span className="font-semibold text-[hsl(var(--foreground))]">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trend card */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-800">
                    {t("providerEarnings.trend.title")}
                  </span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  {t("providerEarnings.trend.body")}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Recent Transactions ── */}
        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-[hsl(var(--border))]">
              <div>
                <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
                  {t("providerEarnings.transactions.title")}
                </h2>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
                  {t("providerEarnings.transactions.subtitle")}
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/40 p-1">
                {(["all", "paid", "pending", "refunded"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setTxFilter(f)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all",
                      txFilter === f
                        ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm"
                        : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                    )}
                  >
                    {f === "all"
                      ? t("providerEarnings.transactions.filterAll")
                      : f === "paid"
                      ? t("providerEarnings.transactions.filterPaid")
                      : f === "pending"
                      ? t("providerEarnings.transactions.filterPending")
                      : t("providerEarnings.transactions.filterRefunded")}
                  </button>
                ))}
              </div>
            </div>

            {/* Table — desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30">
                    {[
                      t("providerEarnings.transactions.colId"),
                      t("providerEarnings.transactions.colCustomer"),
                      t("providerEarnings.transactions.colService"),
                      t("providerEarnings.transactions.colDate"),
                      t("providerEarnings.transactions.colGross"),
                      t("providerEarnings.transactions.colFee"),
                      t("providerEarnings.transactions.colNet"),
                      t("providerEarnings.transactions.colRating"),
                      t("providerEarnings.transactions.colStatus"),
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(var(--border))]">
                  {filteredTransactions.map((tx) => (
                    <motion.tr
                      key={tx.id}
                      whileHover={{ backgroundColor: "hsl(var(--muted) / 0.3)" }}
                      className="transition-colors"
                    >
                      <td className="px-4 py-3.5 font-mono text-xs text-[hsl(var(--muted-foreground))]">
                        {tx.id}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-[hsl(var(--foreground))]">
                        {tx.customer}
                      </td>
                      <td className="px-4 py-3.5 text-[hsl(var(--muted-foreground))]">
                        {tx.service}
                      </td>
                      <td className="px-4 py-3.5 text-[hsl(var(--muted-foreground))]">
                        {tx.date}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-[hsl(var(--foreground))]">
                        ${tx.gross}
                      </td>
                      <td className="px-4 py-3.5 text-red-500">-${tx.fee}</td>
                      <td className="px-4 py-3.5 font-semibold text-emerald-600">
                        ${tx.net}
                      </td>
                      <td className="px-4 py-3.5">
                        <StarRating rating={tx.rating} />
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={tx.status as TransactionStatus} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards — mobile */}
            <div className="md:hidden divide-y divide-[hsl(var(--border))]">
              {filteredTransactions.map((tx) => (
                <div key={tx.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[hsl(var(--foreground))]">
                      {tx.customer}
                    </span>
                    <StatusBadge status={tx.status as TransactionStatus} />
                  </div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))]">
                    {tx.service} · {tx.date}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-[hsl(var(--muted-foreground))]">
                        ${tx.gross} gross
                      </span>
                      <span className="text-red-500">-${tx.fee}</span>
                      <span className="font-semibold text-emerald-600">${tx.net} net</span>
                    </div>
                    <StarRating rating={tx.rating} />
                  </div>
                </div>
              ))}
            </div>

            {filteredTransactions.length === 0 && (
              <div className="py-16 text-center text-[hsl(var(--muted-foreground))] text-sm">
                {t("providerEarnings.transactions.empty")}
              </div>
            )}

            <div className="p-4 border-t border-[hsl(var(--border))] flex items-center justify-between">
              <span className="text-sm text-[hsl(var(--muted-foreground))]">
                {t("providerEarnings.transactions.showing", {
                  count: filteredTransactions.length,
                  total: RECENT_TRANSACTIONS.length,
                })}
              </span>
              <button className="text-sm font-medium text-[var(--accent)] hover:underline">
                {t("providerEarnings.transactions.viewAll")}
              </button>
            </div>
          </div>
        </Reveal>

        {/* ── Bottom padding ── */}
        <div className="h-10" />
      </div>
    </div>
  );
}