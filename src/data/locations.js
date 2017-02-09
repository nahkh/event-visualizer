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
      latitude: row[2],
      longitude: row[3]
    };
  });
  
  return {
    getCoordinates(countryCode, locality) {
      let country = countries[countryCode.toLowerCase()];
      if (country) {
        return country[locality.toLowerCase()];
      }
    }
  };
})();

