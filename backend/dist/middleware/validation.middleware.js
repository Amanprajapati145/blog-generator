"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = void 0;
const zod_1 = require("zod");
const validateData = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res
                .status(400)
                .json({ message: error.issues[0]?.message || "Validation error" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.validateData = validateData;
