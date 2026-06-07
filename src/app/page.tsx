import Link from 'next/link'
import { Mic, Brain, TrendingUp, CheckCircle, Star, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-emerald-400" />
          <span className="text-xl font-bold">InterviewAI</span>
        </div>
        <div className="flex gap-4">
          <Link href="/auth/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Sign In</Link>
          <Link href="/auth/register" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors">Get Started</Link>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-8 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-800/40 px-4 py-2 rounded-full text-emerald-300 text-sm mb-8">
          <Zap className="w-4 h-4" />
          AI-Powered Interview Practice
        </div>
        <h1 className="text-6xl font-bold mb-6 leading-tight">
          Ace Every Interview with{' '}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            AI Coaching
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Practice with AI-generated questions, answer by voice, and receive instant GPT-4o feedback to land your dream job.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/register"
            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg">
            Start Practicing Free
          </Link>
          <Link href="/auth/login"
            className="px-8 py-4 border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors">
            Sign In
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '1', icon: <CheckCircle className="w-6 h-6" />, title: 'Setup Your Interview', desc: 'Enter the job title, company, description, and pick interview type: Behavioral, Technical, or Mixed.', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { step: '2', icon: <Mic className="w-6 h-6" />, title: 'Answer by Voice', desc: 'Use the microphone to record your answers. Whisper AI transcribes your speech in real time.', color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { step: '3', icon: <TrendingUp className="w-6 h-6" />, title: 'Get AI Feedback', desc: 'GPT-4o evaluates your answers for communication, depth, structure, and relevance.', color: 'text-purple-400', bg: 'bg-purple-500/10' },
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 relative">
              <div className="absolute top-4 right-4 text-4xl font-bold text-white/5">{item.step}</div>
              <div className={`inline-flex p-3 rounded-xl ${item.bg} ${item.color} mb-4`}>{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <Brain className="w-5 h-5" />, title: 'GPT-4o Feedback', desc: 'Detailed, actionable feedback on every answer with scoring across 5 dimensions.', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { icon: <Mic className="w-5 h-5" />, title: 'Voice Recording', desc: 'Record answers using your microphone with Whisper AI transcription.', color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: <Star className="w-5 h-5" />, title: 'Score Tracking', desc: 'Track your performance scores across sessions and see improvement over time.', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
            { icon: <TrendingUp className="w-5 h-5" />, title: 'Performance Radar', desc: 'Visualize your strengths across communication, relevance, depth, clarity, and structure.', color: 'text-pink-400', bg: 'bg-pink-500/10' },
            { icon: <CheckCircle className="w-5 h-5" />, title: 'Multiple Types', desc: 'Practice Behavioral, Technical, or Mixed interview formats for any role.', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
            { icon: <Zap className="w-5 h-5" />, title: 'Instant Results', desc: 'Get your score and detailed feedback immediately after completing each answer.', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          ].map((f, i) => (
            <div key={i} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className={`inline-flex p-2.5 rounded-lg ${f.bg} ${f.color} mb-3`}>{f.icon}</div>
              <h3 className="text-base font-semibold mb-1">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
        © 2024 InterviewAI. Ace every interview with AI coaching.
      </footer>
    </div>
  )
}