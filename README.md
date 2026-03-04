# Currency Converter Application

A full-stack web application that converts between 160+ world currencies using live exchange rates. Built with React, Node.js/Express, PostgreSQL, and Prisma ORM.

The application is designed as a portfolio project demonstrating full-stack development skills, server-side API proxying, multi-layer caching, and clean separation between client and server.

---

## Features

**Real-Time Currency Conversion**
Select a source currency, enter an amount, pick a target currency, and see the converted result instantly. All exchange rate data is sourced from ExchangeRate-API and cached server-side so the API key is never exposed to the browser.

**Multi-Currency Comparison**
Expand the comparison panel to convert one amount into up to 5 target currencies simultaneously. Each result shows the converted amount and the current rate.

**Favorite Currency Pairs**
Save frequently used currency pairs as favorites. Favorites appear as clickable chips above the converter inputs — click one to auto-populate both dropdowns instantly.

**Historical Rate Charts**
View exchange rate trend charts for any currency pair over 7, 30, or 90 days. Charts are built from daily rate snapshots stored in PostgreSQL. The summary panel shows the minimum, maximum, average, and percentage change for the selected period.

**Conversion History Log**
Every conversion is automatically recorded with a timestamp, currencies, amount, rate, and result. The history page supports filtering by currency pair and date range, pagination (20 records per page), CSV export, and a clear-all option with confirmation.

---

## Tech Stack

| Layer      | Technology                                              |
|------------|---------------------------------------------------------|
| Frontend   | React 18 (Vite), Bootstrap 5, React Bootstrap           |
| Charts     | Recharts                                                |
| HTTP       | Axios                                                   |
| Backend    | Node.js, Express.js                                     |
| Database   | PostgreSQL with Prisma ORM                              |
| External API | ExchangeRate-API (free tier)                          |
| Caching    | In-memory Map (1hr TTL) + PostgreSQL CachedRate table   |
| Security   | helmet, cors, express-rate-limit, dotenv                |

---

## Prerequisites

Before you begin, make sure the following are installed and available:

- Node.js 18 or higher
- PostgreSQL (running locally or a connection string to a remote instance)
- An ExchangeRate-API key — register for free at https://www.exchangerate-api.com (no credit card required)

---

## Installation and Setup

**1. Clone the repository**

```bash
git clone https://github.com/Martin888Maina/Currency-Converter-Application.git
cd Currency-Converter-Application
```

**2. Install server dependencies**

```bash
cd server
npm install
```

**3. Configure environment variables**

```bash
cp .env.example .env
```

Open `server/.env` and fill in your values:

```
EXCHANGE_RATE_API_KEY=your_api_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/currency_converter
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**4. Set up the database**

Make sure your PostgreSQL server is running and the database specified in `DATABASE_URL` exists, then run:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

**5. Install client dependencies**

```bash
cd ../client
npm install
```

**6. Start the development server**

From the `server/` directory, this single command starts both the Express server and the Vite dev server:

```bash
cd ../server
npm run dev
```

**7. Open in your browser**

- Frontend: http://localhost:5173
- Backend health check: http://localhost:5000/health

---

## Usage Guide

**Converting currencies**

Open the Converter page, select a source currency from the From dropdown (defaults to USD), enter an amount, select a target currency in the To dropdown (defaults to KES), and click Convert. The result appears immediately below with the current exchange rate and a timestamp showing when the rate was last updated.

Use the swap button between the dropdowns to flip the source and target currencies without re-entering the amount.

**Saving favorite pairs**

While on the Converter page, click the Save Pair button next to the current pair to save it to your favorites. Saved pairs appear as chips at the top of the page. Click any chip to instantly load that pair into the converter. Remove a favorite by clicking the X on its chip.

**Comparing multiple currencies**

Below the main result, the Multi-Currency Comparison panel shows the same amount converted into several currencies at once. You can change each target currency using the dropdown on its card, or click Add Currency to add more (up to 5).

**Viewing rate charts**

Navigate to the Charts page, select a currency pair, and choose a time range (7, 30, or 90 days). The line chart shows the daily rate trend with hover tooltips. The summary cards below show the minimum, maximum, average rate, and the percentage change over the period.

Note: charts require at least a few days of cached rate data. The server stores one daily snapshot per base currency each time a fresh API call is made, so the chart fills in over time as you use the converter.

**Reviewing conversion history**

The History page shows all past conversions in reverse chronological order. Use the filter bar to narrow results by source currency, target currency, or date range. Click Export CSV to download the current filtered view. Click Clear All to delete all records (a confirmation prompt appears before anything is deleted).

---

## API Endpoint Reference

All endpoints are prefixed with `/api` and served by the Express backend.

**Conversion**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/currencies | List all supported currency codes |
| GET | /api/rates?base=USD | Get all rates for a base currency |
| GET | /api/convert?from=USD&to=KES&amount=100 | Convert an amount and log to history |

**Favorites**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/favorites | List all saved favorite pairs |
| POST | /api/favorites | Add a pair: `{ from: "USD", to: "KES" }` |
| DELETE | /api/favorites/:id | Remove a favorite by ID |

**History**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/history/conversions | Paginated history (supports page, limit, from, to, startDate, endDate) |
| GET | /api/history/conversions/export | Download history as CSV |
| DELETE | /api/history/conversions | Clear all conversion history |
| GET | /api/history/rates?from=USD&to=KES&days=30 | Rate trend data for charts |

---

## Project Structure

```
Currency-Converter-Application/
├── client/                        # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/            # Navbar, Footer, Loader, ErrorAlert, SkeletonCard
│   │   │   ├── converter/         # CurrencySelect, AmountInput, SwapButton, ConvertResult,
│   │   │   │                        MultiCurrencyCompare
│   │   │   ├── favorites/         # FavoritePairs, FavoriteChip, AddFavoriteBtn
│   │   │   ├── history/           # HistoryTable, HistoryFilters, ExportButton, Pagination
│   │   │   └── charts/            # RateChart, TimeRangeSelector, RateSummary
│   │   ├── pages/                 # Home, Converter, History, Charts
│   │   ├── services/api.js        # Axios instance and all API call functions
│   │   ├── hooks/                 # useConvert, useFavorites, useHistory
│   │   ├── context/               # CurrencyContext (global currency list)
│   │   └── utils/                 # formatCurrency, constants
│   └── vite.config.js             # Vite config with /api proxy to Express
│
└── server/                        # Node.js/Express backend
    ├── prisma/
    │   └── schema.prisma          # ConversionHistory, FavoritePair, CachedRate models
    ├── src/
    │   ├── config/                # database.js (Prisma singleton), environment.js
    │   ├── controllers/           # convertController, favoritesController, historyController
    │   ├── middleware/            # rateLimiter, errorHandler
    │   ├── routes/                # convertRoutes, favoritesRoutes, historyRoutes
    │   └── services/              # exchangeRateService (3-layer cache), cacheService
    ├── .env.example               # Environment variable template
    └── server.js                  # Entry point
```

---

## Caching Architecture

The server uses a three-layer caching strategy to conserve the free tier's 1,500 monthly API requests:

1. **In-memory cache** — a JavaScript Map with a 1-hour TTL. Fastest lookup, cleared on server restart.
2. **PostgreSQL cache** — the `CachedRate` table stores the latest rates per base currency. Survives restarts.
3. **ExchangeRate-API** — only called when both caches are stale or empty.

Each time a fresh API call is made, the server also writes a daily snapshot row (keyed as `USD:2026-03-04`) to build the historical dataset used by the Charts page.

---

## Security

- The ExchangeRate-API key is stored only in `server/.env` and never sent to the browser
- The React frontend communicates exclusively with the Express `/api/*` endpoints
- `helmet` sets secure HTTP response headers on every response
- `cors` restricts cross-origin requests to the configured client origin
- `express-rate-limit` caps requests at 100 per 15 minutes per IP address
- `.env` is listed in `.gitignore` and is never committed to the repository

---

## Future Enhancements

- User authentication — personal favorites and history synced across devices
- Rate alerts — notify the user when a target rate is reached
- Offline PWA support — service worker caching for full offline conversion using last known rates
- Dark mode toggle with preference persistence
- Reverse conversion — enter the desired result amount and calculate the required source amount
- Fee calculator — estimate transfer fees for services like Wise and PayPal
- Localization support (English and Swahili)
- Unit and integration tests with Jest and React Testing Library
- Production deployment: frontend on Vercel, backend on Railway, database on Supabase

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
