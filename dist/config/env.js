"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const dotenv_1 = __importDefault(require("dotenv"));
const __dirname = path_1.default.dirname((0, url_1.fileURLToPath)(import.meta.url));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '..', '..', '.env') });
