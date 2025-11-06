'use client'

import { useState } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function AnalyzePage() {
  const [anomalyId, setAnomalyId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!anomalyId.trim()) {
      setError('Please enter an anomaly ID')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await axios.post(`${API_URL}/api/analyze`, {
        anomaly_id: anomalyId
      })
      setResult(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Analyze Anomaly</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <label className="block text-sm font-medium mb-2">
          Anomaly ID
        </label>
        <div className="flex gap-4">
          <input
            type="text"
            value={anomalyId}
            onChange={(e) => setAnomalyId(e.target.value)}
            placeholder="e.g., AI4I_anomaly_0"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p className="font-semibold mb-2">Sample IDs to try:</p>
          <div className="flex flex-wrap gap-2">
            {['AI4I_anomaly_0', 'AI4I_anomaly_1', 'AI4I_anomaly_100', 'AI4I_anomaly_500'].map(id => (
              <button
                key={id}
                onClick={() => setAnomalyId(id)}
                className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition"
                disabled={loading}
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
          {error}
        </div>
      )}

      {loading && (
        <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg mb-8">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-blue-700">Processing anomaly... This may take up to 77 seconds.</p>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-green-50 border border-green-200 px-4 py-3 rounded-lg">
            <p className="text-green-700 font-semibold">✅ Analysis Complete!</p>
          </div>

          {/* Job Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Job Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Job ID</p>
                <p className="font-mono text-sm">{result.job_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold text-green-600">{result.status}</p>
              </div>
            </div>
          </div>

          {/* Root Cause */}
          {result.root_cause && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">🔍 Root Cause</h2>
              <p className="text-lg">{result.root_cause}</p>
            </div>
          )}

          {/* Confidence Scores */}
          {result.confidence && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">📊 Agent Confidence</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(result.confidence).map(([agent, score]: [string, any]) => (
                  <div key={agent} className="text-center">
                    <p className="text-sm text-gray-600 mb-1 capitalize">{agent}</p>
                    <div className="text-3xl font-bold text-blue-600">
                      {(score * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explanation */}
          {result.explanation && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">📝 Detailed Explanation</h2>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded">
                  {result.explanation}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
