"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const RoutePayu_1 = __importDefault(require("../../src/routes/RoutePayu"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.app.set("PORT", 3123); // Solo un set para el puerto
        this.app.use((0, cors_1.default)({
            origin: "https://thriving-cocada-69cfdc.netlify.app",
            methods: ['GET', 'POST', 'OPTIONS'],
            allowedHeaders: ['Content-Type'],
        }));
        this.app.use((0, morgan_1.default)("dev"));
        this.app.use(express_1.default.json({ limit: "100Mb" }));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        const PAYU_CONFIG = {
            API_KEY: process.env.PAYU_API_KEY,
            MERCHANT_ID: process.env.PAYU_MERCHANT_ID,
            ACCOUNT_ID: process.env.PAYU_ACCOUNT_ID,
            ENDPOINT: process.env.PAYU_ENDPOINT || "https://sandbox.api.payulatam.com",
            BASE_URL: process.env.BASE_URL || "http://localhost:3000",
        };
        this.app.use("/api/payu", RoutePayu_1.default);
    }
    start() {
        this.app.listen(this.app.get("PORT"), () => {
            console.log(`Server is running on port ${this.app.get("PORT")}`);
        });
    }
}
exports.default = Server;
