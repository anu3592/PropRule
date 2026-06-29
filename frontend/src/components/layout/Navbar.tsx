"use client";

import Link from 'next/link';
import { Menu, Search, X, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user from local storage");
        }
      } else {
        setUser(null);
      }
    };
    
    checkUser();
    window.addEventListener("user-auth", checkUser);
    
    return () => {
      window.removeEventListener("user-auth", checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    
    // Force a full page reload to sync auth state across the app
    window.location.href = "/login";
  };

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
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  <User className="h-5 w-5" />
                </button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#1e293b] border border-gray-700 rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm font-medium text-white truncate">{user.name || "User"}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center text-xs text-yellow-500 font-medium">
                        Points: {user.loyalty_points || 0}
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700/50 hover:text-red-300 transition-colors flex items-center gap-2 mt-1"
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Log In</Link>
                <Link href="/signup" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors">Sign Up</Link>
              </>
            )}
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
            {user ? (
              <div className="p-2">
                <div className="mb-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-sm font-medium text-white">{user.name || "User"}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                  <p className="text-xs text-yellow-500 mt-1">Points: {user.loyalty_points || 0}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white p-2">Log In</Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="text-blue-500 hover:text-blue-400 p-2">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
