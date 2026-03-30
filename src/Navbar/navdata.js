import "tailwindcss";
import { 
  Home, Globe, Map, Briefcase, ShieldAlert, 
  Film, Trophy, Activity, Landmark, Plane, Lock, Tv, Zap, Contact2, User,
  ShieldCheck, FileText, MapPin, HelpCircle 
} from 'lucide-react';

import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaTelegramPlane } from 'react-icons/fa';


export const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Global', path: '/category/global', icon: Globe },
  { label: 'National', path: '/category/national', icon: Map },
  { label: 'State', path: '/category/state', icon: Map },
  { label: 'Business', path: '/category/business', icon: Briefcase },
  { label: 'Crime', path: '/category/crime', icon: ShieldAlert },
  { label: 'Entertainment', path: '/category/entertainment', icon: Film },
  { label: 'Sports', path: '/category/sports', icon: Trophy },
  { label: 'Health', path: '/category/health', icon: Activity },
  { label: 'Politics', path: '/category/politics', icon: Landmark },
  { label: 'Travel', path: '/category/travel', icon: Plane },
  { label: 'Admin', path: '/admin', icon: Lock, isAdmin: true },
  { label: 'Live TV', path: '/live-tv', icon: Tv },
    { label: 'Trending', path: '/trending', icon: Zap },
    { label: 'ID Card', path: '/id-card', icon: Contact2 },
    { label: 'Login', path: '/login', icon: User },
];

export const socialLinks = [
  { icon: FaFacebookF, href: 'https://facebook.com', label: 'Facebook' },
  { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FaYoutube, href: 'https://youtube.com', label: 'Youtube' },
  { icon: FaTelegramPlane, href: 'https://telegram.org', label: 'Telegram' },
];

// NEW: Footer Information Links
export const footerInfo = [
  { label: 'Privacy Policy', path: '/privacy', icon: ShieldCheck },
  { label: 'Terms & Conditions', path: '/terms', icon: FileText },
  { label: 'Locations', path: '/locations', icon: MapPin },
  { label: 'FAQ', path: '/faq', icon: HelpCircle },
];