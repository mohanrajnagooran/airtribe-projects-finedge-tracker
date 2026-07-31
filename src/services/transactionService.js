const { v4: uuidv4 } = require('uuid');
const transactionModel = require('../models/transactionModel');
const userModel = require('../models/userModel');
const { ApiError } = require('../middleware/errorHandler');

const getAllTransactions = async (filters = {}) => {
  let transactions = await transactionModel.getAll();

  if (filters.userId) {
    transactions = transactions.filter((t) => t.userId === filters.userId);
  }
  if (filters.type) {
    transactions = transactions.filter((t) => t.type === filters.type);
  }
  if (filters.category) {
    transactions = transactions.filter(
      (t) => t.category.toLowerCase() === filters.category.toLowerCase()
    );
  }

  return transactions;
};

const getTransactionById = async (id) => {
  const transaction = await transactionModel.getById(id);
  if (!transaction) throw new ApiError(404, `Transaction with id ${id} not found`);
  return transaction;
};

const createTransaction = async ({ userId, type, category, amount, description, date }) => {
  const user = await userModel.getById(userId);
  if (!user) throw new ApiError(404, `User with id ${userId} not found`);

  const newTransaction = {
    id: uuidv4(),
    userId,
    type,
    category: category.trim(),
    amount: Number(amount),
    description: description ? description.trim() : '',
    date: date ? new Date(date).toISOString() : new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  return transactionModel.create(newTransaction);
};

const updateTransaction = async (id, updates) => {
  await getTransactionById(id); // throws 404 if missing

  const cleanUpdates = { ...updates };
  if (cleanUpdates.category) cleanUpdates.category = cleanUpdates.category.trim();
  if (cleanUpdates.amount !== undefined) cleanUpdates.amount = Number(cleanUpdates.amount);
  if (cleanUpdates.description !== undefined) cleanUpdates.description = cleanUpdates.description.trim();
  if (cleanUpdates.date) cleanUpdates.date = new Date(cleanUpdates.date).toISOString();

  return transactionModel.update(id, cleanUpdates);
};

const deleteTransaction = async (id) => {
  await getTransactionById(id); // throws 404 if missing
  return transactionModel.remove(id);
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
