const express = require('express');
const {
    addCategory,
    addItem,
    updateCategory,
    updateItem,
    deleteCategory,
    deleteItem,
    reorderMenu
} = require('../controllers/menuController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply protection and authorization to all routes below
router.use(protect);
router.use(authorize('owner', 'admin'));

router.post('/categories', addCategory);
router.post('/items', addItem);

router.put('/categories/:id', updateCategory);
router.put('/items/:id', updateItem);

router.delete('/categories/:id', deleteCategory);
router.delete('/items/:id', deleteItem);

router.put('/reorder', reorderMenu);

module.exports = router;
