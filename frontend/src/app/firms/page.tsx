import Link from 'next/link';
import { Search, Filter, Star, CheckCircle, Globe } from 'lucide-react';
import { getFirms } from '../../lib/api';

export default async function FirmsDirectory() {
  const firms = await getFirms();
  const hasFirms = firms && firms.length > 0;

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Prop Firm Directory</h1>
          <p className="text-gray-400">Browse and compare all verified proprietary trading firms.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search firms..." className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6 bg-gray-900/50 p-6 rounded-xl border border-gray-800 h-fit sticky top-20">
          <div>
            <h3 className="font-semibold mb-3 text-white">Market Type</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white"><input type="checkbox" className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500" /> Forex</label>
              <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white"><input type="checkbox" className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500" /> Futures</label>
              <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white"><input type="checkbox" className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500" /> Crypto</label>
            </div>
          </div>
          <hr className="border-gray-800" />
          <div>
            <h3 className="font-semibold mb-3 text-white">Trading Platform</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white"><input type="checkbox" /> MetaTrader 4 (MT4)</label>
              <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white"><input type="checkbox" /> MetaTrader 5 (MT5)</label>
              <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white"><input type="checkbox" /> cTrader</label>
              <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white"><input type="checkbox" /> DXtrade</label>
            </div>
          </div>
          <hr className="border-gray-800" />
          <div>
            <h3 className="font-semibold mb-3 text-white">Max Allocation</h3>
            <select className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-sm text-white">
              <option>Any Size</option>
              <option>$100k+</option>
              <option>$300k+</option>
              <option>$500k+</option>
              <option>$1M+</option>
            </select>
          </div>
        </div>

        {/* Firm List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between text-sm text-gray-400 mb-4">
            <span>Showing {hasFirms ? firms.length : 0} results</span>
            <div className="flex items-center gap-2">
              <span>Sort by:</span>
              <select className="bg-transparent font-medium text-white focus:outline-none">
                <option>Highest Rated</option>
                <option>Most Popular</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {!hasFirms && (
            <div className="text-center py-20 bg-gray-900/50 rounded-xl border border-gray-800">
              <p className="text-gray-400">Database connection pending. Please start backend server.</p>
            </div>
          )}

          {hasFirms && firms.map((firm) => (
            <div key={firm.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors flex flex-col sm:flex-row gap-6">
              <div className="sm:w-1/4 flex flex-col items-center justify-center text-center gap-2 border-r border-gray-800/50 pr-4">
                <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center text-sm font-bold text-white">
                  {firm.logo ? <img src={firm.logo} alt={firm.name} className="max-w-full max-h-full object-contain" /> : firm.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{firm.name}</h3>
                  <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1"><Globe className="h-3 w-3" /> {firm.country || 'Global'}</div>
                </div>
                <div className="flex items-center gap-1 text-yellow-500 mt-2">
                  <Star className="h-4 w-4 fill-yellow-500" /> <span className="font-bold">4.8</span>
                </div>
                <div className="text-xs text-gray-500">12k reviews</div>
              </div>
              
              <div className="sm:w-2/4 flex flex-col justify-center">
                <div className="flex flex-wrap gap-2 mb-4">
                  {firm.assets && firm.assets.map((asset) => (
                    <span key={asset} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md">{asset}</span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="text-gray-400">Programs: <span className="text-white ml-1">Various</span></div>
                  <div className="text-gray-400">Max Alloc: <span className="text-white ml-1">${firm.max_allocation ? firm.max_allocation.toLocaleString() : 'Varies'}</span></div>
                  <div className="text-gray-400">Profit Split: <span className="text-white ml-1">Up to 90%</span></div>
                  <div className="text-gray-400 flex items-center">Platforms: <span className="text-white ml-1 truncate max-w-[100px]">{firm.platforms.join(', ')}</span></div>
                </div>
              </div>
              
              <div className="sm:w-1/4 flex flex-col justify-center items-end gap-3 border-l border-gray-800/50 pl-4">
                <div className="text-right w-full">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Promo Code</div>
                  <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono px-3 py-1.5 rounded text-sm font-bold text-center w-full">
                    {firm.offers && firm.offers.length > 0 ? firm.offers[0].promo_code : 'N/A'}
                  </div>
                </div>
                <Link href={`/firms/${firm.slug}`} className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-center rounded-lg font-medium transition-colors">
                  Read Review
                </Link>
              </div>
            </div>
          ))}

          {hasFirms && (
            <div className="flex justify-center mt-8">
              <button className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium">Load More</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
