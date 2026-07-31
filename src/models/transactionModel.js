const JsonStore = require('../utils/jsonStore');

const store = new JsonStore('transactions.json');

/**
 * Transaction shape:
 * { id, userId, type ('income'|'expense'), category, amount, description, date, createdAt }
 */
module.exports = {
  getAll: () => store.readAll(),
  getById: (id) => store.findById(id),
  getByUserId: async (userId) => {
    const transactions = await store.readAll();
    return transactions.filter((t) => t.userId === userId);
  },
  create: (transaction) => store.insert(transaction),
  update: (id, updates) => store.updateById(id, updates),
  remove: (id) => store.deleteById(id),
};
