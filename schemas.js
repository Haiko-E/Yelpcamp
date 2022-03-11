const Joi = require('joi');

const campgroundSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required().min(0),
  description: Joi.string().required(),
  location: Joi.string().required(),
  image: Joi.array(),
}).required();

const reviewSchema = Joi.object({
  rating: Joi.number().required(),
  body: Joi.string().required(),
}).required();

const userSchema = Joi.object({
  username: Joi.number().required(),
  password: Joi.required(),
  email: Joi.string().required(),
}).required();

module.exports = {
  campgroundSchema,
  reviewSchema,
  userSchema,
};
