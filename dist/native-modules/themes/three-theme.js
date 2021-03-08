var ThreeTheme = (function () {
    function ThreeTheme() {
        this.rules = [];
    }
    ThreeTheme.prototype.activate = function (three) {
        this.three = three;
        this.active = true;
        this.onActivate();
    };
    ThreeTheme.prototype.deactivate = function () {
        this.onDeactivate();
        this.active = false;
    };
    ThreeTheme.prototype.onActivate = function () {
    };
    ThreeTheme.prototype.onDeactivate = function () {
    };
    return ThreeTheme;
}());
export { ThreeTheme };

//# sourceMappingURL=three-theme.js.map
