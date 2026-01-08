# Moyo ExpenseTracker

## Project Description
Moyo ExpenseTracker is a web-based application designed to help small business owners accurately track their income sources and expenses. The primary goal is to provide a clear, real-time financial overview, allowing users to understand where their money is being allocated and maintain a clear picture of their remaining funds.

## Features
- User authentication with secure login/logout
- Income management: Add, view, edit, and delete income entries
- Expense tracking with categorization
- Custom category management with subcategories
- Comprehensive reporting: Monthly summaries, category breakdowns, trend analysis
- CSV export for reports
- Responsive web interface

## Technology Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS, Recharts
- **Backend**: NestJS, Node.js, PostgreSQL, Prisma
- **Authentication**: JWT with bcrypt
- **Deployment**: Docker

## Project Structure
```
MoyoExpenseTracker/
├── client/              # Frontend Application (Next.js)
├── server/              # Backend API (NestJS)
├── docs/                # Documentation
├── .gitignore
├── package.json         # Monorepo root
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd moyo-expensetracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Create a PostgreSQL database
   - Update server/.env with database connection details

4. Run database migrations:
   ```bash
   cd server
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Development
- `npm run dev`: Start both client and server in development mode
- `npm run build`: Build both client and server
- `npm run lint`: Lint both client and server

## Contributing
Please read the documentation in `docs/` for detailed requirements and guidelines.

## License
MIT