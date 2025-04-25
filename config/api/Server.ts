import express from "express";
import cors from "cors";
import morgan from "morgan";
import routePayu from "../../src/routes/RoutePayu";

class Server {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.app.set("PORT", 3123); // Solo un set para el puerto
    this.app.use(cors({
      origin: "https://thriving-cocada-69cfdc.netlify.app",
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type'],
    }));
    this.app.use(morgan("dev"));
    this.app.use(express.json({ limit: "100Mb" }));
    this.app.use(express.urlencoded({ extended: true }));

    const PAYU_CONFIG = {
      API_KEY: process.env.PAYU_API_KEY,
      MERCHANT_ID: process.env.PAYU_MERCHANT_ID,
      ACCOUNT_ID: process.env.PAYU_ACCOUNT_ID,
      ENDPOINT:
        process.env.PAYU_ENDPOINT || "https://sandbox.api.payulatam.com",
      BASE_URL: process.env.BASE_URL || "http://localhost:3000",
    };

    this.app.use("/api/payu", routePayu);
  }
  start() {
    this.app.listen(this.app.get("PORT"), () => {
      console.log(`Server is running on port ${this.app.get("PORT")}`);
    });
  }
}
export default Server;
