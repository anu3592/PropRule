import { Eye, MousePointerClick, Star, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
// import { getMyFirmData } from '../../lib/api'; // Future implementation

export default function PortalDashboard() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Partner Dashboard</h1>
          <p className="text-gray-400">Manage your firm's presence on PropRules and track performance.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          View Public Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-gray-400 text-sm font-medium mb-1">Profile Views</div>
              <div className="text-3xl font-bold text-white">12,450</div>
            </div>
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Eye className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="text-xs text-green-500 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +15% this month
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-gray-400 text-sm font-medium mb-1">Outbound Clicks</div>
              <div className="text-3xl font-bold text-white">3,240</div>
            </div>
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <MousePointerClick className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <div className="text-xs text-green-500 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +8% this month
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-gray-400 text-sm font-medium mb-1">Average Rating</div>
              <div className="text-3xl font-bold text-white">4.8</div>
            </div>
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            Based on 450 reviews
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-gray-400 text-sm font-medium mb-1">Offer Redemptions</div>
              <div className="text-3xl font-bold text-white">850</div>
            </div>
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
          </div>
          <div className="text-xs text-green-500 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Active Code: PROPRULES10
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recent Reviews</h2>
            <Link href="/portal/reviews" className="text-sm text-blue-500 hover:text-blue-400">Manage</Link>
          </div>
          
          <div className="space-y-4">
             <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-800">
               <div className="flex justify-between mb-2">
                 <div className="flex text-yellow-500 text-xs">★★★★★</div>
                 <div className="text-xs text-gray-500">2 days ago</div>
               </div>
               <p className="text-sm text-gray-300">"Great conditions and fast payouts."</p>
             </div>
             <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-800">
               <div className="flex justify-between mb-2">
                 <div className="flex text-yellow-500 text-xs">★★★★☆</div>
                 <div className="text-xs text-gray-500">5 days ago</div>
               </div>
               <p className="text-sm text-gray-300">"Support took a while to respond, but challenge was smooth."</p>
             </div>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Profile Completion</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Overall Progress</span>
                <span className="font-bold text-white">85%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width: '85%'}}></div></div>
            </div>
            
            <ul className="space-y-3 mt-6">
              <li className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-xs">✓</div>
                <span className="text-gray-300">Basic Information Added</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-xs">✓</div>
                <span className="text-gray-300">Trading Rules Configured</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-xs">✓</div>
                <span className="text-gray-300">Challenges Uploaded</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs"></div>
                <span className="text-gray-400">Active Promotional Offer</span>
                <Link href="/portal/offers" className="text-blue-500 hover:underline ml-auto">Add Now</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
