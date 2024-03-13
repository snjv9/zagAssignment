const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController')
const listingController = require('../controllers/listingController')

router.route('/').post(authController.protect, authController.restrictTo('business_owner', 'admin'), listingController.createListing)
router.route('/').get(authController.protect, listingController.getAllListing)
router.route('/:listingId').get(authController.protect, listingController.getListing)
router.route('/:listingId').patch(authController.protect, authController.restrictTo('business_owner', 'admin'), listingController.updateListing)
router.route('/:listingId').delete(authController.protect, authController.restrictTo('admin'), listingController.deleteListing)

module.exports = router;