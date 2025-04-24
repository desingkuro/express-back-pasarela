// functions/api.js
import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import server from "../build/config/api/Server";

// App Express
const app = express();

app.use(cors({
  origin: "https://thriving-cocada-69cfdc.netlify.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// Rutas
app.use("/api/payu", server);

// Exportar para Netlify
module.exports.handler = serverless(app);
