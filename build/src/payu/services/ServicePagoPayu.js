"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
// Configuración quemada para pruebas (sandbox)
const PAYU_TEST_CONFIG = {
    API_KEY: "4Vj8eK4rloUd272L48hsrarnUA",
    MERCHANT_ID: "508029",
    ACCOUNT_ID: "512321", // Colombia
    ENDPOINT: "https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/",
    TEST: true
};
class PayUTestService {
    // Generar firma SHA256 (como en el formulario)
    static generateSignature(referenceCode, amount) {
        const message = `${PAYU_TEST_CONFIG.API_KEY}~${PAYU_TEST_CONFIG.MERCHANT_ID}~${referenceCode}~${amount}~COP`;
        return crypto_1.default.createHash("sha256").update(message).digest("hex");
    }
    static crearPagoSimulado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const referenceCode = `REF${(0, uuid_1.v4)().substring(0, 8)}`;
            const amount = "100.19";
            const tax = "1114.80";
            const taxReturnBase = "5867.39";
            const formData = {
                lng: "es",
                merchantId: PAYU_TEST_CONFIG.MERCHANT_ID,
                accountId: PAYU_TEST_CONFIG.ACCOUNT_ID,
                algorithmSignature: "SHA256",
                signature: this.generateSignature(referenceCode, amount),
                test: PAYU_TEST_CONFIG.TEST ? "1" : "0",
                description: "Order description for Colombia",
                referenceCode,
                amount,
                tax,
                taxReturnBase,
                currency: "COP",
                payerFullName: "APPROVED",
                payerEmail: "pruebas@payulatam.com",
                payerOfficePhone: "3001234567",
                payerPhone: "1234567",
                payerMobilePhone: "1234567",
                payerDocumentType: "CC",
                payerDocument: "1234567890",
                billingCountry: "CO",
                payerState: "CO-DC",
                billingCity: "Bogotá",
                billingAddress: "Calle 123",
                billingAddress2: "98-76",
                billingAddress3: "Apartmento 1001",
                zipCode: "110111",
                "shipping-option": "on",
                Submit: "Pagar con PayU",
            };
            try {
                const response = yield axios_1.default.post(PAYU_TEST_CONFIG.ENDPOINT, querystring_1.default.stringify(formData), {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    maxRedirects: 0,
                    validateStatus: (status) => status < 400 || status === 302,
                });
                const redirectUrl = response.headers.location;
                if (redirectUrl) {
                    console.log("Redirect URL:", redirectUrl);
                    return res.status(200).json({ success: true, bankUrl: redirectUrl });
                }
                else {
                    return res.status(500).json({ error: "No se recibió URL de redirección" });
                }
            }
            catch (error) {
                return res.status(500).json({ error: "Error enviando datos a PayU", details: error.message });
            }
        });
    }
}
exports.default = PayUTestService;
