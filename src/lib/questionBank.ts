export interface QuestionTemplate {
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  followUps: string[]
}

export const questionBank: QuestionTemplate[] = [
  {
    category: 'Behavioral',
    difficulty: 'easy',
    question: 'Tell me about yourself and your background.',
    followUps: ['What are you most proud of professionally?', 'Where do you see yourself in 5 years?'],
  },
  {
    category: 'Behavioral',
    difficulty: 'medium',
    question: 'Describe a time you had to deal with a difficult colleague or team member.',
    followUps: ['How did it affect the team?', 'What would you do differently?'],
  },
  {
    category: 'Behavioral',
    difficulty: 'hard',
    question: 'Tell me about a time you had to make a critical decision with incomplete information.',
    followUps: ['What was the outcome?', 'How did you manage the risk?'],
  },
  {
    category: 'Leadership',
    difficulty: 'medium',
    question: 'Describe a situation where you had to lead a project under tight deadlines.',
    followUps: ['How did you prioritize tasks?', 'How did you keep the team motivated?'],
  },
  {
    category: 'Problem Solving',
    difficulty: 'hard',
    question: 'Describe the most complex problem you have solved in your career.',
    followUps: ['What was your approach?', 'What would you do differently with hindsight?'],
  },
]

export function getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): QuestionTemplate[] {
  return questionBank.filter((q) => q.difficulty === difficulty)
}
