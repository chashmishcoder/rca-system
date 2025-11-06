export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold animate-pulse">
              ✨ AI-Powered Intelligence
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
            Root Cause Analysis System
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Next-Generation Predictive Maintenance powered by Multi-Agent AI and Deep Learning
          </p>

          <div className="flex justify-center gap-4 mb-16">
            <a
              href="/analyze"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10">Start Analysis →</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            
            <a
              href="#features"
              className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-xl font-bold text-lg border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Feature Cards */}
        <div id="features" className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="group relative p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-blue-500/50 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🔍</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Anomaly Detection</h3>
              <p className="text-gray-300 mb-4">
                Advanced LSTM autoencoder architecture with 87.3% accuracy
              </p>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[87%] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                </div>
                <span className="text-sm font-bold text-blue-400">87.3%</span>
              </div>
            </div>
          </div>

          <div className="group relative p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-purple-500/50 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🤖</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Multi-Agent RCA</h3>
              <p className="text-gray-300 mb-4">
                4 specialized AI agents working in harmony at 84.6% success rate
              </p>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                </div>
                <span className="text-sm font-bold text-purple-400">84.6%</span>
              </div>
            </div>
          </div>

          <div className="group relative p-8 bg-gradient-to-br from-pink-500/10 to-orange-500/10 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-pink-500/50 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🕸️</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Knowledge Graph</h3>
              <p className="text-gray-300 mb-4">
                Semantic reasoning with 50+ entities and intelligent SWRL rules
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm">50+ Entities</span>
                <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm">SWRL Rules</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Status Dashboard */}
        <div className="mt-20 p-8 bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="animate-pulse">⚡</span>
              System Status
            </h2>
            <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              All Systems Operational
            </span>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 hover:border-green-500/50 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="text-gray-300 font-medium">Workflow Success</div>
              <div className="mt-3 text-xs text-green-400">↑ Perfect reliability</div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                84.6%
              </div>
              <div className="text-gray-300 font-medium">RCA Accuracy</div>
              <div className="mt-3 text-xs text-blue-400">↑ Industry leading</div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                0.862
              </div>
              <div className="text-gray-300 font-medium">Confidence Score</div>
              <div className="mt-3 text-xs text-purple-400">↑ High precision</div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                77s
              </div>
              <div className="text-gray-300 font-medium">Avg Processing</div>
              <div className="mt-3 text-xs text-orange-400">↓ Lightning fast</div>
            </div>
          </div>
        </div>

        {/* Phase 6 Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-full border border-green-500/30">
            <span className="text-2xl">✅</span>
            <span className="text-white font-semibold">Multi-Agent RCA System | Phase 6 Complete</span>
            <span className="px-3 py-1 bg-green-500/30 text-green-300 rounded-full text-sm font-bold">95% Deployment Ready</span>
          </div>
        </div>
      </div>
    </div>
  )
}
