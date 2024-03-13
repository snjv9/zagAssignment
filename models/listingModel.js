const mongoose = require('mongoose')

const { Schema } = mongoose

const listingSchema = new Schema({
    listingName: {
        type: String,
        required: [true, 'Please enter a name for your Listing/Business!']
    },
    businessPhone: {
        type: String,
        required: [true, 'Please enter phone Number of Business']
    },
    city: {
        type: String,
        required: [true, 'Please enter business city']
    },
    address: {
        type: String,
        required: [true, 'Please enter address of business']
    },
    images: [String],
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
})
const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;