import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const questions = await prisma.question.findMany({
      where: { sessionId: params.id, score: { not: null } },
    })

    const avgScore = questions.length > 0
      ? questions.reduce((sum, q) => sum + (q.score || 0), 0) / questions.length
      : null

    const updated = await prisma.interviewSession.update({
      where: { id: params.id },
      data: {
        status: 'COMPLETED',
        overallScore: avgScore,
        completedAt: new Date(),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}