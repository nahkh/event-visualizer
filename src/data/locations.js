var csv = require('csv');
var fs = require('fs');
var _ = require('underscore');

module.exports = (() => {
  let rows = csv.parse(fs.readFileSync('./src/server/data/clean.csv', { encoding: 'utf-8'}));
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
      let country = rows[countryCode];
      if (country) {
        return country[locality];
      }
    }
  };
})();

