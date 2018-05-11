const express = require('express');
const url = require('url');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

const passport = require('./config/passport').passport;
const Users = require('./models/users').Users;
const crypto = require('./routes/crypto');
const signupHandler = require('./routes/signup');
const profileHandler = require('./routes/profile');
const errorHandler = require('./routes/handleError');



const PORT = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: "cats" }));
app.set('view engine', 'pug');
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const isLoggedIn = (req, res, next) => {

	if (req.isAuthenticated()) {
		return next();
	}
	else {
		res.redirect('/login');
	}
}

app.post('/login', passport.authenticate('local', { 
	failureRedirect: '/login',
	failureFlash: true 
}), function(req, res) {
		 res.redirect('/');
});

app.get('/login', (req, res) => {
	res.render('login', {message: req.flash('message'), successMessage: req.flash('successMessage')});
});


app.get('/', isLoggedIn, (req, res) => {
	var user = req.user;
	console.log('User ' + user._id + ' logged in.');
	res.render('index');
});

app.get('/profile', isLoggedIn, profileHandler.renderProfile)

app.post('/signup', signupHandler.signup);

app.get('/signup', (req, res) => {
	res.render('signup', {message: req.flash('message')});
});

app.get('/fetchValue', isLoggedIn, crypto.fetchValue);

app.get('/koinexRates', isLoggedIn, crypto.getKoinexData);

app.get('/cmcRates', isLoggedIn, crypto.getCMCData);

app.get('/users',  (req, res) => {
	Users.find({username: "abhishek"}, (err, data) => {
		console.log('Finding user');
		if (err){
			console.log('Error: ', err);
			res.send(err);
		}
		else {
			console.log('Data: ', data);
			res.send(data);
		}
	})
	.catch((err) => {
		console.log(err);
	})
});

app.get('/logout', (req, res) => {
	console.log(req.user._id + ' logging out');
	req.logout();
  	res.redirect('/');
});

app.use((req, res, next) => {
	errorHandler.showErrorPage(req, res, 404);
})

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});