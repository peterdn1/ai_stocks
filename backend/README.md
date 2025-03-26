# AI Stock Impact Tracker - Backend

This is the backend API for the AI Stock Impact Tracker application, built with Node.js, Express, TypeScript, and PostgreSQL with Prisma ORM.

## Features

- User authentication with JWT
- Stock data management
- AI impact scoring
- Portfolio tracking
- Mock trading
- Watchlists and alerts
- News integration

## Prerequisites

- Node.js (v16+)
- PostgreSQL
- npm or yarn

## Setup

1. Clone the repository and navigate to the backend directory:

```bash
cd ai-stock-impact-tracker/backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

Make sure to update:
- `DATABASE_URL` with your PostgreSQL connection string
- `JWT_SECRET` with a secure random string
- `ALPHA_VANTAGE_API_KEY` with your Alpha Vantage API key
- `OPENAI_API_KEY` with your OpenAI API key

4. Set up the database:

```bash
# Complete setup (generate client, run migrations, and seed data)
npm run db:setup

# Or run individual commands:
# Generate Prisma client
npm run prisma:generate

# Create database and run migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

5. Start the development server:

```bash
npm run dev
```

The server will start on port 3001 (or the port specified in your .env file).

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user profile (protected)

### Stocks

- `GET /api/stocks` - List stocks with filtering
- `GET /api/stocks/:symbol` - Get details for a specific stock
- `GET /api/stocks/:symbol/news` - Get relevant news for a stock

### AI Impact

- `GET /api/impact/:symbol` - Get current AI impact score for a stock
- `POST /api/impact/recalculate` - Trigger recalculation (admin/internal)

### Portfolio (Protected)

- `GET /api/portfolio` - Get current user's portfolio holdings
- `GET /api/portfolio/history` - Get user's trade history

### Trading (Protected)

- `POST /api/trade/buy` - Execute a mock buy order
- `POST /api/trade/sell` - Execute a mock sell order

### Watchlist (Protected)

- `GET /api/watchlist` - List user's watchlists
- `POST /api/watchlist` - Create a new watchlist
- `GET /api/watchlist/:id` - Get items in a specific watchlist
- `POST /api/watchlist/:id/add` - Add a stock to a watchlist
- `DELETE /api/watchlist/:id/remove/:symbol` - Remove a stock from a watchlist

### Alerts (Protected)

- `GET /api/alerts` - List user's active alerts
- `POST /api/alerts` - Create a new alert
- `DELETE /api/alerts/:id` - Delete an alert

## Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:setup` - Complete database setup (generate, migrate, seed)
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed the database with sample data
- `npm run prisma:studio` - Open Prisma Studio to view/edit data

## License

[MIT](../LICENSE)