import { Router } from "express";
import authRouter from "./auth.router.js";
import roomRoutes from "./room.router.js";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/room", roomRoutes);

export default mainRouter;
