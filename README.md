# FinEdge – Personal Finance & Expense Tracker API

A RESTful API backend for a personal finance tracker, built with Node.js and Express.
Users can be created, income/expense transactions can be logged, and the API produces
summaries and monthly insights.

## Tech Stack
- Node.js + Express 5
- JSON file-based persistence (`src/data/*.json`) — no database setup required
- UUID for record IDs
- Layered architecture: routes → controllers → services → models

## Getting Started

```bash
npm install
cp .env
npm start        # production
npm run dev      # auto-restart on file changes (Node's built-in --watch)
```

The server starts on `http://localhost:3000` by default (configurable via `PORT` in `.env`).

## Project Structure

```
src/
├── app.js                     # Express app & middleware wiring
├── routes/                    # Route definitions
│   ├── userRoutes.js
│   └── transactionRoutes.js
├── controllers/                # Request/response handling
│   ├── userController.js
│   └── transactionController.js
├── services/                   # Business logic
│   ├── userService.js
│   └── transactionService.js
├── models/                     # Data access layer
│   ├── userModel.js
│   └── transactionModel.js
├── middleware/
│   ├── errorHandler.js         # ApiError class + centralized error handler
│   ├── logger.js                # Request logging
│   └── validator.js             # Input validation
├── utils/
│   ├── analytics.js             # Summary / breakdown / monthly insight calculations
│   ├── aiHelper.js              # Generates natural-language insight sentences
│   └── jsonStore.js             # Generic async JSON file read/write helper
└── data/
    ├── users.json
    └── transactions.json
server.js                       # Entry point
FinEdge.postman_collection.json # Importable Postman collection
```

## API Reference

All responses follow the shape `{ success, data }` or `{ success: false, error: { message } }`.

### Users — `/api/users`

| Method | Path        | Description        | Body |
|--------|-------------|---------------------|------|
| GET    | `/`         | List all users       | — |
| GET    | `/:id`      | Get a user by id     | — |
| POST   | `/`         | Create a user         | `{ name, email }` |
| PUT    | `/:id`      | Update a user         | `{ name?, email? }` |
| DELETE | `/:id`      | Delete a user         | — |

### Transactions — `/api/transactions`

| Method | Path         | Description                                   | Body / Query |
|--------|--------------|------------------------------------------------|--------------|
| GET    | `/`          | List transactions (filter by `userId`, `type`, `category` query params) | — |
| GET    | `/:id`       | Get a transaction by id                          | — |
| POST   | `/`          | Create a transaction                             | `{ userId, type: "income"|"expense", category, amount, description?, date? }` |
| PUT    | `/:id`       | Update a transaction                              | any subset of the create fields |
| DELETE | `/:id`       | Delete a transaction                              | — |
| GET    | `/summary`   | Total income/expense/balance + category breakdown (filter by `?userId=`) | — |
| GET    | `/insights`  | Monthly breakdown + narrative insights (filter by `?userId=`)            | — |

> **Note:** `/summary` and `/insights` are registered before `/:id` in the router so they
> aren't swallowed by the id route.

## Example: Create a transaction

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<user-id>",
    "type": "expense",
    "category": "Groceries",
    "amount": 45.20,
    "description": "Weekly shop",
    "date": "2026-07-20"
  }'
```

## Testing the API

Import `FinEdge.postman_collection.json` into Postman. It includes requests for every
endpoint, grouped into Users, Transactions, and Analytics folders, using `{{baseUrl}}`,
`{{userId}}`, and `{{transactionId}}` collection variables you can fill in as you go.

## Module Ownership (per project spec)

| Member | Module                     | Files |
|--------|-----------------------------|-------|
| 1      | User APIs                    | `routes/userRoutes.js`, `controllers/userController.js`, `services/userService.js`, `models/userModel.js` |
| 2      | Transaction APIs              | `routes/transactionRoutes.js`, `controllers/transactionController.js`, `services/transactionService.js`, `models/transactionModel.js` |
| 3      | Middleware & Utils             | `middleware/errorHandler.js`, `middleware/logger.js`, `middleware/validator.js`, `utils/jsonStore.js` |
| 4      | Analytics & Documentation       | `utils/analytics.js`, `utils/aiHelper.js`, `README.md`, `FinEdge.postman_collection.json` |

## Design Notes
- **Persistence:** plain JSON files via a small async `JsonStore` helper (`utils/jsonStore.js`).
  Swapping to MongoDB later only requires rewriting the two model files — controllers and
  services are unaffected.
- **Validation:** handled in `middleware/validator.js` and applied per-route, keeping
  controllers focused on request/response only.
- **Errors:** a single `ApiError` class + centralized `errorHandler` middleware means every
  route can just `throw new ApiError(statusCode, message)` and let Express handle the response.
- **Analytics:** `utils/analytics.js` does the pure number-crunching (totals, category
  breakdown, monthly grouping); `utils/aiHelper.js` turns that data into human-readable
  sentences and is written so it can later be swapped for a real LLM call without changing
  its callers.

