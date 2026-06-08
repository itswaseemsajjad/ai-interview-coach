export interface ScoringDimension {
  id: string
  label: string
  description: string
  weight: number
}

export const scoringDimensions: ScoringDimension[] = [
  {
    id: 'relevance',
    label: 'Relevance',
    description: 'How well the answer addresses the question',
    weight: 0.25,
  },
  {
    id: 'structure',
    label: 'Structure',
    description: 'Clarity and organization of the response (STAR method)',
    weight: 0.20,
  },
  {
    id: 'specificity',
    label: 'Specificity',
    description: 'Use of concrete examples, metrics, and details',
    weight: 0.25,
  },
  {
    id: 'impact',
    label: 'Impact',
    description: 'Demonstrated results and outcomes',
    weight: 0.20,
  },
  {
    id: 'communication',
    label: 'Communication',
    description: 'Clarity and conciseness of expression',
    weight: 0.10,
  },
]

export function calculateWeightedScore(scores: Record<string, number>): number {
  return scoringDimensions.reduce((total, dim) => {
    const score = scores[dim.id] || 0
    return total + score * dim.weight
  }, 0)
}

export function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 85) return { label: 'Excellent', color: 'text-green-600' }
  if (score >= 70) return { label: 'Good', color: 'text-blue-600' }
  if (score >= 55) return { label: 'Fair', color: 'text-yellow-600' }
  return { label: 'Needs Work', color: 'text-red-600' }
}
