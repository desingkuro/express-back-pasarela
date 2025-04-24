// functions/api.js
const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const server = require("../build/config/api/Server").default;

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
