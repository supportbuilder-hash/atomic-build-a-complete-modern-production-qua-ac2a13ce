"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, MapPin, Star, Check, X, Calendar, Plus, Filter } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";

interface CalendarBooking {
  id: string;
  customerName: string;
  customerAvatar: string;
  service: string;
  date: string;
  timeSlot: string;
  duration: number;
  address: string;
  price: number;
  status: BookingStatus;
  rating?: number;
  note?: string;
}

const MOCK_BOOKINGS: CalendarBooking[] = [
  {
    id: "bk-001",
    customerName: "Sarah Mitchell",
    customerAvatar: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/f27e1e6fdfee48ca8f8ad8eb077d30f1.png",
    service: "Full Electrical Inspection",
    date: "2025-07-07",
    timeSlot: "09:00 AM",
    duration: 2,
    address: "142 Maple Street, Austin, TX 78701",
    price: 180,
    status: "confirmed",
    note: "Please bring circuit breaker tools.",
  },
  {
    id: "bk-002",
    customerName: "James Okafor",
    customerAvatar: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/caa8c800890d4e0f96ddb1db124c3805.png",
    service: "Outlet Installation",
    date: "2025-07-07",
    timeSlot: "01:00 PM",
    duration: 1,
    address: "88 Riverside Ave, Austin, TX 78702",
    price: 95,
    status: "confirmed",
  },
  {
    id: "bk-003",
    customerName: "Priya Nair",
    customerAvatar: "/images/customer-priya-nair.jpg",
    service: "Panel Upgrade",
    date: "2025-07-09",
    timeSlot: "10:00 AM",
    duration: 4,
    address: "310 Oak Lane, Austin, TX 78703",
    price: 420,
    status: "pending",
    note: "200A upgrade requested.",
  },
  {
    id: "bk-004",
    customerName: "Tom Harrington",
    customerAvatar: "/images/customer-tom-harrington.jpg",
    service: "Ceiling Fan Installation",
    date: "2025-07-10",
    timeSlot: "02:00 PM",
    duration: 1,
    address: "55 Cedar Blvd, Austin, TX 78704",
    price: 75,
    status: "confirmed",
  },
  {
    id: "bk-005",
    customerName: "Linda Zhao",
    customerAvatar: "/images/customer-linda-zhao.jpg",
    service: "Emergency Wiring Repair",
    date: "2025-07-11",
    timeSlot: "08:00 AM",
    duration: 3,
    address: "201 Pine Road, Austin, TX 78705",
    price: 310,
    status: "pending",
  },
  {
    id: "bk-006",
    customerName: "Carlos Mendez",
    customerAvatar: "/images/customer-carlos-mendez.jpg",
    service: "Smart Home Setup",
    date: "2025-07-14",
    timeSlot: "11:00 AM",
    duration: 3,
    address: "77 Elm Street, Austin, TX 78706",
    price: 260,
    status: "confirmed",
    note: "Google Home ecosystem.",
  },
  {
    id: "bk-007",
    customerName: "Rachel Kim",
    customerAvatar: "/images/customer-rachel-kim.jpg",
    service: "Full Electrical Inspection",
    date: "2025-07-15",
    timeSlot: "09:00 AM",
    duration: 2,
    address: "400 Birch Ave, Austin, TX 78707",
    price: 180,
    status: "confirmed",
  },
  {
    id: "bk-008",
    customerName: "David Osei",
    customerAvatar: "/images/customer-david-osei.jpg",
    service: "Outlet Installation",
    date: "2025-07-03",
    timeSlot: "10:00 AM",
    duration: 1,
    address: "19 Walnut Drive, Austin, TX 78708",
    price: 95,
    status: "completed",
    rating: 5,
  },
  {
    id: "bk-009",
    customerName: "Monica Patel",
    customerAvatar: "/images/customer-monica-patel.jpg",
    service: "Ceiling Fan Installation",
    date: "2025-07-04",
    timeSlot: "03:00 PM",
    duration: 1,
    address: "63 Spruce Court, Austin, TX 78709",
    price: 75,
    status: "completed",
    rating: 4,
  },
  {
    id: "bk-010",
    customerName: "Alex Turner",
    customerAvatar: "/images/customer-alex-turner.jpg",
    service: "Panel Upgrade",
    date: "2025-07-02",
    timeSlot: "08:00 AM",
    duration: 4,
    address: "500 Aspen Way, Austin, TX 78710",
    price: 420,
    status: "cancelled",
  },
];

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string; dot: string }> = {
  confirmed: {
    label: "Confirmed",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "Pending",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
  },
  completed: {
    label: "Completed",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    dot: "bg-blue-500",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    dot: "bg-red-500",
  },
};

const AVAILABILITY_SLOTS = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM",
];

const BLOCKED_SLOTS: Record<string, string[]> = {
  "2025-07-07": ["09:00 AM", "01:00 PM"],
  "2025-07-09": ["10:00 AM"],
  "2025-07-10": ["02:00 PM"],
  "2025-07-11": ["08:00 AM"],
  "2025-07-14": ["11:00 AM"],
  "2025-07-15": ["09:00 AM"],
};

function getDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function getBookingsForDate(dateKey: string): CalendarBooking[] {
  return MOCK_BOOKINGS.filter((b) => b.date === dateKey);
}

type ViewMode = "month" | "week" | "list";

export default function ProviderCalendarPage() {
  const today = new Date(2025, 6, 7); // July 7, 2025
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(
    getDateKey(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedBooking, setSelectedBooking] = useState<CalendarBooking | null>(null);
  const [filterStatus, setFilterStatus] = useState<BookingStatus | "all">("all");
  const [availabilityMode, setAvailabilityMode] = useState(false);
  const [blockedSlots, setBlockedSlots] = useState<Record<string, string[]>>(BLOCKED_SLOTS);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const selectedBookings = getBookingsForDate(selectedDate).filter(
    (b) => filterStatus === "all" || b.status === filterStatus
  );

  const upcomingBookings = MOCK_BOOKINGS.filter(
    (b) => b.status === "confirmed" || b.status === "pending"
  ).sort((a, b) => a.date.localeCompare(b.date));

  const toggleSlot = (slot: string) => {
    setBlockedSlots((prev) => {
      const current = prev[selectedDate] ?? [];
      const updated = current.includes(slot)
        ? current.filter((s) => s !== slot)
        : [...current, slot];
      return { ...prev, [selectedDate]: updated };
    });
  };

  const monthStats = {
    total: MOCK_BOOKINGS.length,
    confirmed: MOCK_BOOKINGS.filter((b) => b.status === "confirmed").length,
    pending: MOCK_BOOKINGS.filter((b) => b.status === "pending").length,
    completed: MOCK_BOOKINGS.filter((b) => b.status === "completed").length,
    revenue: MOCK_BOOKINGS.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.price, 0),
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <Reveal>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                My Calendar
              </h1>
              <p className="mt-1 text-[hsl(var(--muted-foreground))]">
                Manage your schedule, bookings, and availability in one place.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAvailabilityMode((v) => !v)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200",
                  availabilityMode
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:border-[var(--accent)]"
                )}
              >
                <Clock className="h-4 w-4" />
                {availabilityMode ? "Exit Availability" : "Set Availability"}
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:opacity-90">
                <Plus className="h-4 w-4" />
                Block Time
              </button>
            </div>
          </div>
        </Reveal>

        {/* Stats Row */}
        <Reveal>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5"
          >
            {[
              { label: "Total Bookings", value: monthStats.total, color: "text-[hsl(var(--foreground))]" },
              { label: "Confirmed", value: monthStats.confirmed, color: "text-emerald-600" },
              { label: "Pending", value: monthStats.pending, color: "text-amber-600" },
              { label: "Completed", value: monthStats.completed, color: "text-blue-600" },
              { label: "Est. Revenue", value: `$${monthStats.revenue.toLocaleString("en-US")}`, color: "text-[var(--accent)]" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]"
              >
                <div className={cn("text-2xl font-bold", stat.color)}>{stat.value}</div>
                <div className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Calendar Panel */}
          <div className="lg:col-span-2">
            <Reveal>
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] overflow-hidden">
                {/* Calendar Header */}
                <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={prevMonth}
                      className="rounded-lg border border-[hsl(var(--border))] p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
                      {MONTHS[currentMonth]} {currentYear}
                    </h2>
                    <button
                      onClick={nextMonth}
                      className="rounded-lg border border-[hsl(var(--border))] p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-1">
                    {(["month", "week", "list"] as ViewMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={cn(
                          "rounded-lg px-3 py-1 text-xs font-medium capitalize transition-all duration-200",
                          viewMode === mode
                            ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm"
                            : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                        )}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 border-b border-[hsl(var(--border))]">
                  {DAYS_OF_WEEK.map((d) => (
                    <div
                      key={d}
                      className="py-2 text-center text-xs font-medium text-[hsl(var(--muted-foreground))]"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-20 border-b border-r border-[hsl(var(--border))]/50" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateKey = getDateKey(currentYear, currentMonth, day);
                    const dayBookings = getBookingsForDate(dateKey);
                    const isSelected = selectedDate === dateKey;
                    const isToday = dateKey === getDateKey(today.getFullYear(), today.getMonth(), today.getDate());
                    const hasConfirmed = dayBookings.some((b) => b.status === "confirmed");
                    const hasPending = dayBookings.some((b) => b.status === "pending");

                    return (
                      <motion.button
                        key={dateKey}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedDate(dateKey)}
                        className={cn(
                          "relative h-20 border-b border-r border-[hsl(var(--border))]/50 p-1.5 text-left transition-colors",
                          isSelected
                            ? "bg-[var(--accent)]/8 ring-1 ring-inset ring-[var(--accent)]"
                            : "hover:bg-[hsl(var(--muted))]/60"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                            isToday
                              ? "bg-[var(--accent)] text-white"
                              : isSelected
                              ? "text-[var(--accent)] font-bold"
                              : "text-[hsl(var(--foreground))]"
                          )}
                        >
                          {day}
                        </span>
                        <div className="mt-1 flex flex-col gap-0.5">
                          {hasConfirmed && (
                            <div className="truncate rounded px-1 py-0.5 text-[10px] font-medium bg-emerald-100 text-emerald-700">
                              {dayBookings.filter((b) => b.status === "confirmed").length} confirmed
                            </div>
                          )}
                          {hasPending && (
                            <div className="truncate rounded px-1 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700">
                              {dayBookings.filter((b) => b.status === "pending").length} pending
                            </div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 border-t border-[hsl(var(--border))] px-6 py-3">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <span className={cn("h-2 w-2 rounded-full", cfg.dot)} />
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">{cfg.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Selected Day Bookings */}
            <Reveal className="mt-6">
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)]">
                <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-6 py-4">
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      {availabilityMode ? "Availability" : "Bookings"} for{" "}
                      {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </h3>
                    {!availabilityMode && (
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        {selectedBookings.length} booking{selectedBookings.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                  {!availabilityMode && (
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as BookingStatus | "all")}
                        className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-2 py-1 text-xs text-[hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                      >
                        <option value="all">All</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  {availabilityMode ? (
                    <div>
                      <p className="mb-3 text-sm text-[hsl(var(--muted-foreground))]">
                        Toggle slots to block or open your availability for this day.
                      </p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                        {AVAILABILITY_SLOTS.map((slot) => {
                          const isBlocked = (blockedSlots[selectedDate] ?? []).includes(slot);
                          return (
                            <motion.button
                              key={slot}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => toggleSlot(slot)}
                              className={cn(
                                "rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-200",
                                isBlocked
                                  ? "border-red-200 bg-red-50 text-red-600"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              )}
                            >
                              {isBlocked ? <X className="mx-auto mb-0.5 h-3 w-3" /> : <Check className="mx-auto mb-0.5 h-3 w-3" />}
                              {slot}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ) : selectedBookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Calendar className="mb-3 h-10 w-10 text-[hsl(var(--muted-foreground))]/40" />
                      <p className="text-sm font-medium text-[hsl(var(--foreground))]">No bookings for this day</p>
                      <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                        Select another date or check upcoming bookings below.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedBookings.map((booking) => {
                        const cfg = STATUS_CONFIG[booking.status];
                        return (
                          <motion.div
                            key={booking.id}
                            whileHover={{ x: 2 }}
                            onClick={() => setSelectedBooking(booking)}
                            className="flex cursor-pointer items-start gap-4 rounded-xl border border-[hsl(var(--border))] p-4 transition-all duration-200 hover:border-[var(--accent)]/40 hover:shadow-sm"
                          >
                            <img
                              src={booking.customerAvatar}
                              alt={booking.customerName}
                              className="h-10 w-10 rounded-full object-cover ring-2 ring-[hsl(var(--border))]"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.customerName)}&background=random`;
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-medium text-[hsl(var(--foreground))] truncate">{booking.customerName}</p>
                                <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium", cfg.bg, cfg.color)}>
                                  {cfg.label}
                                </span>
                              </div>
                              <p className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))] truncate">{booking.service}</p>
                              <div className="mt-1.5 flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {booking.timeSlot} ({booking.duration}h)
                                </span>
                                <span className="font-semibold text-[hsl(var(--foreground))]">${booking.price}</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Bookings */}
            <Reveal>
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)]">
                <div className="border-b border-[hsl(var(--border))] px-5 py-4">
                  <h3 className="font-semibold text-[hsl(var(--foreground))]">Upcoming</h3>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Next confirmed & pending jobs</p>
                </div>
                <div className="divide-y divide-[hsl(var(--border))]">
                  {upcomingBookings.slice(0, 6).map((booking) => {
                    const cfg = STATUS_CONFIG[booking.status];
                    return (
                      <motion.button
                        key={booking.id}
                        whileHover={{ backgroundColor: "hsl(var(--muted))" }}
                        onClick={() => {
                          setSelectedDate(booking.date);
                          setSelectedBooking(booking);
                        }}
                        className="w-full px-5 py-3 text-left transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium text-[hsl(var(--foreground))]">
                            {booking.customerName}
                          </p>
                          <span className={cn("shrink-0 flex items-center gap-1 text-xs font-medium", cfg.color)}>
                            <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                            {cfg.label}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-[hsl(var(--muted-foreground))]">{booking.service}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                          <Calendar className="h-3 w-3" />
                          {new Date(booking.date + "T12:00:00").toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                          <Clock className="ml-1 h-3 w-3" />
                          {booking.timeSlot}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </Reveal>

            {/* Quick Stats */}
            <Reveal>
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)]">
                <h3 className="mb-4 font-semibold text-[hsl(var(--foreground))]">This Month</h3>
                <div className="space-y-3">
                  {[
                    { label: "Hours Worked", value: "38h", icon: Clock },
                    { label: "Avg. Rating", value: "4.9", icon: Star },
                    { label: "Jobs Completed", value: "2", icon: Check },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                        <Icon className="h-4 w-4" />
                        {label}
                      </div>
                      <span className="text-sm font-semibold text-[hsl(var(--foreground))]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Working Hours */}
            <Reveal>
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)]">
                <h3 className="mb-4 font-semibold text-[hsl(var(--foreground))]">Working Hours</h3>
                <div className="space-y-2">
                  {[
                    { day: "Mon", start: "08:00", end: "17:00", active: true },
                    { day: "Tue", start: "08:00", end: "17:00", active: true },
                    { day: "Wed", start: "08:00", end: "17:00", active: true },
                    { day: "Thu", start: "08:00", end: "17:00", active: true },
                    { day: "Fri", start: "08:00", end: "15:00", active: true },
                    { day: "Sat", start: "09:00", end: "13:00", active: true },
                    { day: "Sun", start: "", end: "", active: false },
                  ].map(({ day, start, end, active }) => (
                    <div key={day} className="flex items-center justify-between text-sm">
                      <span className={cn("w-8 font-medium", active ? "text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))]")}>
                        {day}
                      </span>
                      {active ? (
                        <span className="text-[hsl(var(--muted-foreground))]">
                          {start} – {end}
                        </span>
                      ) : (
                        <span className="text-xs text-[hsl(var(--muted-foreground))]/60">Unavailable</span>
                      )}
                      <div className={cn("h-2 w-2 rounded-full", active ? "bg-emerald-500" : "bg-[hsl(var(--muted-foreground))]/30")} />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setSelectedBooking(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-6 py-4">
              <h3 className="font-semibold text-[hsl(var(--foreground))]">Booking Details</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Customer */}
              <div className="flex items-center gap-4">
                <img
                  src={selectedBooking.customerAvatar}
                  alt={selectedBooking.customerName}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-[hsl(var(--border))]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedBooking.customerName)}&background=random`;
                  }}
                />
                <div>
                  <p className="font-semibold text-[hsl(var(--foreground))]">{selectedBooking.customerName}</p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{selectedBooking.service}</p>
                  {selectedBooking.rating && (
                    <div className="mt-1 flex items-center gap-1">
                      {Array.from({ length: selectedBooking.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  )}
                </div>
                <span
                  className={cn(
                    "ml-auto shrink-0 rounded-full border px-3 py-1 text-xs font-medium",
                    STATUS_CONFIG[selectedBooking.status].bg,
                    STATUS_CONFIG[selectedBooking.status].color
                  )}
                >
                  {STATUS_CONFIG[selectedBooking.status].label}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3 rounded-xl bg-[hsl(var(--muted))]/50 p-4">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                  <span className="text-[hsl(var(--foreground))]">
                    {new Date(selectedBooking.date + "T12:00:00").toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                  <span className="text-[hsl(var(--foreground))]">
                    {selectedBooking.timeSlot} &mdash; {selectedBooking.duration} hour{selectedBooking.duration > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))]" />
                  <span className="text-[hsl(var(--foreground))]">{selectedBooking.address}</span>
                </div>
              </div>

              {selectedBooking.note && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs font-medium text-amber-700">Customer Note</p>
                  <p className="mt-1 text-sm text-amber-800">{selectedBooking.note}</p>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center justify-between rounded-xl border border-[hsl(var(--border))] px-4 py-3">
                <span className="text-sm text-[hsl(var(--muted-foreground))]">Total Payout</span>
                <span className="text-xl font-bold text-[hsl(var(--foreground))]">${selectedBooking.price}</span>
              </div>

              {/* Actions */}
              {selectedBooking.status === "pending" && (
                <div className="flex gap-3">
                  <button className="flex-1 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100">
                    Decline
                  </button>
                  <button className="flex-1 rounded-xl bg-[var(--accent)] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
                    Accept Job
                  </button>
                </div>
              )}
              {selectedBooking.status === "confirmed" && (
                <button className="w-full rounded-xl bg-[var(--accent)] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
                  Get Directions
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}