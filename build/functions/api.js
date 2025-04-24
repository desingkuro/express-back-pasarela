// functions/api.js
import serverless from "serverless-http";
import express from "express";
import cors from "cors";

// App Express
const app = express();

app.use(cors({
  origin: "https://thriving-cocada-69cfdc.netlify.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// Importar desde DIST
const routePayu = require("../dist/config/api/Server").default;

// Rutas
app.use("/api/payu", routePayu);

// Exportar para Netlify
module.exports.handler = serverless(app);
