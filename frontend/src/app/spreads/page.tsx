import { Search, Filter, LineChart, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SpreadsPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Live Spreads Tracker</h1>
        <p className="text-gray-400">Compare live, average, and raw spreads across major prop firms during NY and London sessions.</p>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
        <div className="flex flex-wrap items-end gap-4 mb-4">
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-400 mb-1">Asset Class</label>
            <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
              <option>Forex Majors</option>
              <option>Forex Minors</option>
              <option>Indices</option>
              <option>Commodities</option>
              <option>Crypto</option>
            </select>
          </div>
          
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-400 mb-1">Instrument</label>
            <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
              <option>EUR/USD</option>
              <option>GBP/USD</option>
              <option>USD/JPY</option>
              <option>AUD/USD</option>
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-400 mb-1">Session</label>
            <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
              <option>Current (Live)</option>
              <option>New York (Avg)</option>
              <option>London (Avg)</option>
              <option>Asian (Avg)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col justify-center items-center text-center">
          <div className="text-gray-400 text-sm mb-2">Tightest Spread (EUR/USD)</div>
          <div className="text-4xl font-bold text-white mb-2">0.0 pips</div>
          <div className="text-sm font-medium text-blue-400">FTMO</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col justify-center items-center text-center">
          <div className="text-gray-400 text-sm mb-2">Industry Average</div>
          <div className="text-4xl font-bold text-white mb-2">0.4 pips</div>
          <div className="text-sm font-medium text-gray-500 flex items-center gap-1"><TrendingDown className="h-4 w-4 text-green-500" /> -0.1 from yesterday</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col justify-center items-center text-center">
          <div className="text-gray-400 text-sm mb-2">Highest Commission</div>
          <div className="text-4xl font-bold text-white mb-2">$7.00</div>
          <div className="text-sm font-medium text-red-400 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> Per lot round turn</div>
        </div>
      </div>

      <div className="bg-gray-900/30 rounded-xl overflow-hidden border border-gray-800 flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900 text-xs text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-4 font-semibold w-1/4">Firm</th>
                <th className="py-4 px-4 font-semibold text-right">Spread (EUR/USD)</th>
                <th className="py-4 px-4 font-semibold text-right">Commission (per lot)</th>
                <th className="py-4 px-4 font-semibold text-right">Total Cost (Pips)</th>
                <th className="py-4 px-4 font-semibold text-center">Trend</th>
              </tr>
            </thead>
            <tbody>
              {[
                { firm: 'FTMO', spread: 0.1, comm: 3.00, total: 0.4 },
                { firm: 'Apex Trader Funding', spread: 0.2, comm: 2.00, total: 0.4 },
                { firm: 'Funding Pips', spread: 0.0, comm: 4.00, total: 0.4 },
                { firm: 'Topstep', spread: 0.3, comm: 0.00, total: 0.3 },
                { firm: 'MyFundedFX', spread: 0.2, comm: 3.00, total: 0.5 },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-[10px] font-bold text-white">Logo</div>
                      <Link href={`/firms/${row.firm.toLowerCase().replace(/\s+/g, '-')}`} className="font-bold text-white hover:text-blue-400 transition-colors">
                        {row.firm}
                      </Link>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-medium text-white">{row.spread.toFixed(1)}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-gray-300">${row.comm.toFixed(2)}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-bold text-blue-400">{row.total.toFixed(1)}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {Math.random() > 0.5 ? <TrendingDown className="h-5 w-5 text-green-500 mx-auto" /> : <TrendingUp className="h-5 w-5 text-red-500 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-800 text-xs text-gray-500 text-center">
          *Total cost is calculated by converting commission to pips (assuming $10/pip standard lot) and adding to the raw spread.
        </div>
      </div>
    </div>
  );
}
