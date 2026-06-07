'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface AnswerFeedbackProps {
  question: string
  answer: string | null
  feedback: string | null
  score: number | null
  questionNumber: number
}

export default function AnswerFeedback({ question, answer, feedback, score, questionNumber }: AnswerFeedbackProps) {
  const [expanded, setExpanded] = useState(false)

  const scoreColor = !score ? 'bg-gray-100 text-gray-600' : score >= 70 ? 'bg-green-100 text-green-700' : score >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">Q{questionNumber}</span>
          <span className="text-sm font-medium text-gray-900 line-clamp-1">{question}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {score !== null && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${scoreColor}`}>
              {Math.round(score)}/100
            </span>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>
      {expanded && (
        <div className="p-4 space-y-3">
          {answer && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Your Answer</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{answer}</p>
            </div>
          )}
          {feedback && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">AI Feedback</p>
              <div className={`text-sm rounded-lg p-3 ${score && score >= 70 ? 'bg-green-50 text-green-800' : score && score >= 40 ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800'}`}>
                {feedback}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}