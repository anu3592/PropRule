import { MessageSquare, Check, X, Star } from 'lucide-react';
import { getReviews } from '../../../lib/api';

export default async function AdminReviewsPage() {
  const reviews = await getReviews();
  
  // Since we don't have a specific backend endpoint yet for "pending" reviews, we'll just mock the pending vs approved state visually for now based on what the API returns.
  // In a real scenario, getReviews() should take a status filter.
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2"><MessageSquare className="h-8 w-8 text-yellow-500" /> Manage Reviews</h1>
          <p className="text-gray-400">Review, approve, or reject user-submitted prop firm reviews.</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-800">
          <button className="px-6 py-4 text-sm font-medium text-white border-b-2 border-blue-500 bg-gray-800/50">Pending Approval</button>
          <button className="px-6 py-4 text-sm font-medium text-gray-400 hover:text-white transition-colors">Approved</button>
          <button className="px-6 py-4 text-sm font-medium text-gray-400 hover:text-white transition-colors">Rejected</button>
        </div>

        <div className="p-6">
          {!reviews || reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No reviews found or database is offline.
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-800/30 border border-gray-800 rounded-lg p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-white">
                        {review.user?.name?.substring(0, 2).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{review.user?.name || 'Anonymous User'}</div>
                        <div className="text-xs text-gray-400">Submitted for: <span className="font-bold text-blue-400">{review.firm?.name || 'Unknown Firm'}</span></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex text-yellow-500 text-sm mb-1">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                      </div>
                      <div className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900 p-4 rounded text-sm text-gray-300 mb-4 border border-gray-800">
                    "{review.content}"
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium rounded transition-colors flex items-center gap-1">
                      <X className="h-4 w-4" /> Reject
                    </button>
                    <button className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white text-sm font-medium rounded transition-colors flex items-center gap-1 shadow-lg shadow-green-500/20">
                      <Check className="h-4 w-4" /> Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
