"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Star, CheckCheck, Check, Clock, Image, Smile, ArrowLeft, Circle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  type: "text" | "image";
  imageUrl?: string;
}

interface Conversation {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerCategory: string;
  providerRating: number;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  bookingId?: string;
  bookingStatus?: string;
  messages: Message[];
}

const CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    providerId: "marcus-rivera",
    providerName: "Marcus Rivera",
    providerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Handyman",
    providerCategory: "Electrician",
    providerRating: 4.92,
    isOnline: true,
    lastMessage: "I'll be there by 10 AM sharp. Please make sure the main panel is accessible.",
    lastMessageTime: "10:42 AM",
    unreadCount: 2,
    bookingId: "BK-2024-001",
    bookingStatus: "Confirmed",
    messages: [
      {
        id: "m1",
        senderId: "customer",
        text: "Hi Marcus, I have a circuit breaker that keeps tripping. Can you take a look tomorrow?",
        timestamp: "Yesterday, 3:15 PM",
        status: "read",
        type: "text",
      },
      {
        id: "m2",
        senderId: "marcus-rivera",
        text: "Hi! Yes, absolutely. I have availability tomorrow morning. What time works best for you?",
        timestamp: "Yesterday, 3:28 PM",
        status: "read",
        type: "text",
      },
      {
        id: "m3",
        senderId: "customer",
        text: "10 AM would be perfect. The issue is in the kitchen — the breaker trips whenever I use the microwave and toaster at the same time.",
        timestamp: "Yesterday, 3:35 PM",
        status: "read",
        type: "text",
      },
      {
        id: "m4",
        senderId: "marcus-rivera",
        text: "That sounds like an overloaded circuit. I'll bring the necessary equipment to assess and possibly add a dedicated circuit. Booking confirmed for tomorrow at 10 AM.",
        timestamp: "Yesterday, 3:50 PM",
        status: "read",
        type: "text",
      },
      {
        id: "m5",
        senderId: "marcus-rivera",
        text: "I'll be there by 10 AM sharp. Please make sure the main panel is accessible.",
        timestamp: "10:42 AM",
        status: "delivered",
        type: "text",
      },
    ],
  },
  {
    id: "conv-2",
    providerId: "sarah-chen",
    providerName: "Sarah Chen",
    providerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah%20Chen",
    providerCategory: "Plumber",
    providerRating: 4.88,
    isOnline: false,
    lastMessage: "The leak has been fixed. Please check under the sink and let me know if everything looks good.",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    bookingId: "BK-2024-002",
    bookingStatus: "Completed",
    messages: [
      {
        id: "m1",
        senderId: "customer",
        text: "Sarah, there's a slow leak under my kitchen sink. Can you come by this week?",
        timestamp: "Mon, 9:00 AM",
        status: "read",
        type: "text",
      },
      {
        id: "m2",
        senderId: "sarah-chen",
        text: "Of course! I can come Wednesday afternoon. The leak is likely from the P-trap or supply line — both are quick fixes.",
        timestamp: "Mon, 9:20 AM",
        status: "read",
        type: "text",
      },
      {
        id: "m3",
        senderId: "customer",
        text: "Wednesday at 2 PM works great. Thank you!",
        timestamp: "Mon, 9:25 AM",
        status: "read",
        type: "text",
      },
      {
        id: "m4",
        senderId: "sarah-chen",
        text: "The leak has been fixed. Please check under the sink and let me know if everything looks good.",
        timestamp: "Yesterday, 3:10 PM",
        status: "read",
        type: "text",
      },
    ],
  },
  {
    id: "conv-3",
    providerId: "james-okafor",
    providerName: "James Okafor",
    providerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James%20Okafor",
    providerCategory: "AC & HVAC",
    providerRating: 4.95,
    isOnline: true,
    lastMessage: "Sure, I can do a full AC tune-up and filter replacement. My rate is $85 for the service.",
    lastMessageTime: "Tue",
    unreadCount: 0,
    bookingId: undefined,
    bookingStatus: undefined,
    messages: [
      {
        id: "m1",
        senderId: "customer",
        text: "Hi James, my AC isn't cooling as well as it used to. Do you offer maintenance services?",
        timestamp: "Tue, 11:00 AM",
        status: "read",
        type: "text",
      },
      {
        id: "m2",
        senderId: "james-okafor",
        text: "Sure, I can do a full AC tune-up and filter replacement. My rate is $85 for the service.",
        timestamp: "Tue, 11:30 AM",
        status: "read",
        type: "text",
      },
    ],
  },
  {
    id: "conv-4",
    providerId: "priya-sharma",
    providerName: "Priya Sharma",
    providerAvatar: "/images/cleaning-priya-sharma-profile.jpg",
    providerCategory: "Cleaning",
    providerRating: 4.79,
    isOnline: false,
    lastMessage: "Thank you for the 5-star review! It was a pleasure cleaning your home.",
    lastMessageTime: "Mon",
    unreadCount: 0,
    bookingId: "BK-2024-003",
    bookingStatus: "Completed",
    messages: [
      {
        id: "m1",
        senderId: "priya-sharma",
        text: "Thank you for the 5-star review! It was a pleasure cleaning your home.",
        timestamp: "Mon, 6:00 PM",
        status: "read",
        type: "text",
      },
      {
        id: "m2",
        senderId: "customer",
        text: "You did an amazing job, Priya! The house looks spotless. We'll definitely book again.",
        timestamp: "Mon, 6:15 PM",
        status: "read",
        type: "text",
      },
    ],
  },
  {
    id: "conv-5",
    providerId: "tom-bradley",
    providerName: "Tom Bradley",
    providerAvatar: "/images/handyman-tom-bradley-profile.jpg",
    providerCategory: "Handyman",
    providerRating: 4.71,
    isOnline: false,
    lastMessage: "I can come Saturday morning to fix the fence and patch the drywall.",
    lastMessageTime: "Sun",
    unreadCount: 0,
    messages: [
      {
        id: "m1",
        senderId: "customer",
        text: "Tom, I need a few small repairs done — a broken fence panel and some drywall patching.",
        timestamp: "Sun, 2:00 PM",
        status: "read",
        type: "text",
      },
      {
        id: "m2",
        senderId: "tom-bradley",
        text: "I can come Saturday morning to fix the fence and patch the drywall.",
        timestamp: "Sun, 2:45 PM",
        status: "read",
        type: "text",
      },
    ],
  },
];

function MessageStatusIcon({ status }: { status: Message["status"] }) {
  if (status === "read") return <CheckCheck className="h-3.5 w-3.5 text-[var(--accent)]" />;
  if (status === "delivered") return <CheckCheck className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />;
  return <Check className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />;
}

export default function CustomerMessagesPage() {
  const t = useTranslations();
  const [conversations] = useState<Conversation[]>(CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>("conv-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId) ?? conversations[0];

  const filteredConversations = conversations.filter((c) =>
    c.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.providerCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvId]);

  function handleSelectConv(id: string) {
    setActiveConvId(id);
    setShowMobileChat(true);
  }

  function handleSend() {
    if (!newMessage.trim()) return;
    setNewMessage("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <main className="min-h-screen bg-[hsl(var(--background))]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-3xl">
              {t("messages.title")}
            </h1>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              {t("messages.subtitle")}
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div
            className="overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)]"
            style={{ height: "calc(100vh - 220px)", minHeight: "560px" }}
          >
            <div className="flex h-full">
              {/* Sidebar */}
              <div
                className={cn(
                  "flex h-full w-full flex-col border-r border-[hsl(var(--border))] md:w-80 lg:w-96",
                  showMobileChat ? "hidden md:flex" : "flex"
                )}
              >
                {/* Sidebar header */}
                <div className="border-b border-[hsl(var(--border))] p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                    <input
                      type="text"
                      placeholder={t("messages.searchPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] py-2 pl-9 pr-4 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 transition-all"
                    />
                  </div>
                </div>

                {/* Conversation list */}
                <div className="flex-1 overflow-y-auto">
                  {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Search className="mb-3 h-8 w-8 text-[hsl(var(--muted-foreground))]" />
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">{t("messages.noResults")}</p>
                    </div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => handleSelectConv(conv.id)}
                        className={cn(
                          "flex w-full items-start gap-3 border-b border-[hsl(var(--border))] p-4 text-left transition-colors hover:bg-[hsl(var(--muted))]/40",
                          activeConvId === conv.id && "bg-[var(--accent)]/5 border-l-2 border-l-[var(--accent)]"
                        )}
                      >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={conv.providerAvatar}
                            alt={conv.providerName}
                            className="h-11 w-11 rounded-full object-cover ring-2 ring-[hsl(var(--border))]"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.providerName)}&background=random`;
                            }}
                          />
                          {conv.isOnline && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[hsl(var(--card))] bg-green-500" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-semibold text-[hsl(var(--foreground))]">
                              {conv.providerName}
                            </span>
                            <span className="flex-shrink-0 text-xs text-[hsl(var(--muted-foreground))]">
                              {conv.lastMessageTime}
                            </span>
                          </div>
                          <div className="mt-0.5 flex items-center gap-1">
                            <span className="truncate text-xs text-[hsl(var(--muted-foreground))]">
                              {conv.providerCategory}
                            </span>
                            {conv.bookingStatus && (
                              <>
                                <span className="text-[hsl(var(--muted-foreground))]">·</span>
                                <span
                                  className={cn(
                                    "flex-shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                                    conv.bookingStatus === "Confirmed"
                                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                      : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  )}
                                >
                                  {conv.bookingStatus}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="mt-1 flex items-center justify-between gap-2">
                            <p className="truncate text-xs text-[hsl(var(--muted-foreground))]">
                              {conv.lastMessage}
                            </p>
                            {conv.unreadCount > 0 && (
                              <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Chat panel */}
              <div
                className={cn(
                  "flex h-full flex-1 flex-col",
                  !showMobileChat ? "hidden md:flex" : "flex"
                )}
              >
                {activeConv ? (
                  <>
                    {/* Chat header */}
                    <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setShowMobileChat(false)}
                          className="mr-1 rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]/40 md:hidden"
                          aria-label={t("messages.backToList")}
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div className="relative">
                          <img
                            src={activeConv.providerAvatar}
                            alt={activeConv.providerName}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-[hsl(var(--border))]"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeConv.providerName)}&background=random`;
                            }}
                          />
                          {activeConv.isOnline && (
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[hsl(var(--card))] bg-green-500" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[hsl(var(--foreground))]">
                              {activeConv.providerName}
                            </span>
                            <span className="flex items-center gap-0.5 text-xs text-amber-500">
                              <Star className="h-3 w-3 fill-amber-500" />
                              {activeConv.providerRating}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                            <span>{activeConv.providerCategory}</span>
                            {activeConv.isOnline ? (
                              <>
                                <Circle className="h-1.5 w-1.5 fill-green-500 text-green-500" />
                                <span className="text-green-600 dark:text-green-400">{t("messages.online")}</span>
                              </>
                            ) : (
                              <span>{t("messages.offline")}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {activeConv.bookingId && (
                          <span className="mr-2 hidden rounded-full border border-[hsl(var(--border))] px-3 py-1 text-xs font-medium text-[hsl(var(--muted-foreground))] sm:inline-flex">
                            {activeConv.bookingId}
                          </span>
                        )}
                        <button
                          className="rounded-xl p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]/40 transition-colors"
                          aria-label={t("messages.callButton")}
                        >
                          <Phone className="h-4 w-4" />
                        </button>
                        <button
                          className="rounded-xl p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]/40 transition-colors"
                          aria-label={t("messages.videoButton")}
                        >
                          <Video className="h-4 w-4" />
                        </button>
                        <button
                          className="rounded-xl p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]/40 transition-colors"
                          aria-label={t("messages.moreOptions")}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Booking context banner */}
                    {activeConv.bookingId && (
                      <div className="border-b border-[hsl(var(--border))] bg-[var(--accent)]/5 px-4 py-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                            <Clock className="h-3.5 w-3.5 text-[var(--accent)]" />
                            <span>
                              {t("messages.bookingRef")}{" "}
                              <span className="font-semibold text-[hsl(var(--foreground))]">
                                {activeConv.bookingId}
                              </span>
                            </span>
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                                activeConv.bookingStatus === "Confirmed"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              )}
                            >
                              {activeConv.bookingStatus}
                            </span>
                          </div>
                          <button className="text-xs font-medium text-[var(--accent)] hover:underline">
                            {t("messages.viewBooking")}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Messages area */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                      <AnimatePresence initial={false}>
                        {activeConv.messages.map((msg, idx) => {
                          const isCustomer = msg.senderId === "customer";
                          const showDate =
                            idx === 0 ||
                            activeConv.messages[idx - 1].timestamp.split(",")[0] !==
                              msg.timestamp.split(",")[0];

                          return (
                            <div key={msg.id}>
                              {showDate && (
                                <div className="flex items-center gap-3 py-2">
                                  <div className="h-px flex-1 bg-[hsl(var(--border))]" />
                                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                                    {msg.timestamp.includes(",")
                                      ? msg.timestamp.split(",")[0]
                                      : "Today"}
                                  </span>
                                  <div className="h-px flex-1 bg-[hsl(var(--border))]" />
                                </div>
                              )}
                              <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className={cn(
                                  "flex items-end gap-2",
                                  isCustomer ? "flex-row-reverse" : "flex-row"
                                )}
                              >
                                {!isCustomer && (
                                  <img
                                    src={activeConv.providerAvatar}
                                    alt={activeConv.providerName}
                                    className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeConv.providerName)}&background=random`;
                                    }}
                                  />
                                )}
                                <div
                                  className={cn(
                                    "max-w-[70%] rounded-2xl px-4 py-2.5 text-sm",
                                    isCustomer
                                      ? "rounded-br-sm bg-[var(--accent)] text-white"
                                      : "rounded-bl-sm bg-[hsl(var(--muted))]/60 text-[hsl(var(--foreground))]"
                                  )}
                                >
                                  <p className="leading-relaxed">{msg.text}</p>
                                  <div
                                    className={cn(
                                      "mt-1 flex items-center gap-1",
                                      isCustomer ? "justify-end" : "justify-start"
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        "text-[10px]",
                                        isCustomer ? "text-white/70" : "text-[hsl(var(--muted-foreground))]"
                                      )}
                                    >
                                      {msg.timestamp.includes(",")
                                        ? msg.timestamp.split(", ")[1]
                                        : msg.timestamp}
                                    </span>
                                    {isCustomer && <MessageStatusIcon status={msg.status} />}
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                          );
                        })}
                      </AnimatePresence>
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input area */}
                    <div className="border-t border-[hsl(var(--border))] p-4">
                      <div className="flex items-center gap-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 focus-within:ring-2 focus-within:ring-[var(--accent)]/30 transition-all">
                        <button
                          className="flex-shrink-0 rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[var(--accent)] transition-colors"
                          aria-label={t("messages.attachFile")}
                        >
                          <Paperclip className="h-4 w-4" />
                        </button>
                        <button
                          className="flex-shrink-0 rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[var(--accent)] transition-colors"
                          aria-label={t("messages.attachImage")}
                        >
                          <Image className="h-4 w-4" />
                        </button>
                        <input
                          ref={inputRef}
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={t("messages.inputPlaceholder")}
                          className="flex-1 bg-transparent text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none"
                        />
                        <button
                          className="flex-shrink-0 rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[var(--accent)] transition-colors"
                          aria-label={t("messages.emoji")}
                        >
                          <Smile className="h-4 w-4" />
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSend}
                          disabled={!newMessage.trim()}
                          className={cn(
                            "flex-shrink-0 rounded-xl p-2 transition-all",
                            newMessage.trim()
                              ? "bg-[var(--accent)] text-white shadow-sm hover:opacity-90"
                              : "bg-[hsl(var(--muted))]/60 text-[hsl(var(--muted-foreground))] cursor-not-allowed"
                          )}
                          aria-label={t("messages.sendButton")}
                        >
                          <Send className="h-4 w-4" />
                        </motion.button>
                      </div>
                      <p className="mt-2 text-center text-[10px] text-[hsl(var(--muted-foreground))]">
                        {t("messages.disclaimer")}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                    <div className="rounded-full bg-[hsl(var(--muted))]/40 p-6">
                      <Send className="h-10 w-10 text-[hsl(var(--muted-foreground))]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[hsl(var(--foreground))]">{t("messages.emptyState")}</p>
                      <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{t("messages.emptyStateHint")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}