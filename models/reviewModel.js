const mongoose = require('mongoose')
const Listing = require('./listingModel')
const { Schema } = mongoose

const reviewSchema = new Schema({
    description: {
        type: String,
        required: [true, 'Please write your review']
    },
    response: {
        type: String,
        required: false
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        required: [true, 'Please provide a rating between 1 to 5']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    },
    listing: {
        type: mongoose.Schema.ObjectId,
        ref: 'Listing',
        required: [true, 'Review must belong to a listing.']
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
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'listing',
        select: 'listingName address'
    }).populate({
        path: 'user',
        select: 'name'
    });
    next();
});
reviewSchema.statics.calcAverageRatings = async function (listingId) {
    const stats = await this.aggregate([
        {
            $match: { listing: listingId }
        },
        {
            $group: {
                _id: '$listing',
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    // console.log(stats);

    if (stats.length > 0) {
        await Listing.findByIdAndUpdate(listingId, {
            ratingsAverage: stats[0].avgRating
        });
    } else {
        await Listing.findByIdAndUpdate(listingId, {
            ratingsAverage: 4.5
        });
    }
};
reviewSchema.post('save', async function () {
    // this points to current review
    await this.constructor.calcAverageRatings(this.listing);
});
reviewSchema.post(/^findOneAnd/, async function () {
    // await this.findOne(); does NOT work here, query has already executed
    if (this.rating) {
        await this.constructor.calcAverageRatings(this.listing);
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;