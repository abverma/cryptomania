const mongoose = require('./index').mongoose;

const UserSchema = new mongoose.Schema({
      username: String,
      password: String
    });

const Users = mongoose.model('users', UserSchema, 'users');

exports.Users = Users;