export interface InterviewTip {
  category: string
  icon: string
  tips: string[]
}

export const interviewTips: InterviewTip[] = [
  {
    category: 'Before the Interview',
    icon: '📚',
    tips: [
      'Research the company thoroughly — know their products, culture, and recent news',
      'Review the job description and prepare examples matching each requirement',
      'Practice the STAR method: Situation, Task, Action, Result',
      'Prepare 5-7 strong behavioral examples that can adapt to different questions',
    ],
  },
  {
    category: 'During the Interview',
    icon: '🎯',
    tips: [
      'Take a moment to think before answering — it shows thoughtfulness',
      'Use specific numbers and metrics when discussing achievements',
      'Ask clarifying questions if a question is unclear',
      'Show enthusiasm and genuine interest in the role and company',
    ],
  },
  {
    category: 'Behavioral Questions',
    icon: '💬',
    tips: [
      'Always structure answers with STAR: Situation, Task, Action, Result',
      'Focus on YOUR actions and contributions, not the team\'s',
      'Include quantifiable results whenever possible',
      'Choose examples that demonstrate growth and learning',
    ],
  },
  {
    category: 'Technical Questions',
    icon: '💻',
    tips: [
      'Think out loud — interviewers want to understand your reasoning process',
      'Break complex problems into smaller sub-problems',
      'If stuck, discuss your approach even if you can\'t write perfect code',
      'Ask about constraints and edge cases before diving into a solution',
    ],
  },
]
