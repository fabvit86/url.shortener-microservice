'use strict';

var rootPath = process.cwd();
var UrlHandler = require(rootPath+'/app/controllers/urlController.server.js');

module.exports = function (app){

	var urlHandler = new UrlHandler();

	app.route('/').get(function(req, res){
		res.sendFile(rootPath+'/public/index.html');
	});

	//path to use to generate a new short URL:
	app.route('/getnewurl/*').get(urlHandler.getUrl);

	//passing a shorturl will redirect to the original URL:
	app.route('/:shorturl').get(urlHandler.getLink);

}