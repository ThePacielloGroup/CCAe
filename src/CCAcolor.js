const Color = require('color') // https://github.com/Qix-/color/
const cssKeywords = require('color-name');
const blinder = require('color-blind');

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

Color.prototype.mixed = function(bg) {
    // https://stackoverflow.com/a/11615135/3909342
    if (this.alpha() !== 1) {
        let a = 1 - this.alpha();
        let r = Math.round((this.alpha() * (this.red() / 255) + (a * (bg.red() / 255))) * 255);
        let g = Math.round((this.alpha() * (this.green() / 255) + (a * (bg.green() / 255))) * 255);
        let b = Math.round((this.alpha() * (this.blue() / 255) + (a * (bg.blue() / 255))) * 255);
        return Color.rgb(r, g, b)
    } else {
        return this
    }
}

Color.prototype.protanopia = function() {
    let rgb = blinder.protanopia(this.hex(), true);
    return Color.rgb(rgb.R, rgb.G, rgb.B)
}

Color.prototype.deuteranopia = function() {
    let rgb = blinder.deuteranopia(this.hex(), true);
    return Color.rgb(rgb.R, rgb.G, rgb.B)
}

Color.prototype.tritanopia = function() {
    let rgb = blinder.tritanopia(this.hex(), true);
    return Color.rgb(rgb.R, rgb.G, rgb.B)
}

Color.prototype.protanomaly = function() {
    let rgb = blinder.protanomaly(this.hex(), true);
    return Color.rgb(rgb.R, rgb.G, rgb.B)
}

Color.prototype.deuteranomaly = function() {
    let rgb = blinder.deuteranomaly(this.hex(), true);
    return Color.rgb(rgb.R, rgb.G, rgb.B)
}

Color.prototype.tritanomaly = function() {
    let rgb = blinder.tritanomaly(this.hex(), true);
    return Color.rgb(rgb.R, rgb.G, rgb.B)
}

Color.prototype.achromatopsia = function() {
    let rgb = blinder.achromatopsia(this.hex(), true);
    return Color.rgb(rgb.R, rgb.G, rgb.B)
}

Color.prototype.achromatomaly = function() {
    let rgb = blinder.achromatomaly(this.hex(), true);
    return Color.rgb(rgb.R, rgb.G, rgb.B)
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
