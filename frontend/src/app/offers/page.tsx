import { Search, Tag, Copy, Gift, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getOffers } from '../../lib/api';

export default async function OffersPage() {
  const offers = await getOffers();
  const hasOffers = offers && offers.length > 0;

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">Exclusive Prop Firm Offers <Gift className="h-8 w-8 text-blue-500" /></h1>
          <p className="text-gray-400">Verified discount codes, promotions, and exclusive deals across top proprietary trading firms.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search offers or firms..." className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-white" />
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 mb-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium whitespace-nowrap">All Offers</button>
        <button className="px-4 py-2 bg-gray-900 text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap">Largest Discounts</button>
        <button className="px-4 py-2 bg-gray-900 text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap">Expiring Soon</button>
      </div>

      {!hasOffers && (
        <div className="text-center py-20 bg-gray-900/50 rounded-xl border border-gray-800">
          <p className="text-gray-400">No offers available or database is offline.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hasOffers && offers.map((offer) => (
          <div key={offer.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative overflow-hidden group hover:border-gray-700 transition-colors">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
              <Tag className="h-32 w-32" />
            </div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center text-sm font-bold border border-gray-700 text-white overflow-hidden">
                {offer.firm?.logo && offer.firm.logo !== 'Logo' ? <img src={offer.firm.logo} alt="" className="w-full h-full object-contain" /> : (offer.firm?.name?.substring(0, 2).toUpperCase() || 'F')}
              </div>
              <span className="bg-green-500/10 text-green-500 text-sm font-bold px-3 py-1 rounded-full border border-green-500/20">
                {offer.discount_pct}% OFF
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 relative z-10">{offer.title}</h3>
            <p className="text-sm text-gray-400 mb-6 relative z-10 line-clamp-2">
              Get {offer.discount_pct}% off challenges at {offer.firm?.name || 'this firm'}.
            </p>
            
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-3 flex justify-between items-center mb-4 relative z-10">
              <span className="font-mono text-xl font-bold text-blue-400 tracking-wider">{offer.promo_code}</span>
              <button className="flex items-center gap-1 text-sm font-medium bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded transition-colors">
                <Copy className="h-4 w-4" /> Copy
              </button>
            </div>
            
            <div className="flex justify-between items-center relative z-10">
              <span className="text-xs text-gray-500 flex items-center gap-1">Expires: <span className="text-gray-300">{offer.expiry_date ? new Date(offer.expiry_date).toLocaleDateString() : 'Never'}</span></span>
              <Link href={`/firms/${offer.firm?.slug || ''}`} className="text-blue-500 hover:text-blue-400 text-sm font-medium flex items-center gap-1">
                View Firm <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
