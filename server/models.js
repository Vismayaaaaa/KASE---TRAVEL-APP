const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: { type: String, default: 'https://randomuser.me/api/portraits/lego/1.jpg' }
}, { timestamps: true });

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    image: { type: String, required: true },
    images: [String],
    host: {
        name: String,
        avatar: String,
        isSuperhost: Boolean
    },
    details: {
        guests: Number,
        bedrooms: Number,
        beds: Number,
        baths: Number
    },
    amenities: [String],
    description: String,
    guestFavorite: { type: Boolean, default: false },
    isExternal: { type: Boolean, default: false },
    googlePlaceId: { type: String, unique: true, sparse: true },
    category: { type: String, index: true }
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guest: {
        name: String,
        email: String
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    numberOfGuests: {
        adults: { type: Number, required: true },
        children: { type: Number, default: 0 },
        infants: { type: Number, default: 0 },
        pets: { type: Number, default: 0 }
    },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' }
}, { timestamps: true });

const experienceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    rating: { type: Number, default: 0 },
    image: { type: String, required: true },
    images: [String],
    host: { name: String, avatar: String },
    category: { type: String, required: true },
    groupSize: { type: Number, required: true },
    description: String,
    included: [String]
}, { timestamps: true });

const reviewSchema = new mongoose.Schema({
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    subRatings: {
        cleanliness: { type: Number, min: 1, max: 5, required: true },
        accuracy: { type: Number, min: 1, max: 5, required: true },
        checkIn: { type: Number, min: 1, max: 5, required: true },
        communication: { type: Number, min: 1, max: 5, required: true },
        location: { type: Number, min: 1, max: 5, required: true },
        value: { type: Number, min: 1, max: 5, required: true }
    },
    comment: { type: String, required: true }
}, { timestamps: true });

// Wishlist Schema
const wishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true }
}, { timestamps: true });

// Create compound index to prevent duplicate wishlist entries
wishlistSchema.index({ user: 1, listing: 1 }, { unique: true });

module.exports = {
    User: mongoose.model('User', userSchema),
    Listing: mongoose.model('Listing', listingSchema),
    Booking: mongoose.model('Booking', bookingSchema),
    Experience: mongoose.model('Experience', experienceSchema),
    Review: mongoose.model('Review', reviewSchema),
    Wishlist: mongoose.model('Wishlist', wishlistSchema)
};
