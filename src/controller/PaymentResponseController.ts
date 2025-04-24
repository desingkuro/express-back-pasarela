import { Request, Response } from 'express';
import crypto from 'crypto';

class PaymentResponseController {
  private readonly API_KEY = process.env.PAYU_API_KEY || '4Vj8eK4rloUd272L48hsrarnUA';

  public handlePaymentResponse(req: Request, res: Response) {
    // Obtener parámetros de la solicitud
    const {
      merchantId,
      referenceCode,
      TX_VALUE,
      currency,
      transactionState,
      signature,
      reference_pol,
      cus,
      description,
      pseBank,
      lapPaymentMethod,
      transactionId,
      message
    } = req.query;

    // Validar y formatear el valor
    const numericValue = parseFloat(TX_VALUE as string) || 0;
    const formattedValue = numericValue.toFixed(1);

    // Generar firma esperada
    const signatureString = `${this.API_KEY}~${merchantId}~${referenceCode}~${formattedValue}~${currency}~${transactionState}`;
    const expectedSignature = crypto.createHash('md5').update(signatureString).digest('hex');

    // Determinar estado de la transacción
    const stateMessage = this.getTransactionStateMessage(transactionState as string, message as string);

    // Validar firma
    const isValidSignature = signature?.toString().toUpperCase() === expectedSignature.toUpperCase();

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

  private getTransactionStateMessage(state: string, defaultMessage: string): string {
    const states: Record<string, string> = {
      '4': 'Transacción aprobada',
      '6': 'Transacción rechazada',
      '7': 'Pago pendiente',
      '104': 'Error'
    };

    return states[state] || defaultMessage || 'Estado desconocido';
  }
}

export default new PaymentResponseController();