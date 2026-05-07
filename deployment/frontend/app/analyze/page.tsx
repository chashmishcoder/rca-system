'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://rca-backend-5jlv.onrender.com'

const DATASET_MEANS: Record<string, number> = {
  air_temperature:     300.5,
  process_temperature: 310.8,
  rotational_speed:    1538.0,
  torque:              40.0,
  tool_wear:           108.0,
}

interface Equipment { equipment_id: string; name: string; status: string }

const SAMPLE_READINGS = [
  {
    label: 'Normal Operation',
    description: 'Typical healthy machine state',
    values: { air_temperature: '298.1', process_temperature: '308.6', rotational_speed: '1551', torque: '42.8', tool_wear: '0' }
  },
  {
    label: 'High Wear Anomaly',
    description: 'Elevated tool wear + torque \u2192 likely failure',
    values: { air_temperature: '302.4', process_temperature: '312.4', rotational_speed: '1460', torque: '69.1', tool_wear: '198' }
  },
  {
    label: 'Overstrain Risk',
    description: 'Low RPM, extreme torque',
    values: { air_temperature: '300.5', process_temperature: '310.8', rotational_speed: '1200', torque: '74.5', tool_wear: '150' }
  },
]

const SENSOR_FIELDS = [
  { key: 'air_temperature',     label: 'Air Temperature (K)',     placeholder: '295 \u2013 305 K',    unit: 'K' },
  { key: 'process_temperature', label: 'Process Temperature (K)', placeholder: '305 \u2013 314 K',    unit: 'K' },
  { key: 'rotational_speed',    label: 'Rotational Speed (RPM)',  placeholder: '1168 \u2013 2886 RPM', unit: 'RPM' },
  { key: 'torque',              label: 'Torque (Nm)',             placeholder: '3.8 \u2013 76.6 Nm',  unit: 'Nm' },
  { key: 'tool_wear',           label: 'Tool Wear (min)',         placeholder: '0 \u2013 253 min',     unit: 'min' },
]

export default function AnalyzePage() {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([])
  const [selectedEqId, setSelectedEqId]   = useState('')
  const [autoFilled, setAutoFilled]       = useState<Set<string>>(new Set())
  const [prefillStatus, setPrefillStatus] = useState<'idle' | 'loading' | 'done' | 'no-data'>('idle')

  const [airTemp,  setAirTemp]  = useState('')
  const [procTemp, setProcTemp] = useState('')
  const [rpm,      setRpm]      = useState('')
  const [torque,   setTorque]   = useState('')
  const [toolWear, setToolWear] = useState('')

  const [loading,   setLoading]   = useState(false)
  const [result,    setResult]    = useState<any>(null)
  const [noAnomaly, setNoAnomaly] = useState<any>(null)
  const [error,     setError]     = useState('')

  const SETTERS: Record<string, (v: string) => void> = {
    air_temperature:     setAirTemp,
    process_temperature: setProcTemp,
    rotational_speed:    setRpm,
    torque:              setTorque,
    tool_wear:           setToolWear,
  }
  const VALUES: Record<string, string> = {
    air_temperature:     airTemp,
    process_temperature: procTemp,
    rotational_speed:    rpm,
    torque,
    tool_wear:           toolWear,
  }

  useEffect(() => {
    fetch(`${API_URL}/api/equipment`)
      .then((r) => r.ok ? r.json() : [])
      .then((data: Equipment[]) => setEquipmentList(data))
      .catch(() => {})
  }, [])

  async function handleEquipmentSelect(eqId: string) {
    setSelectedEqId(eqId)
    setResult(null); setNoAnomaly(null); setError('')
    if (!eqId) { setAutoFilled(new Set()); setPrefillStatus('idle'); return }

    setPrefillStatus('loading')
    try {
      const res = await fetch(`${API_URL}/api/sensors/latest?equipment_id=${eqId}&limit=1`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      const reading = data[0]
      const filled = new Set<string>()
      for (const f of SENSOR_FIELDS) {
        const raw = reading?.[f.key]
        if (raw != null && typeof raw === 'number') {
          SETTERS[f.key](raw.toFixed(1))
          filled.add(f.key)
        } else {
          SETTERS[f.key]('')
        }
      }
      setAutoFilled(filled)
      setPrefillStatus(filled.size > 0 ? 'done' : 'no-data')
    } catch {
      setPrefillStatus('no-data')
      setAutoFilled(new Set())
    }
  }

  const applySample = (sample: typeof SAMPLE_READINGS[0]) => {
    setSelectedEqId('')
    setAutoFilled(new Set())
    setPrefillStatus('idle')
    setAirTemp(sample.values.air_temperature)
    setProcTemp(sample.values.process_temperature)
    setRpm(sample.values.rotational_speed)
    setTorque(sample.values.torque)
    setToolWear(sample.values.tool_wear)
    setResult(null); setNoAnomaly(null); setError('')
  }

  const handleAnalyze = async () => {
    const resolved = {
      air_temperature:     parseFloat(airTemp)  || DATASET_MEANS.air_temperature,
      process_temperature: parseFloat(procTemp) || DATASET_MEANS.process_temperature,
      rotational_speed:    parseFloat(rpm)      || DATASET_MEANS.rotational_speed,
      torque:              parseFloat(torque)   || DATASET_MEANS.torque,
      tool_wear:           parseFloat(toolWear) || DATASET_MEANS.tool_wear,
    }

    if (!airTemp && !procTemp && !rpm && !torque && !toolWear && !selectedEqId) {
      setError('Please select an equipment or enter sensor readings before analyzing.')
      return
    }

    setLoading(true); setError(''); setResult(null); setNoAnomaly(null)

    try {
      const payload: any = { ...resolved }
      if (selectedEqId) payload.machine_id = selectedEqId

      const response = await axios.post(`${API_URL}/api/sensor/ingest`, payload)
      const data = response.data

      if (!data.anomaly_detected) { setNoAnomaly(data); return }
      await pollForResults(data.workflow_id)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const pollForResults = async (workflowId: string, maxAttempts = 60) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      try {
        const statusResponse = await axios.get(`${API_URL}/api/rca/status/${workflowId}`)
        if (statusResponse.data.status === 'completed') {
          const resultResponse = await axios.get(`${API_URL}/api/rca/result/${workflowId}`)
          setResult(resultResponse.data); return
        } else if (statusResponse.data.status === 'failed') {
          setError('Analysis failed on the server'); return
        }
      } catch (err: any) {
        if (attempt === maxAttempts - 1) setError('Analysis timed out. Please try again.')
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
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl" />

          <div className="relative z-10">
            <h2 className="text-lg font-semibold text-gray-200 mb-6">Enter Sensor Readings</h2>

            {/* Equipment selector */}
            <div className="mb-6">
              <label className="block text-xs font-semibold mb-1.5 text-gray-400 uppercase tracking-wide">
                Equipment (optional \u2014 auto-fills latest readings)
              </label>
              <select
                value={selectedEqId}
                onChange={(e) => handleEquipmentSelect(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">\u2014 Select equipment to auto-fill \u2014</option>
                {equipmentList.map((eq) => (
                  <option key={eq.equipment_id} value={eq.equipment_id}>
                    {eq.name || eq.equipment_id} ({eq.equipment_id}) \u2014 {eq.status}
                  </option>
                ))}
              </select>

              {prefillStatus === 'loading' && (
                <p className="text-xs text-blue-400 mt-1.5">Fetching latest readings\u2026</p>
              )}
              {prefillStatus === 'done' && (
                <p className="text-xs text-emerald-400 mt-1.5">
                  Auto-filled {autoFilled.size} field{autoFilled.size !== 1 ? 's' : ''} from latest reading.
                  {autoFilled.size < 5 && ' Empty fields will use dataset means.'}
                </p>
              )}
              {prefillStatus === 'no-data' && (
                <p className="text-xs text-amber-400 mt-1.5">No sensor history found \u2014 enter readings manually or use a sample below.</p>
              )}
            </div>

            {/* Sensor fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {SENSOR_FIELDS.map(({ key, label, placeholder }) => {
                const isAutoFilled = autoFilled.has(key)
                const meanVal = DATASET_MEANS[key]
                return (
                  <div key={key}>
                    <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                      <span className="text-gray-400">{label}</span>
                      {isAutoFilled && (
                        <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded font-medium normal-case tracking-normal">
                          auto-filled
                        </span>
                      )}
                      {!isAutoFilled && selectedEqId && prefillStatus === 'done' && (
                        <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] rounded font-medium normal-case tracking-normal">
                          using mean
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={VALUES[key]}
                      onChange={(e) => {
                        SETTERS[key](e.target.value)
                        setAutoFilled((prev) => { const n = new Set(prev); n.delete(key); return n })
                      }}
                      placeholder={isAutoFilled || selectedEqId ? String(meanVal) : placeholder}
                      className={`w-full px-4 py-3 bg-slate-900/50 border text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-600 transition-all duration-300 ${
                        isAutoFilled ? 'border-emerald-500/40' : 'border-white/10'
                      }`}
                      disabled={loading}
                    />
                  </div>
                )
              })}

              {/* Analyze button in 6th cell */}
              <div className="flex items-end">
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Analyzing...
                    </span>
                  ) : 'Analyze'}
                </button>
              </div>
            </div>

            {/* Sample Readings */}
            <div className="mt-2">
              <p className="text-sm font-semibold mb-3 text-gray-400">Quick Start \u2014 Load a Sample Reading:</p>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_READINGS.map(sample => (
                  <button
                    key={sample.label}
                    onClick={() => applySample(sample)}
                    title={sample.description}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 text-gray-300 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm"
                    disabled={loading}
                  >
                    {sample.label}
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
              <span className="text-2xl">\u26a0\ufe0f</span>
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
                <p className="text-gray-400 text-sm">Processing anomaly data \u2022 Analyzing patterns \u2022 Generating insights</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-6">
              {['Diagnostic', 'Reasoning', 'Planning', 'Learning'].map((agent, i) => (
                <div key={agent} className="text-center p-3 bg-white/5 rounded-lg border border-white/10 animate-pulse" style={{ animationDelay: `${i * 150}ms` }}>
                  <div className="text-2xl mb-1">\ud83e\udd16</div>
                  <p className="text-xs text-gray-400">{agent}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Anomaly Detected */}
        {noAnomaly && (
          <div className="p-6 bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/40 rounded-2xl mb-8 backdrop-blur-lg">
            <div className="flex items-start gap-4">
              <span className="text-4xl">\u2705</span>
              <div className="flex-1">
                <p className="text-green-300 font-bold text-xl mb-1">No Anomaly Detected</p>
                <p className="text-gray-400 mb-4">Equipment is operating within normal parameters.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Ensemble Score', value: noAnomaly.ensemble_score?.toFixed(3) },
                    { label: 'LSTM Score',      value: noAnomaly.lstm_normalized_score?.toFixed(3) },
                    { label: 'RF Probability',  value: noAnomaly.rf_probability?.toFixed(3) },
                    { label: 'Recon. Error',    value: noAnomaly.reconstruction_error?.toFixed(6) },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 bg-white/5 rounded-lg border border-white/10 text-center">
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{label}</p>
                      <p className="text-green-300 font-mono font-bold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Success Badge */}
            <div className="p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-2xl backdrop-blur-lg">
              <div className="flex items-center gap-3">
                <span className="text-3xl">\u2705</span>
                <div>
                  <p className="text-green-300 font-bold text-lg">Analysis Complete!</p>
                  <p className="text-gray-400 text-sm">Root cause successfully identified</p>
                </div>
              </div>
            </div>

            {/* Job Info */}
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-white">Analysis Information</h2>
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
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold"
                    style={{
                      background: result.severity === 'critical' ? 'rgba(244,67,54,0.2)' : result.severity === 'high' ? 'rgba(255,152,0,0.2)' : 'rgba(255,193,7,0.2)',
                      color: result.severity === 'critical' ? '#F44336' : result.severity === 'high' ? '#FF9800' : '#FFC107'
                    }}>
                    {result.severity?.toUpperCase()}
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
              <div className="p-8 backdrop-blur-lg rounded-2xl shadow-xl"
                style={{ background: 'rgba(255,152,0,0.1)', border: '1px solid rgba(255,152,0,0.3)' }}>
                <h2 className="text-2xl font-bold mb-6 text-white" style={{ color: '#FF9800' }}>Root Cause Identified</h2>
                <p className="text-xl text-gray-200 leading-relaxed">{result.root_cause}</p>
                {result.causal_chain?.length > 0 && (
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
              <h2 className="text-2xl font-bold mb-6 text-white">Agent Confidence Scores</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { label: 'Diagnostic', value: result.diagnostic_confidence, from: '#1976D2', to: '#00BCD4' },
                  { label: 'Reasoning',  value: result.reasoning_confidence,  from: '#9C27B0', to: '#E91E63' },
                  { label: 'Planning',   value: result.planning_confidence,   from: '#4CAF50', to: '#8BC34A' },
                ].map(({ label, value, from, to }) => {
                  const pct = ((value || 0) * 100).toFixed(1)
                  return (
                    <div key={label} className="p-6 rounded-xl text-center"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <p className="text-sm text-gray-400 mb-3 uppercase tracking-wide">{label}</p>
                      <div className="text-5xl font-bold mb-3"
                        style={{ background: `linear-gradient(90deg,${from},${to})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        {pct}%
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${pct}%`, background: `linear-gradient(90deg,${from},${to})` }} />
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
                  <div className="p-6 rounded-2xl backdrop-blur-lg"
                    style={{ background: 'rgba(25,118,210,0.1)', border: '1px solid rgba(25,118,210,0.3)' }}>
                    <h3 className="text-xl font-bold mb-4" style={{ color: '#1976D2' }}>Symptoms Detected</h3>
                    <ul className="space-y-2">
                      {result.symptoms.map((s: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300">
                          <span className="text-blue-400">\u2022</span><span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.affected_entities?.length > 0 && (
                  <div className="p-6 rounded-2xl backdrop-blur-lg"
                    style={{ background: 'rgba(156,39,176,0.1)', border: '1px solid rgba(156,39,176,0.3)' }}>
                    <h3 className="text-xl font-bold mb-4" style={{ color: '#9C27B0' }}>Affected Entities</h3>
                    <ul className="space-y-2">
                      {result.affected_entities.map((e: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300">
                          <span className="text-purple-400">\u2022</span><span>{e}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Recommended Actions */}
            {result.recommended_actions?.length > 0 && (
              <div className="p-8 backdrop-blur-lg rounded-2xl shadow-xl"
                style={{ background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.3)' }}>
                <h2 className="text-2xl font-bold mb-6 text-white" style={{ color: '#4CAF50' }}>Recommended Actions</h2>
                <div className="space-y-4">
                  {result.recommended_actions.map((action: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-lg"
                      style={{ background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.2)' }}>
                      <div className="flex items-start gap-3">
                        <span className="text-green-400 font-bold text-lg">{idx + 1}</span>
                        <div className="flex-1">
                          <p className="text-white font-semibold mb-1">{action.action || action.description || action}</p>
                          {action.priority && (
                            <span className="text-xs px-2 py-1 rounded" style={{
                              background: action.priority === 'critical' ? 'rgba(244,67,54,0.2)' : action.priority === 'high' ? 'rgba(255,152,0,0.2)' : 'rgba(76,175,80,0.2)',
                              color: action.priority === 'critical' ? '#F44336' : action.priority === 'high' ? '#FF9800' : '#4CAF50'
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
                <h2 className="text-2xl font-bold mb-6 text-white">Detailed Analysis</h2>
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
