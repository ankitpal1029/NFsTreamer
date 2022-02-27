"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EvaluateTier = (pointAdded, prevPoints) => {
    if (prevPoints + pointAdded >= 25 && prevPoints < 25) {
        return "Tier 1";
    }
    else if (prevPoints + pointAdded >= 50 && prevPoints < 50) {
        return "Tier 2";
    }
    else if (prevPoints + pointAdded >= 75 && prevPoints < 75) {
        return "Tier 3";
    }
    else {
        return "No Upgrade";
    }
};
exports.default = EvaluateTier;
//# sourceMappingURL=evaluate-tier.js.map