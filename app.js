var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
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

// the config file only exists if the node_env is development or configuration
if (config) {
	var issueTypes = helpers.parseIssues(config.issueTypes);
	
	if (process.env.NODE_ENV === 'development') {
		var issues = helpers.sendSampleAPIRequests(issueTypes, config.apiRoot, issuesObj => {
			// takes issues array and retrieves all issues
			helpers.sumAllEstimates(issuesObj, config.apiRoot);
		});
	} else {
		helpers.sendAPIRequests(issueTypes, config.apiRoot, issuesObj => {
			// takes issues array and retrieves all issues
			helpers.sumAllEstimates(issuesObj, config.apiRoot);
		});
	}
} else {
	// otherwise start the prompt so that the user may enter arguments through the cmd line
	prompt.start();
	prompt.get(['apiRoot', 'issueTypes'], (err, result) => {
		// get all issueTypes and save it in an object
		var issueTypes = helpers.parseIssues(result.issueTypes);
		helpers.sendAPIRequests(issueTypes, result.apiRoot, issuesObj => {
			// takes issues array and retrieves all issues
			helpers.sumAllEstimates(issuesObj, config.apiRoot);
		});
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
