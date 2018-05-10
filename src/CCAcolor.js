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

Color.isHex = function(string) {
    let abbr = /^#([a-f0-9]{3,4})$/i;
    let hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
    return (string.match(hex) || string.match(abbr))
}

Color.isRGB = function(string) {
    let rgb = /^rgb?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*?\)$/;
    return string.match(rgb)
}

Color.isRGBA = function(string) {
    let rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
    return string.match(rgba)
}

Color.isHSL = function(string) {
    let hsl = /^hsl?\(\s*([+-]?(?:\d*\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*?\)$/;
    return string.match(hsl)
}

Color.isHSLA = function(string) {
    let hsla = /^hsla?\(\s*([+-]?(?:\d*\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
    return string.match(hsla)
}

Color.isName = function(string) {
    return (cssKeywords[string])
}
module.exports = Color
