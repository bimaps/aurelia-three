"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeIcon = void 0;
var THREE = require("three");
var canvg_1 = require("canvg");
var aurelia_logging_1 = require("aurelia-logging");
var log = aurelia_logging_1.getLogger('three-icon');
var ThreeIcon = (function () {
    function ThreeIcon() {
    }
    ThreeIcon.getTexture = function (input, backgroundColor, foregroundColor, text) {
        var iconKey = input + "-" + backgroundColor + "-" + foregroundColor + "-" + text;
        if (ThreeIcon.icons[iconKey]) {
            return Promise.resolve(ThreeIcon.icons[iconKey]);
        }
        return ThreeIcon.textureFromStringOrUrlSvg(input, backgroundColor, foregroundColor, text).then(function (texture) {
            ThreeIcon.icons[iconKey] = texture;
            return ThreeIcon.icons[iconKey];
        });
    };
    ThreeIcon.getSvgFromUrl = function (url) {
        return fetch(url).then(function (result) {
            return result.text();
        }).then(function (text) {
            if (text.toLowerCase().indexOf('<svg') !== -1)
                return text;
            throw new Error('Invalid SVG');
        });
    };
    ThreeIcon.textureFromStringOrUrlSvg = function (string, backgroundColor, foregroundColor, text) {
        var imageCanvas = document.createElement('canvas');
        var svgPromise = Promise.resolve(string);
        if (string.indexOf('http') === 0) {
            svgPromise = ThreeIcon.getSvgFromUrl(string);
        }
        return svgPromise.then(function (string) {
            var svg = ThreeIcon.colorizeSvg(string, backgroundColor, foregroundColor, text);
            return canvg_1.default.fromString(imageCanvas.getContext('2d'), svg, {
                ignoreMouse: true,
                enableRedraw: false,
                ignoreDimensions: false
            });
        }).then(function (canvg) {
            return canvg.render();
        }).then(function () {
            var texture = new THREE.Texture(imageCanvas);
            texture.needsUpdate = true;
            return texture;
        });
    };
    ThreeIcon.colorizeSvg = function (svg, backgroundColor, foregroundColor, text) {
        var f = document.createElement('iframe');
        f.style.display = 'none';
        document.body.appendChild(f);
        f.contentDocument.open();
        f.contentDocument.write(svg);
        f.contentDocument.close();
        var doc = f.contentDocument.body;
        document.body.removeChild(f);
        doc.querySelectorAll('.colorize-fill-with-fill').forEach(function (el) {
            if (el.getAttribute('fill'))
                el.setAttribute('fill', backgroundColor);
        });
        doc.querySelectorAll('.colorize-fill-with-stroke').forEach(function (el) {
            if (el.getAttribute('fill'))
                el.setAttribute('fill', foregroundColor);
        });
        doc.querySelectorAll('.colorize-stroke-with-fill').forEach(function (el) {
            if (el.getAttribute('fill'))
                el.setAttribute('fill', backgroundColor);
        });
        doc.querySelectorAll('.colorize-stroke-with-stroke').forEach(function (el) {
            if (el.getAttribute('fill'))
                el.setAttribute('fill', foregroundColor);
        });
        if (text) {
            var el = doc.querySelector('.text');
            el.setAttribute('fill', foregroundColor);
            el.textContent = text;
        }
        svg = doc.innerHTML;
        return svg;
    };
    ThreeIcon.icons = {};
    return ThreeIcon;
}());
exports.ThreeIcon = ThreeIcon;

//# sourceMappingURL=three-icon.js.map
