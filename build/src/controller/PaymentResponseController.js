"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
class PaymentResponseController {
    constructor() {
        this.API_KEY = process.env.PAYU_API_KEY || '4Vj8eK4rloUd272L48hsrarnUA';
    }
    handlePaymentResponse(req, res) {
        // Obtener parámetros de la solicitud
        const { merchantId, referenceCode, TX_VALUE, currency, transactionState, signature, reference_pol, cus, description, pseBank, lapPaymentMethod, transactionId, message } = req.query;
        // Validar y formatear el valor
        const numericValue = parseFloat(TX_VALUE) || 0;
        const formattedValue = numericValue.toFixed(1);
        // Generar firma esperada
        const signatureString = `${this.API_KEY}~${merchantId}~${referenceCode}~${formattedValue}~${currency}~${transactionState}`;
        const expectedSignature = crypto_1.default.createHash('md5').update(signatureString).digest('hex');
        // Determinar estado de la transacción
        const stateMessage = this.getTransactionStateMessage(transactionState, message);
        // Validar firma
        const isValidSignature = (signature === null || signature === void 0 ? void 0 : signature.toString().toUpperCase()) === expectedSignature.toUpperCase();
        // Renderizar respuesta
        res.render('paymentResult', {
            isValidSignature,
            transactionData: {
                state: stateMessage,
                transactionId,
                reference_pol,
                referenceCode,
                cus,
                pseBank,
                value: numericValue,
                currency,
                description,
                paymentMethod: lapPaymentMethod
            },
            hasBankInfo: !!pseBank
        });
    }
    getTransactionStateMessage(state, defaultMessage) {
        const states = {
            '4': 'Transacción aprobada',
            '6': 'Transacción rechazada',
            '7': 'Pago pendiente',
            '104': 'Error'
        };
        return states[state] || defaultMessage || 'Estado desconocido';
    }
}
exports.default = new PaymentResponseController();
