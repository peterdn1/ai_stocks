# AI Stock Impact Tracker - Frontend

This is the frontend application for the AI Stock Impact Tracker, built with React, Vite, and Tailwind CSS.

## Features

- User authentication (login/register)
- Stock browsing with AI impact scores
- Stock details with news and AI analysis
- Portfolio tracking
- Mock trading
- Watchlists and alerts
- Responsive design

## Prerequisites

- Node.js (v16+)
- npm or yarn

## Setup

1. Clone the repository and navigate to the frontend directory:

```bash
cd ai-stock-impact-tracker/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000.

## Project Structure

```
frontend/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── layouts/        # Page layout structures
│   ├── pages/          # Top-level page components
│   ├── services/       # API interaction logic
│   ├── store/          # State management (Zustand)
│   ├── styles/         # Global styles, Tailwind config
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Entry point
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── postcss.config.js   # PostCSS configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## API Integration

The frontend communicates with the backend API through the services defined in `src/services/api.js`. The API base URL is configured in the Vite configuration to proxy requests to the backend server during development.

## Authentication

Authentication is handled using JWT tokens stored in localStorage. The auth state is managed using Zustand in `src/store/authStore.js`.

## Styling

The application uses Tailwind CSS for styling with custom components and utilities defined in `src/styles/index.css`.

## License

[MIT](../LICENSE)