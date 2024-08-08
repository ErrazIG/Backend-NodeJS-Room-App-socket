"use strict";

// Imports
import cors from "cors";
import "dotenv/config";
import express from "express";
import "express-async-errors";
import { createServer } from "http";
import morgan from "morgan";
import io from "./config/socket.js";
import mainRouter from "./routes/index.js";

// Variables env
const { NODE_ENV, PORT } = process.env;

// WEB API
// Init
const app = express();
const server = createServer(app);

// Middlewares
app.use(
  cors({
    origin: "https://frontend-react-room-app-socket.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.static("public"));
app.use(express.json());
app.use(morgan("short"));

// Routing
app.use("/api", mainRouter);

// Start
// Lancement du serveur
server.listen(PORT, () => {
  console.log(`Web API is running on ${PORT} (${NODE_ENV})`);
});

// Initialisation de Socket.io
io.attach(server);
