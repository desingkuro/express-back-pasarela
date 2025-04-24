"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ControllerPagoPayu_1 = __importDefault(require("../controller/ControllerPagoPayu"));
const PaymentResponseController_1 = __importDefault(require("../controller/PaymentResponseController"));
class RoutePayu {
    constructor() {
        this.routeApi = (0, express_1.Router)();
        this.routeApi.get("/", (req, res) => {
            res.status(200).json({ message: "PayU API" });
        });
        // Crear orden de pago PSE
        this.routeApi.post("/pse", ControllerPagoPayu_1.default.createOrder);
        // Manejar notificación de PayU (webhook)
        this.routeApi.post("/notify", ControllerPagoPayu_1.default.handleNotification);
        // Manejar respuesta de redirección
        this.routeApi.get('/payment-response', PaymentResponseController_1.default.handlePaymentResponse);
    }
}
const routePayu = new RoutePayu().routeApi;
exports.default = routePayu;
