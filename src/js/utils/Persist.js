var LZString = require('lz-string');

var Persist = {

	getItem: function(key, decompress) {
		decompress = (decompress === undefined) ? true : decompress;

		var item = (decompress) ? LZString.decompress(localStorage.getItem(key)) : localStorage.getItem(key);

		return (item === '' || item === null) ? null : JSON.parse(item);
	},

	setItem: function(key, item, compress) {
		compress = (compress === undefined) ? true : compress;

		item = (compress) ? LZString.compress(JSON.stringify(item)) : JSON.stringify(item);

		localStorage.setItem(key, item);
	}

};

module.exports = Persist;
