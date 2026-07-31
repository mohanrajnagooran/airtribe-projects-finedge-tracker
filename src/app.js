const express = require('express');
const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FinEdge API is running',
    endpoints: {
      users: '/api/users',
      transactions: '/api/transactions',
      summary: '/api/transactions/summary?userId=...',
      insights: '/api/transactions/insights?userId=...',
    },
  });
});

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
