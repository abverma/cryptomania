const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/crypto');

const Schema = mongoose.Schema;

const User = new Schema({
      username: String,
      password: String
    });

const Users = mongoose.model('users', User, 'users');

exports.Users = Users;