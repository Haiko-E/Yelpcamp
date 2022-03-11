const { userSchema } = require('../schemas');
const User = require('../models/user');

module.exports.showRegisterForm = async (req, res, next) => {
  res.render('users/register.ejs');
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const newUser = await User.register(user, password);
    req.login(newUser, (err) => {
      if (err) return next(err);
      req.flash('succes', 'Welcome to yelpcamp');
      res.redirect('/campgrounds');
    });
  } catch (error) {
    req.flash('deleted', error.message);
    res.redirect('/register');
  }
};

module.exports.showLoginForm = async (req, res, next) => {
  res.render('users/login.ejs');
};

module.exports.loginUser = async (req, res, next) => {
  try {
    const redirectUrl = req.session.lastURL || '/campgrounds';
    delete req.session.lastURL;
    res.redirect(redirectUrl);
  } catch (error) {
    next(error);
  }
};

module.exports.logoutUser = (req, res, next) => {
  req.logout();
  req.flash('succes', 'Goodbye');
  res.redirect('campgrounds');
};
