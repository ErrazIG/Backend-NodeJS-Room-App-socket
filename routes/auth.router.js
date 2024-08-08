import { Router } from "express";

const authRouter = Router();

authRouter.route("/register").all((_, res) => res.sendStatus(405));

authRouter.route("/login").all((_, res) => res.sendStatus(405));

export default authRouter;
