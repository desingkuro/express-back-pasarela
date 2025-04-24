import { Request, Response } from "express";
import dotenv from "dotenv";
import PayUTestService from "../services/ServicePagoPayu";

dotenv.config({ path: "variables.env" });

class ControllerPagoPayu extends PayUTestService {
  public async createOrder(req: Request, res: Response) {
    await PayUTestService.crearPagoSimulado(req, res);
  }

  public async handleNotification(req: Request, res: Response) {
    await PayUTestService.crearPagoSimulado(req, res);
  }

  public async handleResponse(req: Request, res: Response) {
    try {
      // Procesar respuesta de redirección
      const { transactionId, state, reference_sale: referenceCode, currency, value } = req.query;

      // Validar parámetros
      if (!transactionId || !state || !referenceCode) {
        throw new Error('Parámetros de respuesta incompletos');
      }

      // Redirigir a página de resultado con parámetros
      res.redirect(`/payment-result?transactionId=${transactionId}&status=${state}&reference=${referenceCode}&amount=${value}&currency=${currency}`);
      
    } catch (error: any) {
      console.error('Error en handleResponse:', error);
      res.redirect('/payment-result?error=1');
    }
  }
}

const controllerPagoPayu = new ControllerPagoPayu();
export default controllerPagoPayu;