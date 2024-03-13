const express = require('express');
const morgan = require('morgan');
const app = express();
const userRouter = require('./routes/userRoutes')
const listingRouter = require('./routes/listingRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const authController = require('./controllers/authController')


// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

app.post('/api/v1/login', authController.login)
app.use('/api/v1/listing', listingRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/user', userRouter)
module.exports = app;
