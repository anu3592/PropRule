import { LineChart, Activity, DollarSign, Clock, Filter, Search } from 'lucide-react';
import Link from 'next/link';
import { getPayouts } from '../../lib/api';

export default async function PayoutsPage() {
  const payouts = await getPayouts();
  const hasPayouts = payouts && payouts.length > 0;

  // Aggregate stats if payouts exist (simple sum for demo)
  const totalAmount = hasPayouts ? payouts.reduce((sum, p) => sum + p.amount, 0) : 0;
  const largestPayout = hasPayouts ? Math.max(...payouts.map(p => p.amount)) : 0;

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Prop Firm Payouts Tracker</h1>
        <p className="text-gray-400">Track verified payout times, sizes, and reliability across the industry.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign className="h-24 w-24 text-green-500" />
          </div>
          <div className="text-gray-400 text-sm font-medium mb-2">Total Tracked</div>
          <div className="text-3xl font-bold text-white mb-1">${totalAmount > 0 ? (totalAmount/1000).toFixed(1) + 'k+' : '0'}</div>
          <div className="text-xs text-green-500 font-medium">+15% this month</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity className="h-24 w-24 text-blue-500" />
          </div>
          <div className="text-gray-400 text-sm font-medium mb-2">Total Payouts</div>
          <div className="text-3xl font-bold text-white mb-1">{hasPayouts ? payouts.length : 0}</div>
          <div className="text-xs text-green-500 font-medium">+120 this week</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clock className="h-24 w-24 text-purple-500" />
          </div>
          <div className="text-gray-400 text-sm font-medium mb-2">Avg Processing Time</div>
          <div className="text-3xl font-bold text-white mb-1">36 Hours</div>
          <div className="text-xs text-gray-500 font-medium">Across all firms</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <LineChart className="h-24 w-24 text-yellow-500" />
          </div>
          <div className="text-gray-400 text-sm font-medium mb-2">Largest Payout</div>
          <div className="text-3xl font-bold text-white mb-1">${largestPayout > 0 ? largestPayout.toLocaleString() : '0'}</div>
          <div className="text-xs text-blue-400 font-medium hover:underline cursor-pointer">View proof</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Last 7 Days</button>
          <button className="px-4 py-2 bg-gray-900 text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-colors">Last 30 Days</button>
          <button className="px-4 py-2 bg-gray-900 text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-colors">All Time</button>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search firm..." className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-gray-900">
              <tr className="border-b border-gray-800 text-xs text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Firm</th>
                <th className="py-4 px-6 font-semibold text-right">Payout ($)</th>
                <th className="py-4 px-6 font-semibold text-right">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {!hasPayouts && (
                 <tr><td colSpan={4} className="py-8 text-center text-gray-500">No payouts tracked or database offline.</td></tr>
              )}
              {hasPayouts && payouts.map((payout) => (
                <tr key={payout.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                        {payout.firm?.logo && payout.firm.logo !== 'Logo' ? <img src={payout.firm.logo} alt={payout.firm.name} className="w-full h-full object-contain" /> : (payout.firm?.name?.substring(0, 2).toUpperCase() || 'F')}
                      </div>
                      <Link href={`/firms/${payout.firm?.slug || ''}`} className="font-bold text-white hover:text-blue-400 transition-colors">
                        {payout.firm?.name || 'Unknown Firm'}
                      </Link>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-green-500">${payout.amount.toLocaleString()}</td>
                  <td className="py-4 px-6 text-right text-gray-300">
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded capitalize">{payout.status}</span>
                  </td>
                  <td className="py-4 px-6 text-right text-gray-300">{new Date(payout.payout_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
