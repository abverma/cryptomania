const request = require('request');
const Q = require('q');

const BTC_HOLDING = .27;
const XRP_HOLDING = 2333;
const LTC_HOLDING = 1.4;

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

const fetchAndCalculate = (bittrex_value, binance_value) => {

	return new Promise((resolve, reject) => {
		const options = {
			url : 'https://koinex.in/api/ticker',
			headers: {
				'User-Agent': "Mozilla/5.0 Gecko/20100101 Firefox/59.0"	
			}
		}
		const start_time = new Date().getTime();

		console.log('Fetching rates in rupees ....');

		bittrex_value = bittrex_value ? parseFloat(bittrex_value) : 0;
		binance_value = binance_value ? parseFloat(binance_value) : 0;

		request(options, (err, res, data) => {
			if (err) {
				console.log(err);
				reject(err);
			}
			else {
				var data = JSON.parse(data);
				var btc_inr = parseFloat(data.prices.inr.BTC);
				var xrp_inr = parseFloat(data.prices.inr.XRP);
				var ltc_inr = parseFloat(data.prices.inr.LTC); 
				
				console.log('BTC: ',btc_inr);
				console.log('XRP: ', xrp_inr);
				console.log('LTC: ', ltc_inr);		
				var value = btc_inr * (bittrex_value + binance_value + BTC_HOLDING) + (xrp_inr * XRP_HOLDING) + (ltc_inr * LTC_HOLDING);
				var end_time = new Date().getTime();
				console.log('Time taken: ', (end_time - start_time)/1000);
				resolve({
					total_value: value.toFixed(2),
					btc_rate: btc_inr,
					ltc_rate: ltc_inr,
					xrp_rate: xrp_inr
				});
			}
		});
	})
	
}

exports.fetchAndCalculate = fetchAndCalculate;

// var bittrex_value;
// var binance_value;

// ask('Enter BTC value on bittrex: ')
// 	.then((result) => {
// 		bittrex_value = result;
// 		return ask('Enter BTC value on binance: ')
// 	})
// 	.then((result) => {
// 		binance_value = result;
// 		fetchAndCalculate(bittrex_value, binance_value)
// 			.then((value) => {
// 				console.log('Total: ', value.toFixed(2));
// 				process.exit();
// 			})
// 			.catch((err) => {
// 				console.log(err);
// 			});

// 	})
// 	.catch((err) => {
// 		console.log(err);
// 		process.exit();
// 	});


  	

