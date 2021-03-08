"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeTool = void 0;
var aurelia_framework_1 = require("aurelia-framework");
var ThreeTool = (function () {
    function ThreeTool(service) {
        var _this = this;
        this.active = false;
        aurelia_framework_1.Container.instance.get(aurelia_framework_1.TaskQueue).queueMicroTask(function () {
            _this.service = service;
            if (_this.canRegister()) {
                _this.service.registerTool(_this);
            }
        });
        return this;
    }
    ThreeTool.prototype.canRegister = function () {
        return true;
    };
    ThreeTool.prototype.activate = function (three) {
        this.three = three;
        this.active = true;
        this.onActivate();
    };
    ThreeTool.prototype.deactivate = function () {
        this.onDeactivate();
        this.active = false;
    };
    ThreeTool.prototype.onActivate = function () {
    };
    ThreeTool.prototype.onDeactivate = function () {
    };
    return ThreeTool;
}());
exports.ThreeTool = ThreeTool;

//# sourceMappingURL=three-tool.js.map
