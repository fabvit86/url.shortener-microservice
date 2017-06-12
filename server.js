'use strict';

var express = require('express'),
	routes = require('./app/routes/index.js'),
	mongoose = require('mongoose');

var app = express();
require('dotenv').load(); //inizialize the dotenv Node module

var rootPath = process.cwd();

//db connection:
mongoose.connect(process.env.MONGO_URI); //takes the uri from the .env file

app.use('/public', express.static(rootPath+'/public'));
app.use('/controllers', express.static(rootPath+'/app/controllers'));

routes(app); //pass the app to the routes

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log('Node.js listening on port '+port+'...');
});