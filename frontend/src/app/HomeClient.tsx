"use client";

import Link from "next/link";
import { ArrowRight, Trophy, ShieldCheck, TrendingUp, Users, Sparkles, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HomeClient({ firms }: { firms: any[] }) {
  const hasFirms = firms && firms.length > 0;
  const trendingFirms = hasFirms ? firms.slice(0, 3) : [];
  const topFirms = hasFirms ? firms.slice(0, 5) : [];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto">
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Find Your Edge in <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Prop Trading</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Compare proprietary trading firms using verified data, real trader reviews, and exclusive discount codes to fund your future.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/firms" className="px-8 py-4 bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition-all flex items-center gap-2 text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105">
                Explore Firms <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/ai-match" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all flex items-center gap-2 text-lg backdrop-blur-md hover:scale-105">
                AI Firm Match <Trophy className="h-5 w-5 text-yellow-500" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/10 bg-black/40 backdrop-blur-xl py-12 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { label: 'Total Firms', value: hasFirms ? firms.length : '120+' },
              { label: 'Challenges Listed', value: '1,500+' },
              { label: 'Verified Reviews', value: '50k+' },
              { label: 'Payouts Tracked', value: '$10M+' }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeIn}>
                <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-400 uppercase tracking-widest font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Firms Carousel */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Trending Prop Firms</h2>
              <p className="text-gray-400 text-lg">The most popular firms among our community this week.</p>
            </div>
          </motion.div>
          
          {hasFirms ? (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingFirms.map((firm: any) => (
                <motion.div key={firm.id} variants={fadeIn} whileHover={{ y: -8, scale: 1.02 }} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 transition-all shadow-xl group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 bg-black/50 border border-white/10 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-inner">
                      {firm.logo && firm.logo.startsWith('http') ? <img src={firm.logo} alt={firm.name} className="max-w-full max-h-full object-contain p-2" /> : firm.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/30">Trending</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">{firm.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm mb-6">
                    {'★'.repeat(5)} <span className="text-gray-400 ml-1">({firm.rating || 4.9}/5)</span>
                  </div>
                  <div className="space-y-3 text-sm text-gray-400 mb-8">
                    <div className="flex justify-between border-b border-white/5 pb-2"><span>Max Allocation</span> <span className="text-white font-medium">${firm.max_allocation ? firm.max_allocation.toLocaleString() : 'Varies'}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-2"><span>Profit Split</span> <span className="text-white font-medium">Up to 90%</span></div>
                    <div className="flex justify-between"><span>Platforms</span> <span className="text-white font-medium truncate max-w-[120px] text-right">{firm.platforms?.join(', ') || 'Various'}</span></div>
                  </div>
                  <Link href={`/firms/${firm.slug}`} className="block w-full text-center py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors border border-white/5 group-hover:border-white/20">
                    View Details
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <p className="text-gray-400 text-lg">Database connection pending. Please configure MongoDB.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
