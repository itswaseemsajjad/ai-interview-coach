import Link from 'next/link'
import { format } from 'date-fns'

interface SessionRowProps {
  session: {
    id: string
    jobTitle: string
    company: string | null
    interviewType: string
    overallScore: number | null
    createdAt: string
    status: string
    _count?: { questions: number }
  }
}

export default function SessionRow({ session }: SessionRowProps) {
  const scoreColor = !session.overallScore ? 'text-gray-400' : session.overallScore >= 70 ? 'text-green-600' : session.overallScore >= 40 ? 'text-yellow-600' : 'text-red-600'

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div>
          <p className="text-sm font-medium text-gray-900">{session.jobTitle}</p>
          {session.company && <p className="text-xs text-gray-400">{session.company}</p>}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
          session.interviewType === 'TECHNICAL' ? 'bg-purple-100 text-purple-700' :
          session.interviewType === 'MIXED' ? 'bg-orange-100 text-orange-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {session.interviewType}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`text-sm font-semibold ${scoreColor}`}>
          {session.overallScore !== null ? `${Math.round(session.overallScore)}/100` : '—'}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {format(new Date(session.createdAt), 'MMM d, yyyy')}
      </td>
      <td className="px-6 py-4">
        <Link
          href={`/interview/${session.id}/results`}
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          View Results
        </Link>
      </td>
    </tr>
  )
}