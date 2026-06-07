# AI Interview Coach

An AI-powered interview practice platform with voice recording, Whisper transcription, and GPT-4o feedback.

## Features

- **AI Question Generation**: GPT-4o generates tailored interview questions based on job title, company, and description
- **Voice Recording**: Record answers using your browser microphone via MediaRecorder API
- **Whisper Transcription**: OpenAI Whisper automatically converts speech to text
- **GPT-4o Evaluation**: Instant AI feedback with scores across 5 dimensions (communication, relevance, depth, clarity, structure)
- **Performance Analytics**: Radar charts and score tracking across sessions
- **Multiple Interview Types**: Behavioral, Technical, or Mixed formats

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment Variables
```bash
cp .env.example .env
```
Fill in:
- `OPENAI_API_KEY` - Required for question generation, evaluation, and Whisper transcription
- `NEXTAUTH_SECRET` - Any random 32+ character string

### 3. Database setup
```bash
npx prisma db push
```

### 4. Run the app
```bash
npm run dev
```

Open http://localhost:3000

## How Voice Recording Works

1. The `VoiceRecorder` component uses the browser `MediaRecorder` API to capture audio
2. When you stop recording, the audio blob is sent to `/api/interview/transcribe`
3. The server writes the audio to a temp file and sends it to OpenAI Whisper
4. The transcribed text is returned and fills the answer textarea
5. You can also type your answer directly

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: OpenAI GPT-4o (questions + evaluation) + Whisper (transcription)
- **Database**: SQLite via Prisma
- **Auth**: NextAuth.js
- **Charts**: Recharts (RadarChart)
- **Styling**: Tailwind CSS
- **Language**: TypeScript