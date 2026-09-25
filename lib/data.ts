export const BRAND = {
  name: "Fixly",
  tagline: "Your Home, In Good Hands.",
  description:
    "Connecting homeowners with trusted local professionals since 2022. Available across 200+ cities in the United States.",
  email: "support@fixly.com",
  phone: "1-800-FIXLY-01",
  social: {
    twitter: "https://twitter.com/fixly",
    instagram: "https://instagram.com/fixly",
    facebook: "https://facebook.com/fixly",
    linkedin: "https://linkedin.com/company/fixly",
  },
} as const;

export interface NavLink {
  label: string;
  href: string;
  key: string;
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/", key: "home" },
  { label: "Services", href: "/services", key: "services" },
  { label: "Find Professionals", href: "/find-professionals", key: "findProfessionals" },
  { label: "How It Works", href: "#how-it-works", key: "howItWorks" },
  { label: "For Providers", href: "/provider/verification", key: "forProviders" },
];

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  slug: string;
  count: number;
}

export interface Provider {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  experience: number;
  verified: boolean;
  priceFrom: number;
  priceUnit: string;
  distance: number;
  availability: string;
  location: string;
  bio: string;
}

export interface Booking {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  service: string;
  status: "upcoming" | "active" | "completed" | "cancelled";
  date: string;
  time: string;
  address: string;
  price: number;
  rating?: number;
}

export const mockProviders: Provider[] = [
  {
    id: "marcus-rivera",
    name: "Marcus Rivera",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus%20Rivera",
    specialty: "Licensed Master Electrician",
    rating: 4.92,
    reviewCount: 318,
    experience: 11,
    verified: true,
    priceFrom: 85,
    priceUnit: "hr",
    distance: 4.3,
    availability: "Available Today",
    location: "Austin, TX",
    bio: "Licensed master electrician with 11 years of residential and commercial experience.",
  },
  {
    id: "aisha-okonkwo",
    name: "Aisha Okonkwo",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha%20Okonkwo",
    specialty: "Plumbing Expert",
    rating: 4.95,
    reviewCount: 278,
    experience: 9,
    verified: true,
    priceFrom: 75,
    priceUnit: "hr",
    distance: 2.7,
    availability: "Available Tomorrow",
    location: "Austin, TX",
    bio: "Known for fast leak detection and same-day pipe repairs.",
  },
  {
    id: "james-tran",
    name: "James Tran",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James%20Tran",
    specialty: "HVAC Specialist",
    rating: 4.93,
    reviewCount: 401,
    experience: 14,
    verified: true,
    priceFrom: 90,
    priceUnit: "hr",
    distance: 3.8,
    availability: "Available Today",
    location: "Austin, TX",
    bio: "Certified for all major AC brands including Daikin, Mitsubishi, and LG.",
  },
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya%20Sharma",
    specialty: "Professional Cleaner",
    rating: 4.98,
    reviewCount: 524,
    experience: 6,
    verified: true,
    priceFrom: 55,
    priceUnit: "hr",
    distance: 1.5,
    availability: "Available This Weekend",
    location: "Austin, TX",
    bio: "Specialises in deep cleans and end-of-lease cleaning with eco-friendly supplies.",
  },
];

export const mockBookings: Booking[] = [
  {
    id: "BK-2024-001",
    providerId: "marcus-rivera",
    providerName: "Marcus Rivera",
    providerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus%20Rivera",
    service: "Electrical Panel Upgrade",
    status: "upcoming",
    date: "2024-07-18",
    time: "10:00 AM",
    address: "14/82 Crown Street, Austin TX 78701",
    price: 1200,
  },
  {
    id: "BK-2024-002",
    providerId: "aisha-okonkwo",
    providerName: "Aisha Okonkwo",
    providerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha%20Okonkwo",
    service: "Pipe Leak Repair",
    status: "completed",
    date: "2024-07-10",
    time: "2:00 PM",
    address: "14/82 Crown Street, Austin TX 78701",
    price: 225,
    rating: 5,
  },
  {
    id: "BK-2024-003",
    providerId: "priya-sharma",
    providerName: "Priya Sharma",
    providerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya%20Sharma",
    service: "Deep Home Cleaning",
    status: "completed",
    date: "2024-07-05",
    time: "9:00 AM",
    address: "14/82 Crown Street, Austin TX 78701",
    price: 165,
    rating: 5,
  },
];