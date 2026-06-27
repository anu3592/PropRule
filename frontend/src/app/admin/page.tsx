import { Building2, MessageSquare, Users, Activity, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { getFirms, getReviews } from '../../lib/api';

export default async function AdminDashboard() {
  const firms = await getFirms();
  const reviews = await getReviews();
  
  const pendingReviewsCount = reviews?.filter(r => r.status === 'pending').length || 0;
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Welcome back, Admin. Here is what's happening today.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-gray-400 text-sm font-medium mb-1">Total Firms</div>
              <div className="text-3xl font-bold text-white">{firms?.length || 0}</div>
            </div>
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="text-xs text-green-500 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +2 this week
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-gray-400 text-sm font-medium mb-1">Pending Reviews</div>
              <div className="text-3xl font-bold text-white">{pendingReviewsCount}</div>
            </div>
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
          <div className="text-xs text-yellow-500 flex items-center gap-1">
            Requires action
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-gray-400 text-sm font-medium mb-1">Total Users</div>
              <div className="text-3xl font-bold text-white">4,250</div>
            </div>
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
          </div>
          <div className="text-xs text-green-500 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +145 this week
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-gray-400 text-sm font-medium mb-1">Active Offers</div>
              <div className="text-3xl font-bold text-white">12</div>
            </div>
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Across 8 firms
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recent Reviews (Pending)</h2>
            <Link href="/admin/reviews" className="text-sm text-blue-500 hover:text-blue-400">View All</Link>
          </div>
          
          <div className="space-y-4">
            {pendingReviewsCount === 0 ? (
              <p className="text-gray-400 text-sm">No pending reviews to approve.</p>
            ) : (
              // This is a placeholder since getReviews might not return pending depending on the backend query
              <p className="text-gray-400 text-sm">Pending reviews will appear here.</p>
            )}
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/firms" className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 text-center transition-colors">
              <Building2 className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Add New Firm</div>
            </Link>
            <Link href="/admin/offers" className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 text-center transition-colors">
              <Activity className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Manage Offers</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
