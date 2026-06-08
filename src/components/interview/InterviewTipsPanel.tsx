'use client'
import { useState } from 'react'
import { interviewTips } from '@/lib/interviewTips'

export function InterviewTipsPanel() {
  const [activeCategory, setActiveCategory] = useState(0)
  const category = interviewTips[activeCategory]

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-blue-800 mb-3">💡 Interview Tips</h3>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {interviewTips.map((cat, i) => (
          <button
            key={cat.category}
            onClick={() => setActiveCategory(i)}
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
              activeCategory === i
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
            }`}
          >
            {cat.icon} {cat.category}
          </button>
        ))}
      </div>
      <ul className="space-y-2">
        {category.tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-blue-700">
            <span className="text-blue-400 mt-0.5 shrink-0">•</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  )
}
