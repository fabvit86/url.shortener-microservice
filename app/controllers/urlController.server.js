'use strict';

var Urls = require('../models/urls.js'); //url model

//validates a URL:
function validateUrl(url){
	if(typeof url !== 'string') return false;
	//a valid url must start with http:// or https:// and must contain at least one point
	var regExp = new RegExp('^(https?:\/\/)' //must contain http:// or https://
		+'(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}' //domain name, must contain at least one point and end with at least two letters
		+'(\/[-a-z\\d%_.~+]*)*' //path
		+'(\\?[;&a-z\\d%_.~+=-]*)?' //it may contain a query string (?param=value)
    	+'(\#[-a-z\\d_]*)?$','i' //it may contain a fragment identifier (#anchor) at the end
	);
	if(regExp.test(url)) return true;
	return false;
}

//Creates a base36 key to be used as the short URL:
function createShortUrl(id){
	//get the hex string from the ObjectId, convert it to Integer and then convert it to a base36 string:
	return parseInt(id.valueOf(), 16).toString(36);
}

function UrlHandler(){
	this.getUrl = function(req, res){
		var parameter = req.originalUrl.slice(11); //remove initial 'getnewurl/' from the url
		var response = {};
		//validate url:
		if(validateUrl(parameter)){ 
			//create a new URL:
			var newUrl = new Urls({'originalUrl': parameter}); 
			var newUrlId = newUrl._id; //the _id is set on instantiation
			//insert the new URL in the urls collection:
			newUrl.save(function(err, insertedUrl){
				if(err) throw err;
				//create the shortURL encoding the document id:
				var shortUrl = createShortUrl(newUrlId);
				//update the document in the urls collection:
				Urls.findByIdAndUpdate(newUrlId, {"shortUrl": shortUrl}, {new: true})
				.exec(function(err, result){
					if(err) throw err;
					//complete and send the response:
					response.original_url = parameter;
					response.short_url = process.env.APP_URL+result.shortUrl;
					res.json(response);
				});
			});
		}else{
			response.error = "Invalid URL";
			res.json(response);
		}
	};

	//retrieve and redirect to the original URL binded to the short URL:
	this.getLink = function(req, res){
		Urls.findOne({"shortUrl": req.originalUrl.slice(1)}, function(err, result){
			if(err) throw err;
			if(!result) return res.send("Invalid short URL");
			res.redirect(result.originalUrl);
		});
	};
}//UrlHandler

module.exports = UrlHandler;