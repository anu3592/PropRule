import Link from 'next/link';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { getChallenges } from '../../lib/api';

export default async function ChallengesPage() {
  const challenges = await getChallenges();
  const hasChallenges = challenges && challenges.length > 0;

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Compare Prop Firm Challenges</h1>
        <p className="text-gray-400">Filter and compare evaluation programs across the industry.</p>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
        <div className="flex flex-wrap items-end gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-400 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search firm or challenge..." className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-white" />
            </div>
          </div>
          
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-400 mb-1">Account Size</label>
            <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
              <option>All Sizes</option>
              <option>$10k - $25k</option>
              <option>$50k</option>
              <option>$100k</option>
              <option>$200k+</option>
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
            <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
              <option>All Types</option>
              <option>1-Step</option>
              <option>2-Step</option>
              <option>3-Step</option>
              <option>Instant Funding</option>
            </select>
          </div>

          <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-6 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors text-white">
            <Filter className="h-4 w-4" /> More Filters
          </button>
        </div>
      </div>

      <div className="bg-gray-900/30 rounded-xl overflow-hidden border border-gray-800 flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900 text-xs text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-4 font-semibold cursor-pointer hover:text-white">Firm & Program <ArrowUpDown className="inline h-3 w-3 ml-1" /></th>
                <th className="py-4 px-4 font-semibold cursor-pointer hover:text-white">Size <ArrowUpDown className="inline h-3 w-3 ml-1" /></th>
                <th className="py-4 px-4 font-semibold cursor-pointer hover:text-white">Profit Target <ArrowUpDown className="inline h-3 w-3 ml-1" /></th>
                <th className="py-4 px-4 font-semibold cursor-pointer hover:text-white">Max Loss <ArrowUpDown className="inline h-3 w-3 ml-1" /></th>
                <th className="py-4 px-4 font-semibold cursor-pointer hover:text-white">Daily Loss <ArrowUpDown className="inline h-3 w-3 ml-1" /></th>
                <th className="py-4 px-4 font-semibold cursor-pointer hover:text-white">Profit Split <ArrowUpDown className="inline h-3 w-3 ml-1" /></th>
                <th className="py-4 px-4 font-semibold cursor-pointer hover:text-white">Price <ArrowUpDown className="inline h-3 w-3 ml-1" /></th>
                <th className="py-4 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {!hasChallenges && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    No challenges available. Please ensure backend is running.
                  </td>
                </tr>
              )}
              {hasChallenges && challenges.map((challenge) => (
                <tr key={challenge.id} className="border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                        {challenge.firm?.logo && challenge.firm?.logo !== 'Logo' ? <img src={challenge.firm.logo} alt={challenge.firm.name} className="w-full h-full object-cover"/> : (challenge.firm?.name?.substring(0, 2).toUpperCase() || 'NA')}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{challenge.firm?.name || 'Unknown Firm'} {challenge.name}</div>
                        <div className="text-xs text-gray-500">{challenge.challenge_type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-white">${challenge.account_size.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-300">{challenge.profit_target_pct}</div>
                  </td>
                  <td className="py-4 px-4 font-medium text-red-400">{challenge.max_total_loss_pct}%</td>
                  <td className="py-4 px-4 font-medium text-red-400">{challenge.max_daily_loss_pct ? `${challenge.max_daily_loss_pct}%` : 'N/A'}</td>
                  <td className="py-4 px-4 font-medium text-green-400">Up to {challenge.profit_split_pct || 80}%</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{challenge.fee} {challenge.fee_currency}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Link href={`/firms/${challenge.firm?.slug || ''}`} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded transition-colors inline-block">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-800 flex items-center justify-between">
          <div className="text-sm text-gray-400">Showing {hasChallenges ? challenges.length : 0} challenges</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-gray-800 text-gray-400 rounded hover:text-white disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700" disabled={!hasChallenges}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
