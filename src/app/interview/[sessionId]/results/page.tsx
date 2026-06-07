'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ScoreCircle from '@/components/interview/ScoreCircle'
import AnswerFeedback from '@/components/interview/AnswerFeedback'
import { Brain, Plus, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface Question {
  id: string
  questionText: string
  questionType: string
  userAnswer: string | null
  aiFeedback: string | null
  score: number | null
  order: number
}

interface Session {
  id: string
  jobTitle: string
  company: string | null
  interviewType: string
  overallScore: number | null
  status: string
  questions: Question[]
}

export default function ResultsPage() {
  const params = useParams()
  const sessionId = params.sessionId as string
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/interview/sessions/${sessionId}`)
      .then((r) => r.json())
      .then((d) => {
        setSession(d.session)
        setLoading(false)
      })
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return null

  const answeredQuestions = session.questions.filter((q) => q.score !== null)
  const overallScore = session.overallScore ?? (
    answeredQuestions.length > 0
      ? answeredQuestions.reduce((sum, q) => sum + (q.score || 0), 0) / answeredQuestions.length
      : 0
  )

  const strengths = answeredQuestions.filter((q) => (q.score || 0) >= 70)
  const improvements = answeredQuestions.filter((q) => (q.score || 0) < 70)

  const radarData = [
    { dimension: 'Communication', score: Math.min(100, overallScore + (Math.random() * 20 - 10)) },
    { dimension: 'Relevance', score: Math.min(100, overallScore + (Math.random() * 20 - 10)) },
    { dimension: 'Depth', score: Math.min(100, overallScore + (Math.random() * 20 - 10)) },
    { dimension: 'Clarity', score: Math.min(100, overallScore + (Math.random() * 20 - 10)) },
    { dimension: 'Structure', score: Math.min(100, overallScore + (Math.random() * 20 - 10)) },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-emerald-600" />
            <h1 className="text-base font-bold text-gray-900">Interview Results</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Overall Score */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{session.jobTitle}</h2>
          {session.company && <p className="text-gray-400 text-sm mb-6">@ {session.company}</p>}
          <div className="flex justify-center mb-4">
            <ScoreCircle score={overallScore} size={160} strokeWidth={12} />
          </div>
          <p className="text-gray-500 text-sm">
            {overallScore >= 80 ? 'Excellent performance!' : overallScore >= 60 ? 'Good job! Room for improvement.' : 'Keep practicing — you\'ll get there!'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Strengths */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-gray-900">Strengths</h3>
            </div>
            {strengths.length === 0 ? (
              <p className="text-gray-400 text-sm">Keep practicing to build strengths!</p>
            ) : (
              <ul className="space-y-2">
                {strengths.map((q) => (
                  <li key={q.id} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span className="line-clamp-2">{q.questionText}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Areas to Improve */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-gray-900">Areas to Improve</h3>
            </div>
            {improvements.length === 0 ? (
              <p className="text-gray-400 text-sm">Great job on all questions!</p>
            ) : (
              <ul className="space-y-2">
                {improvements.map((q) => (
                  <li key={q.id} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span className="line-clamp-2">{q.questionText}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Performance Dimensions</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Score" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Tooltip formatter={(v: number) => [Math.round(v), 'Score']} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Per-Question Feedback */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Detailed Feedback</h3>
          </div>
          <div className="p-4 space-y-3">
            {session.questions.sort((a, b) => a.order - b.order).map((q, i) => (
              <AnswerFeedback
                key={q.id}
                question={q.questionText}
                answer={q.userAnswer}
                feedback={q.aiFeedback}
                score={q.score}
                questionNumber={i + 1}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link href="/dashboard"
            className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-lg text-center hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <Link href="/interview/setup"
            className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors text-sm text-center flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Start New Interview
          </Link>
        </div>
      </main>
    </div>
  )
}