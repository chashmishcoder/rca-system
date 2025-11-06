export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span 
              className="px-4 py-2 rounded-full text-white text-sm font-semibold animate-pulse" 
              style={{ background: 'linear-gradient(90deg, #1976D2, #00BCD4)' }}
            >
              AI-Powered Intelligence
            </span>
          </div>
          
          <h1 
            className="text-5xl md:text-6xl font-bold mb-4" 
            style={{ 
              background: 'linear-gradient(90deg, #1976D2, #00BCD4, #4CAF50)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Root Cause Analysis System
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Next-Generation Predictive Maintenance powered by Multi-Agent AI and Deep Learning
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="/analyze"
              className="px-8 py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-105"
              style={{ 
                background: 'linear-gradient(90deg, #1976D2, #00BCD4)',
                boxShadow: '0 10px 25px -5px rgba(25, 118, 210, 0.4)'
              }}
            >
              Start Analysis
            </a>
            
            <a
              href="#features"
              className="px-8 py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-105"
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(16px)'
              }}
            >
              Learn More
            </a>
          </div>
        </div>

        <div 
          className="mb-12 p-6 rounded-2xl" 
          style={{ 
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
          }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="text-3xl">⚡</span>
            <span style={{ color: '#1976D2' }}>System Health Overview</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              className="p-4 rounded-xl text-center transition-transform hover:scale-105"
              style={{ background: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.3)' }}
            >
              <div className="text-4xl font-bold mb-2" style={{ color: '#4CAF50' }}>100%</div>
              <div className="text-sm text-gray-400">Workflow Success</div>
              <div className="text-xs mt-1" style={{ color: '#4CAF50' }}>Perfect reliability</div>
            </div>
            
            <div 
              className="p-4 rounded-xl text-center transition-transform hover:scale-105"
              style={{ background: 'rgba(25, 118, 210, 0.1)', border: '1px solid rgba(25, 118, 210, 0.3)' }}
            >
              <div className="text-4xl font-bold mb-2" style={{ color: '#1976D2' }}>84.6%</div>
              <div className="text-sm text-gray-400">RCA Accuracy</div>
              <div className="text-xs mt-1" style={{ color: '#1976D2' }}>Industry leading</div>
            </div>
            
            <div 
              className="p-4 rounded-xl text-center transition-transform hover:scale-105"
              style={{ background: 'rgba(0, 188, 212, 0.1)', border: '1px solid rgba(0, 188, 212, 0.3)' }}
            >
              <div className="text-4xl font-bold mb-2" style={{ color: '#00BCD4' }}>0.862</div>
              <div className="text-sm text-gray-400">Confidence Score</div>
              <div className="text-xs mt-1" style={{ color: '#00BCD4' }}>High precision</div>
            </div>
            
            <div 
              className="p-4 rounded-xl text-center transition-transform hover:scale-105"
              style={{ background: 'rgba(255, 152, 0, 0.1)', border: '1px solid rgba(255, 152, 0, 0.3)' }}
            >
              <div className="text-4xl font-bold mb-2" style={{ color: '#FF9800' }}>77s</div>
              <div className="text-sm text-gray-400">Avg Processing</div>
              <div className="text-xs mt-1" style={{ color: '#FF9800' }}>Lightning fast</div>
            </div>
          </div>
        </div>

        <div id="features" className="grid md:grid-cols-3 gap-6 mb-12">
          <div 
            className="p-6 rounded-2xl transition-all duration-300 transform hover:scale-105"
            style={{ 
              background: 'rgba(25, 118, 210, 0.1)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(25, 118, 210, 0.3)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-3">Anomaly Detection</h3>
            <p className="text-gray-300 mb-4">
              Advanced LSTM autoencoder with 87.3% accuracy
            </p>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                <div 
                  className="h-full rounded-full" 
                  style={{ width: '87%', background: 'linear-gradient(90deg, #1976D2, #00BCD4)' }}
                ></div>
              </div>
              <span className="text-sm font-bold" style={{ color: '#1976D2' }}>87.3%</span>
            </div>
          </div>

          <div 
            className="p-6 rounded-2xl transition-all duration-300 transform hover:scale-105"
            style={{ 
              background: 'rgba(0, 188, 212, 0.1)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(0, 188, 212, 0.3)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold mb-3">Multi-Agent RCA</h3>
            <p className="text-gray-300 mb-4">
              4 specialized AI agents at 84.6% success
            </p>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                <div 
                  className="h-full rounded-full" 
                  style={{ width: '85%', background: 'linear-gradient(90deg, #00BCD4, #4CAF50)' }}
                ></div>
              </div>
              <span className="text-sm font-bold" style={{ color: '#00BCD4' }}>84.6%</span>
            </div>
          </div>

          <div 
            className="p-6 rounded-2xl transition-all duration-300 transform hover:scale-105"
            style={{ 
              background: 'rgba(76, 175, 80, 0.1)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="text-5xl mb-4">🕸️</div>
            <h3 className="text-2xl font-bold mb-3">Knowledge Graph</h3>
            <p className="text-gray-300 mb-4">
              Semantic reasoning with 50+ entities
            </p>
            <div className="flex gap-2 flex-wrap">
              <span 
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ background: 'rgba(76, 175, 80, 0.2)', color: '#4CAF50' }}
              >
                50+ Entities
              </span>
              <span 
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ background: 'rgba(76, 175, 80, 0.2)', color: '#4CAF50' }}
              >
                SWRL Rules
              </span>
            </div>
          </div>
        </div>

        <div 
          className="mb-12 p-6 rounded-2xl"
          style={{ 
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span>🤖</span>
              <span style={{ color: '#00BCD4' }}>AI Agent Status</span>
            </h2>
            <span 
              className="px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
              style={{ background: 'rgba(76, 175, 80, 0.2)', color: '#4CAF50' }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#4CAF50' }}></span>
              All Agents Operational
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Diagnostic', 'Reasoning', 'Planning', 'Learning'].map((agent) => (
              <div 
                key={agent} 
                className="p-4 rounded-xl text-center transition-transform hover:scale-105"
                style={{ 
                  background: 'rgba(25, 118, 210, 0.1)',
                  border: '1px solid rgba(25, 118, 210, 0.3)'
                }}
              >
                <div className="text-3xl mb-2">🤖</div>
                <div className="text-sm font-medium text-gray-300">{agent} Agent</div>
                <div className="text-xs mt-1 flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4CAF50' }}></span>
                  <span style={{ color: '#4CAF50' }}>Operational</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <div 
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full flex-wrap justify-center"
            style={{ 
              background: 'linear-gradient(90deg, rgba(76, 175, 80, 0.2), rgba(0, 188, 212, 0.2))',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(76, 175, 80, 0.4)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
            }}
          >
            <span className="text-2xl">✅</span>
            <span className="font-semibold text-white">Multi-Agent RCA System | Phase 6 Complete</span>
            <span 
              className="px-3 py-1 rounded-full text-sm font-bold"
              style={{ background: 'rgba(76, 175, 80, 0.3)', color: '#4CAF50' }}
            >
              95% Deployment Ready
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
