require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración PayU
const PAYU_CONFIG = {
  API_KEY: process.env.PAYU_API_KEY,
  MERCHANT_ID: process.env.PAYU_MERCHANT_ID,
  ACCOUNT_ID: process.env.PAYU_ACCOUNT_ID,
  ENDPOINT: process.env.PAYU_ENDPOINT || 'https://sandbox.api.payulatam.com',
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000'
};

// Generar firma
const generateSignature = (referenceCode, amount, currency) => {
  const message = `${PAYU_CONFIG.API_KEY}~${PAYU_CONFIG.MERCHANT_ID}~${referenceCode}~${amount}~${currency}`;
  return crypto.createHash('md5').update(message).digest('hex');
};

// Rutas
app.post('/api/payu/pse', async (req, res) => {
  try {
    const {
      amount,
      bankCode,
      personType,
      identificationType,
      identificationNumber,
      firstName,
      lastName,
      email,
      description,
      ipAddress,
      userAgent
    } = req.body;

    const referenceCode = uuidv4();
    const currency = 'COP';
    const signature = generateSignature(referenceCode, amount, currency);

    const requestData = {
      language: 'es',
      command: 'SUBMIT_TRANSACTION',
      merchant: {
        apiKey: PAYU_CONFIG.API_KEY,
        apiLogin: PAYU_CONFIG.MERCHANT_ID,
      },
      transaction: {
        order: {
          accountId: PAYU_CONFIG.ACCOUNT_ID,
          referenceCode,
          description: description || 'Pago con PSE',
          language: 'es',
          signature,
          notifyUrl: `${PAYU_CONFIG.BASE_URL}/api/payu/notify`,
          additionalValues: {
            TX_VALUE: {
              value: amount.toFixed(2),
              currency,
            },
          },
          buyer: {
            merchantBuyerId: identificationNumber,
            fullName: `${firstName} ${lastName}`,
            emailAddress: email,
            dniNumber: identificationNumber,
          },
        },
        payer: {
          merchantPayerId: identificationNumber,
          fullName: `${firstName} ${lastName}`,
          emailAddress: email,
          dniNumber: identificationNumber,
        },
        type: 'AUTHORIZATION_AND_CAPTURE',
        paymentMethod: 'PSE',
        paymentCountry: 'CO',
        ipAddress: ipAddress || req.ip,
        userAgent: userAgent || req.get('User-Agent'),
        extraParameters: {
          RESPONSE_URL: `${PAYU_CONFIG.BASE_URL}/payment-response`,
          FINANCIAL_INSTITUTION_CODE: bankCode,
          USER_TYPE: personType,
          PSE_REFERENCE1: identificationNumber,
        },
      },
    };

    const response = await axios.post(`${PAYU_CONFIG.ENDPOINT}/payments-api/4.0/service.cgi`, requestData);
    
    if (response.data.code !== 'SUCCESS') {
      throw new Error(response.data.error || 'Error en PayU');
    }

    res.json({
      success: true,
      transactionId: response.data.transactionResponse.transactionId,
      bankUrl: response.data.transactionResponse.extraParameters.BANK_URL,
      referenceCode
    });
  } catch (error) {
    console.error('Error en PSE:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.error || error.message
    });
  }
});

app.post('/api/payu/notify', (req, res) => {
  // Procesar notificación de PayU
  const data = req.body;
  
  // Validar firma
  const signature = generateSignature(
    data.reference_sale,
    parseFloat(data.value),
    data.currency
  );

  if (signature !== data.signature) {
    console.warn('Firma inválida en notificación');
    return res.status(400).send('Invalid signature');
  }

  // Aquí actualizarías tu base de datos con el estado del pago
  console.log('Notificación recibida:', {
    transactionId: data.transaction_id,
    reference: data.reference_sale,
    status: data.state,
    amount: data.value,
    date: data.transaction_date
  });

  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Servidor PayU PSE corriendo en http://localhost:${port}`);
});