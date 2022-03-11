const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedsHelper');
const axios = require('axios');
const { cloudinary } = require('../cloudinary');

//RUN DATABASE
async function main() {
  try {
    await mongoose.connect('mongodb://localhost/yelpcamp');
    console.log('MONGOOSE');
  } catch (e) {
    console.log(e.message);
  }
}
main();

cloudinary.config({
  cloud_name: 'dxqagufcd',
  api_key: '631931677217898',
  api_secret: '-OwS8EQ5KLq8KzNfQDvH37ijbkU',
});

function randomNumber(length) {
  return Math.floor(Math.random() * length);
}

async function fetchImage() {
  try {
    const { data } = await axios.get(
      'https://api.unsplash.com//photos/random?client_id=CFx3AaeBdqhsP9OOpBoiuTZA6wpo0Q5QBp4ORmf84g8&collections=483251'
    );
    return data;
  } catch (e) {
    console.log(e.message);
  }
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

async function seedDB() {
  try {
    await Campground.deleteMany({});
    await cloudinary.api.delete_resources_by_prefix('Yelpcamp');
  } catch (error) {
    console.log(error);
  }

  for (let i = 0; i < 49; i++) {
    try {
      const random1000 = randomNumber(1000);
      const data = await fetchImage();
      const cloud = await cloudinary.uploader.upload(data.urls.regular, {
        folder: 'Yelpcamp',
      });

      const newCampground = new Campground({
        author: '6203ccb47a216be182a94489',
        title: `${sample(descriptors)} ${sample(places)}`,
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi quos molestiae fugit dignissimos dolor minima rem, tempore voluptatum facilis neque saepe, harum similique tenetur velit accusantium laborum magni ab ex?',
        price: randomNumber(20) + 10,
        geometry: {
          type: 'Point',
          coordinates: [cities[random1000].longitude, cities[random1000].latitude],
        },
        image: [
          {
            path: cloud.url,
            filename: cloud.public_id,
          },
        ],
      });

      await newCampground.save();
    } catch (error) {
      console.log('ERROR', error);
    }
  }
}
seedDB().then(() => {
  mongoose.connection.close();
});
