"use client";

import Link from 'next/link';
import { Menu, Search, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/firms", label: "Firms" },
    { href: "/challenges", label: "Challenges" },
    { href: "/offers", label: "Offers" },
    { href: "/reviews", label: "Reviews" },
    { href: "/payouts", label: "Payouts" },
    { href: "/rules", label: "Rules" },
    { href: "/spreads", label: "Spreads" },
    { href: "/calendar", label: "Calendar" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#0f172a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0f172a]/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-start">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <span className="text-xl font-bold text-white tracking-tight">Prop<span className="text-blue-500">Rules</span></span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-x-5 text-sm font-medium text-gray-300">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="hover:text-white transition-colors whitespace-nowrap">{link.label}</Link>
            ))}
            <Link href="/ai-match" className="text-yellow-500 hover:text-yellow-400 transition-colors whitespace-nowrap">AI Match</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              alert("Global search will be integrated soon! For now, try searching directly on the Blog page.");
            }}
            className="text-gray-300 hover:text-white transition-colors hidden sm:block relative"
            title="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Log In</Link>
            <Link href="/signup" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors">Sign Up</Link>
          </div>
          <button 
            className="lg:hidden text-gray-300 hover:text-white transition-colors ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-800 bg-[#0f172a] p-4 absolute w-full shadow-xl">
          <div className="flex flex-col space-y-4 text-sm font-medium text-gray-300">
            {navLinks.map(link => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="hover:text-white transition-colors p-2 rounded hover:bg-gray-800/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link 
              href="/ai-match" 
              className="text-yellow-500 hover:text-yellow-400 transition-colors p-2 rounded hover:bg-gray-800/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              AI Match
            </Link>
            <div className="h-px bg-gray-800 w-full my-2"></div>
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white p-2">Log In</Link>
            <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="text-blue-500 hover:text-blue-400 p-2">Sign Up</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
