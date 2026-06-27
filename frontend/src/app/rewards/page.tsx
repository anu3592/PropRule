import { Award, Star, Share2, MessageSquare, Gift, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RewardsPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-900/40 to-gray-900 border border-purple-500/20 rounded-2xl p-8 md:p-12 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Award className="h-64 w-64 text-purple-500" />
        </div>
        
        <div className="max-w-2xl relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">PropRules <span className="text-purple-400">Rewards</span></h1>
          <p className="text-lg text-gray-300 mb-8">
            Earn points for contributing to the community and redeem them for exclusive discounts, free challenges, and premium features.
          </p>
          
          {/* User Status Mockup */}
          <div className="bg-gray-950/80 backdrop-blur-sm border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <div className="text-sm text-gray-400 mb-1">Your Balance</div>
              <div className="text-4xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" /> 1,250
              </div>
            </div>
            <div className="w-full md:w-px h-px md:h-16 bg-gray-800"></div>
            <div className="flex-1 text-center md:text-left">
              <div className="text-sm text-gray-400 mb-1">Current Tier</div>
              <div className="text-2xl font-bold text-purple-400">Pro Trader</div>
              <div className="text-xs text-gray-500 mt-1">750 points to Elite</div>
            </div>
            <div>
              <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap">
                Redeem Points
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* How to Earn */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">How to Earn Points</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:border-purple-500/50 transition-colors">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Write a Review</h3>
            <p className="text-gray-400 text-sm mb-4">Share your verified experience with a prop firm.</p>
            <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
              +500 <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:border-purple-500/50 transition-colors">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Verify Payout</h3>
            <p className="text-gray-400 text-sm mb-4">Upload proof of your payout to help the community.</p>
            <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
              +1000 <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:border-purple-500/50 transition-colors">
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Daily Login</h3>
            <p className="text-gray-400 text-sm mb-4">Come back daily to check new offers and reviews.</p>
            <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
              +10 <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Catalog */}
      <div>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Rewards Catalog</h2>
            <p className="text-gray-400">Spend your points on exclusive community benefits.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col group hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center font-bold">FTMO</div>
              <div className="bg-yellow-500/10 text-yellow-500 font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1">
                2,500 <Star className="h-3 w-3 fill-yellow-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">20% Off Challenge</h3>
            <p className="text-sm text-gray-400 mb-6 flex-1">Unlock an exclusive 20% discount code for any FTMO evaluation.</p>
            <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50" disabled>
              Need 1,250 more
            </button>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col group hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center font-bold">APEX</div>
              <div className="bg-yellow-500/10 text-yellow-500 font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1">
                1,000 <Star className="h-3 w-3 fill-yellow-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">80% Off Evaluation</h3>
            <p className="text-sm text-gray-400 mb-6 flex-1">Unlock a massive 80% discount code for Apex Trader Funding.</p>
            <button className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors">
              Unlock Now
            </button>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col group hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center font-bold text-purple-400">PRO</div>
              <div className="bg-yellow-500/10 text-yellow-500 font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1">
                5,000 <Star className="h-3 w-3 fill-yellow-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">1 Month Pro Badge</h3>
            <p className="text-sm text-gray-400 mb-6 flex-1">Get the Pro Badge next to your name and unlock advanced analytics.</p>
            <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50" disabled>
              Need 3,750 more
            </button>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col group hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center font-bold">PIPS</div>
              <div className="bg-yellow-500/10 text-yellow-500 font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1">
                10,000 <Star className="h-3 w-3 fill-yellow-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Free $10k Challenge</h3>
            <p className="text-sm text-gray-400 mb-6 flex-1">Redeem for a completely free $10,000 challenge account.</p>
            <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50" disabled>
              Need 8,750 more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
