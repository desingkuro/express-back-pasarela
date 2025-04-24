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
const dotenv_1 = __importDefault(require("dotenv"));
const ServicePagoPayu_1 = __importDefault(require("../services/ServicePagoPayu"));
dotenv_1.default.config({ path: "variables.env" });
class ControllerPagoPayu extends ServicePagoPayu_1.default {
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ServicePagoPayu_1.default.crearPagoSimulado(req, res);
        });
    }
    handleNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ServicePagoPayu_1.default.crearPagoSimulado(req, res);
        });
    }
    handleResponse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Procesar respuesta de redirección
                const { transactionId, state, reference_sale: referenceCode, currency, value } = req.query;
                // Validar parámetros
                if (!transactionId || !state || !referenceCode) {
                    throw new Error('Parámetros de respuesta incompletos');
                }
                // Redirigir a página de resultado con parámetros
                res.redirect(`/payment-result?transactionId=${transactionId}&status=${state}&reference=${referenceCode}&amount=${value}&currency=${currency}`);
            }
            catch (error) {
                console.error('Error en handleResponse:', error);
                res.redirect('/payment-result?error=1');
            }
        });
    }
}
const controllerPagoPayu = new ControllerPagoPayu();
exports.default = controllerPagoPayu;
