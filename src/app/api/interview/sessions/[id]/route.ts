import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const interviewSession = await prisma.interviewSession.findUnique({
      where: { id: params.id },
      include: { questions: { orderBy: { order: 'asc' } } },
    })

    if (!interviewSession) return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    return NextResponse.json({ session: interviewSession })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}