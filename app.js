var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var prompt = require('prompt');

var app = express();
var config = require('./helpers/config.js');
var helpers = require('./helpers/helpers.js');
// comment out if you want to input through cmd prompt


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
if (config) {
	var issueTypes = helpers.parseIssues(config.testissueTypes);
	helpers.sendAPIRequests(issueTypes, config.testapiRoot);

} else {
	prompt.start();

	prompt.get(['apiRoot', 'issueTypes'], (err, result) => {
		// get all issueTypes and save it in an object
		var issueTypes = helpers.parseIssues(result.issueTypes);
		helpers.sendAPIRequests(issueTypes, result.apiRoot);


	});
	
}

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
