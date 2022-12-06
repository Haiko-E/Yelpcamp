const express = require('express');
const router = express.Router();
const { isLoggedin, isCampgroundAuthor } = require('../middle');
const {
  deleteCampground,
  updateCampground,
  showCampground,
  showCampgrounds,
  showNewForm,
  createCampground,
  showUpdateForm,
} = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// prettier-ignore
router.route('/')
  .get(showCampgrounds)
  .post(isLoggedin, upload.array('image'), createCampground)

// prettier-ignore
router.route('/new')
 .get( isLoggedin, showNewForm)

// prettier-ignore
router.route('/:id')
.get(showCampground)
.patch(isLoggedin, isCampgroundAuthor, upload.array('image'),  updateCampground)
.delete(isCampgroundAuthor, deleteCampground);

// prettier-ignore
router.route('/:id/edit')
  .get(isCampgroundAuthor, showUpdateForm);

module.exports = router;
