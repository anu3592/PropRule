import { Bot, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function AIMatchPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col min-h-screen">
      <div className="max-w-4xl mx-auto w-full text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-blue-900/30 rounded-full mb-6 border border-blue-500/20">
          <Bot className="h-12 w-12 text-blue-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
          AI Prop Firm Matchmaker <Sparkles className="h-8 w-8 text-yellow-500" />
        </h1>
        <p className="text-xl text-gray-400">
          Answer a few questions about your trading style, and our AI will recommend the perfect proprietary trading firm and challenge for you.
        </p>
      </div>

      <div className="max-w-3xl mx-auto w-full bg-gray-900/50 border border-gray-800 rounded-2xl p-8 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Question 1 of 5</span>
            <span>20%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: '20%' }}></div>
          </div>
        </div>

        {/* Question Content */}
        <div className="min-h-[300px] flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">What is your primary trading market?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="relative cursor-pointer">
              <input type="radio" name="market" className="peer sr-only" />
              <div className="p-6 bg-gray-800 border border-gray-700 rounded-xl hover:border-blue-500 peer-checked:border-blue-500 peer-checked:bg-blue-900/20 transition-all text-center">
                <div className="text-3xl mb-2">💱</div>
                <div className="font-bold text-white mb-1">Forex</div>
                <div className="text-xs text-gray-400">Major and minor currency pairs</div>
              </div>
            </label>
            
            <label className="relative cursor-pointer">
              <input type="radio" name="market" className="peer sr-only" />
              <div className="p-6 bg-gray-800 border border-gray-700 rounded-xl hover:border-blue-500 peer-checked:border-blue-500 peer-checked:bg-blue-900/20 transition-all text-center">
                <div className="text-3xl mb-2">📈</div>
                <div className="font-bold text-white mb-1">Futures</div>
                <div className="text-xs text-gray-400">Indices, metals, energies (CME, etc.)</div>
              </div>
            </label>
            
            <label className="relative cursor-pointer">
              <input type="radio" name="market" className="peer sr-only" />
              <div className="p-6 bg-gray-800 border border-gray-700 rounded-xl hover:border-blue-500 peer-checked:border-blue-500 peer-checked:bg-blue-900/20 transition-all text-center">
                <div className="text-3xl mb-2">₿</div>
                <div className="font-bold text-white mb-1">Crypto</div>
                <div className="text-xs text-gray-400">Bitcoin, Ethereum, Altcoins</div>
              </div>
            </label>
            
            <label className="relative cursor-pointer">
              <input type="radio" name="market" className="peer sr-only" />
              <div className="p-6 bg-gray-800 border border-gray-700 rounded-xl hover:border-blue-500 peer-checked:border-blue-500 peer-checked:bg-blue-900/20 transition-all text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="font-bold text-white mb-1">Stocks / Equities</div>
                <div className="text-xs text-gray-400">US Equities and CFDs</div>
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-800 flex justify-between items-center">
          <button className="px-6 py-2 text-gray-400 hover:text-white transition-colors invisible">
            Back
          </button>
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center gap-2">
            Next Question <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Feature Highlights */}
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-center">
        <div className="p-4">
          <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-3" />
          <h3 className="font-bold text-white mb-2">Unbiased Recommendations</h3>
          <p className="text-sm text-gray-400">Our algorithm maps your needs to over 1,500 data points across 120+ firms.</p>
        </div>
        <div className="p-4">
          <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-3" />
          <h3 className="font-bold text-white mb-2">Rule Matching</h3>
          <p className="text-sm text-gray-400">Avoid failing due to hidden rules. We ensure the firm allows your specific strategy.</p>
        </div>
        <div className="p-4">
          <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-3" />
          <h3 className="font-bold text-white mb-2">Best Value</h3>
          <p className="text-sm text-gray-400">We automatically apply the best available promo codes to your matched result.</p>
        </div>
      </div>
    </div>
  );
}
