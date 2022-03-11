if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const ejsMate = require('ejs-mate');
const campgroundRoute = require('./routes/campgrounds');
const reviewRoute = require('./routes/reviews');
const userRoute = require('./routes/users');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');
const dbUrl = process.env.MONGO_DB_URL || 'mongodb://localhost/yelpcamp';
const secret = process.env.SECRET || 'mylittlesecret';

const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 3600,
});

const sessionConfig = {
  store,
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(
  mongoSanitize({
    replaceWith: '_',
  })
);
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//RUN DATABASE
async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log('MONGOOSE');
  } catch (e) {
    console.log(e.message);
  }
}
main();

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.deleted = req.flash('deleted');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});

app.use('/campgrounds', campgroundRoute);
app.use('/campgrounds/:id/reviews', reviewRoute);
app.use('/', userRoute);

//ROUTES
app.get('/', (req, res) => {
  res.render('home.ejs');
});

app.use((err, req, res, next) => {
  const { message = 'Something went wrong', statusCode = 500 } = err;
  console.log(err);
  res.status(statusCode).send(message);
});

app.use((req, res, next) => {
  res.status(404).send('NOT FOUND');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
