const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

// @desc    Add category to restaurant
// @route   POST /api/menu/categories
// @access  Private (Owner/Admin)
exports.addCategory = async (req, res, next) => {
    try {
        const { restaurantId, name, sequenceOrder } = req.body;

        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                error: 'Restaurant not found'
            });
        }

        // Check ownership
        if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to add category to this restaurant'
            });
        }

        const category = await Category.create({
            restaurant: restaurantId,
            name,
            sequenceOrder
        });

        res.status(201).json({
            success: true,
            data: category
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Add item to category
// @route   POST /api/menu/items
// @access  Private (Owner/Admin)
exports.addItem = async (req, res, next) => {
    try {
        const { restaurantId, categoryId, name, price, description, image, isVegetarian, available, sequenceOrder } = req.body;

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ success: false, error: 'Restaurant not found' });
        }

        // Check ownership
        if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        const item = await MenuItem.create({
            restaurant: restaurantId,
            category: categoryId,
            name,
            price,
            description,
            image,
            isVegetarian,
            available,
            sequenceOrder
        });

        res.status(201).json({
            success: true,
            data: item
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update category (e.g., name, sequence)
// @route   PUT /api/menu/categories/:id
// @access  Private
exports.updateCategory = async (req, res, next) => {
    try {
        let category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ success: false, error: 'Category not found' });

        const restaurant = await Restaurant.findById(category.restaurant);
        if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: category });
    } catch (err) {
        next(err);
    }
};

// @desc    Update menu item
// @route   PUT /api/menu/items/:id
// @access  Private
exports.updateItem = async (req, res, next) => {
    try {
        let item = await MenuItem.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, error: 'Item not found' });

        const restaurant = await Restaurant.findById(item.restaurant);
        if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: item });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete category
// @route   DELETE /api/menu/categories/:id
// @access  Private
exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ success: false, error: 'Category not found' });

        const restaurant = await Restaurant.findById(category.restaurant);
        if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        // Delete all items in this category
        await MenuItem.deleteMany({ category: req.params.id });
        await category.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/items/:id
// @access  Private
exports.deleteItem = async (req, res, next) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, error: 'Item not found' });

        const restaurant = await Restaurant.findById(item.restaurant);
        if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        await item.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

// @desc    Reorder categories or items
// @route   PUT /api/menu/reorder
// @access  Private
exports.reorderMenu = async (req, res, next) => {
    try {
        const { type, items } = req.body; // type: 'categories' | 'items', items: [{ id, sequenceOrder }]

        const Model = type === 'categories' ? Category : MenuItem;

        const updatePromises = items.map(item => 
            Model.findByIdAndUpdate(item.id, { sequenceOrder: item.sequenceOrder })
        );

        await Promise.all(updatePromises);

        res.status(200).json({
            success: true,
            message: `${type} reordered successfully`
        });
    } catch (err) {
        next(err);
    }
};
