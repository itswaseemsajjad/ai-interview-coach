interface QuestionCardProps {
  question: string
  questionType: string
  questionNumber: number
  totalQuestions: number
}

const typeColors: Record<string, string> = {
  BEHAVIORAL: 'bg-blue-100 text-blue-700',
  TECHNICAL: 'bg-purple-100 text-purple-700',
}

export default function QuestionCard({ question, questionType, questionNumber, totalQuestions }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColors[questionType] || 'bg-gray-100 text-gray-700'}`}>
          {questionType}
        </span>
        <span className="text-sm text-gray-400 font-medium">
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>
      <p className="text-xl font-medium text-gray-900 leading-relaxed">{question}</p>
    </div>
  )
}