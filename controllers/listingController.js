const Listing = require('../models/listingModel')
const mongoose = require('mongoose')
//Creating a new Listing
exports.createListing = (async (req, res, next) => {
    try {
        const newListing = await Listing.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                data: newListing
            }
        })

    } catch (err) {
        res.status(500).json({
            status: "Error",
            message: err.message
        })
    }
})

//Get All Listings
exports.getAllListing = (async (req, res, next) => {
    try {
        const listings = await Listing.find()
        res.status(200).json({
            status: "success",
            results: listings.length,
            data: {
                data: listings
            }
        })
    } catch (err) {
        res.status(500).json({
            status: "Error",
            message: err.message
        })
    }
})

//Get single Listing using Id
exports.getListing = (async (req, res, next) => {
    try {
        const listingId = req.params.listingId
        if (!listingId || !mongoose.isValidObjectId(listingId)) {
            throw new Error('Please provide Listing Id in request parameters')
        }
        const listing = await Listing.findById(listingId)
        res.status(200).json({
            status: "success",
            data: {
                data: listing
            }
        })
    } catch (err) {
        res.status(500).json({
            status: "Error",
            message: err.message
        })
    }
})

//Update Listing 
exports.updateListing = (async (req, res, next) => {
    try {
        const listingId = req.params.listingId
        if (!listingId || !mongoose.isValidObjectId(listingId)) {
            throw new Error('Please provide Listing Id in request parameters for updation')
        }
        const listing = await Listing.findByIdAndUpdate(listingId, req.body, {
            new: true,
            runValidators: true
        })
        if (!listing) {
            throw new Error('No document found with that id')
        }
        res.status(200).json({
            status: "success",
            data: {
                data: listing
            }
        })
    } catch (err) {
        res.status(500).json({
            status: "Error",
            message: err.message
        })
    }
})

//Delete Listing
exports.deleteListing = async (req, res, next) => {
    try {
        const listingId = req.params.listingId
        if (!listingId || !mongoose.isValidObjectId(listingId)) {
            throw new Error('Please provide Listing Id in request parameters for updation')
        }
        const listing = await Listing.findByIdAndDelete(listingId);

        if (!listing) {
            throw new Error('No listing found with that ID');
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


