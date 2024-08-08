import { Server } from "socket.io";
import roomController from "../controllers/roomController.js";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");
  roomController.handleSocketEvents(socket, io);
});

export default io;
