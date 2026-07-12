# SkillPath.AI

SkillPath.AI is a premium SaaS-style career preparation app built with Next.js App Router, TypeScript, and Tailwind CSS. It helps students and early-career candidates improve job readiness through skill matching, ATS resume analysis, mock interview practice, and a role-specific roadmap.

## Features

- Landing page, auth UI, and responsive dashboard shell
- Skill Match with resume parsing and rules-based role matching
- Resume ATS Checker with dynamic scoring and suggestions
- Interview AI with browser recording, transcription route, and feedback flow
- Personalized roadmap based on role, skills, ATS gaps, and interview progress
- Supabase email/password authentication

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Gemini and Groq server-side integrations

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.example .env.local
```

3. Fill in the required values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run build
npm run typecheck
```

## Deployment

This project is ready for GitHub and Vercel deployment.

### Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add the same environment variables from `.env.local` inside the Vercel project settings.
4. Deploy.

## Security Notes

- Never commit `.env.local` or `.env`.
- Keep `GEMINI_API_KEY` and `GROQ_API_KEY` server-side only.
- Rotate any real keys that were previously exposed outside ignored local files.
