// functions/api.js
import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import server from "../config/api/Server";

// App Express
const serverInstance = new server();
const app = serverInstance.app;

app.use(cors({
  origin: "https://thriving-cocada-69cfdc.netlify.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// Exportar para Netlify
module.exports.handler = serverless(app);
