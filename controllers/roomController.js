import { generateRoomCode } from "../utils/generateRoomCode.utils.js";

const rooms = {};
let generatedRoomId = null;

const createRoom = (userName) => {
  const roomId = generateRoomCode();
  rooms[roomId] = {
    id: roomId,
    users: [userName].filter((user) => user && user.trim() !== ""),
  };
  generatedRoomId = roomId;
  return roomId;
};

const roomController = {
  createRoom: (req, res) => {
    const { userName } = req.body;
    if (!userName) {
      return res.status(400).json({ error: "Le nom d'utilisateur est requis" });
    }
    const roomId = createRoom(userName);
    res.json({ roomId });
  },

  joinRoom: (req, res) => {
    const { roomId, userName } = req.body;
    if (!rooms[roomId]) {
      return res.status(400).json({ error: "La salle n'existe pas" });
    }
    if (!rooms[roomId].users.includes(userName)) {
      rooms[roomId].users.push(userName);
    }
    rooms[roomId].users = rooms[roomId].users.filter(
      (user) => user && user.trim() !== ""
    );
    res.json({ roomId, users: rooms[roomId].users });
  },

  leaveRoom: (req, res) => {
    const { roomId, userName } = req.body;
    if (!rooms[roomId]) {
      return res.status(400).json({ error: "La salle n'existe pas" });
    }
    rooms[roomId].users = rooms[roomId].users.filter(
      (user) => user !== userName
    );
    if (rooms[roomId].users.length === 0) {
      delete rooms[roomId];
    }
    res.json({ roomId, users: rooms[roomId].users });
  },

  handleSocketEvents: (socket, io) => {
    socket.on("createRoom", (userName) => {
      const roomId = generatedRoomId;
      if (!roomId) {
        socket.emit("error", "Erreur lors de la création de la salle");
        return;
      }
      socket.join(roomId);
      io.to(roomId).emit("updateRoom", {
        ...rooms[roomId],
        users: rooms[roomId].users.filter((user) => user && user.trim() !== ""),
      });
    });

    socket.on("joinRoom", (roomId, userName) => {
      if (!rooms[roomId]) {
        socket.emit("error", "La salle n'existe pas");
        return;
      }
      if (!rooms[roomId].users.includes(userName)) {
        rooms[roomId].users.push(userName);
        socket.join(roomId);
        io.to(roomId).emit("updateRoom", {
          ...rooms[roomId],
          users: rooms[roomId].users.filter(
            (user) => user && user.trim() !== ""
          ),
        });
      }
    });

    socket.on("leaveRoom", (roomId, userName) => {
      if (!rooms[roomId]) {
        socket.emit("error", "La salle n'existe pas");
        return;
      }
      rooms[roomId].users = rooms[roomId].users.filter(
        (user) => user !== userName
      );
      socket.leave(roomId);
      io.to(roomId).emit("updateRoom", {
        ...rooms[roomId],
        users: rooms[roomId].users.filter((user) => user && user.trim() !== ""),
      });
      if (rooms[roomId].users.length === 0) {
        delete rooms[roomId];
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  },
};

export default roomController;
