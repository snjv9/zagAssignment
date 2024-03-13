const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

//Signing and returning token with our secret
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
    });
};

//Login Middleware
exports.login = (async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // 1) Check if email and password exist
        if (!email || !password) {
            throw new Error('Please provide email and password!');
        }
        // 2) Check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            throw new Error('Incorrect email or password');
        }

        // 3) If everything ok, send token to client
        const token = signToken(user._id);

        res.cookie('jwt', token);

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user
            }
        });
    } catch (err) {
        res.status(500).json({
            status: "Error",
            message: err.message
        })
    }
});

//Middleware for checking if user is logged in
exports.protect = (async (req, res, next) => {
    // 1) Getting token and check of it's there
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {

            throw new Error('You are not logged in! Please log in to get access.')

        }

        // 2) Verification token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            throw new Error('The user belonging to this token does no longer exist.')
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
    } catch (err) {
        res.status(500).json({
            status: "Error",
            message: err.message
        })
    }
});

//Restricting Access (authorization)
exports.restrictTo = (...roles) => {

    return (req, res, next) => {
        // roles ['admin', 'business_owner']. role='user'
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                status: "Error",
                message: "You do not have permission to perform this action"
            })
            throw new Error('You do not have permission to perform this action');
        }
        next();
    }

};