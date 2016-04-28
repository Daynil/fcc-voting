'use strict';
let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
	githubID: String,
	displayName: String,
	username: String
});

module.exports = mongoose.model('User', userSchema);