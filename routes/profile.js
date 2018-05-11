const mongoose = require('mongoose');
const Users = require('../models/users').Users;
const errorHandler = require('./handleError');


const ObjectId = mongoose.Types.ObjectId;

exports.renderProfile = (req, res) => {
	var userId = req.user._id;
	console.log(userId);
	Users.findById(userId, (err, user) => {
		if (err) {
			errorHandler.showErrorPage(req, res, 500);
		}
		else if (user) {
			console.log(user);
			res.render('profile', {'user': user});
		}
		else {
			res.redirect('/login');
		}
	})

}