import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import openai from '@/lib/openai'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { transcribedText } = await req.json()
    if (!transcribedText?.trim()) return NextResponse.json({ error: 'Answer is required' }, { status: 400 })

    const question = await prisma.question.findUnique({ where: { id: params.id } })
    if (!question) return NextResponse.json({ error: 'Question not found' }, { status: 404 })

    const prompt = `You are an expert interview coach evaluating a candidate's answer.

Question: "${question.questionText}"
Question Type: ${question.questionType}
Candidate's Answer: "${transcribedText}"

Evaluate this answer and respond with ONLY valid JSON (no markdown, no extra text):
{
  "score": <number 0-100>,
  "feedback": "<2-3 sentences of specific, actionable feedback mentioning what was good and what could improve>",
  "dimensions": {
    "communication": <number 0-100>,
    "relevance": <number 0-100>,
    "depth": <number 0-100>,
    "clarity": <number 0-100>,
    "structure": <number 0-100>
  }
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
    })

    const text = completion.choices[0]?.message?.content || '{}'
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Failed to parse evaluation')

    const evaluation = JSON.parse(jsonMatch[0])
    const score = Math.min(100, Math.max(0, evaluation.score || 50))
    const feedback = evaluation.feedback || 'Answer received.'

    await prisma.question.update({
      where: { id: params.id },
      data: {
        userAnswer: transcribedText,
        aiFeedback: feedback,
        score,
      },
    })

    return NextResponse.json({ score, feedback, dimensions: evaluation.dimensions || {} })
  } catch (error: any) {
    console.error('Answer evaluation error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}