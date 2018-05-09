const Color = require('color') // https://github.com/Qix-/color/
const cssKeywords = require('color-name');

var reverseKeywords = {};
for (var key in cssKeywords) {
	if (cssKeywords.hasOwnProperty(key)) {
		reverseKeywords[cssKeywords[key]] = key;
	}
}

Color.prototype.cssname = function() {
    const reversed = reverseKeywords[this.color];
    if (reversed) {
        return reversed;
    }
    return null
}

module.exports = Color