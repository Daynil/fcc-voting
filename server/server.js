'use strict';
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');

let development = true; // process.env.NODE_ENV !== 'production';

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

app.get('/test', (req, res) => {
	res.status(200).end('We workey!');
});

let port = process.env.PORT || 3000;
let server = app.listen(port, () => console.log(`Listening on port ${port}...`));