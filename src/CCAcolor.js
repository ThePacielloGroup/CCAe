'use strict';
const Color = require('./Color.js') // https://github.com/Qix-/color/
const cssKeywords = require('color-name');
const blinder = require('color-blind');

var reverseKeywords = {};
for (var key in cssKeywords) {
	if (cssKeywords.hasOwnProperty(key)) {
		reverseKeywords[cssKeywords[key]] = key;
	}
}

Color.prototype.real = null
Color.prototype.displayedValue = null

Color.prototype.cssname = function() {
    const reversed = reverseKeywords[this.color];
    if (reversed) {
        return reversed;
    }
    return null
}

Color.prototype.setMixed = function(bg) {
    // https://stackoverflow.com/a/11615135/3909342
    if (this.alpha() < 1) {
        let a = 1 - this.alpha();
        let r = Math.round((this.alpha() * (this.red() / 255) + (a * (bg.red() / 255))) * 255);
        let g = Math.round((this.alpha() * (this.green() / 255) + (a * (bg.green() / 255))) * 255);
        let b = Math.round((this.alpha() * (this.blue() / 255) + (a * (bg.blue() / 255))) * 255);
        this.real = Color.rgb(r, g, b)
    } else {
        this.real = null
    }
}

Color.prototype.getReal = function() {
    if (this.real != null) {
        return this.real
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
    let abbr = /^#([a-f0-9]{3})$/i;
    let hex = /^#([a-f0-9]{6})$/i;
    return (string.match(hex) || string.match(abbr))
}

Color.isHexA = function(string) {
    let abbr = /^#([a-f0-9]{3,4})$/i;
    let hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
    return (string.match(hex) || string.match(abbr))
}

Color.isRGB = function(string) {
    let rgb = /^rgb\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*?\)$/;
    return string.match(rgb)
}

Color.isRGBA = function(string) {
    let rgba = /^rgba\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
    return string.match(rgba)
}

Color.isHSL = function(string) {
    let hsl = /^hsl\(\s*([+-]?(?:\d*\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*?\)$/;
    return string.match(hsl)
}

Color.isHSLA = function(string) {
    let hsla = /^hsla\(\s*([+-]?(?:\d*\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
    return string.match(hsla)
}

Color.isHSV = function(string) {
    let hsv = /^hsv\(\s*([+-]?(?:\d*\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*?\)$/;
    return string.match(hsv)
}

Color.isHSVA = function(string) {
    let hsva = /^hsva\(\s*([+-]?(?:\d*\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
    return string.match(hsva)
}

Color.isName = function(string) {
    // Full list https://www.w3.org/TR/css-color-3/#svg-color
    return (cssKeywords[string])
}

// HSV not supported by https://github.com/Qix-/color-string
// So we overright string()

var swizzle = require('simple-swizzle');
var colorString = require('color-string');
Color.prototype.string=function (places) {
    var self = (this.model in colorString.to || this.model == "hsv") ? this : this.rgb();
    self = self.round(typeof places === 'number' ? places : 1);
    var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);

    if (this.model == "hsv") {
        var hsva = swizzle(args);
        return hsva.length < 4 || hsva[3] === 1
            ? 'hsv(' + hsva[0] + ', ' + hsva[1] + '%, ' + hsva[2] + '%)'
            : 'hsva(' + hsva[0] + ', ' + hsva[1] + '%, ' + hsva[2] + '%, ' + hsva[3] + ')';    
    } else {
        return colorString.to[self.model](args);    
    }
},

// Qix doesn't display alpha values for hex
Color.prototype.hexa=function () {
    if (this.valpha < 1) {
        return this.hex() + Math.floor(this.valpha*255).toString(16)
    }
    return this.hex()
},


Color.prototype.getColorTextString=function (format) {
    switch (format) {
        case 'rgb':
            return this.getReal().rgb().string()
        case 'rgba':
            return this.rgb().string()
        case 'hsl':
            // Return rounded values for HSL. This is due to a bug in `color-string` Qix-/color#127
            return this.getReal().hsl().round().string()
        case 'hsla':
            // Return rounded values for HSL. This is due to a bug in `color-string` Qix-/color#127
            return this.hsl().round().string()
        case 'hsv':
            // Return rounded values for HSV. This is due to a bug in `color-string` Qix-/color#127
            return this.getReal().hsv().round().string()
        case 'hsva':
            // Return rounded values for HSV. This is due to a bug in `color-string` Qix-/color#127
            return this.hsv().round().string()
        default: //hex
            return this.hexa()
    }
}

module.exports = Color