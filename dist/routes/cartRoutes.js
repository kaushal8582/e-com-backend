"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartController = __importStar(require("../controllers/cartController.js"));
const auth_js_1 = require("../middleware/auth.js");
const validate_js_1 = require("../middleware/validate.js");
const cartValidators_js_1 = require("../validators/cartValidators.js");
const router = (0, express_1.Router)();
router.use(auth_js_1.authRequired);
router.get('/', cartController.getCart);
router.post('/items', (0, validate_js_1.validateBody)(cartValidators_js_1.addCartItemSchema), cartController.addItem);
router.patch('/items/:productId', (0, validate_js_1.validateParams)(cartValidators_js_1.productIdParamSchema), (0, validate_js_1.validateBody)(cartValidators_js_1.updateCartItemSchema), cartController.updateItem);
router.delete('/items/:productId', (0, validate_js_1.validateParams)(cartValidators_js_1.productIdParamSchema), cartController.removeItem);
router.post('/sync', (0, validate_js_1.validateBody)(cartValidators_js_1.syncCartSchema), cartController.syncCart);
exports.default = router;
