var helpers = {};
var request = require('request');
var jsonfile = require('jsonfile');
var path = require('path');

/***
Input: Issues String from config or prompt
Output: Array of issues

since issueTypes is passed in through prompt, we must parse it to an array from a string
assuming the input is always in the format [x|y|z], this will split it to an array
***/

helpers.parseIssues = issueTypes => {
	return issueTypes.substring(1, issueTypes.length - 1).split('|');
};
/***
Input: Issues array and apiRoot to send requests
Output: Object that has name of issue as key and issues array handled in callback function
***/

helpers.sendAPIRequests = (issueTypes, apiRoot) => {
	// counter used to wait for last API call to respond before processing next part of data
	// not my ideal solution
	var counter = issueTypes.length;
	var issues = {};
	for (var issue of issueTypes) {
		request.get(apiRoot  +'/issuetypes/' + issue, (req, res) => {
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

			var response = JSON.parse(res.body);
			issues[response.name] = response.issues;
			counter--;
			// decrement counter after each successful response
			if (!counter) {
				//call api requests for issues
				cb(issues);
			}

		});
	}
};

// used for testing wtih sample json files that were provided
helpers.sendSampleAPIRequests = (issueTypes, apiRoot, cb) => {
	var counter = issueTypes.length;
	var issues = {};

	for (var issue of issueTypes) {
		var file = path.join(__dirname, '..', 'samples', issue + '.json');
		jsonfile.readFile(file, function(err, obj) {
			counter--;
			if (!err) {
				issues[obj.name] = obj.issues;
				if (!counter) {
					//call api requests for issues
					cb(issues);
				}
			} else {
				console.log('Please refer to the following error message: \n', err);
			}

		});	
	}
};

/***
Input: Issues object with array of issues
Output: Object that has name of issue as key and estimated completion time
***/
helpers.sumAllEstimates = (issueObj, apiRoot) => {
	// iterate over all object keys (issue types)
	for (var issue in issueObj) {
		var curIssue = issueObj[issue];
		var counter = curIssue.length;
		if (process.env.NODE_ENV === 'development') {
			estimateSampleIssueAndOutput(issue, curIssue, counter);
		} else {
			//send API requests
			estimateIssueandOutput(issue, curIssue, counter);
		}
	}

	function estimateIssueAndOutput(issueName, currentIssue, counter) {
		var sum = 0;
		for (var singleIssue of currentIssue) {
			request.get(apiRoot  +'/issuetypes/' + issue, (req, res) => {
				// according to API documentation, the response should be the following JSON object
				/**
				{
					"id": "/issues/1",
					"issuetype": "/issuetypes/bug",
					"description": "Issue #1",
					"estimate": "3"
				}
				**/

				var response = JSON.parse(res.body);
				issues[response.name] = response.issues;
				sum += parseInt(response.estimate);
				counter--;

				if (!counter) {
					//call api requests for issues
					console.log(issueName + ':', sum);
				}	
			});
		}
	} // end of estimateIssueAndOutput function

	function estimateSampleIssueAndOutput(issueName, currentIssue, counter) {
		var sum = 0;
		for (var singleIssue of currentIssue) {
			// because of how provided samples are named, parse the rootAPI paths accordingly
			var parsedIssue = singleIssue.substring(1).replace('s/', '-');
			var file = path.join(__dirname, '..', 'samples', parsedIssue + '.json');
				jsonfile.readFile(file, function(err, obj) {
					counter--;
					if (!err) {
						sum += parseInt(obj.estimate);
						if (!counter) {
							//call api requests for issues
							console.log(issueName + ':', sum);
						}
					} else {
						console.log('Please refer to the following error message \n', err);
					}
				});	

		}
	} // end of estimateSampleIssueAndOutput function
};

module.exports = helpers;