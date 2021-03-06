const mongoose = require('mongoose');

const HOST = 'ds119150.mlab.com';
const PORT = 19150;
const SCHEMA = 'cryptomania';
const user = 'abverma';
const pwd = 'matlabkya';

var url = `mongodb://${user}:${pwd}@${HOST}:${PORT}/${SCHEMA}`; 

mongoose.connect(url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
	console.log('Connected to mongo...');
})

exports.mongoose = mongoose;