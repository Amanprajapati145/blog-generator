"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planLimits = void 0;
exports.planLimits = {
    free: {
        blogsPerMonth: 2,
        wordsPerMonth: 3000,
    },
    pro: {
        blogsPerMonth: 50,
        wordsPerMonth: 100000,
    },
    enterprise: {
        blogsPerMonth: Infinity,
        wordsPerMonth: Infinity,
    },
};
