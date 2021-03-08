import { Container, TaskQueue } from 'aurelia-framework';
var ThreeTool = (function () {
    function ThreeTool(service) {
        var _this = this;
        this.active = false;
        Container.instance.get(TaskQueue).queueMicroTask(function () {
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
export { ThreeTool };

//# sourceMappingURL=three-tool.js.map
