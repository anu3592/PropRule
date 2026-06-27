import Link from 'next/link';
import { Star, CheckCircle, XCircle, Globe, ChevronRight, Award, ShieldAlert, ArrowLeft } from 'lucide-react';
import { getFirmBySlug } from '../../../lib/api';

export default async function FirmProfilePage({ params }: { params: { slug: string } }) {
  const firm = await getFirmBySlug(params.slug);
  
  if (!firm) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Firm Not Found</h1>
        <p className="text-gray-400 mb-8">The prop firm you are looking for does not exist or database is offline.</p>
        <Link href="/firms" className="px-6 py-2 bg-blue-600 text-white rounded-lg">Return to Directory</Link>
      </div>
    );
  }

  // Helper to find specific rule
  const getRule = (category: string) => firm.rules?.find(r => r.category === category);
  const newsRule = getRule('news_trading');
  const weekendRule = getRule('weekend_holding');
  const eaRule = getRule('eas');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Firm Header */}
      <div className="bg-gray-900 border-b border-gray-800 pt-8 pb-12">
        <div className="container mx-auto px-4">
          <Link href="/firms" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Directory
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 bg-gray-800 rounded-xl flex items-center justify-center text-2xl font-bold border border-gray-700 shrink-0 shadow-lg text-white p-2">
              {firm.logo && firm.logo !== 'Logo' ? <img src={firm.logo} alt={firm.name} className="max-w-full max-h-full object-contain" /> : firm.name.substring(0, 2).toUpperCase()}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                    {firm.name}
                    <ShieldAlert className="h-6 w-6 text-blue-500" />
                  </h1>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><Globe className="h-4 w-4" /> {firm.country || 'Global'}</span>
                    <span>•</span>
                    <span>Founded {firm.founded_year || 'Unknown'}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-yellow-500 text-2xl font-bold">
                    <Star className="h-6 w-6 fill-yellow-500" /> 4.8
                  </div>
                  <div className="text-sm text-gray-400">Based on 12,450 reviews</div>
                </div>
              </div>
              
              <div className="flex gap-4 mb-6 flex-wrap">
                <span className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Verified</span>
                <span className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg">{firm.assets.join(', ') || 'Various'}</span>
                <span className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg">{firm.platforms.join(', ') || 'Various'}</span>
              </div>
              
              <div className="flex gap-4">
                <a href="#" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20">Visit Website</a>
                <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors border border-gray-700 flex items-center gap-2">
                  <Star className="h-4 w-4" /> Save Firm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            
            {/* Quick Overview */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Award className="h-6 w-6 text-blue-500" /> Key Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                  <div className="text-gray-400 text-sm mb-1">Max Allocation</div>
                  <div className="text-xl font-bold text-white">${firm.max_allocation?.toLocaleString() || 'Varies'}</div>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                  <div className="text-gray-400 text-sm mb-1">Profit Split</div>
                  <div className="text-xl font-bold text-white">Up to 90%</div>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                  <div className="text-gray-400 text-sm mb-1">Payout Speed</div>
                  <div className="text-xl font-bold text-white">14 Days</div>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                  <div className="text-gray-400 text-sm mb-1">Scaling Plan</div>
                  <div className="text-xl font-bold text-green-500">Yes</div>
                </div>
              </div>
            </section>

            {/* Trading Rules */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Trading Rules</h2>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                    <span className="text-gray-400">News Trading</span>
                    <span className="flex items-center gap-2 text-white font-medium">
                      {newsRule?.is_allowed ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />} 
                      {newsRule?.value || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                    <span className="text-gray-400">Weekend Holding</span>
                    <span className="flex items-center gap-2 text-white font-medium">
                      {weekendRule?.is_allowed ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />} 
                      {weekendRule?.value || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                    <span className="text-gray-400">EAs / Bots</span>
                    <span className="flex items-center gap-2 text-white font-medium">
                      {eaRule?.is_allowed ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />} 
                      {eaRule?.value || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                    <span className="text-gray-400">Consistency Rule</span>
                    <span className="flex items-center gap-2 text-white font-medium"><XCircle className="h-4 w-4 text-gray-500" /> None</span>
                  </div>
                </div>
                {(newsRule?.description || weekendRule?.description) && (
                  <div className="mt-4 text-sm text-gray-400 border-t border-gray-800 pt-4">
                    <p><strong>Notes:</strong> {newsRule?.description} {weekendRule?.description}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Programs / Challenges */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Available Challenges</h2>
              <div className="bg-gray-900/30 rounded-xl border border-gray-800 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-900 border-b border-gray-800">
                    <tr className="text-xs text-gray-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Account Size</th>
                      <th className="py-4 px-6">Type</th>
                      <th className="py-4 px-6">Target</th>
                      <th className="py-4 px-6">Drawdown</th>
                      <th className="py-4 px-6 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {firm.challenges && firm.challenges.length > 0 ? firm.challenges.map((challenge, i) => (
                      <tr key={challenge.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                        <td className="py-4 px-6 font-bold text-white">${challenge.account_size.toLocaleString()}</td>
                        <td className="py-4 px-6 text-gray-300">{challenge.challenge_type}</td>
                        <td className="py-4 px-6 text-gray-300">{challenge.profit_target_pct}</td>
                        <td className="py-4 px-6 text-gray-300">{challenge.max_daily_loss_pct || 'N/A'}% Daily / {challenge.max_total_loss_pct}% Max</td>
                        <td className="py-4 px-6 text-right font-medium text-white">{challenge.fee} {challenge.fee_currency}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={5} className="py-8 text-center text-gray-500">No challenges listed for this firm yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* Promo Codes */}
            {firm.offers && firm.offers.length > 0 && firm.offers[0].is_active && (
              <div className="bg-gradient-to-br from-blue-900/40 to-gray-900 border border-blue-500/20 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Award className="h-24 w-24 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">{firm.offers[0].title}</h3>
                <p className="text-sm text-blue-200 mb-6 relative z-10">Use our exclusive promo code to get a discount on all challenges.</p>
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-3 flex justify-between items-center relative z-10">
                  <span className="font-mono text-xl font-bold text-blue-400 tracking-wider">{firm.offers[0].promo_code}</span>
                  <button className="text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors">Copy</button>
                </div>
                {firm.offers[0].expiry_date && (
                  <div className="mt-4 text-xs text-gray-400 relative z-10 text-center">Valid until {new Date(firm.offers[0].expiry_date).toLocaleDateString()}</div>
                )}
              </div>
            )}

            {/* Ratings Summary */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6">Review Breakdown</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Trading Conditions</span>
                    <span className="font-bold text-white">4.9</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width: '98%'}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Customer Care</span>
                    <span className="font-bold text-white">4.7</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width: '94%'}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">User Friendliness</span>
                    <span className="font-bold text-white">4.8</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width: '96%'}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Payout Process</span>
                    <span className="font-bold text-white">4.9</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width: '98%'}}></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
