import { Tag, Plus, Edit, Trash2 } from 'lucide-react';
// import { getOffers } from '../../../lib/api';

export default function ManageOffersPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2"><Tag className="h-8 w-8 text-blue-500" /> Manage Offers</h1>
          <p className="text-gray-400">Create and manage promotional codes and discounts for your challenges.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create Offer
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900 text-xs text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Offer Title</th>
                <th className="py-4 px-6 font-semibold">Promo Code</th>
                <th className="py-4 px-6 font-semibold">Discount</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold">Expiry</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Mock data for now, ideally fetch specific firm's offers */}
              <tr className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                <td className="py-4 px-6 font-medium text-white">Spring Sale 2026</td>
                <td className="py-4 px-6">
                  <span className="font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded">SPRING10</span>
                </td>
                <td className="py-4 px-6 text-green-500 font-bold">10% OFF</td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded">Active</span>
                </td>
                <td className="py-4 px-6 text-gray-400 text-sm">May 31, 2026</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded transition-colors" title="Edit Offer">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded transition-colors" title="Delete Offer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors opacity-60">
                <td className="py-4 px-6 font-medium text-white">Black Friday</td>
                <td className="py-4 px-6">
                  <span className="font-mono text-gray-400 bg-gray-800 px-2 py-1 rounded">BF2025</span>
                </td>
                <td className="py-4 px-6 text-gray-400 font-bold">20% OFF</td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-gray-800 text-gray-500 text-xs font-bold rounded">Expired</span>
                </td>
                <td className="py-4 px-6 text-gray-400 text-sm">Nov 30, 2025</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded transition-colors" title="Delete Offer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
