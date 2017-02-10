var eventSource = require('../eventsource.js');
var locations = require('./locations');
var Rx = require('rxjs');

const fixedLocations = [
	{
		countryCode: 'us',
		locality: 'new york'
	},
	{
		countryCode: 'us',
		locality: 'los angeles'
	},
	{
		countryCode: 'gb',
		locality: 'london'
	},
	{
		countryCode: 'de',
		locality: 'berlin'
	},
	{
		countryCode: 'fi',
		locality: 'helsinki'
	},
	{
		countryCode: 'au',
		locality: 'sydney'
	},
	{
		countryCode: 'ch',
		locality: 'zurich'
	},
	{
		countryCode: 'ru',
		locality: 'moscow'
	}
];

module.exports = (() => {
	let subscription = null;
	
	return {
		start() {
			if(subscription) {
				subscription.unsubscribe();
			}
			subscription = Rx.Observable.interval(1000)
				.timeInterval()
				.subscribe(index => {
					let location = fixedLocations[parseInt(index.value) % fixedLocations.length];
					if(location) {
						let coordinates = locations.getCoordinates(location.countryCode, location.locality);
						eventSource.sendEvent(coordinates);
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


