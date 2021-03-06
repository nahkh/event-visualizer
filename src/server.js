'use strict';

var express = require('express');
var eventSource = require('./eventsource.js');
var locations = require('./data/locations.js');
var generator = require('./remotedatasource.js');

module.exports = (() => {
	var app = express();
	app.get('/stream', eventSource.init);
	app.use('/resources', express.static(__dirname + '/public'));
	app.get('/', (req, res) => {
		res.sendFile(__dirname + '/public/index.html');
	});
	
	generator.start();


	return app.listen(5000, () => {
		console.log('Listening on port 5000!');
	})
})();
