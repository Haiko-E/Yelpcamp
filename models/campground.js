const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    title: {
      type: String,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },

    geometry: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      },
    },
    image: [
      {
        path: String,
        filename: String,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  opts
);

CampgroundSchema.virtual('properties.popupMarkup').get(function () {
  return `<a href=/campgrounds/${this._id}>${this.title}</a>`;
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

const Campground = mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;
