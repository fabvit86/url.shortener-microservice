'use strict';

var rootPath = process.cwd();
var UrlHandler = require(rootPath+'/app/controllers/urlController.server.js');

module.exports = function (app){

	var urlHandler = new UrlHandler();

	app.route('/').get(function(req, res){
		res.sendFile(rootPath+'/public/index.html');
	});

	//route to use to get a new short URL:
	app.route('/getnewurl/*').get(urlHandler.getUrl);

	app.route('/*').get(urlHandler.getLink);
}