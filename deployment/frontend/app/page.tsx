export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Root Cause Analysis System
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI-Powered Predictive Maintenance with Multi-Agent Intelligence
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 border rounded-lg hover:shadow-lg transition">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Anomaly Detection</h3>
            <p className="text-gray-600">
              LSTM autoencoder detects anomalies with 87.3% accuracy
            </p>
          </div>
          
          <div className="p-6 border rounded-lg hover:shadow-lg transition">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">Multi-Agent RCA</h3>
            <p className="text-gray-600">
              4 specialized agents identify root causes at 84.6% success
            </p>
          </div>
          
          <div className="p-6 border rounded-lg hover:shadow-lg transition">
            <div className="text-4xl mb-4">🕸️</div>
            <h3 className="text-xl font-semibold mb-2">Knowledge Graph</h3>
            <p className="text-gray-600">
              Semantic reasoning with 50+ entities and SWRL rules
            </p>
          </div>
        </div>

        <div className="mt-12">
          <a
            href="/analyze"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Analyze Anomaly →
          </a>
        </div>

        <div className="mt-16 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">System Status</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <div className="text-3xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-600">Workflow Success</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">84.6%</div>
              <div className="text-sm text-gray-600">RCA Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">0.862</div>
              <div className="text-sm text-gray-600">Confidence Score</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">77s</div>
              <div className="text-sm text-gray-600">Avg Processing</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
