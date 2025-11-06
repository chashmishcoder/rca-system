'use client'

import { useState } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://rca-backend-5jlv.onrender.com'

export default function AnalyzePage() {
  const [anomalyId, setAnomalyId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async (id?: string) => {
    const targetId = id || anomalyId
    
    if (!targetId.trim()) {
      setError('Please enter an anomaly ID')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)
    setAnomalyId(targetId)

    try {
      // Backend expects specific format with required fields
      const payload = {
        anomaly_id: targetId,
        timestamp: new Date().toISOString(),
        reconstruction_error: 0.4397,  // Mock value for demo
        top_contributing_features: [
          { feature_name: "Rotational speed [rpm]", error: 0.2156 },
          { feature_name: "Torque [Nm]", error: 0.1534 },
          { feature_name: "Tool wear [min]", error: 0.0707 }
        ],
        severity: "high",
        metadata: { source: "frontend_demo" }
      }
      
      const response = await axios.post(`${API_URL}/api/rca/analyze`, payload)
      
      // Backend returns workflow_id, need to poll for results
      const workflowId = response.data.workflow_id
      
      // Poll for results
      await pollForResults(workflowId)
      
    } catch (err: any) {
      console.error('Analysis error:', err)
      setError(err.response?.data?.detail || err.message || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const pollForResults = async (workflowId: string, maxAttempts = 60) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
      
      try {
        // Check status
        const statusResponse = await axios.get(`${API_URL}/api/rca/status/${workflowId}`)
        
        if (statusResponse.data.status === 'completed') {
          // Get results
          const resultResponse = await axios.get(`${API_URL}/api/rca/result/${workflowId}`)
          setResult(resultResponse.data)
          return
        } else if (statusResponse.data.status === 'failed') {
          setError('Analysis failed on the server')
          return
        }
        // If processing, continue polling
      } catch (err: any) {
        console.error('Polling error:', err)
        if (attempt === maxAttempts - 1) {
          setError('Analysis timed out. Please try again.')
        }
      }
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
                onClick={() => handleAnalyze()}
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
                    onClick={() => handleAnalyze(id)}
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
                Analysis Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Workflow ID</p>
                  <p className="font-mono text-sm text-blue-400 break-all">{result.workflow_id}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Anomaly ID</p>
                  <p className="font-mono text-sm text-purple-400">{result.anomaly_id}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Severity</p>
                  <span 
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold"
                    style={{
                      background: result.severity === 'high' ? 'rgba(255, 152, 0, 0.2)' : 
                                 result.severity === 'critical' ? 'rgba(244, 67, 54, 0.2)' : 
                                 'rgba(255, 193, 7, 0.2)',
                      color: result.severity === 'high' ? '#FF9800' : 
                             result.severity === 'critical' ? '#F44336' : 
                             '#FFC107'
                    }}
                  >
                    {result.severity.toUpperCase()}
                  </span>
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
              <div 
                className="p-8 backdrop-blur-lg rounded-2xl shadow-xl"
                style={{
                  background: 'rgba(255, 152, 0, 0.1)',
                  border: '1px solid rgba(255, 152, 0, 0.3)'
                }}
              >
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                  <span className="text-3xl">🔍</span>
                  <span style={{ color: '#FF9800' }}>Root Cause Identified</span>
                </h2>
                <p className="text-xl text-gray-200 leading-relaxed">{result.root_cause}</p>
                
                {result.causal_chain && result.causal_chain.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-gray-400 mb-3">Causal Chain:</p>
                    <div className="space-y-2">
                      {result.causal_chain.map((step: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                          <span className="text-orange-400 font-bold">{idx + 1}.</span>
                          <span className="text-gray-300">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Confidence Scores */}
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <span>📊</span>
                <span style={{ color: '#1976D2' }}>Agent Confidence Scores</span>
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { label: 'Diagnostic', value: result.diagnostic_confidence, color: { from: '#1976D2', to: '#00BCD4' } },
                  { label: 'Reasoning', value: result.reasoning_confidence, color: { from: '#9C27B0', to: '#E91E63' } },
                  { label: 'Planning', value: result.planning_confidence, color: { from: '#4CAF50', to: '#8BC34A' } }
                ].map(({ label, value, color }) => {
                  const percentage = ((value || 0) * 100).toFixed(1)
                  
                  return (
                    <div 
                      key={label} 
                      className="p-6 rounded-xl text-center transform hover:scale-105 transition-all duration-300"
                      style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                    >
                      <p className="text-sm text-gray-400 mb-3 uppercase tracking-wide">{label}</p>
                      <div 
                        className="text-5xl font-bold mb-3"
                        style={{
                          background: `linear-gradient(90deg, ${color.from}, ${color.to})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >
                        {percentage}%
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${percentage}%`,
                            background: `linear-gradient(90deg, ${color.from}, ${color.to})`
                          }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Symptoms & Affected Entities */}
            {(result.symptoms?.length > 0 || result.affected_entities?.length > 0) && (
              <div className="grid md:grid-cols-2 gap-6">
                {result.symptoms?.length > 0 && (
                  <div 
                    className="p-6 rounded-2xl backdrop-blur-lg"
                    style={{ background: 'rgba(25, 118, 210, 0.1)', border: '1px solid rgba(25, 118, 210, 0.3)' }}
                  >
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#1976D2' }}>
                      <span>🔬</span> Symptoms Detected
                    </h3>
                    <ul className="space-y-2">
                      {result.symptoms.map((symptom: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-300">
                          <span className="text-blue-400">•</span>
                          <span>{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {result.affected_entities?.length > 0 && (
                  <div 
                    className="p-6 rounded-2xl backdrop-blur-lg"
                    style={{ background: 'rgba(156, 39, 176, 0.1)', border: '1px solid rgba(156, 39, 176, 0.3)' }}
                  >
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#9C27B0' }}>
                      <span>⚙️</span> Affected Entities
                    </h3>
                    <ul className="space-y-2">
                      {result.affected_entities.map((entity: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-300">
                          <span className="text-purple-400">•</span>
                          <span>{entity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Recommended Actions */}
            {result.recommended_actions?.length > 0 && (
              <div 
                className="p-8 backdrop-blur-lg rounded-2xl shadow-xl"
                style={{ background: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.3)' }}
              >
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                  <span>🛠️</span>
                  <span style={{ color: '#4CAF50' }}>Recommended Actions</span>
                </h2>
                <div className="space-y-4">
                  {result.recommended_actions.map((action: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-lg"
                      style={{ background: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.2)' }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-green-400 font-bold text-lg">{idx + 1}</span>
                        <div className="flex-1">
                          <p className="text-white font-semibold mb-1">
                            {action.action || action.description || action}
                          </p>
                          {action.priority && (
                            <span className="text-xs px-2 py-1 rounded" style={{ 
                              background: action.priority === 'high' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(76, 175, 80, 0.2)',
                              color: action.priority === 'high' ? '#FF9800' : '#4CAF50'
                            }}>
                              {action.priority} priority
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Explanation */}
            {result.final_explanation && (
              <div className="p-8 bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                  <span>📝</span>
                  Detailed Analysis
                </h2>
                <div className="p-6 bg-slate-900/50 rounded-xl border border-white/10">
                  <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-mono">
                    {result.final_explanation}
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
