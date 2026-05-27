# CeylonPrivé Travels 🌴

A premium luxury digital platform for an elite tour guide in Sri Lanka.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express, TypeScript, Prisma ORM
- **Database:** PostgreSQL (Supabase in production, Docker locally)
- **Media:** Cloudinary (image/video storage + CDN)
- **AI:** Google Gemini 1.5 Flash (travel itinerary generation)
- **Deployment:** Vercel (frontend), Render (backend)
- **CI/CD:** GitHub Actions

## Local Development Setup

### Prerequisites
- Node.js 20+
- Docker Desktop
- Git

### 1. Clone the repository
```bash
git clone https://github.com/anjulaPerera/ceylonprive-travels.git
cd ceylonprive-travels
```

### 2. Start the database
```bash
docker compose up postgres -d
```

### 3. Set up the backend
```bash
cd backend
cp .env.example .env
# Fill in your values in .env
npm install
npx prisma generate
npx prisma migrate dev
npx tsx prisma/seed.ts
npm run dev
```

### 4. Set up the frontend
```bash
cd frontend
cp .env.example .env.local
# Fill in your values in .env.local
npm install
npm run dev
```


## Branch Strategy
- `main` — production only, never commit directly
- `develop` — integration branch, all features merge here
- `feature/*` — individual feature branches