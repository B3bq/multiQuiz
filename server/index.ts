import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

type Player = {
  id: string;
  nickname: string;
};

type Room = {
  host: string;
  players: Player[];
};

const rooms: Record<string, Room> = {};

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Vite dev server
  },
});

io.on("connection", (socket) => {
  console.log("Nowy gracz:", socket.id);

  socket.on("join_lobby", (nickname: string) => {
    console.log(`${nickname} dołączył`);
    socket.emit("joined_successfully");
  });
  
  socket.on("create_room", (roomCode: string) => {
    rooms[roomCode] = {
      host: socket.id,
      players: [
        {
          id: socket.id,
          nickname: "HOST"
        }
      ]
    };
    console.log(rooms);
  
    console.log(roomCode);
    socket.join(roomCode);

    io.to(roomCode).emit("players_update", rooms[roomCode].players);
  });

  socket.on("check_room", (roomCode) => {

    const room = rooms[roomCode];
  
    if (!room) {
      socket.emit("room_invalid");
      console.log('invalid')
      return;
    }
  
    socket.emit("room_valid");
    console.log('valid')
  });

  socket.on("join_room", ({ roomCode, nickname }) => {
    const room = rooms[roomCode];
  
    if (!room) {
      socket.emit("join_error", "Pokój nie istnieje");
      return;
    }
  
    room.players.push({
      id: socket.id,
      nickname
    });
    socket.join(roomCode);

    socket.emit("join_success");
  
    io.to(roomCode).emit("players_update", room.players);
  });

  socket.on("start_game", (roomCode) => {

    const room = rooms[roomCode];
  
    if (!room) return;
  
    if (room.host !== socket.id) return; // only host
  
    io.to(roomCode).emit("game_started");
  
  });

  socket.on("disconnect", () => {
    for (const code in rooms) {
      const room = rooms[code];
  
      room.players = room.players.filter(p => p.id !== socket.id);
  
      io.to(code).emit("players_update", room.players);
    }
  });

});

httpServer.listen(3000, "0.0.0.0", () => {
  console.log("Serwer działa na http://localhost:3000");
});