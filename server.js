const express = require('express');
const app = express();
const crypto = require('./crypto');
const url = require('url');

const PORT = process.env.PORT || 5000;

app.set('view engine', 'pug');

var getQueryParams = (url_parts) => {
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

var send404 = (res) => {
	res.writeHead(404, { 'Content-Type': 'html/plain' });
	res.end('<html><body><h2>Page not found<h2></body></html>');
}

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

app.get('/fetchValue', function(req, res) {
	console.log(req.query);
	//var queryObj = getQueryParams(req.query);
	//console.log(queryObj);

	var queryObj = req.query;
	var bittrex_value = queryObj.bittrex;
	var binance_value = queryObj.binance;

	crypto.fetchAndCalculate(bittrex_value, binance_value)
		.then((result) => {
			console.log('Total: ', result.total_value);
  			res.render('result', {result: result});
		})
		.catch((err) => {
			console.log(err);
  			res.writeHead(500, { 'Content-Type': 'html/plain' });
			res.write(err);
			res.end();
		});
})

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
})