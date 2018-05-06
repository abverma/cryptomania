const http = require('http');
const crypto = require('./crypto');
const url = require('url');
const fs = require('fs');
const PORT = process.env.PORT || 5000;
const HOST = 'localhost';
	  

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

var server = http.createServer((req, res) => {

	var url_parts = url.parse(req.url);
	console.log(req.method, url_parts.pathname);

	if (url_parts.pathname === '/') {
		fs.readFile('./crypto.html', (err, data) => {
			if (err) {
				send404(res);
			}
			else {
				res.end(data);
			}
		});
	}
	else if (url_parts.pathname === '/fetchValue') {
		var queryObj = getQueryParams(url_parts);
		console.log(queryObj);

		var bittrex_value = queryObj.bittrex;
		var binance_value = queryObj.binance;

		crypto.fetchAndCalculate(bittrex_value, binance_value)
			.then((value) => {
				console.log('Total: ', value.toFixed(2));
	  			res.writeHead(200, { 'Content-Type': 'html' });
	  			// var data = {
	  			// 	data: {
	  			// 		total: value.toFixed(2)
	  			// 	}
	  			// }
	  			var data = '<html><head><title>Cryptomania</title></head><body><h1>Cryptomania</h1>Total Value: Rs.' + value.toFixed(2).toString() + '</body></html>'
				res.write(data);
				res.end();
			})
			.catch((err) => {
				console.log(err);
	  			res.writeHead(500, { 'Content-Type': 'html/plain' });
				res.write(err);
				res.end();
			});
	}
	else {
		send404(res);
	}
});

server.listen(PORT);

console.log(`Listening at port ${PORT} ....`);
