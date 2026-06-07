import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import SessionRow from '@/components/dashboard/SessionRow'
import { Brain, Plus, TrendingUp, Star, Hash, LogOut } from 'lucide-react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/login')

  const userId = (session.user as any).id

  const sessions = await prisma.interviewSession.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { questions: true } } },
  })

  const completedSessions = sessions.filter((s) => s.status === 'COMPLETED' && s.overallScore !== null)
  const totalSessions = sessions.length
  const avgScore = completedSessions.length > 0
    ? completedSessions.reduce((sum, s) => sum + (s.overallScore || 0), 0) / completedSessions.length
    : 0
  const bestScore = completedSessions.length > 0
    ? Math.max(...completedSessions.map((s) => s.overallScore || 0))
    : 0

  const recentSessions = sessions.slice(0, 10)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-emerald-600" />
            <span className="text-lg font-bold text-gray-900">InterviewAI</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-emerald-600">Dashboard</Link>
            <Link href="/history" className="text-sm text-gray-600 hover:text-gray-900">History</Link>
            <Link href="/api/auth/signout" className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1">
              <LogOut className="w-4 h-4" /> Sign Out
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {session.user.name}!</h1>
            <p className="text-gray-500 text-sm mt-1">Ready to practice your next interview?</p>
          </div>
          <Link href="/interview/setup"
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm">
            <Plus className="w-4 h-4" /> Start New Interview
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: <Hash className="w-5 h-5" />, value: totalSessions.toString(), label: 'Total Sessions', color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: <TrendingUp className="w-5 h-5" />, value: avgScore > 0 ? `${avgScore.toFixed(0)}/100` : '—', label: 'Average Score', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { icon: <Star className="w-5 h-5" />, value: bestScore > 0 ? `${bestScore.toFixed(0)}/100` : '—', label: 'Best Score', color: 'text-yellow-600', bg: 'bg-yellow-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sessions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Recent Sessions</h2>
            <Link href="/history" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">View all</Link>
          </div>
          {recentSessions.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No sessions yet.{' '}
              <Link href="/interview/setup" className="text-emerald-600 hover:underline">Start your first interview</Link>
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
                  {recentSessions.map((s) => (
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