var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var prompt = require('prompt');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

prompt.start();

prompt.get(['apiRoot', 'issueTypes'], (err, result) => {
	// get all issuesTypes and save it in an object
	
	// since issueTypes is passed in through prompt, we must parse it to an array from a string
	// assuming the input is always in the format [x|y|z], this will split it to an array
	var issueTypes = result.issueTypes.substring(1, result.issueTypes.length - 1).split('|');
	var counter = issueTypes.length;
	// counter used to wait for last API call to respond before processing next part of data
	// not my ideal solution

	var issues = {}
	// object to store issuetypes API calls

	for (var issueType of issueTypes) {
		request.get(result.apiRoot + '/issuetypes/' + issueType, (req, res) => {
			// according to API documentation, the response should be the following JSON object
			/**
				{
					"id": "/issuetypes/story",
					"name": "story",
					"issues": [
						"/issues/4",
						"/issues/5"
					]
				}
			**/

			issues[res.name] = res.issues;
			counter--;
			//decrement counter after each successful response

			if (!counter) {
				//call api requests for issues
			}

		});
	}


});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
