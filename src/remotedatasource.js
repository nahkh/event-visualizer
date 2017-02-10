var _ = require('underscore');
var eventSource = require('./eventsource.js');
var config = require('./config.js');
var locations = require('./data/locations');
var moment = require('moment-timezone');
var parse = require('csv/node_modules/csv-parse/lib/sync');
var request = require('request-promise');
var Rx = require('rxjs');


module.exports = (() => {
	let rows = [];
	
	let subscription = null;
	let loadRowsSubscription = null;
	
	const loadRows = () => {
		return request({
			method: "GET", 
			rejectUnauthorized: false, 
			url: config.getDataUrl(),
		})
			.then(response => {
				let newRows = parse(response);
				newRows.splice(0, 1);
				if (newRows.length) {
					if(rows.length) {
						let index = 0;
						let firstTime = moment(newRows[0][0]);
						while (rows.length < index && firstTime.isBefore(moment(rows[index][0]))) {
							++index;
						}
						rows = rows.splice(0, index-1).concat(newRows);
					} else {
						rows = newRows;
					}
				}
				console.log(`Number of events queued: ${rows.length}`);
			});
	}
	return {
		start() {
			if(loadRowsSubscription) {
				loadRowsSubscription.unsubscribe();
			}
			if(subscription) {
				subscription.unsubscribe();
			}
			loadRows().then(() => {
				console.log('Loaded initial data, starting serving now');
				const offset = moment().unix() - moment(rows[0][0]).unix();
				console.log(`Running with offset ${offset}`);
				subscription = Rx.Observable.interval(10)
					.timeInterval()
					.subscribe(() => {
						const offsetTime = moment().subtract(offset, 'seconds');
						while(rows.length && moment(rows[0][0]).isBefore(offsetTime)) {
							let coordinates = locations.getCoordinates(rows[0][1], rows[0][2] || '');
							rows.splice(0, 1);
							coordinates.timestamp = moment().format('YYYY-MM-DD[T]HH:mm:ssZ');
							eventSource.sendEvent(coordinates);
						}
					});
					
				loadRowsSubscription = Rx.Observable.interval(60000)
					.timeInterval()
					.subscribe(() => {
						loadRows();
					});
			});
		},
		stop() {
			if(subscription) {
				subscription.unsubscribe();
			}
			if(loadRowsSubscription) {
				loadRowsSubscription.unsubscribe();
			}
			subscription = null;
			loadRowsSubscription = null;
		}
	};
})();


