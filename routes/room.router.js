import { Router } from "express";
import roomController from "../controllers/roomController.js";

const roomRouter = Router();

roomRouter
  .route("/create-room")
  .post(roomController.createRoom)
  .all((_, res) => res.sendStatus(405));

roomRouter
  .route("/join-room")
  .post(roomController.joinRoom)
  .all((_, res) => res.sendStatus(405));
export default roomRouter;
