import { Request, Response } from "express";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import qs from "querystring";

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
  private static generateSignature(referenceCode: string, amount: string): string {
    const message = `${PAYU_TEST_CONFIG.API_KEY}~${PAYU_TEST_CONFIG.MERCHANT_ID}~${referenceCode}~${amount}~COP`;
    return crypto.createHash("sha256").update(message).digest("hex");
  }

  public static async crearPagoSimulado(req: Request, res: Response) {
    const referenceCode = `REF${uuidv4().substring(0, 8)}`;
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
      const response = await axios.post(
        PAYU_TEST_CONFIG.ENDPOINT,
        qs.stringify(formData),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          maxRedirects: 0,
          validateStatus: (status) => status < 400 || status === 302,
        }
      );

      const redirectUrl = response.headers.location;
      if (redirectUrl) {
        console.log("Redirect URL:", redirectUrl);
        return res.status(200).json({success:true,bankUrl:redirectUrl});
      } else {
        return res.status(500).json({ error: "No se recibió URL de redirección" });
      }
    } catch (error: any) {
      return res.status(500).json({ error: "Error enviando datos a PayU", details: error.message });
    }
  }
}

export default PayUTestService;
