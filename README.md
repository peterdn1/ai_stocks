# AI Stock Impact Tracker

A full-stack web application for tracking stock exposure to AI developments, featuring AI sentiment tagging, stock screening, mock trading, and more.

## Overview

AI Stock Impact Tracker helps investors understand how companies are leveraging artificial intelligence and how it impacts their stock performance. The application provides AI-generated impact scores, news analysis, and tools for tracking and simulating investments in AI-focused companies.

![AI Stock Impact Tracker](https://via.placeholder.com/800x400?text=AI+Stock+Impact+Tracker)

## Features

- **AI Impact Scoring**: Proprietary algorithm to assess how companies are leveraging AI
- **Stock Screener**: Filter stocks by sector, industry, market cap, and AI impact score
- **Mock Trading**: Practice investment strategies with virtual capital
- **News Integration**: Relevant news articles with AI sentiment analysis
- **Watchlists & Alerts**: Create custom watchlists and set alerts for price or AI score changes
- **Visualization Dashboard**: Track portfolio performance and AI impact trends
- **User Authentication**: Secure account creation and login

## Technology Stack

### Frontend
- React (with Vite)
- Tailwind CSS
- React Router
- Zustand (state management)
- Axios
- Recharts (for data visualization)

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- OpenAI API (for AI sentiment analysis)

## Project Structure

```
ai-stock-impact-tracker/
├── frontend/         # React SPA (Vite)
│   ├── public/       # Static assets
│   ├── src/          # Source code
│   └── ...
│
├── backend/          # Node.js API (Express)
│   ├── prisma/       # Database schema and migrations
│   ├── src/          # Source code
│   └── ...
│
└── README.md         # This file
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ai-stock-impact-tracker.git
cd ai-stock-impact-tracker
```

2. Set up the backend:

```bash
cd backend
npm install
cp .env.example .env  # Update with your database and API credentials
npm run db:setup      # Generate Prisma client, run migrations, and seed data
npm run dev           # Start the development server
```

3. Set up the frontend:

```bash
cd ../frontend
npm install
npm run dev           # Start the development server
```

4. Open your browser and navigate to http://localhost:3000

## Development

See the individual README files in the `frontend` and `backend` directories for more detailed development instructions.

## License

[MIT](LICENSE)