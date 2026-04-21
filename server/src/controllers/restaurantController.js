const Restaurant = require('../models/Restaurant');

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
exports.getRestaurants = async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find().populate('owner', 'name email');

        res.status(200).json({
            success: true,
            count: restaurants.length,
            data: restaurants
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
exports.getRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id)
            .populate('categories')
            .populate({
                path: 'categories',
                populate: {
                    path: 'items'
                }
            });

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                error: 'Restaurant not found'
            });
        }

        res.status(200).json({
            success: true,
            data: restaurant
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new restaurant
// @route   POST /api/restaurants
// @access  Private (Owner/Admin)
exports.createRestaurant = async (req, res, next) => {
    try {
        // Add owner to req.body
        req.body.owner = req.user.id;

        // Check for existing restaurant by this owner (if we want to limit)
        // const existing = await Restaurant.findOne({ owner: req.user.id });
        // if(existing) ...

        const restaurant = await Restaurant.create(req.body);

        res.status(201).json({
            success: true,
            data: restaurant
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (Owner/Admin)
exports.updateRestaurant = async (req, res, next) => {
    try {
        let restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                error: 'Restaurant not found'
            });
        }

        // Make sure user is restaurant owner
        if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: `User ${req.user.id} is not authorized to update this restaurant`
            });
        }

        restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: restaurant
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private (Owner/Admin)
exports.deleteRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                error: 'Restaurant not found'
            });
        }

        // Make sure user is restaurant owner
        if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: `User ${req.user.id} is not authorized to delete this restaurant`
            });
        }

        await restaurant.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
