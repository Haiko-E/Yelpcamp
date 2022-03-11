const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');
const cloudinary = require('cloudinary').v2;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.showCampgrounds = async (req, res, next) => {
  try {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds });
  } catch (error) {
    next(error);
  }
};

module.exports.showNewForm = (req, res) => {
  res.render('campgrounds/new.ejs');
};

module.exports.showCampground = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findById(id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
        },
      })
      .populate('author');
    // res.send(campground);
    res.render('campgrounds/show.ejs', { campground });
  } catch (error) {
    next(error);
  }
};

module.exports.createCampground = async (req, res, next) => {
  try {
    const geodata = await geocoder
      .forwardGeocode({
        query: req.body.location,
        limit: 1,
      })
      .send();

    const data = req.body;
    const pictures = req.files;

    await campgroundSchema.validateAsync(data);
    const camp = new Campground(data);
    camp.geometry = geodata.body.features[0].geometry;
    camp.image.push(...pictures);
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'Succesfully created a new campground');
    res.redirect('/campgrounds');
  } catch (error) {
    next(error);
  }
};

module.exports.showUpdateForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit.ejs', { campground });
  } catch (error) {
    next(error);
  }
};

module.exports.updateCampground = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const pictures = req.files;
    const campground = await Campground.findByIdAndUpdate(id, data, {
      runValidators: true,
    });
    campground.image.push(...pictures);
    campground.save();
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        cloudinary.uploader.destroy(filename);
      }
      await campground.updateOne({
        $pull: { image: { filename: { $in: req.body.deleteImages } } },
      });
    }
    res.redirect(`/campgrounds/${id}`);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteCampground = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    if (campground.image) {
      for (let image of campground.image) {
        cloudinary.uploader.destroy(image.filename);
      }
    }
    req.flash('deleted', 'Succesfully deleted a campground');
    res.redirect(`/campgrounds`);
  } catch (error) {
    next(error);
  }
};
