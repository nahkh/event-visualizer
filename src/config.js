var config = require('../config.json');

module.exports = {
	getDataUrl() {
		return config.dataSource;
	}
}