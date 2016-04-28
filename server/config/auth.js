'use strict';

let appURL;
if (process.env.NODE_ENV === 'development') {
	appURL = 'http://localhost:3000';
} else {
	appURL = `herokuURL/${process.env.PORT}`;
}

let configAuth = {
	'githubAuth': {
		'clientID': process.env.GITHUB_KEY,
		'clientSecret': process.env.GITHUB_SECRET,
		'callbackURL': 'http://localhost:3000/auth/github/callback'
	}
};

module.exports = configAuth;