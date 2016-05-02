'use strict';
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
require('dotenv').load();
require('./config/passport')(passport);

const mongoose = require('mongoose');
const Users = require('./models/users');
const Polls = require('./models/polls');

let development = process.env.NODE_ENV === 'development';

// Set up database stuff
mongoose.connect(process.env.MONGO_URI);

app.use(bodyParser.json());
app.use(morgan('dev'));

if (development) {
	const webpack = require('webpack');
	const webpackMiddleware = require('webpack-dev-middleware');
	const webpackConfig = require('../webpack.config.js');
	const compiler = webpack(webpackConfig);
	const middleware = webpackMiddleware(compiler, {
		publicPath: '/',
		stats: {
			colors: true,
			hash: false,
			timings: true,
			chunks: false, 
			chunkModules: false,
			modules: false
		}
	});
	app.use(middleware);
}
let pathname = path.join(__dirname, "../public");
app.use( express.static(pathname) );

app.use(session({
	secret: 'secretRandSessionPass',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/api/polllist', (req, res) => {
	Polls
		.find({})
		.exec()
		.then(users => {
			res.status(200).send(users);
		});
});

app.post('/api/newpoll', (req, res) => {
	let newpoll = req.body.newpoll;
	
	let newQuestion = new Polls({
		creator: newpoll.creator,
		question: newpoll.question,
		choices: newpoll.choices
	});
	newQuestion.save(err => {
		if (err)  {
			console.log(err);
			res.status(400).end(err);
		} else {
			res.status(200).end('new question saved');
		}
	});
});

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', passport.authenticate('github', {successRedirect: '/after-auth'}));

app.get('/auth/checkCreds', (req, res) => {
	if (req.isAuthenticated()) res.send({isAuthenticated: true, userID: req.user.githubID});
	else res.send({isAuthenticated: false});
});

app.get('/auth/logout', (req, res) => {
	req.logout();
	res.end();
});

// Pass all non-api routes to react-router for handling
app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, "../public", 'index.html'));
});

let port = process.env.PORT || 3000;
let server = app.listen(port, () => console.log(`Listening on port ${port}...`));