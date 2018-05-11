const express = require('express');
const url = require('url');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

const passport = require('./config/passport').passport;
const Users = require('./models/users').Users;
const crypto = require('./routes/crypto');
const signupHandler = require('./routes/signup');

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

const getQueryParams = (url_parts) => {
	var queryObj = {};

	if (!url_parts || url_parts === '') {
		return queryObj;
	}
	else {
		var paramArray = url_parts.query.split('&');

		paramArray.forEach(function(param){
			var kvpair = param.split('=');
			queryObj[kvpair[0]] = kvpair[1];
		})

		return queryObj;
	}
	
}

const send404 = (res) => {
	res.writeHead(404, { 'Content-Type': 'html/plain' });
	res.end('<html><body><h2>Page not found<h2></body></html>');
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


app.get('/', isLoggedIn, function (req, res) {
	var user = req.user;
	
	console.log('User ' + user._id + ' logged in.');
	res.render('index');
});

app.post('/signup', (req, res) => {
	console.log('Handling signup');
	signupHandler.signup(req, res);
});

app.get('/signup', (req, res) => {
	res.render('signup', {message: req.flash('message')});
});

app.get('/fetchValue', isLoggedIn, function(req, res) {
	console.log(req.query);
	//var queryObj = getQueryParams(req.query);
	//console.log(queryObj);

	var queryObj = req.query;
	var bittrex_value = queryObj.bittrex;
	var binance_value = queryObj.binance;

	crypto.calculateHoldingValue(bittrex_value, binance_value)
		.then((result) => {
			console.log('Total: ', result.total_value);
  			res.render('result', {result: result});
		})
		.catch((err) => {
			console.log('Error fetching holding value.');
			console.log(err);
  			//res.writeHead(500, { 'Content-Type': 'html/plain' });
			//res.write(err);
			res.statusCode = 500;
			res.send();
		});
});

app.get('/koinexRates', isLoggedIn, (req, res) => {
	crypto.fetchKoinexRates()
		.then((data) => {
			var result = {};
			var pricelist = data.prices.inr;

			var stats = data.stats.inr;

			for (var key in pricelist) {
				var name = stats[key].currency_full_form;
				name = name.replace(name.charAt(0), name.charAt(0).toUpperCase());
				
				result[key] = {
					name: name,
					price: pricelist[key],
					per_change: parseFloat(stats[key].per_change)
				}
			}

			res.render('koinex', {data: result});
		})
		.catch((err) => {
			console.log('Error fetching koinex rates');
			console.log(err);
			res.statusCode = 500;
			res.send();
		})
})

app.get('/cmcRates', isLoggedIn, (req, res) => {

	var query = req.query;

	crypto.fetchCMCRates(query.limit)
		.then((data) => {
			var result = {};
			var rankArray = [];
			for (var key in data.data) {
				rankArray.push(data.data[key].rank)
			}
			rankArray = rankArray.sort(function(a, b){return a - b});

			for (var i in rankArray) {
				for (var key in data.data) {
					if (data.data[key].rank == rankArray[i]) {
						result[rankArray[i]] = data.data[key];
					}
				}
			}
			
			res.render('cmc', {data: result});
		})
		.catch((err) => {
			console.log('Error fetching cmc rates');
			console.log(err);
			res.statusCode = 500;
			res.send();
		})
})

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
	send404(res);
})

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});