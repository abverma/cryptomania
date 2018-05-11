const MongoClient = require('mongodb').MongoClient;

const db = null;

const HOST = ds119150.mlab.com;
const PORT = process.env.PORT || 19150;
const SCHEMA = 'cryptomania';
const user = 'abverma';
const pwd = 'matlabkya';

var url = `mongodb://${user}:${pwd}${HOST}:${PORT}/${SCHEMA}`; 

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