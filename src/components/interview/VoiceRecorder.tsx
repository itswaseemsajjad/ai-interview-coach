'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Loader2 } from 'lucide-react'

interface VoiceRecorderProps {
  onTranscript: (text: string) => void
}

export default function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
  const [state, setState] = useState<'idle' | 'recording' | 'transcribing'>('idle')
  const [seconds, setSeconds] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        setState('transcribing')
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const formData = new FormData()
        formData.append('audio', blob, 'recording.webm')

        try {
          const res = await fetch('/api/interview/transcribe', {
            method: 'POST',
            body: formData,
          })
          const data = await res.json()
          onTranscript(data.transcript || '')
        } catch (err) {
          console.error('Transcription error:', err)
        }
        setState('idle')
        setSeconds(0)
      }

      mediaRecorder.start()
      setState('recording')
      setSeconds(0)
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } catch (err) {
      console.error('Mic error:', err)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    mediaRecorderRef.current?.stop()
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={state === 'idle' ? startRecording : state === 'recording' ? stopRecording : undefined}
        disabled={state === 'transcribing'}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
          state === 'idle'
            ? 'bg-gray-200 hover:bg-gray-300 text-gray-600'
            : state === 'recording'
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {state === 'idle' && <Mic className="w-8 h-8" />}
        {state === 'recording' && <Square className="w-7 h-7" />}
        {state === 'transcribing' && <Loader2 className="w-7 h-7 animate-spin" />}
      </button>
      <div className="text-sm text-gray-500">
        {state === 'idle' && 'Click mic to record your answer'}
        {state === 'recording' && (
          <span className="text-red-500 font-medium">Recording... {seconds}s (click to stop)</span>
        )}
        {state === 'transcribing' && <span className="text-blue-500">Transcribing with Whisper AI...</span>}
      </div>
    </div>
  )
}