'use strict';

var SSE = require('express-sse');
var sse = new SSE();

module.exports = {
	sendEvent(event) {
		if(event) {
			sse.send(event);
		}
	},
	init(req,res) {
		sse.init(req, res);
	}
}