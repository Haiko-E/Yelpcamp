const Review = require('../models/review');
const Campground = require('../models/campground');
const { reviewSchema } = require('../schemas');

module.exports.deleteReview = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  } catch (error) {
    next(error.message);
  }
};

module.exports.createReview = async (req, res, next) => {
  try {
    await reviewSchema.validateAsync(req.body);
    const reviewData = new Review(req.body);
    const campground = await Campground.findById(req.params.id);
    campground.reviews.push(reviewData);
    reviewData.author = req.user._id;
    await campground.save();
    await reviewData.save();
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (error) {
    next(error);
  }
};
