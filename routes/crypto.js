const request = require('request');
const Q = require('q');

const BTC_HOLDING = .27;
const XRP_HOLDING = 2333;
const LTC_HOLDING = 1.4;

const KOINEX_TICKER_URL = 'https://koinex.in/api/ticker';
var CMC_LIMIT = 10;

var CMC_TICKER_URL = 'https://api.coinmarketcap.com/v2/ticker/';

exports.fetchValue = (req, res) => {
	console.log(req.query);
	//var queryObj = getQueryParams(req.query);
	//console.log(queryObj);

	var queryObj = req.query;
	var bittrex_value = queryObj.bittrex;
	var binance_value = queryObj.binance;

	calculateHoldingValue(bittrex_value, binance_value)
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
}

exports.getKoinexData = (req, res) => {
	fetchKoinexRates()
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
}

exports.getCMCData = (req, res) => {

	var query = req.query;

	fetchCMCRates(query.limit)
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
}

const calculateHoldingValue = (bittrex_value, binance_value) => {

	return new Promise((resolve, reject) => {

		bittrex_value = bittrex_value ? parseFloat(bittrex_value) : 0;
		binance_value = binance_value ? parseFloat(binance_value) : 0;

		fetchKoinexRates()
			.then((data) => {
				var btc_inr = parseFloat(data.prices.inr.BTC);
				var xrp_inr = parseFloat(data.prices.inr.XRP);
				var ltc_inr = parseFloat(data.prices.inr.LTC); 
				
				console.log('BTC: ',btc_inr);
				console.log('XRP: ', xrp_inr);
				console.log('LTC: ', ltc_inr);		
				var value = btc_inr * (bittrex_value + binance_value + BTC_HOLDING) + (xrp_inr * XRP_HOLDING) + (ltc_inr * LTC_HOLDING);
				
				resolve({
					total_value: value.toFixed(2),
					btc_rate: btc_inr,
					ltc_rate: ltc_inr,
					xrp_rate: xrp_inr
				});
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			})
	});
}

const fetchKoinexRates = () => {

	return new Promise((resolve, reject) => {

		const options = {
			url : KOINEX_TICKER_URL,
			headers: {
				'User-Agent': "Mozilla/5.0 Gecko/20100101 Firefox/59.0"	
			}
		}

		const start_time = new Date().getTime();

		console.log('Fetching rates in rupees ....');
		
		request(options, (err, res, data) => {
			if (err) {

				console.log(err);
				reject(err);

			}
			else {

				var end_time = new Date().getTime();
				console.log('Time taken: ', (end_time - start_time)/1000);
				resolve(JSON.parse(data));

			}
		});
	});
	
}

const fetchCMCRates = (limit) => {

	return new Promise((resolve, reject) => {

		// const options = {
		// 	url : KOINEX_TICKER_URL,
		// 	headers: {
		// 		'User-Agent': "Mozilla/5.0 Gecko/20100101 Firefox/59.0"	
		// 	}
		// }

		const start_time = new Date().getTime();

		console.log('Fetching cmc in rupees ....');

		var url = CMC_TICKER_URL + '?start=0&limit=' + (limit ? limit : CMC_LIMIT);
		console.log(url);
		request(url, (err, res, data) => {
			if (err) {

				console.log(err);
				reject(err);

			}
			else {

				var end_time = new Date().getTime();
				console.log('Time taken: ', (end_time - start_time)/1000);
				resolve(JSON.parse(data));

			}
		});
	});
	
}

exports.fetchKoinexRates = fetchKoinexRates;
exports.fetchCMCRates = fetchCMCRates;
exports.calculateHoldingValue = calculateHoldingValue;


  	

