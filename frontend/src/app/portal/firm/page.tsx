import { Building, Save, UploadCloud } from 'lucide-react';

export default function ManageFirmProfile() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2"><Building className="h-8 w-8 text-blue-500" /> My Firm Profile</h1>
          <p className="text-gray-400">Update your firm's public information, assets, and platforms.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
          
          <div className="flex flex-col md:flex-row gap-8 mb-6">
            <div className="w-32 h-32 bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition-colors shrink-0">
              <UploadCloud className="h-8 w-8 mb-2" />
              <span className="text-xs font-medium">Upload Logo</span>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Firm Name</label>
                <input type="text" defaultValue="FTMO" className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Founded Year</label>
                <input type="number" defaultValue="2015" className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Country</label>
                <input type="text" defaultValue="Czech Republic" className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Website URL</label>
                <input type="url" defaultValue="https://ftmo.com" className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea rows={4} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" defaultValue="FTMO is a project which is looking for experienced traders. To ensure that we have exactly the qualities we are looking for, we have developed a 2-step evaluation course."></textarea>
          </div>
        </div>

        {/* Trading Specs */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Trading Specifications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Tradable Assets</label>
              <div className="space-y-2 bg-gray-950 border border-gray-800 rounded-lg p-4">
                <label className="flex items-center gap-2 text-white cursor-pointer"><input type="checkbox" defaultChecked className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500" /> Forex</label>
                <label className="flex items-center gap-2 text-white cursor-pointer"><input type="checkbox" defaultChecked className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500" /> Commodities</label>
                <label className="flex items-center gap-2 text-white cursor-pointer"><input type="checkbox" defaultChecked className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500" /> Indices</label>
                <label className="flex items-center gap-2 text-white cursor-pointer"><input type="checkbox" defaultChecked className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500" /> Crypto</label>
                <label className="flex items-center gap-2 text-white cursor-pointer"><input type="checkbox" defaultChecked className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500" /> Stocks</label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Trading Platforms</label>
              <div className="space-y-2 bg-gray-950 border border-gray-800 rounded-lg p-4">
                <label className="flex items-center gap-2 text-white cursor-pointer"><input type="checkbox" defaultChecked className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500" /> MetaTrader 4</label>
                <label className="flex items-center gap-2 text-white cursor-pointer"><input type="checkbox" defaultChecked className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500" /> MetaTrader 5</label>
                <label className="flex items-center gap-2 text-white cursor-pointer"><input type="checkbox" defaultChecked className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500" /> cTrader</label>
                <label className="flex items-center gap-2 text-white cursor-pointer"><input type="checkbox" className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500" /> TradeLocker</label>
                <label className="flex items-center gap-2 text-white cursor-pointer"><input type="checkbox" defaultChecked className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500" /> DXtrade</label>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-400 mb-1">Maximum Allocation ($)</label>
            <input type="number" defaultValue="400000" className="w-full md:w-1/2 bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
