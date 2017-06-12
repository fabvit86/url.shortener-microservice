'use strict';

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var Url = new Schema({
		originalUrl: String,
		shortUrl: String
	}
);

//convert the Schema into a Model and export it:
module.exports = mongoose.model('Url', Url, 'urls');