import * as THREE from 'three';
import Canvg from 'canvg';
import { getLogger } from 'aurelia-logging';
const log = getLogger('three-icon');
export class ThreeIcon {
    static getTexture(input, backgroundColor, foregroundColor, text) {
        let iconKey = `${input}-${backgroundColor}-${foregroundColor}-${text}`;
        if (ThreeIcon.icons[iconKey]) {
            return Promise.resolve(ThreeIcon.icons[iconKey]);
        }
        return ThreeIcon.textureFromStringOrUrlSvg(input, backgroundColor, foregroundColor, text).then((texture) => {
            ThreeIcon.icons[iconKey] = texture;
            return ThreeIcon.icons[iconKey];
        });
    }
    static getSvgFromUrl(url) {
        return fetch(url).then((result) => {
            return result.text();
        }).then((text) => {
            if (text.toLowerCase().indexOf('<svg') !== -1)
                return text;
            throw new Error('Invalid SVG');
        });
    }
    static textureFromStringOrUrlSvg(string, backgroundColor, foregroundColor, text) {
        let imageCanvas = document.createElement('canvas');
        let svgPromise = Promise.resolve(string);
        if (string.indexOf('http') === 0) {
            svgPromise = ThreeIcon.getSvgFromUrl(string);
        }
        return svgPromise.then((string) => {
            let svg = ThreeIcon.colorizeSvg(string, backgroundColor, foregroundColor, text);
            return Canvg.fromString(imageCanvas.getContext('2d'), svg, {
                ignoreMouse: true,
                enableRedraw: false,
                ignoreDimensions: false
            });
        }).then((canvg) => {
            return canvg.render();
        }).then(() => {
            let texture = new THREE.Texture(imageCanvas);
            texture.needsUpdate = true;
            return texture;
        });
    }
    static colorizeSvg(svg, backgroundColor, foregroundColor, text) {
        let f = document.createElement('iframe');
        f.style.display = 'none';
        document.body.appendChild(f);
        f.contentDocument.open();
        f.contentDocument.write(svg);
        f.contentDocument.close();
        let doc = f.contentDocument.body;
        document.body.removeChild(f);
        doc.querySelectorAll('.colorize-fill-with-fill').forEach((el) => {
            if (el.getAttribute('fill'))
                el.setAttribute('fill', backgroundColor);
        });
        doc.querySelectorAll('.colorize-fill-with-stroke').forEach((el) => {
            if (el.getAttribute('fill'))
                el.setAttribute('fill', foregroundColor);
        });
        doc.querySelectorAll('.colorize-stroke-with-fill').forEach((el) => {
            if (el.getAttribute('fill'))
                el.setAttribute('fill', backgroundColor);
        });
        doc.querySelectorAll('.colorize-stroke-with-stroke').forEach((el) => {
            if (el.getAttribute('fill'))
                el.setAttribute('fill', foregroundColor);
        });
        if (text) {
            let el = doc.querySelector('.text');
            el.setAttribute('fill', foregroundColor);
            el.textContent = text;
        }
        svg = doc.innerHTML;
        return svg;
    }
}
ThreeIcon.icons = {};

//# sourceMappingURL=three-icon.js.map
