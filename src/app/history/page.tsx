import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import SessionRow from '@/components/dashboard/SessionRow'
import { Brain, ArrowLeft, Plus } from 'lucide-react'

export default async function HistoryPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/login')

  const userId = (session.user as any).id
  const sessions = await prisma.interviewSession.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { questions: true } } },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></Link>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-emerald-600" />
              <h1 className="text-base font-bold text-gray-900">Interview History</h1>
            </div>
          </div>
          <Link href="/interview/setup" className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> New Interview
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">All Sessions ({sessions.length})</h2>
          </div>
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No sessions yet. <Link href="/interview/setup" className="text-emerald-600 hover:underline">Start your first interview</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sessions.map((s) => (
                    <SessionRow key={s.id} session={{ ...s, createdAt: s.createdAt.toISOString() }} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}