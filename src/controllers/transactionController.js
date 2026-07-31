const transactionService = require('../services/transactionService');
const analytics = require('../utils/analytics');
const aiHelper = require('../utils/aiHelper');

const getAllTransactions = async (req, res, next) => {
  try {
    const { userId, type, category } = req.query;
    const transactions = await transactionService.getAllTransactions({ userId, type, category });
    res.status(200).json({ success: true, data: transactions });
  } catch (err) {
    next(err);
  }
};

const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id);
    res.status(200).json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.createTransaction(req.body);
    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.updateTransaction(req.params.id, req.body);
    res.status(200).json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    await transactionService.deleteTransaction(req.params.id);
    res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// GET /api/transactions/summary?userId=...
const getSummary = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const transactions = await transactionService.getAllTransactions({ userId });
    const summary = analytics.computeSummary(transactions);
    const categoryBreakdown = analytics.computeCategoryBreakdown(transactions);
    res.status(200).json({ success: true, data: { ...summary, categoryBreakdown } });
  } catch (err) {
    next(err);
  }
};

// GET /api/transactions/insights?userId=...
const getMonthlyInsights = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const transactions = await transactionService.getAllTransactions({ userId });

    const summary = analytics.computeSummary(transactions);
    const categoryBreakdown = analytics.computeCategoryBreakdown(transactions);
    const monthly = analytics.computeMonthlyInsights(transactions);
    const latestMonth = analytics.computeLatestMonthInsight(transactions);
    const narrativeInsights = aiHelper.generateInsights({ summary, categoryBreakdown, latestMonth });

    res.status(200).json({
      success: true,
      data: { summary, categoryBreakdown, monthly, insights: narrativeInsights },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
  getMonthlyInsights,
};
