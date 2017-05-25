var config = {}

if (process.env.NODE_ENV === 'development') {
	config.apiRoot = 'http://www.example.com/api/v1';
	config.issueTypes = '[bugs|stories|tasks]';
} else if (process.env.NODE_ENV === 'configuration') {
	// enter configuration information here
	config.apiRoot = 'http://www.example.com/api/v1';
	config.issueTypes = '[bugs|stories|tasks]';
}	else {
	config = null;
}
	

module.exports = config;