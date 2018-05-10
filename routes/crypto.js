const request = require('request');
const Q = require('q');

const BTC_HOLDING = .27;
const XRP_HOLDING = 2333;
const LTC_HOLDING = 1.4;

const KOINEX_TICKER_URL = 'https://koinex.in/api/ticker';
var CMC_LIMIT = 10;

var CMC_TICKER_URL = 'https://api.coinmarketcap.com/v2/ticker/';


const ask = (question) => {
	return new Promise((resolve, reject) => {
		var stdin = process.stdin, stdout = process.stdout;

		stdin.resume();
		stdout.write(`${question}`);

		stdin.once('data', function(data) {
			//data = data.toString().trim();

			if (!data || data === '') {
			  stdout.write('Please enter some data bro... \n');
			  ask(question, callback);
			}
			else {
			  resolve(parseFloat(data));
			}
		});
		
	});
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


  	

