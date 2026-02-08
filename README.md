# Moyo ExpenseTracker

Expense tracking application for small business owners. Track income, expenses, manage categories, and generate reports.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts
- **Backend:** Express.js, TypeScript, Prisma ORM
- **Database:** SQLite (development) / PostgreSQL (production)
- **Auth:** JWT with bcrypt

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Install all dependencies
npm install

# Set up database
cd server
npx prisma migrate dev
npx prisma db seed
cd ..

# Start development servers
npm run dev
```

The client runs on `http://localhost:3000` and the server on `http://localhost:5000`.

## Project Structure

```
├── client/          # Next.js frontend
│   └── src/
│       ├── app/     # App Router pages
│       ├── components/
│       ├── context/
│       └── lib/
├── server/          # Express backend
│   └── src/
│       ├── routes/
│       ├── middleware/
│       └── index.ts
└── package.json     # Monorepo root
```
