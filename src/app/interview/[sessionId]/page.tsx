'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import QuestionCard from '@/components/interview/QuestionCard'
import VoiceRecorder from '@/components/interview/VoiceRecorder'
import { ArrowRight, Brain, Loader2 } from 'lucide-react'

interface Question {
  id: string
  questionText: string
  questionType: string
  order: number
}

interface Session {
  id: string
  jobTitle: string
  company: string | null
  interviewType: string
  questions: Question[]
}

export default function InterviewPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string

  const [session, setSession] = useState<Session | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ score: number; feedback: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/interview/sessions/${sessionId}`)
      .then((r) => r.json())
      .then((d) => {
        setSession(d.session)
        setLoading(false)
      })
  }, [sessionId])

  const currentQuestion = session?.questions[currentIndex]

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || !currentQuestion) return
    setSubmitting(true)

    try {
      const res = await fetch(`/api/interview/questions/${currentQuestion.id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcribedText: answer }),
      })
      const data = await res.json()
      setFeedback({ score: data.score, feedback: data.feedback })
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleNext = async () => {
    const questions = session?.questions || []
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setAnswer('')
      setFeedback(null)
    } else {
      // Complete session
      await fetch(`/api/interview/sessions/${sessionId}/complete`, { method: 'POST' })
      router.push(`/interview/${sessionId}/results`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-3" />
          <p className="text-gray-500">Loading your interview...</p>
        </div>
      </div>
    )
  }

  if (!session || !currentQuestion) return null

  const questions = session.questions
  const progress = ((currentIndex) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-emerald-600" />
            <span className="text-base font-bold text-gray-900">{session.jobTitle}</span>
            {session.company && <span className="text-gray-400 text-sm">@ {session.company}</span>}
          </div>
          <span className="text-sm text-gray-500">{currentIndex + 1} / {questions.length}</span>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div className="h-1 bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <QuestionCard
          question={currentQuestion.questionText}
          questionType={currentQuestion.questionType}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
        />

        {/* Voice Recorder */}
        {!feedback && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-6 text-center">Record or Type Your Answer</h3>
            <div className="flex justify-center mb-6">
              <VoiceRecorder onTranscript={(text) => setAnswer((prev) => prev ? prev + ' ' + text : text)} />
            </div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={5}
              placeholder="Your answer will appear here after transcription, or type directly..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
            />
            <button
              onClick={handleSubmitAnswer}
              disabled={!answer.trim() || submitting}
              className="mt-4 w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Evaluating with AI...</>
              ) : (
                'Submit Answer'
              )}
            </button>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">AI Feedback</h3>
              <span className={`text-2xl font-bold ${feedback.score >= 70 ? 'text-emerald-600' : feedback.score >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                {Math.round(feedback.score)}/100
              </span>
            </div>
            <div className={`p-4 rounded-xl text-sm leading-relaxed ${
              feedback.score >= 70 ? 'bg-emerald-50 text-emerald-800' :
              feedback.score >= 40 ? 'bg-yellow-50 text-yellow-800' :
              'bg-red-50 text-red-800'
            }`}>
              {feedback.feedback}
            </div>
            <button
              onClick={handleNext}
              className="mt-4 w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2 transition-colors"
            >
              {currentIndex < questions.length - 1 ? (
                <><ArrowRight className="w-4 h-4" /> Next Question</>
              ) : (
                'View Results'
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}