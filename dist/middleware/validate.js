"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
exports.validateQuery = validateQuery;
exports.validateParams = validateParams;
const zod_1 = require("zod");
function validateBody(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: err.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
                });
                return;
            }
            next(err);
        }
    };
}
function validateQuery(schema) {
    return (req, res, next) => {
        try {
            Object.assign(req, { query: schema.parse(req.query) });
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid query parameters',
                    errors: err.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
                });
                return;
            }
            next(err);
        }
    };
}
function validateParams(schema) {
    return (req, res, next) => {
        try {
            Object.assign(req, { params: schema.parse(req.params) });
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid path parameters',
                    errors: err.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
                });
                return;
            }
            next(err);
        }
    };
}
