const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.lastURL = req.originalUrl;
    req.flash('error', 'you must be sigend in first');
    return res.redirect('/login');
  }
  next();
};

module.exports.isCampgroundAuthor = async (req, res, next) => {
  if (!req.user) {
    req.flash('error', 'you are not allowed');
    return res.redirect('/campgrounds');
  }
  const { id: campId } = req.params;
  const { _id: userId } = req.user;
  const { author: authorId } = await Campground.findById(campId);

  if (!authorId.equals(userId)) {
    req.flash('error', 'you are not allowed to delete a campground');
    return res.redirect('/campgrounds');
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  if (!req.user) {
    req.flash('error', 'you are not allowed');
    return res.redirect('/campgrounds');
  }
  const { reviewId } = req.params;
  const { _id: userId } = req.user;
  const { author: authorId } = await Review.findById(reviewId);

  if (!authorId.equals(userId)) {
    req.flash('error', 'you are not allowed to delete a this review');
    return res.redirect('/campgrounds');
  }
  next();
};
