const User = require('../models/userModel')

exports.createUser = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        });

        res.status(201).json({
            status: 'success',
            data: newUser
        });
    } catch (err) {
        res.status(500).json({
            status: "Error",
            message: err.message
        })
    }
};

