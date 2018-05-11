const Users = require('../models/users').Users;
const passport = require('passport');

const LocalStrategy  = require('passport-local').Strategy;

passport.serializeUser(function(user, cb) {
	//console.log('Serializing ' + user);
	cb(null, user._id);
});

passport.deserializeUser(function(id, cb) {
	//console.log('Deserializing ' + id);
	Users.findById(id, function(err, user) {
		cb(err, user);
	});
});
		
passport.use(new LocalStrategy({
		passReqToCallback : true 
	},
	function(req, username, password, done) {
		Users.findOne({ username: username, password: password }, function(err, user) {
			if (err) { 
				console.log('error');
				return done(err); 
			}
			if (!user) {
				console.log('incorrect username');
				return done(null, false, req.flash('message', 'Incorrect username or password'));
			}
			
		  	return done(null, user);
		});
	}
));

exports.passport = passport;