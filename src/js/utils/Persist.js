var LZString = require('lz-string');

var Persist = {
	getItem: function(key, decompress) {
		decompress = (decompress === undefined) ? true : decompress;

		var item = (decompress) ? LZString.decompress(localStorage.getItem(key)) : localStorage.getItem(key);

		return (item === '' || item === null) ? null : JSON.parse(item);
	},

	getChromeSyncItem: function(item, callback) {
		chrome.storage.sync.get(item, callback);
	},

	setItem: function(key, item, compress) {
		compress = (compress === undefined) ? true : compress;

		item = (compress) ? LZString.compress(JSON.stringify(item)) : JSON.stringify(item);

		localStorage.setItem(key, item);
	},

	removeItem: function(key) {
		localStorage.removeItem(key);
	},

	clear: function() {
		localStorage.clear();
		chrome.storage.sync.clear();
	}
};

module.exports = Persist;
