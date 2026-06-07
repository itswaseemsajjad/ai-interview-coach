'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Brain, Loader2 } from 'lucide-react'

export default function InterviewSetupPage() {
  const router = useRouter()
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [interviewType, setInterviewType] = useState('BEHAVIORAL')
  const [questionCount, setQuestionCount] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/interview/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, company, jobDescription, interviewType, questionCount }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create session')
      } else {
        router.push(`/interview/${data.id}`)
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-emerald-600" />
            <h1 className="text-base font-bold text-gray-900">Setup Interview</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Configure Your Practice Interview</h2>
          <p className="text-gray-500 text-sm mb-6">AI will generate tailored questions based on your setup.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title <span className="text-red-500">*</span></label>
              <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                placeholder="e.g. Senior Software Engineer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company (optional)</label>
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                placeholder="e.g. Google, Meta, Startup" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description (optional)</label>
              <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
                placeholder="Paste the job description for more relevant questions..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interview Type</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'BEHAVIORAL', label: 'Behavioral', desc: 'Situational & past experience' },
                  { value: 'TECHNICAL', label: 'Technical', desc: 'Skills & problem solving' },
                  { value: 'MIXED', label: 'Mixed', desc: 'Combination of both' },
                ].map((type) => (
                  <button key={type.value} type="button" onClick={() => setInterviewType(type.value)}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      interviewType === type.value ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <p className="text-sm font-medium text-gray-900">{type.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
              <select value={questionCount} onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white">
                <option value={5}>5 questions (~10 min)</option>
                <option value={10}>10 questions (~20 min)</option>
                <option value={15}>15 questions (~30 min)</option>
              </select>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating Questions...</>
              ) : (
                'Start Interview'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}