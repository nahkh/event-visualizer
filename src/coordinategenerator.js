var eventSource = require('./eventsource.js');
var locations = require('./data/locations');
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

Rx.Observable.interval(100)
	.timeInterval()
	.subscribe(index => {
		let location = fixedLocations[parseInt(index.value) % fixedLocations.length];
		if(location) {
			let coordinates = locations.getCoordinates(location.countryCode, location.locality);
			//let coordinates = {latitude:0, longitude:0};
			eventSource.sendEvent(coordinates);
		}
	});

