"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { User, Mail, Phone, MapPin, Camera, Edit, Save, X, Shield, Bell, CreditCard, Star, Calendar, CheckCircle, AlertCircle, Eye, EyeOff, Lock, Trash2, Plus, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

const MOCK_CUSTOMER = {
  name: "Sarah Mitchell",
  email: "sarah.mitchell@email.com",
  phone: "+1 (555) 248-9031",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah%20Mitchell",
  location: "Austin, TX 78701",
  memberSince: "March 2022",
  totalBookings: 24,
  reviewsGiven: 18,
  savedProviders: 9,
  verified: true,
};

const MOCK_ADDRESSES = [
  { id: "1", label: "Home", address: "1842 Maple Street, Austin, TX 78701", isDefault: true },
  { id: "2", label: "Office", address: "500 W 2nd St, Suite 700, Austin, TX 78701", isDefault: false },
];

const MOCK_PAYMENT_METHODS = [
  { id: "1", type: "Visa", last4: "4242", expiry: "09/26", isDefault: true },
  { id: "2", type: "Mastercard", last4: "8810", expiry: "03/25", isDefault: false },
];

const NOTIFICATION_SETTINGS = [
  { id: "booking_confirm", label: "Booking Confirmations", description: "Get notified when a booking is confirmed", email: true, push: true },
  { id: "booking_reminder", label: "Booking Reminders", description: "Reminders 24 hours before your appointment", email: true, push: false },
  { id: "provider_message", label: "Provider Messages", description: "New messages from your service professionals", email: false, push: true },
  { id: "promotions", label: "Promotions & Offers", description: "Special deals and discounts from Fixly", email: true, push: false },
  { id: "review_request", label: "Review Requests", description: "Prompts to review completed services", email: true, push: true },
];

type TabKey = "profile" | "addresses" | "payment" | "notifications" | "security";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "profile", label: "Personal Info", icon: <User className="h-4 w-4" /> },
  { key: "addresses", label: "Addresses", icon: <MapPin className="h-4 w-4" /> },
  { key: "payment", label: "Payment Methods", icon: <CreditCard className="h-4 w-4" /> },
  { key: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
  { key: "security", label: "Security", icon: <Lock className="h-4 w-4" /> },
];

function StatCard({ value, label, icon }: { value: string | number; label: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 flex flex-col items-center text-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
      <div className="h-10 w-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
        {icon}
      </div>
      <div className="text-2xl font-bold text-[hsl(var(--foreground))]">{value}</div>
      <div className="text-xs text-[hsl(var(--muted-foreground))]">{label}</div>
    </div>
  );
}

function ProfileTab() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: MOCK_CUSTOMER.name,
    email: MOCK_CUSTOMER.email,
    phone: MOCK_CUSTOMER.phone,
    location: MOCK_CUSTOMER.location,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-700 text-sm">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          Profile updated successfully.
        </div>
      )}

      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Personal Information</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:opacity-80 transition-opacity"
            >
              <Edit className="h-4 w-4" /> Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 text-sm font-medium bg-[var(--accent)] text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Save className="h-4 w-4" /> Save
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-6 mb-6 pb-6 border-b border-[hsl(var(--border))]">
          <div className="relative flex-shrink-0">
            <img
              src={MOCK_CUSTOMER.avatar}
              alt={MOCK_CUSTOMER.name}
              className="h-20 w-20 rounded-full object-cover ring-2 ring-[hsl(var(--border))]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(MOCK_CUSTOMER.name)}&background=6366f1&color=fff&size=80`;
              }}
            />
            <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-md hover:opacity-90 transition-opacity">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[hsl(var(--foreground))]">{MOCK_CUSTOMER.name}</span>
              {MOCK_CUSTOMER.verified && (
                <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                  <Shield className="h-3 w-3" /> Verified
                </span>
              )}
            </div>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">Member since {MOCK_CUSTOMER.memberSince}</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{MOCK_CUSTOMER.totalBookings} bookings completed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { label: "Full Name", key: "name" as const, icon: <User className="h-4 w-4" />, type: "text" },
            { label: "Email Address", key: "email" as const, icon: <Mail className="h-4 w-4" />, type: "email" },
            { label: "Phone Number", key: "phone" as const, icon: <Phone className="h-4 w-4" />, type: "tel" },
            { label: "City & State", key: "location" as const, icon: <MapPin className="h-4 w-4" />, type: "text" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5">{field.label}</label>
              {editing ? (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]">{field.icon}</span>
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition-all"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[hsl(var(--muted))]/40 text-sm text-[hsl(var(--foreground))]">
                  <span className="text-[hsl(var(--muted-foreground))]">{field.icon}</span>
                  {form[field.key]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddressesTab() {
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [adding, setAdding] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: "", address: "" });

  const handleAdd = () => {
    if (!newAddress.label || !newAddress.address) return;
    setAddresses((prev) => [
      ...prev,
      { id: String(Date.now()), label: newAddress.label, address: newAddress.address, isDefault: false },
    ]);
    setNewAddress({ label: "", address: "" });
    setAdding(false);
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const handleRemove = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Saved Addresses</h2>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 text-sm font-medium bg-[var(--accent)] text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Add Address
        </button>
      </div>

      {addresses.map((addr) => (
        <div
          key={addr.id}
          className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] flex items-start justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] flex-shrink-0 mt-0.5">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-[hsl(var(--foreground))]">{addr.label}</span>
                {addr.isDefault && (
                  <span className="text-xs bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-0.5 rounded-full font-medium">Default</span>
                )}
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">{addr.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!addr.isDefault && (
              <button
                onClick={() => handleSetDefault(addr.id)}
                className="text-xs text-[hsl(var(--muted-foreground))] hover:text-[var(--accent)] transition-colors"
              >
                Set default
              </button>
            )}
            <button
              onClick={() => handleRemove(addr.id)}
              className="text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors"
              aria-label="Remove address"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      {adding && (
        <div className="rounded-2xl border border-[var(--accent)]/30 bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] space-y-4">
          <h3 className="font-medium text-sm text-[hsl(var(--foreground))]">New Address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5">Label (e.g. Home, Office)</label>
              <input
                type="text"
                value={newAddress.label}
                onChange={(e) => setNewAddress((p) => ({ ...p, label: e.target.value }))}
                placeholder="Home"
                className="w-full px-3 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5">Full Address</label>
              <input
                type="text"
                value={newAddress.address}
                onChange={(e) => setNewAddress((p) => ({ ...p, address: e.target.value }))}
                placeholder="123 Main St, City, State ZIP"
                className="w-full px-3 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd}
              className="text-sm font-medium bg-[var(--accent)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Save Address
            </button>
            <button
              onClick={() => setAdding(false)}
              className="text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentTab() {
  const [methods, setMethods] = useState(MOCK_PAYMENT_METHODS);

  const handleSetDefault = (id: string) => {
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
  };

  const handleRemove = (id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
  };

  const cardBrandColor = (type: string) => {
    if (type === "Visa") return "bg-blue-600";
    if (type === "Mastercard") return "bg-red-500";
    return "bg-gray-600";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Payment Methods</h2>
        <button className="flex items-center gap-1.5 text-sm font-medium bg-[var(--accent)] text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> Add Card
        </button>
      </div>

      {methods.map((method) => (
        <div
          key={method.id}
          className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className={cn("h-10 w-14 rounded-lg flex items-center justify-center text-white text-xs font-bold", cardBrandColor(method.type))}>
              {method.type}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-[hsl(var(--foreground))]">•••• {method.last4}</span>
                {method.isDefault && (
                  <span className="text-xs bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-0.5 rounded-full font-medium">Default</span>
                )}
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">Expires {method.expiry}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!method.isDefault && (
              <button
                onClick={() => handleSetDefault(method.id)}
                className="text-xs text-[hsl(var(--muted-foreground))] hover:text-[var(--accent)] transition-colors"
              >
                Set default
              </button>
            )}
            <button
              onClick={() => handleRemove(method.id)}
              className="text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors"
              aria-label="Remove card"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      <div className="rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))]/50 p-5 flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 rounded-full bg-[hsl(var(--muted))]/60 flex items-center justify-center mx-auto mb-2">
            <CreditCard className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
          </div>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Add a new payment method to get started</p>
          <button className="mt-2 text-sm font-medium text-[var(--accent)] hover:opacity-80 transition-opacity">
            + Add credit or debit card
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
        <Shield className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">Your payment information is encrypted and secured with 256-bit SSL. Fixly never stores your full card number.</p>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = useState(NOTIFICATION_SETTINGS);

  const toggle = (id: string, channel: "email" | "push") => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [channel]: !s[channel] } : s))
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Notification Preferences</h2>

      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30">
          <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide">Notification Type</span>
          <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide w-12 text-center">Email</span>
          <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide w-12 text-center">Push</span>
        </div>
        {settings.map((setting, i) => (
          <div
            key={setting.id}
            className={cn(
              "grid grid-cols-[1fr_auto_auto] gap-4 items-center px-5 py-4",
              i < settings.length - 1 && "border-b border-[hsl(var(--border))]"
            )}
          >
            <div>
              <p className="text-sm font-medium text-[hsl(var(--foreground))]">{setting.label}</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{setting.description}</p>
            </div>
            {(["email", "push"] as const).map((channel) => (
              <div key={channel} className="w-12 flex justify-center">
                <button
                  role="switch"
                  aria-checked={setting[channel]}
                  onClick={() => toggle(setting.id, channel)}
                  className={cn(
                    "relative h-5 w-9 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                    setting[channel] ? "bg-[var(--accent)]" : "bg-[hsl(var(--muted))]"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
                      setting[channel] ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleChangePassword = () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setError("New passwords do not match.");
      return;
    }
    if (passwords.newPass.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setSaved(true);
    setPasswords({ current: "", newPass: "", confirm: "" });
    setTimeout(() => setSaved(false), 3000);
  };

  const SESSIONS = [
    { device: "MacBook Pro — Chrome", location: "Austin, TX", time: "Active now", current: true },
    { device: "iPhone 15 — Safari", location: "Austin, TX", time: "2 hours ago", current: false },
    { device: "Windows PC — Edge", location: "Dallas, TX", time: "3 days ago", current: false },
  ];

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-700 text-sm">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          Password updated successfully.
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
        <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-5">Change Password</h2>
        <div className="space-y-4 max-w-md">
          {[
            { label: "Current Password", key: "current" as const, show: showCurrent, toggle: () => setShowCurrent((v) => !v) },
            { label: "New Password", key: "newPass" as const, show: showNew, toggle: () => setShowNew((v) => !v) },
            { label: "Confirm New Password", key: "confirm" as const, show: showConfirm, toggle: () => setShowConfirm((v) => !v) },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5">{field.label}</label>
              <div className="relative">
                <input
                  type={field.show ? "text" : "password"}
                  value={passwords[field.key]}
                  onChange={(e) => setPasswords((p) => ({ ...p, [field.key]: e.target.value }))}
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={field.toggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                  aria-label={field.show ? "Hide password" : "Show password"}
                >
                  {field.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={handleChangePassword}
            className="w-full sm:w-auto bg-[var(--accent)] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            Update Password
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Two-Factor Authentication</h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">Add an extra layer of security to your account</p>
          </div>
          <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-full font-medium">Not enabled</span>
        </div>
        <button className="flex items-center gap-2 text-sm font-medium text-[var(--accent)] border border-[var(--accent)]/30 px-4 py-2 rounded-xl hover:bg-[var(--accent)]/5 transition-colors">
          <Shield className="h-4 w-4" /> Enable 2FA
        </button>
      </div>

      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
        <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-5">Active Sessions</h2>
        <div className="space-y-3">
          {SESSIONS.map((session, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-[hsl(var(--border))] last:border-0">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-[hsl(var(--muted))]/60 flex items-center justify-center flex-shrink-0">
                  <Lock className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[hsl(var(--foreground))]">{session.device}</span>
                    {session.current && (
                      <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-1.5 py-0.5 rounded-full font-medium">Current</span>
                    )}
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{session.location} · {session.time}</p>
                </div>
              </div>
              {!session.current && (
                <button className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors flex-shrink-0">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <h3 className="text-sm font-semibold text-red-700 mb-1">Danger Zone</h3>
        <p className="text-xs text-red-600 mb-3">Permanently delete your account and all associated data. This action cannot be undone.</p>
        <button className="flex items-center gap-1.5 text-sm font-medium text-red-600 border border-red-300 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors">
          <Trash2 className="h-4 w-4" /> Delete Account
        </button>
      </div>
    </div>
  );
}

export default function CustomerProfilePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  return (
    <main className="min-h-screen bg-[hsl(var(--background))]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <Reveal>
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
              Account Settings
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] mt-1 text-sm">
              Manage your profile, addresses, payment methods, and security preferences.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <StatCard value={MOCK_CUSTOMER.totalBookings} label="Total Bookings" icon={<Calendar className="h-5 w-5" />} />
            <StatCard value={MOCK_CUSTOMER.reviewsGiven} label="Reviews Given" icon={<Star className="h-5 w-5" />} />
            <StatCard value={MOCK_CUSTOMER.savedProviders} label="Saved Pros" icon={<User className="h-5 w-5" />} />
            <StatCard value="4.9" label="Avg. Rating Given" icon={<CheckCircle className="h-5 w-5" />} />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="lg:w-56 flex-shrink-0">
              <nav className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
                {TABS.map((tab, i) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all text-left",
                      i < TABS.length - 1 && "border-b border-[hsl(var(--border))]",
                      activeTab === tab.key
                        ? "bg-[var(--accent)]/8 text-[var(--accent)]"
                        : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/40"
                    )}
                  >
                    <span className={cn(activeTab === tab.key ? "text-[var(--accent)]" : "text-[hsl(var(--muted-foreground))]")}>
                      {tab.icon}
                    </span>
                    {tab.label}
                    {activeTab === tab.key && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
                  </button>
                ))}
              </nav>
            </aside>

            <div className="flex-1 min-w-0">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {activeTab === "profile" && <ProfileTab />}
                {activeTab === "addresses" && <AddressesTab />}
                {activeTab === "payment" && <PaymentTab />}
                {activeTab === "notifications" && <NotificationsTab />}
                {activeTab === "security" && <SecurityTab />}
              </motion.div>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}