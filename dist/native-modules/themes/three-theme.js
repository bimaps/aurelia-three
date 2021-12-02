export class ThreeTheme {
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

//# sourceMappingURL=three-theme.js.map
