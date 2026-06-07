interface ScoreCircleProps {
  score: number
  size?: number
  strokeWidth?: number
}

export default function ScoreCircle({ score, size = 120, strokeWidth = 10 }: ScoreCircleProps) {
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const progress = ((100 - score) / 100) * circumference

  let color = '#10b981'
  if (score < 40) color = '#ef4444'
  else if (score < 70) color = '#f59e0b'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-gray-900">{Math.round(score)}</span>
        <span className="text-xs text-gray-400">/100</span>
      </div>
    </div>
  )
}