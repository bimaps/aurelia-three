"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CubeView = exports.ThreeCubeView = void 0;
const THREE = require("three");
const aurelia_framework_1 = require("aurelia-framework");
const aurelia_logging_1 = require("aurelia-logging");
const three_1 = require("./three");
const log = aurelia_logging_1.getLogger('three-cube-view');
class ThreeCubeView {
    constructor() {
        this.observing = false;
    }
    bind() {
        this.threeChanged();
    }
    startObserving() {
        if (this.observing) {
            return;
        }
        this.observing = true;
        this.update();
    }
    stopObserving() {
        this.observing = false;
    }
    update() {
        requestAnimationFrame(() => {
            this.controls.update();
            if (this.observing) {
                this.update();
            }
        });
    }
    threeChanged() {
        if (!this.three) {
            return;
        }
        this.stopObserving();
        if (this.controls) {
            delete this.controls;
        }
        if (!this.three.getCamera()) {
            return;
        }
        this.controls = new CubeView(this.three.getCamera(), 50, { perspective: false });
        if (this.host.innerHTML) {
            this.host.innerHTML = '';
        }
        this.host.append(this.controls.element);
        this.controls.element.addEventListener('click', this);
        this.startObserving();
    }
    handleEvent(event) {
        const id = (event.target && event.target instanceof HTMLElement) ? event.target.id : '';
        if (id === 'front' || id === 'back' || id === 'top' || id === 'bottom' || id === 'left' || id === 'right') {
            this.three.navigation.zoomOnScene(1, id, true);
        }
    }
    home() {
        this.three.navigation.zoomOnScene(1, '3d', true);
    }
}
__decorate([
    aurelia_framework_1.bindable,
    __metadata("design:type", three_1.ThreeCustomElement)
], ThreeCubeView.prototype, "three", void 0);
exports.ThreeCubeView = ThreeCubeView;
const sides = {
    front: 'rotateY(  0deg) translateZ(%SIZE)',
    right: 'rotateY( 90deg) translateZ(%SIZE)',
    back: 'rotateY(180deg) translateZ(%SIZE)',
    left: 'rotateY(-90deg) translateZ(%SIZE)',
    top: 'rotateX( 90deg) translateZ(%SIZE)',
    bottom: 'rotateX(-90deg) translateZ(%SIZE)'
};
const offsets = {
    n: [0, -1],
    e: [1, 0],
    s: [0, 1],
    w: [-1, 0]
};
const R = 1.7320508075688772;
class CubeView {
    constructor(camera, size, options) {
        this.camera = camera;
        this.size = size;
        this.options = options;
        this.matrix = new THREE.Matrix4;
        this.unit = 'px';
        this.size = size || 80;
        this.options = options || {};
        this.half = size / 2;
        this.options.perspective = this.options.perspective || false;
        const container = document.createElement('div');
        container.className = 'three-cube-view__element';
        container.style.width = size + this.unit;
        container.style.height = size + this.unit;
        container.style.left = size / 2 + this.unit;
        container.style.top = size / 2 + this.unit;
        this.box = document.createElement('div');
        this.box.className = 'three-cube-view__box';
        this.box.style.width = size + this.unit;
        this.box.style.height = size + this.unit;
        this.box.style.fontSize = (size / 6) + this.unit;
        container.appendChild(this.box);
        this.ring = document.createElement('div');
        const s = size * R / 2;
        this.directions = {
            n: 'translateX(' + s + this.unit + ') translateY(' + 0 + this.unit + ')',
            e: 'translateX(' + s * 2 + this.unit + ') translateY(' + s + this.unit + ')',
            s: 'translateX(' + s + this.unit + ') translateY(' + s * 2 + this.unit + ')',
            w: 'translateX(' + 0 + this.unit + ') translateY(' + s + this.unit + ')'
        };
        this.direction('N');
        this.direction('E');
        this.direction('S');
        this.direction('W');
        this.ring.className = 'ring';
        this.ring.style.transform = 'rotateX(90deg) translateZ(' + (-size / 5) + this.unit + ') translateX(' + (-size / 3) + this.unit + ')';
        this.ring.style.width = size * R + this.unit;
        this.ring.style.height = size * R + this.unit;
        this.box.appendChild(this.ring);
        this.plane('Front');
        this.plane('Right');
        this.plane('Back');
        this.plane('Left');
        this.plane('Top');
        this.plane('Bottom');
        this.element = container;
    }
    direction(name) {
        const e = document.createElement('div');
        const id = name.toLowerCase();
        const fs = this.size / 6;
        e.id = id;
        e.textContent = name;
        e.style.transform = this.directions[id];
        e.style.fontSize = fs + this.unit;
        e.style.left = (-this.size / 2 / 6 - offsets[id][0] * fs) + this.unit;
        e.style.top = (-this.size / 2 / 6 - offsets[id][1] * fs) + this.unit;
        this.ring.appendChild(e);
    }
    plane(side) {
        const e = document.createElement('div');
        const id = side.toLowerCase();
        e.id = id;
        e.textContent = side;
        e.className = id + ' face';
        e.style.width = this.size + this.unit;
        e.style.height = this.size + this.unit;
        e.style.transform = sides[id].replace('%SIZE', (this.size / 2) + this.unit);
        e.style.lineHeight = this.size + this.unit;
        this.box.appendChild(e);
        return e;
    }
    update() {
        this.matrix.copy(this.camera.matrixWorldInverse);
        this.matrix.elements[12] = this.half;
        this.matrix.elements[13] = this.half;
        this.matrix.elements[14] = 0;
        const style = this.getObjectCSSMatrix(this.matrix);
        this.box.style.transform = style;
        this.element.style.perspective = ((this.options.perspective && this.camera instanceof THREE.PerspectiveCamera) ?
            (Math.pow(this.size * this.size + this.size * this.size, 0.5) / Math.tan((this.camera.fov / 2) * Math.PI / 180)) : 0) + this.unit;
    }
    epsilon(value) {
        return Math.abs(value) < 1e-10 ? 0 : value;
    }
    getObjectCSSMatrix(matrix) {
        const elements = matrix.elements;
        const matrix3d = 'matrix3d(' +
            this.epsilon(elements[0]) + ',' +
            this.epsilon(elements[1]) + ',' +
            this.epsilon(elements[2]) + ',' +
            this.epsilon(elements[3]) + ',' +
            this.epsilon(-elements[4]) + ',' +
            this.epsilon(-elements[5]) + ',' +
            this.epsilon(-elements[6]) + ',' +
            this.epsilon(-elements[7]) + ',' +
            this.epsilon(elements[8]) + ',' +
            this.epsilon(elements[9]) + ',' +
            this.epsilon(elements[10]) + ',' +
            this.epsilon(elements[11]) + ',' +
            this.epsilon(elements[12]) + ',' +
            this.epsilon(elements[13]) + ',' +
            this.epsilon(elements[14]) + ',' +
            this.epsilon(elements[15]) +
            ')';
        return 'translate(-50%,-50%)' + matrix3d;
    }
}
exports.CubeView = CubeView;

//# sourceMappingURL=three-cube-view.js.map
