const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');

const {
  logoutUser,
  loginUser,
  showLoginForm,
  showRegisterForm,
  createUser,
} = require('../controllers/users');

// prettier-ignore
router.route('/register')
  .get(showRegisterForm)
  .post(createUser);

// prettier-ignore
router.route('/login')
  .get(showLoginForm)
  .post(passport.authenticate('local', {failureRedirect: '/login',failureFlash: true,}), loginUser);

// prettier-ignore
router.route('/logout')
  .get(logoutUser);

module.exports = router;
