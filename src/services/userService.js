const { v4: uuidv4 } = require('uuid');
const userModel = require('../models/userModel');
const { ApiError } = require('../middleware/errorHandler');

const getAllUsers = async () => userModel.getAll();

const getUserById = async (id) => {
  const user = await userModel.getById(id);
  if (!user) throw new ApiError(404, `User with id ${id} not found`);
  return user;
};

const createUser = async ({ name, email }) => {
  const existing = await userModel.getByEmail(email);
  if (existing) throw new ApiError(409, `A user with email ${email} already exists`);

  const newUser = {
    id: uuidv4(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    createdAt: new Date().toISOString(),
  };

  return userModel.create(newUser);
};

const updateUser = async (id, updates) => {
  await getUserById(id); // throws 404 if missing

  if (updates.email) {
    const existing = await userModel.getByEmail(updates.email);
    if (existing && existing.id !== id) {
      throw new ApiError(409, `A user with email ${updates.email} already exists`);
    }
    updates.email = updates.email.trim().toLowerCase();
  }
  if (updates.name) updates.name = updates.name.trim();

  return userModel.update(id, updates);
};

const deleteUser = async (id) => {
  await getUserById(id); // throws 404 if missing
  return userModel.remove(id);
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
