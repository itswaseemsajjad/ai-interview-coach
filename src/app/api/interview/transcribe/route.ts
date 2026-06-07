import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import openai from '@/lib/openai'
import { writeFileSync, unlinkSync, createReadStream } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const audio = formData.get('audio') as File

    if (!audio) return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })

    const bytes = await audio.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const tmpPath = join(tmpdir(), `audio_${Date.now()}.webm`)
    writeFileSync(tmpPath, buffer)

    try {
      const transcript = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: createReadStream(tmpPath) as any,
        response_format: 'json',
      })
      unlinkSync(tmpPath)
      return NextResponse.json({ transcript: transcript.text })
    } catch (err) {
      try { unlinkSync(tmpPath) } catch {}
      throw err
    }
  } catch (error: any) {
    console.error('Transcribe error:', error)
    return NextResponse.json({ error: error.message || 'Transcription failed' }, { status: 500 })
  }
}