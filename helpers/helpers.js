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
}
/***
Input: Issues array and apiRoot to send requests
Output: Object that has name of issue as key and issues array

***/

helpers.sendAPIRequests = (issueTypes, apiRoot) => {
	// counter used to wait for last API call to respond before processing next part of data
	// not my ideal solution
	var counter = issueTypes.length;
	var issues = {};

	for (var issue of issueTypes) {
		request.get('apiRoot  + '/issuetypes/' + issue', (req, res) => {
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
			issues[response[0].title] = response[0].id;
			counter--;
			// decrement counter after each successful response

			if (!counter) {
				//call api requests for issues
				console.log(issues);
				console.log('All calls have been made');
			}

		});
	}
}

// used for testing wtih sample json files that were given
helpers.sendSampleAPIRequests = (issueTypes, apiRoot) => {
	for (var issue of issueTypes) {
		var file = path.join(__dirname, '..', 'samples', issue + '.json');
		jsonfile.readFile(file, function(err, obj) {
			console.log(obj)
		});	
	}

}

module.exports = helpers;