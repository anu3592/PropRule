import { Search, Filter, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function RulesPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Prop Firm Rules Comparison</h1>
        <p className="text-gray-400">Compare trading rules, restrictions, and permitted strategies across all proprietary trading firms.</p>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
        <div className="flex flex-wrap items-end gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-400 mb-1">Search Firm</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search firm..." className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-white" />
            </div>
          </div>
          
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-400 mb-1">Rule Category</label>
            <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
              <option>All Rules</option>
              <option>News Trading</option>
              <option>Weekend Holding</option>
              <option>EAs / Bots</option>
              <option>Copy Trading</option>
              <option>Consistency</option>
            </select>
          </div>

          <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-6 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors text-white">
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>
      </div>

      <div className="bg-gray-900/30 rounded-xl overflow-hidden border border-gray-800 flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900 text-xs text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-4 font-semibold w-1/4">Firm</th>
                <th className="py-4 px-4 font-semibold text-center">News Trading</th>
                <th className="py-4 px-4 font-semibold text-center">Weekend Hold</th>
                <th className="py-4 px-4 font-semibold text-center">EAs / Bots</th>
                <th className="py-4 px-4 font-semibold text-center">Copy Trading</th>
                <th className="py-4 px-4 font-semibold text-center">Consistency Rule</th>
              </tr>
            </thead>
            <tbody>
              {[
                { firm: 'FTMO', news: true, weekend: false, eas: true, copy: 'Own accounts only', consistency: 'None' },
                { firm: 'Apex Trader Funding', news: true, weekend: false, eas: true, copy: 'Allowed', consistency: '30% Rule' },
                { firm: 'Funding Pips', news: true, weekend: true, eas: true, copy: 'Allowed', consistency: 'None' },
                { firm: 'Topstep', news: false, weekend: false, eas: false, copy: 'Not Allowed', consistency: 'None' },
                { firm: 'MyFundedFX', news: true, weekend: true, eas: true, copy: 'Own accounts only', consistency: 'None' },
                { firm: 'The Funded Trader', news: false, weekend: true, eas: true, copy: 'Allowed', consistency: 'None' },
                { firm: 'Alpha Capital Group', news: true, weekend: false, eas: true, copy: 'Allowed', consistency: 'None' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-[10px] font-bold text-white">Logo</div>
                      <span className="font-bold text-white text-sm">{row.firm}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {row.news ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-500 mx-auto" />}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {row.weekend ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-500 mx-auto" />}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {row.eas ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-500 mx-auto" />}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm text-gray-300">{row.copy}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm text-gray-300">{row.consistency}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
