import { Search, Filter, Star, CheckCircle, ThumbsUp, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { getReviews } from '../../lib/api';

export default async function ReviewsPage() {
  const reviews = await getReviews();
  const hasReviews = reviews && reviews.length > 0;

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Prop Firm Reviews</h1>
          <p className="text-gray-400">Read verified reviews from real funded traders and evaluate firm reliability.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
          <MessageSquare className="h-5 w-5" /> Post a Review
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {/* Filters Sidebar */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 sticky top-20">
            <h3 className="font-semibold mb-4 text-white flex items-center gap-2"><Filter className="h-4 w-4" /> Filter Reviews</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Firm</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-sm text-white">
                  <option>All Firms</option>
                  <option>FTMO</option>
                  <option>Apex Trader Funding</option>
                  <option>Funding Pips</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Rating</label>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white">
                      <input type="checkbox" className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500" />
                      <div className="flex items-center text-yellow-500 text-sm">
                        {'★'.repeat(rating)}{'☆'.repeat(5-rating)}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="border-gray-800" />
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Experience Type</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white"><input type="checkbox" /> Funded Only</label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white"><input type="checkbox" /> Paid Out Only</label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white"><input type="checkbox" /> Evaluation</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {!hasReviews && (
            <div className="text-center py-20 bg-gray-900/50 rounded-xl border border-gray-800">
              <p className="text-gray-400">No reviews found or database is offline.</p>
            </div>
          )}

          {hasReviews && reviews.map((review) => (
            <div key={review.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 font-bold">
                    {review.user?.name?.substring(0, 2).toUpperCase() || 'AN'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white">{review.user?.name || 'Anonymous User'}</h4>
                      <span className="flex items-center gap-1 text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded"><CheckCircle className="h-3 w-3" /> Verified Payout</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{new Date(review.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-1">Reviewed Firm</div>
                  <Link href={`/firms/${review.firm_id}`} className="font-bold text-blue-400 hover:text-blue-300 flex items-center gap-2">
                    {review.firm?.logo && review.firm.logo !== 'Logo' && (
                      <img src={review.firm.logo} alt="" className="w-6 h-6 object-contain" />
                    )}
                    {review.firm?.name || 'Firm'}
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-500">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                </div>
                <span className="font-bold">{review.rating >= 4 ? 'Excellent Experience' : 'Mixed Experience'}</span>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {review.content}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <button className="flex items-center gap-1 hover:text-white transition-colors"><ThumbsUp className="h-4 w-4" /> 12 Found Helpful</button>
              </div>
            </div>
          ))}
          
          {hasReviews && (
            <div className="flex justify-center mt-8">
              <button className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium">Load More</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
