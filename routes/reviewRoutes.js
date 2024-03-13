const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController')
const authController = require('../controllers/authController')

router.route('/:listingId').post(authController.protect, authController.restrictTo('admin', 'user'), reviewController.createReview)
router.route('/').get(authController.protect, reviewController.getAllReviews)
router.route('/:reviewId').get(authController.protect, reviewController.getReview)
router.route('/:reviewId').patch(authController.protect, reviewController.updateReview)
router.route('/:reviewId').delete(authController.protect, authController.restrictTo('user', 'admin'), reviewController.deleteReview)

module.exports = router;