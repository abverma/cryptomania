const Users = require('../models/users').Users;

exports.signup = (req, res) => {
	var payload = req.body
	console.log(payload);
	var username = payload.username;
	var password = payload.password;

	var newUser = new Users({
		username: username,
		password: password
	});

	newUser.save((err, user) => {
		if (err) {
			console.log('Error in signup');
			console.log(err);
			req.flash('message', 'Error in signup');
			res.redirect('/signup');
		}
		else {
			console.log('Success signup');
			console.log(user);
			req.flash('successMessage', 'Sign up successful!');
			res.redirect('/login');
		}
	})
}