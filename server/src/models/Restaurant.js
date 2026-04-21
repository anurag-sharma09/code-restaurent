const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a restaurant name'],
        trim: true
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    location: {
        type: String,
        required: [true, 'Please add an address']
    },
    openingHours: {
        type: String,
        default: '9:00 AM - 10:00 PM'
    },
    contactDetails: {
        phone: String,
        email: String
    },
    images: {
        logo: String,
        banner: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create restaurant slug from the name
restaurantSchema.pre('save', function() {
    if (this.isModified('name')) {
        this.slug = this.name.split(' ').join('-').toLowerCase();
    }
});

// Cascade delete categories and menu items when a restaurant is deleted
restaurantSchema.pre('deleteOne', { document: true, query: false }, async function() {
    console.log(`Categories and Items being removed from restaurant ${this._id}`);
    await this.model('Category').deleteMany({ restaurant: this._id });
    await this.model('MenuItem').deleteMany({ restaurant: this._id });
});


// Reverse populate with categories
restaurantSchema.virtual('categories', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'restaurant',
    justOne: false
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
