"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Wrench, Mail, Phone, MessageCircle as Twitter, Briefcase as Linkedin, Globe as Facebook, Camera as Instagram, ArrowRight } from 'lucide-react';
import { BRAND } from "@/lib/data";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const footerSections = [
  {
    title: "For Customers",
    links: [
      { label: "How It Works", href: "#how-it-works" },
      { label: "Browse Services", href: "/services" },
      { label: "Find Professionals", href: "/find-professionals" },
      { label: "My Dashboard", href: "/customer/dashboard" },
      { label: "My Bookings", href: "/customer/bookings" },
    ],
  },
  {
    title: "For Professionals",
    links: [
      { label: "Join as a Provider", href: "/provider/verification" },
      { label: "Provider Dashboard", href: "/provider/dashboard" },
      { label: "Earnings", href: "/provider/earnings" },
      { label: "Verification", href: "/provider/verification" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Fixly", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Find Professionals", href: "/find-professionals" },
      { label: "Help Centre", href: "/" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/" },
      { label: "Terms of Service", href: "/" },
      { label: "Cookie Policy", href: "/" },
      { label: "Accessibility", href: "/" },
    ],
  },
];

export default function Footer() {
  const t = useTranslations();
  const pathname = usePathname();

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      if (pathname === "/") {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const getHref = (href: string) => {
    if (href.startsWith("#")) {
      return pathname === "/" ? href : `/${href}`;
    }
    return href;
  };

  return (
    <footer className="bg-[var(--foreground)] text-white/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-white/10"
        >
          {/* Brand Column */}
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                Fix<span className="text-[var(--accent)]">ly</span>
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-6 max-w-xs">
              {BRAND.description}
            </p>

            {/* Contact */}
            <div className="flex flex-col gap-2 mb-6">
              <a
                href={`mailto:${BRAND.email}`}
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                <Mail className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                {BRAND.email}
              </a>
              <a
                href={`tel:${BRAND.phone}`}
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                <Phone className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                {BRAND.phone}
              </a>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: BRAND.social.twitter, label: "Twitter" },
                { icon: Instagram, href: BRAND.social.instagram, label: "Instagram" },
                { icon: Facebook, href: BRAND.social.facebook, label: "Facebook" },
                { icon: Linkedin, href: BRAND.social.linkedin, label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow Fixly on ${label}`}
                  className="w-8 h-8 rounded-lg bg-white/8 hover:bg-[var(--primary)] flex items-center justify-center transition-all duration-200 group"
                >
                  <Icon className="w-4 h-4 text-white/60 group-hover:text-white" aria-hidden="true" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <motion.div key={section.title} variants={fadeInUp}>
              <h3 className="text-sm font-semibold text-white mb-4 tracking-wide">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={getHref(link.href)}
                      onClick={(e) => handleAnchorClick(e, link.href)}
                      className="text-sm text-white/55 hover:text-white transition-colors duration-200 hover:translate-x-0.5 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* App Download Banner */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-8 border-b border-white/10"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white mb-1">
                Download the Fixly App
              </p>
              <p className="text-xs text-white/50">
                Book, track, and message your pro from anywhere. Available on iOS and Android.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 rounded-xl text-sm font-medium text-white transition-all duration-200 border border-white/10"
              >
                <span>App Store</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 rounded-xl text-sm font-medium text-white transition-all duration-200 border border-white/10"
              >
                <span>Google Play</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; 2024 Fixly Technologies, Inc. All rights reserved.
          </p>
          <p className="text-xs text-white/30 text-center sm:text-right max-w-md">
            Fixly is a marketplace platform. All professionals are independently verified and carry public liability insurance.
          </p>
        </div>
      </div>
    </footer>
  );
}