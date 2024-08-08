"use strict";

//Imports
import cors from "cors";
import "dotenv/config";
import express from "express";
import "express-async-errors";
import morgan from "morgan";
import mainRouter from "./routes/index.js";

// variables env
const { NODE_ENV, PORT } = process.env;

//WEB API
//Init
const app = express();

//Middlewares
app.use(cors({ origin: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(morgan("short"));

//Routing
app.use("/api", mainRouter);

//Start
// lancement du serv
app.listen(PORT, () => {
  console.log(`Web API is running on ${PORT} (${NODE_ENV})`);
});
