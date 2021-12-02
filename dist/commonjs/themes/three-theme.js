"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeTheme = void 0;
class ThreeTheme {
    constructor() {
        this.rules = [];
    }
    activate(three) {
        this.three = three;
        this.active = true;
        this.onActivate();
    }
    deactivate() {
        this.onDeactivate();
        this.active = false;
    }
    onActivate() {
    }
    onDeactivate() {
    }
}
exports.ThreeTheme = ThreeTheme;

//# sourceMappingURL=three-theme.js.map
