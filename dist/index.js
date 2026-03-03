"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_js_1 = __importDefault(require("./app.js"));
const db_js_1 = require("./config/db.js");
const PORT = Number(process.env.PORT) || 3001;
async function main() {
    await (0, db_js_1.connectDB)();
    app_js_1.default.listen(PORT, () => {
        console.log(`API running at http://localhost:${PORT}`);
        console.log(`Health: http://localhost:${PORT}/health`);
        console.log(`API base: http://localhost:${PORT}/api/v1`);
    });
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
