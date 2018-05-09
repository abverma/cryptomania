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
});

app.get('/fetchValue', function(req, res) {
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

app.get('/koinexRates', (req, res) => {
	crypto.fetchKoinexRates()
		.then((data) => {
			//res.send(data.prices.inr);
			var result = {};
			var pricelist = data.prices.inr;
			//console.log(pricelist);

			var stats = data.stats.inr;
			//console.log(stats);

			for (var key in pricelist) {
				result[key] = {
					name: stats[key].currency_full_form.toUpperCase(),
					price: pricelist[key],
					per_change: parseFloat(stats[key].per_change)
				}
			}

			console.log(result);

			res.render('koinex', {data: result});
		})
		.catch((err) => {
			console.log('Error fetching koinex rates');
			console.log(err);
			res.statusCode = 500;
			res.send();
		})
})

app.get('/cmcRates', (req, res) => {

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



app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});