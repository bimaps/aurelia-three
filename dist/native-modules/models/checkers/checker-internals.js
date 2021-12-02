export * from './checker-interfaces';
export * from './checker-module-base.model';
export * from './checker-module-filter.model';
export * from './checker-module-extract.model';
export * from './checker-module-math.model';
export * from './checker-module-reducer.model';
export * from './checker-module-if.model';
export * from './checker-module-projection.model';
export * from './checker-module-distance.model';
export * from './checker-module-normal-distance.model';
export * from './checker-module-output.model';
export * from './checker-flow.model';
import { CheckerModuleFilterModel } from './checker-module-filter.model';
import { CheckerModuleExtractModel } from './checker-module-extract.model';
import { CheckerModuleMathModel } from './checker-module-math.model';
import { CheckerModuleReducerModel } from './checker-module-reducer.model';
import { CheckerModuleIfModel } from './checker-module-if.model';
import { CheckerModuleProjectionModel } from './checker-module-projection.model';
import { CheckerModuleDistanceModel } from './checker-module-distance.model';
import { CheckerModuleNormalDistanceModel } from './checker-module-normal-distance.model';
import { CheckerModuleOutputModel } from './checker-module-output.model';
export const modelsByType = {
    filter: CheckerModuleFilterModel,
    extract: CheckerModuleExtractModel,
    math: CheckerModuleMathModel,
    reducer: CheckerModuleReducerModel,
    if: CheckerModuleIfModel,
    projection: CheckerModuleProjectionModel,
    distance: CheckerModuleDistanceModel,
    "normal-distance": CheckerModuleNormalDistanceModel,
    output: CheckerModuleOutputModel,
};

//# sourceMappingURL=checker-internals.js.map
