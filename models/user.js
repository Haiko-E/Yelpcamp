const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

// username and password are added by Passport
var UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);
module.exports = User;
