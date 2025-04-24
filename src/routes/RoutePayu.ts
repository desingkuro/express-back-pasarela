import { Request, Response, Router } from "express";
import controllerPagoPayu from "../controller/ControllerPagoPayu";
import PaymentResponseController from "../controller/PaymentResponseController";

class RoutePayu{
    public routeApi:Router;
    constructor(){
        this.routeApi = Router();
        this.routeApi.get("/", (req:Request, res:Response) => {
            res.status(200).json({message: "PayU API"});
        });
        // Crear orden de pago PSE
        this.routeApi.post("/pse", controllerPagoPayu.createOrder);

        // Manejar notificación de PayU (webhook)
        this.routeApi.post("/notify", controllerPagoPayu.handleNotification);

        // Manejar respuesta de redirección
        this.routeApi.get('/payment-response', PaymentResponseController.handlePaymentResponse);
    }
}
const routePayu = new RoutePayu().routeApi;
export default routePayu;