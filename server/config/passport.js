'use strict';

let GitHubStrategy = require('passport-github').Strategy;
let User = require('../models/users');
let configAuth = require('./auth');

module.exports = (passport) => {
	passport.serializeUser( (user, done) => done(null, user.id));
	
	passport.deserializeUser( (id, done) => {
		User.findById(id, (err, user) => done(err, user));
		//done(null, user);
	});
	
	passport.use(new GitHubStrategy({
		clientID: configAuth.githubAuth.clientID,
		clientSecret: configAuth.githubAuth.clientSecret,
		callbackURL: configAuth.githubAuth.callbackURL
	},
	(token, refreshToken, profile, done) => {

			//done(null, profile);
			User.findOne({ 'githubID': profile.id }, (err, user) => {
				if (err) done(err);
				if (user) done(null, user);
				else {
					let newUser = new User();
					
					newUser.githubID = profile.id;
					newUser.displayName = profile.displayName;
					newUser.username = profile.username;
					
					newUser.save( (err) => {
						if (err) throw err;
						return done(null, newUser);
					})
				}
			});
	}));
}