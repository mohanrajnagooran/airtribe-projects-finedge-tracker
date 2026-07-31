const express = require('express');
const userController = require('../controllers/userController');
const {
  validateUserCreate,
  validateUserUpdate,
  validateIdParam,
} = require('../middleware/validator');

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:id', validateIdParam('id'), userController.getUserById);
router.post('/', validateUserCreate, userController.createUser);
router.put('/:id', validateIdParam('id'), validateUserUpdate, userController.updateUser);
router.delete('/:id', validateIdParam('id'), userController.deleteUser);

module.exports = router;
