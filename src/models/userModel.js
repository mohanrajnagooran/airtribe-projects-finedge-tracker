const JsonStore = require('../utils/jsonStore');

const store = new JsonStore('users.json');

/**
 * User shape:
 * { id, name, email, createdAt }
 */
module.exports = {
  getAll: () => store.readAll(),
  getById: (id) => store.findById(id),
  getByEmail: async (email) => {
    const users = await store.readAll();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },
  create: (user) => store.insert(user),
  update: (id, updates) => store.updateById(id, updates),
  remove: (id) => store.deleteById(id),
};
