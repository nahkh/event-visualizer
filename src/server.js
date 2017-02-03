'use strict';

var express = require('express');
var eventSource = require('./eventsource.js');

module.exports = (() => {
	var app = express();
	app.use('/resources', express.static(__dirname + '/public'));
	app.get('/', (req, res) => {
		res.sendFile(__dirname + '/public/index.html');
	});

	return app.listen(5000, () => {
		console.log('Listening on port 5000!');
	})
})();


