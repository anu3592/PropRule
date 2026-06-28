"use client";

import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const ALL_POSTS = [
  { title: 'FTMO Updates MetaTrader 5 Conditions for Crypto Traders', category: 'Firm Updates', date: 'Oct 20, 2026', slug: 'ftmo-updates-mt5-crypto' },
  { title: '5 Psychological Traps to Avoid During Your Evaluation', category: 'Trading Guides', date: 'Oct 15, 2026', slug: 'psychological-traps-evaluation' },
  { title: 'Comparing the Best Instant Funding Prop Firms', category: 'Industry News', date: 'Oct 12, 2026', slug: 'best-instant-funding-prop-firms' },
  { title: 'How to Master the 30% Consistency Rule', category: 'Trading Guides', date: 'Oct 08, 2026', slug: 'master-consistency-rule' },
  { title: 'Apex Trader Funding Announces New Rithmic Integration', category: 'Firm Updates', date: 'Oct 05, 2026', slug: 'apex-rithmic-integration' },
  { title: 'US Regulatory Changes: How They Impact Retail Traders', category: 'Industry News', date: 'Sep 28, 2026', slug: 'us-regulatory-changes-retail' },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All Posts");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = ALL_POSTS.filter(post => {
    const matchesCategory = activeCategory === "All Posts" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col min-h-screen">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Prop Trading News & Guides</h1>
        <p className="text-xl text-gray-400 mb-8">Stay updated with the latest industry shifts, firm interviews, educational guides, and platform updates.</p>
        
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search articles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-full pl-12 pr-6 py-3 focus:outline-none focus:border-blue-500 text-white shadow-lg transition-all" 
          />
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 mb-8 justify-center">
        {["All Posts", "Industry News", "Firm Updates", "Trading Guides"].map((category) => (
          <button 
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
              activeCategory === category 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-gray-900 text-gray-400 hover:text-white border-gray-800'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured Post - Only show if no search/filter active */}
      {activeCategory === "All Posts" && searchQuery === "" && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-12 group hover:border-gray-700 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="h-64 md:h-auto bg-gray-800 relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-600">Featured Image</div>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-xs font-medium mb-4">
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">Industry News</span>
                <span className="text-gray-400 flex items-center gap-1"><Calendar className="h-3 w-3" /> Oct 24, 2026</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors cursor-pointer">
                The Evolution of Prop Trading: What to Expect in 2027
              </h2>
              <p className="text-gray-400 mb-6 line-clamp-3">
                As regulatory frameworks tighten and technology advances, proprietary trading firms are shifting their models. We sat down with industry leaders to discuss the transition from demo to live environments and the future of trader evaluation.
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center"><User className="h-4 w-4 text-gray-400" /></div>
                  <span className="text-sm font-medium text-gray-300">Alex Thompson</span>
                </div>
                <Link href="/blog/evolution-of-prop-trading" className="text-blue-500 hover:text-blue-400 font-medium flex items-center gap-1 text-sm">
                  Read Full Article <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col group hover:border-gray-700 transition-colors">
              <div className="h-48 bg-gray-800 relative">
                 <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-xs">Image Placeholder</div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs font-medium mb-3">
                  <span className="text-blue-400">{post.category}</span>
                  <span className="text-gray-500 flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors cursor-pointer">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-1">
                  A brief excerpt from the article giving readers an idea of what to expect when they click through to read the full content.
                </p>
                <Link href={`/blog/${post.slug}`} className="text-blue-500 hover:text-blue-400 font-medium flex items-center gap-1 text-sm mt-auto">
                  Read More <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-400 text-lg">No articles found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {filteredPosts.length > 0 && (
        <div className="flex justify-center mt-12">
          <button className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium border border-gray-700">Load More Articles</button>
        </div>
      )}
    </div>
  );
}
