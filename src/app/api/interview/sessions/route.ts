import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import openai from '@/lib/openai'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = (session.user as any).id
    const sessions = await prisma.interviewSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { questions: true } } },
    })
    return NextResponse.json({ sessions })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = (session.user as any).id
    const { jobTitle, company, jobDescription, interviewType, questionCount = 5 } = await req.json()

    if (!jobTitle) return NextResponse.json({ error: 'Job title required' }, { status: 400 })

    const count = Math.min(Math.max(parseInt(questionCount) || 5, 1), 15)

    // Generate questions with GPT-4o
    const prompt = `Generate ${count} ${interviewType} interview questions for a ${jobTitle} position${company ? ` at ${company}` : ''}.${jobDescription ? `\nJob description: ${jobDescription.substring(0, 500)}` : ''}

Return ONLY a JSON array with no additional text: [{"questionText": "...", "questionType": "BEHAVIORAL|TECHNICAL"}]`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    })

    const text = completion.choices[0]?.message?.content || '[]'
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error('Failed to parse questions')

    const questionsData: { questionText: string; questionType: string }[] = JSON.parse(jsonMatch[0])

    const interviewSession = await prisma.interviewSession.create({
      data: {
        userId,
        jobTitle,
        company: company || null,
        jobDescription: jobDescription || null,
        interviewType,
        questions: {
          create: questionsData.map((q, i) => ({
            questionText: q.questionText,
            questionType: q.questionType || interviewType,
            order: i,
          })),
        },
      },
      include: { questions: true },
    })

    return NextResponse.json(interviewSession, { status: 201 })
  } catch (error: any) {
    console.error('Create session error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}