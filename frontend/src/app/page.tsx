import Link from "next/link";
import { ArrowRight, Trophy, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { getFirms } from "../lib/api";

export default async function Home() {
  const firms = await getFirms();
  
  // Use real data if available, fallback to mock if empty
  const hasFirms = firms && firms.length > 0;
  const trendingFirms = hasFirms ? firms.slice(0, 3) : [];
  const topFirms = hasFirms ? firms.slice(0, 5) : [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Find Your Edge in <span className="text-blue-500">Prop Trading</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10">
            Compare proprietary trading firms using verified data, real trader reviews, and exclusive discount codes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/firms" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center gap-2 text-lg">
              Compare Firms <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/ai-match" className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2 text-lg">
              AI Firm Match <Trophy className="h-5 w-5 text-yellow-500" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-gray-800 bg-gray-900/50 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">{hasFirms ? firms.length : '120+'}</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Total Firms</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">1,500+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Challenges Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50k+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Verified Reviews</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">$10M+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Payouts Tracked</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Firms Carousel / Grid placeholder */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Trending Prop Firms</h2>
              <p className="text-gray-400">The most popular firms among our community this week.</p>
            </div>
            <div className="hidden sm:flex bg-gray-800 p-1 rounded-lg">
              <button className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm font-medium">Forex</button>
              <button className="px-4 py-2 text-gray-400 hover:text-white rounded-md text-sm font-medium transition-colors">Futures</button>
              <button className="px-4 py-2 text-gray-400 hover:text-white rounded-md text-sm font-medium transition-colors">Crypto</button>
            </div>
          </div>
          
          {hasFirms ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingFirms.map((firm) => (
                <div key={firm.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center font-bold text-xl text-white">
                      {firm.logo ? <img src={firm.logo} alt={firm.name} className="max-w-full max-h-full object-contain" /> : firm.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="bg-blue-500/10 text-blue-500 text-xs font-bold px-2 py-1 rounded">Trending</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{firm.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm mb-4">
                    {'★'.repeat(5)} <span className="text-gray-400 ml-1">(4.9/5)</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-400 mb-6">
                    <div className="flex justify-between"><span>Max Allocation:</span> <span className="text-white font-medium">${firm.max_allocation ? firm.max_allocation.toLocaleString() : 'Varies'}</span></div>
                    <div className="flex justify-between"><span>Profit Split:</span> <span className="text-white font-medium">Up to 90%</span></div>
                    <div className="flex justify-between"><span>Platform:</span> <span className="text-white font-medium truncate max-w-[120px] text-right">{firm.platforms.join(', ') || 'Various'}</span></div>
                  </div>
                  <Link href={`/firms/${firm.slug}`} className="block w-full text-center py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-900/50 rounded-xl border border-gray-800">
              <p className="text-gray-400">Database connection pending. Please start backend server.</p>
            </div>
          )}
        </div>
      </section>

      {/* Top Ranked Firms Table */}
      <section className="py-20 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Top Ranked Prop Firms</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-sm text-gray-400 uppercase tracking-wider">
                  <th className="py-4 px-4 font-semibold">Rank & Firm</th>
                  <th className="py-4 px-4 font-semibold">Rating</th>
                  <th className="py-4 px-4 font-semibold">Max Allocation</th>
                  <th className="py-4 px-4 font-semibold">Profit Split</th>
                  <th className="py-4 px-4 font-semibold">Promo</th>
                  <th className="py-4 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {hasFirms ? topFirms.map((firm, i) => (
                  <tr key={firm.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors group">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500 font-bold w-6 text-center">#{i + 1}</span>
                        <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-xs text-white">
                           {firm.logo ? <img src={firm.logo} alt={firm.name} className="max-w-full max-h-full object-contain" /> : firm.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white">{firm.name}</div>
                          <div className="text-xs text-gray-500">Since {firm.founded_year || 'Unknown'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-yellow-500">★ 4.8</div>
                      <div className="text-xs text-gray-500">12k reviews</div>
                    </td>
                    <td className="py-4 px-4 font-medium">${firm.max_allocation ? firm.max_allocation.toLocaleString() : 'Varies'}</td>
                    <td className="py-4 px-4 font-medium">90%</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded">10% OFF</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link href={`/firms/${firm.slug}`} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                        Review
                      </Link>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">No data available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-8 text-center">
            <Link href="/firms" className="text-blue-500 hover:text-blue-400 font-medium flex items-center justify-center gap-2">
              View All {hasFirms ? firms.length : '120+'} Firms <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ & Newsletter */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
          <p className="text-gray-400 mb-8">Get the latest prop firm news, exclusive discount codes, and new challenge releases straight to your inbox.</p>
          <form className="flex max-w-md mx-auto gap-2">
            <input type="email" placeholder="Enter your email" className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}
