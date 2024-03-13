const { default: mongoose } = require('mongoose');
const Review = require('../models/reviewModel')

//Creating a review
exports.createReview = (async (req, res, next) => {
    try {
        const reviewBody = {
            description: req.body.description,
            user: req.user._id,
            listing: req.params.listingId,
            rating: req.body.rating
        }
        const newReview = await Review.create(reviewBody);

        res.status(201).json({
            status: "success",
            data: {
                data: newReview
            }
        })
    } catch (err) {
        res.status(500).json({
            status: "Error",
            message: err.message
        })
    }
})

//Get All Reviews for all Listings
exports.getAllReviews = (async (req, res, next) => {
    try {
        const reviews = await Review.find()
        res.status(200).json({
            status: "success",
            results: reviews.length,
            data: {
                data: reviews
            }
        })
    } catch (err) {
        res.status(500).json({
            status: "Error",
            message: err.message
        })
    }
})

//Get a review by id
exports.getReview = (async (req, res, next) => {
    try {
        const reviewId = req.params.reviewId
        if (!reviewId || !mongoose.isValidObjectId(reviewId)) {
            throw new Error('Please provide Review Id in request parameters')
        }
        const review = await Review.findById(reviewId)
        if (!review) {
            throw new Error('No review found with given Id')
        }
        res.status(200).json({
            status: "success",
            data: review
        })
    } catch (err) {
        res.status(500).json({
            status: "Error",
            message: err.message
        })
    }
})

//Update Review 
exports.updateReview = (async (req, res, next) => {
    try {
        const reviewId = req.params.reviewId
        if (!reviewId || !mongoose.isValidObjectId(reviewId)) {
            throw new Error('Please provide Review Id in request parameters for updation')
        }
        let review;
        if (req.user.role === 'business_owner') {
            if (req.body.response) {
                review = await Review.findByIdAndUpdate(reviewId, { response: req.body.response }, {
                    new: true,
                    runValidators: true
                })
            }
            else {
                throw new Error('Business owners can only respond to reviews')
            }
        }
        else {
            review = await Review.findByIdAndUpdate(reviewId, req.body, {
                new: true,
                runValidators: true
            })
        }
        if (!review) {
            throw new Error('No document found with that id')
        }
        res.status(200).json({
            status: "success",
            data: {
                data: review
            }
        })
    } catch (err) {
        res.status(500).json({
            status: "Error",
            message: err.message
        })
    }
})

//Delete Review
exports.deleteReview = async (req, res, next) => {
    try {
        const reviewId = req.params.reviewId
        if (!reviewId || !mongoose.isValidObjectId(reviewId)) {
            throw new Error('Please provide correct Review Id in request parameters for deletion')
        }
        const review = await Review.findByIdAndDelete(reviewId);

        if (!review) {
            throw new Error('No review found with that ID');
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).json({
            status: "Error",
            message: err.message
        })
    }
}
