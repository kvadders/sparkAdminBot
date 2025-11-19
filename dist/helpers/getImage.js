"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImage = void 0;
const context_1 = require("../@types/context");
const getImage = (project) => {
    switch (project) {
        case context_1.Project.DeepNude:
            return "https://bot.deep-nudes.com/static/DN.png";
        case context_1.Project.AIDeepNudes:
            return "https://bot.deep-nudes.com/static/AIDN.png";
        default:
            return "https://bot.deep-nudes.com/static/DN.png";
    }
};
exports.getImage = getImage;
