const { ApiError } = require('./errorHandler');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_TYPES = ['income', 'expense'];

const validateUserCreate = (req, res, next) => {
  const { name, email } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('name is required and must be a non-empty string');
  }
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    errors.push('a valid email is required');
  }

  if (errors.length) {
    return next(new ApiError(400, errors.join('; ')));
  }
  next();
};

const validateUserUpdate = (req, res, next) => {
  const { name, email } = req.body;
  const errors = [];

  if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
    errors.push('name must be a non-empty string');
  }
  if (email !== undefined && (typeof email !== 'string' || !EMAIL_REGEX.test(email))) {
    errors.push('email must be valid');
  }

  if (errors.length) {
    return next(new ApiError(400, errors.join('; ')));
  }
  next();
};

const validateTransactionCreate = (req, res, next) => {
  const { userId, type, category, amount, date } = req.body;
  const errors = [];

  if (!userId || typeof userId !== 'string') {
    errors.push('userId is required');
  }
  if (!type || !VALID_TYPES.includes(type)) {
    errors.push(`type is required and must be one of: ${VALID_TYPES.join(', ')}`);
  }
  if (!category || typeof category !== 'string' || !category.trim()) {
    errors.push('category is required and must be a non-empty string');
  }
  if (amount === undefined || typeof amount !== 'number' || amount <= 0) {
    errors.push('amount is required and must be a positive number');
  }
  if (date !== undefined && isNaN(Date.parse(date))) {
    errors.push('date must be a valid date string');
  }

  if (errors.length) {
    return next(new ApiError(400, errors.join('; ')));
  }
  next();
};

const validateTransactionUpdate = (req, res, next) => {
  const { type, category, amount, date } = req.body;
  const errors = [];

  if (type !== undefined && !VALID_TYPES.includes(type)) {
    errors.push(`type must be one of: ${VALID_TYPES.join(', ')}`);
  }
  if (category !== undefined && (typeof category !== 'string' || !category.trim())) {
    errors.push('category must be a non-empty string');
  }
  if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
    errors.push('amount must be a positive number');
  }
  if (date !== undefined && isNaN(Date.parse(date))) {
    errors.push('date must be a valid date string');
  }

  if (errors.length) {
    return next(new ApiError(400, errors.join('; ')));
  }
  next();
};

// Validates that a route param looks like a UUID-ish id (non-empty string)
const validateIdParam = (paramName = 'id') => (req, res, next) => {
  const value = req.params[paramName];
  if (!value || typeof value !== 'string' || !value.trim()) {
    return next(new ApiError(400, `${paramName} route parameter is required`));
  }
  next();
};

module.exports = {
  validateUserCreate,
  validateUserUpdate,
  validateTransactionCreate,
  validateTransactionUpdate,
  validateIdParam,
};
