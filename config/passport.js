const Users = require('../routes/users').Users;
const passport = require('passport');

const LocalStrategy  = require('passport-local').Strategy;

passport.serializeUser(function(user, cb) {
	cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  Users.findById(id, function(err, user) {
    cb(err, user);
  });
});
		
passport.use(new LocalStrategy({
		passReqToCallback : true 
	},
	function(req, username, password, done) {
  		
		Users.findOne({ user_name: username, password: password }, function(err, user) {
			if (err) { 
				console.log('error');

				return done(err); 
			}
			if (!user) {
				console.log('incorrect username');
				return done(null, false, req.flash('message', 'Incorrect username or password'));
			}
			
			console.log('success');
		  	return done(null, user);
		});
	}
));

exports.passport = passport;