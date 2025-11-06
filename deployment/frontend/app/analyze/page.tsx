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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Analyze Anomaly
          </h1>
          <p className="text-gray-300 text-lg">
            Identify root causes with AI-powered multi-agent analysis
          </p>
        </div>

        {/* Input Card */}
        <div className="relative p-8 bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl"></div>
          
          <div className="relative z-10">
            <label className="block text-sm font-semibold mb-3 text-gray-300 uppercase tracking-wide">
              Anomaly Identifier
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={anomalyId}
                onChange={(e) => setAnomalyId(e.target.value)}
                placeholder="e.g., AI4I_anomaly_0"
                className="flex-1 px-6 py-4 bg-slate-900/50 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all duration-300"
                disabled={loading}
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Analyzing...
                  </span>
                ) : (
                  'Analyze 🚀'
                )}
              </button>
            </div>
            
            {/* Sample IDs */}
            <div className="mt-6">
              <p className="text-sm font-semibold mb-3 text-gray-400">Quick Start - Try These Samples:</p>
              <div className="flex flex-wrap gap-2">
                {['AI4I_anomaly_0', 'AI4I_anomaly_1', 'AI4I_anomaly_100', 'AI4I_anomaly_500'].map(id => (
                  <button
                    key={id}
                    onClick={() => setAnomalyId(id)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 text-gray-300 rounded-lg transition-all duration-300 transform hover:scale-105"
                    disabled={loading}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-6 bg-red-500/10 border border-red-500/50 text-red-300 rounded-2xl mb-8 backdrop-blur-lg animate-pulse">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl backdrop-blur-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-500"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-purple-500 opacity-20"></div>
              </div>
              <div>
                <p className="text-blue-300 font-bold text-lg">AI Agents Working...</p>
                <p className="text-gray-400 text-sm">Processing anomaly data • Analyzing patterns • Generating insights</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-6">
              {['Diagnostic', 'Reasoning', 'Planning', 'Learning'].map((agent, i) => (
                <div key={agent} className="text-center p-3 bg-white/5 rounded-lg border border-white/10 animate-pulse" style={{ animationDelay: `${i * 150}ms` }}>
                  <div className="text-2xl mb-1">🤖</div>
                  <p className="text-xs text-gray-400">{agent}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            {/* Success Badge */}
            <div className="p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-2xl backdrop-blur-lg">
              <div className="flex items-center gap-3">
                <span className="text-3xl">✅</span>
                <div>
                  <p className="text-green-300 font-bold text-lg">Analysis Complete!</p>
                  <p className="text-gray-400 text-sm">Root cause successfully identified</p>
                </div>
              </div>
            </div>

            {/* Job Info */}
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <span>📋</span>
                Job Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Job ID</p>
                  <p className="font-mono text-sm text-blue-400 break-all">{result.job_id}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Status</p>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-bold">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    {result.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Root Cause */}
            {result.root_cause && (
              <div className="p-8 bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-lg rounded-2xl border border-orange-500/30 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                  <span className="text-3xl">🔍</span>
                  Root Cause Identified
                </h2>
                <p className="text-xl text-gray-200 leading-relaxed">{result.root_cause}</p>
              </div>
            )}

            {/* Confidence Scores */}
            {result.confidence && (
              <div className="p-8 bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                  <span>📊</span>
                  Agent Confidence Scores
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {Object.entries(result.confidence).map(([agent, score]: [string, any], index) => {
                    const colors = [
                      { from: 'from-blue-500', to: 'to-cyan-500', text: 'text-blue-400' },
                      { from: 'from-purple-500', to: 'to-pink-500', text: 'text-purple-400' },
                      { from: 'from-green-500', to: 'to-emerald-500', text: 'text-green-400' },
                    ][index % 3]
                    
                    const percentage = (score * 100).toFixed(1)
                    
                    return (
                      <div key={agent} className="p-6 bg-white/5 rounded-xl border border-white/10 text-center transform hover:scale-105 transition-all duration-300">
                        <p className="text-sm text-gray-400 mb-3 uppercase tracking-wide capitalize">{agent}</p>
                        <div className={`text-5xl font-bold bg-gradient-to-r ${colors.from} ${colors.to} bg-clip-text text-transparent mb-3`}>
                          {percentage}%
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${colors.from} ${colors.to} rounded-full transition-all duration-1000`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Explanation */}
            {result.explanation && (
              <div className="p-8 bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                  <span>📝</span>
                  Detailed Analysis
                </h2>
                <div className="p-6 bg-slate-900/50 rounded-xl border border-white/10">
                  <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-mono">
                    {result.explanation}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
