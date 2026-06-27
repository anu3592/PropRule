import { Calendar, Filter, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CalendarPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">High Impact News Calendar</h1>
        <p className="text-gray-400">Track macroeconomic events that may trigger prop firm news trading restrictions.</p>
      </div>

      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 flex items-start gap-4">
        <AlertTriangle className="h-6 w-6 text-red-500 shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-red-500 mb-1">News Trading Rules Warning</h3>
          <p className="text-sm text-gray-300">
            Many proprietary trading firms prohibit opening or closing trades 2 minutes before and after high-impact news releases. 
            Check our <Link href="/rules" className="text-blue-400 hover:underline">firm rules comparison</Link> to ensure compliance.
          </p>
        </div>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Today</button>
            <button className="px-4 py-2 bg-gray-900 text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-colors">Tomorrow</button>
            <button className="px-4 py-2 bg-gray-900 text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-colors">This Week</button>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="w-full sm:w-48 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
              <option>Impact: High Only (Red)</option>
              <option>Impact: Medium & High</option>
              <option>All Events</option>
            </select>
            <select className="w-full sm:w-32 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
              <option>Currency: All</option>
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>JPY</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/30 rounded-xl overflow-hidden border border-gray-800 flex-1 mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900 text-xs text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Time (Local)</th>
                <th className="py-4 px-6 font-semibold">Currency</th>
                <th className="py-4 px-6 font-semibold">Impact</th>
                <th className="py-4 px-6 font-semibold">Event</th>
                <th className="py-4 px-6 font-semibold text-right">Actual</th>
                <th className="py-4 px-6 font-semibold text-right">Forecast</th>
                <th className="py-4 px-6 font-semibold text-right">Previous</th>
              </tr>
            </thead>
            <tbody>
              {[
                { time: '08:30 AM', currency: 'USD', impact: 'High', event: 'Non-Farm Employment Change', actual: '185K', forecast: '160K', previous: '175K' },
                { time: '08:30 AM', currency: 'USD', impact: 'High', event: 'Unemployment Rate', actual: '3.9%', forecast: '3.9%', previous: '3.8%' },
                { time: '10:00 AM', currency: 'USD', impact: 'High', event: 'ISM Services PMI', actual: '', forecast: '52.1', previous: '51.4' },
                { time: '02:00 PM', currency: 'USD', impact: 'High', event: 'FOMC Statement', actual: '', forecast: '', previous: '' },
                { time: '02:00 PM', currency: 'USD', impact: 'High', event: 'Federal Funds Rate', actual: '', forecast: '5.50%', previous: '5.50%' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-6 text-white font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" /> {row.time}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-white px-2 py-1 bg-gray-800 rounded">{row.currency}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="flex items-center gap-1 text-red-500 font-bold text-xs uppercase bg-red-500/10 px-2 py-1 rounded inline-flex">
                      <AlertTriangle className="h-3 w-3" /> {row.impact}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-white">{row.event}</td>
                  <td className={`py-4 px-6 text-right font-bold ${row.actual ? 'text-green-400' : 'text-gray-600'}`}>{row.actual || '-'}</td>
                  <td className="py-4 px-6 text-right text-gray-400 font-medium">{row.forecast || '-'}</td>
                  <td className="py-4 px-6 text-right text-gray-500">{row.previous || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
