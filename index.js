const MongoClient = require('mongodb').MongoClient;

const db = null;

const HOST = 'localhost';
const PORT = process.env.PORT || 27017;
const SCHEMA = 'crypto';

var url = `mongodb://${HOST}:${PORT}/${SCHEMA}`; 

console.log(url);
const connect = (cb) => {
	MongoClient.connect(url, function (err, client) {
		if (err) {
			cb(err);
		}	
		else {
			console.log('Mongo connection ready...');

			var db = client.db(SCHEMA);
			cb(db);
		}
	});
}

exports.connect = connect;