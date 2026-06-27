import { Building2, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { getFirms } from '../../../lib/api';

export default async function AdminFirmsPage() {
  const firms = await getFirms();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2"><Building2 className="h-8 w-8 text-blue-500" /> Manage Firms</h1>
          <p className="text-gray-400">Add, edit, or remove proprietary trading firms from the platform.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New Firm
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900 text-xs text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Firm Name</th>
                <th className="py-4 px-6 font-semibold">Country</th>
                <th className="py-4 px-6 font-semibold">Assets</th>
                <th className="py-4 px-6 font-semibold">Max Alloc.</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!firms || firms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No firms found or database is offline.
                  </td>
                </tr>
              ) : (
                firms.map((firm) => (
                  <tr key={firm.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                           {firm.logo && firm.logo !== 'Logo' ? <img src={firm.logo} alt="" className="w-full h-full object-contain" /> : firm.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="font-bold text-white text-sm">{firm.name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-300">{firm.country || 'N/A'}</td>
                    <td className="py-4 px-6 text-sm text-gray-300">{firm.assets.join(', ') || 'Various'}</td>
                    <td className="py-4 px-6 text-sm text-gray-300">${firm.max_allocation?.toLocaleString() || 'Varies'}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/firms/${firm.slug}`} target="_blank" className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded transition-colors" title="View Public Profile">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded transition-colors" title="Edit Firm">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded transition-colors" title="Delete Firm">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
