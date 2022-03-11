const express = require('express');
const { createReview, deleteReview } = require('../controllers/reviews');
const router = express.Router({ mergeParams: true });
const { isLoggedin, isReviewAuthor } = require('../middleware');

router.delete('/:reviewId', isLoggedin, isReviewAuthor, deleteReview);

router.post('/', isLoggedin, createReview);

module.exports = router;
