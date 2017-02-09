'use strict';

var _ = require('underscore');
var fs = require('fs');
var parse = require('csv/node_modules/csv-parse/lib/sync');


module.exports = (() => {
  let fileContents = fs.readFileSync('./src/data/clean.csv', { encoding: 'utf-8'});
  let rows = parse(fileContents);
  let countries = {};
  _.forEach(rows, row => {
    let country = countries[row[0]];
    if (!country) {
      country = {};
      countries[row[0]] = country;
    }
    country[row[1]] = {
      latitude: parseFloat(row[2]),
      longitude: parseFloat(row[3])
    };
  });
  
  for (let countryCode in countries) {
	  if (!countries.hasOwnProperty(countryCode)) {
		  continue;
	  }
	  const cities = _.pairs(countries[countryCode]);
	  const average_longitude = _.reduce(cities, (mem, c) => mem + c[1].longitude, 0) / cities.length;
	  const average_latitude = _.reduce(cities, (mem, c) => mem + c[1].latitude, 0) / cities.length;
	  countries[countryCode].average = {
		  longitude: average_longitude,
		  latitude: average_latitude,
	  };
  }
  
  
  return {
    getCoordinates(countryCode, locality) {
      let country = countries[countryCode.toLowerCase()];
      if (country) {
        let coordinates = country[locality.toLowerCase()];
		if (!coordinates) {
			coordinates = country.average;
		}
		return coordinates;
      }
    }
  };
})();

