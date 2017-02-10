var _ = require('underscore');
var eventSource = require('./eventsource.js');
var fs = require('fs');
var locations = require('./data/locations');
var moment = require('moment-timezone');
var parse = require('csv/node_modules/csv-parse/lib/sync');
var Rx = require('rxjs');


module.exports = (() => {
	let fileContents = fs.readFileSync('./src/data/latest_shipments 2017-02-09T0913.csv', { encoding: 'utf-8'});
	let rows = parse(fileContents);
	rows.splice(0,1);
	
	let subscription = null;
	
	return {
		start() {
			if(subscription) {
				subscription.unsubscribe();
			}
			let cursorPosition = 0;
			const offset = moment().unix() - moment(rows[0][0]).unix();
			subscription = Rx.Observable.interval(10)
				.timeInterval()
				.subscribe(() => {
					const offsetTime = moment().subtract(offset, 'seconds');
					while(cursorPosition < rows.length && moment(rows[cursorPosition][0]).isBefore(offsetTime)) {
						let coordinates = locations.getCoordinates(rows[cursorPosition][1], rows[cursorPosition][2] || '');
						coordinates.timestamp = moment().format('YYYY-MM-DD[T]HH:mm:ssZ');
						eventSource.sendEvent(coordinates);
						++cursorPosition;
					}
					if(cursorPosition >= rows.length) {
						this.start();
					}
				});
		},
		stop() {
			if(subscription) {
				subscription.unsubscribe();
			}
			subscription = null;
		}
	};
})();


