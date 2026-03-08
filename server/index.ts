import { createServer } from "http";
import { Server } from "socket.io";
import { startQuestion, nextQuestion, evaluateAnswer } from "./game/gameManager.ts";

const httpServer = createServer();

type Player = {
  id: string;
  nickname: string;
  points: number
};

type Room = {
  host: string;
  players: Player[];
};

const rooms: Record<string, Room> = {};

const io = new Server(httpServer, {
  cors: {
    origin: "*", 
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Nowy gracz połączony:", socket.id);

  socket.on("join_lobby", (nickname: string) => {
    console.log(`${nickname} dołączył do lobby`);
    socket.emit("joined_successfully");
  });
  
  socket.on("create_room", (roomCode: string) => {
    rooms[roomCode] = {
      host: socket.id,
      players: [
        {
          id: socket.id,
          nickname: "HOST",
          points: 0
        }
      ]
    };
    
    socket.join(roomCode);
    console.log(`🏠 Host ${socket.id} utworzył i dołączył do pokoju: ${roomCode}`);
    io.to(roomCode).emit("players_update", rooms[roomCode].players);
  });

  socket.on("check_room", (roomCode) => {
    if (!rooms[roomCode]) {
      socket.emit("room_invalid");
    } else {
      socket.emit("room_valid");
    }
  });

  socket.on("join_room", ({ roomCode, nickname }) => {
    const room = rooms[roomCode];
    if (!room) {
      socket.emit("join_error", "Pokój nie istnieje");
      return;
    }
  
    room.players.push({
      id: socket.id,
      nickname,
      points: 0
    });
    
    socket.join(roomCode);
    console.log(`👤 Gracz ${nickname} (${socket.id}) dołączył do pokoju: ${roomCode}`);
    
    socket.emit("join_success");
    io.to(roomCode).emit("players_update", room.players);
  });

  
  socket.on("join_room_reconnect", (roomCode: string) => {
    socket.join(roomCode);
    console.log(`🔄 Socket ${socket.id} awaryjnie dołączył do pokoju: ${roomCode} na ekranie gry`);

    if(rooms[roomCode]){
      socket.emit("players_update", rooms[roomCode].players);
    }
  });

  socket.on("start_game", (roomCode) => {
    console.log(`🚀 Sygnał start_game dla pokoju: ${roomCode}`);
    
    const room = rooms[roomCode];
    if (!room) {
        console.log(`❌ Pokój ${roomCode} nie istnieje w pamięci serwera!`);
        return;
    }

    io.to(roomCode).emit("game_started");
  
    setTimeout(() => {
      startQuestion(io, roomCode, true);
    }, 2500); 
  });

  socket.on("nextQuestion", (roomCode) => {
    nextQuestion(io, roomCode);
  });

  socket.on("answer", ({roomCode, answer, nickname}) => {
    console.log(`[DEBUG] Złapano odpowiedź: "${answer}" od socket: ${socket.id} w pokoju: ${roomCode}`);
    const room = rooms[roomCode];
    if(!room) return;

    const player = room.players.find(p => p.nickname === nickname); // finding player
    if (!player) return;
    
    // counting points
    const pointsGained = evaluateAnswer(roomCode, nickname, answer);
    
    if (pointsGained > 0) {
        player.points += pointsGained;
        io.to(roomCode).emit("players_update", room.players);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket rozłączony:", socket.id);
    for (const code in rooms) {
      const room = rooms[code];
      const initialLength = room.players.length;
      room.players = room.players.filter(p => p.id !== socket.id);
      
      if (initialLength !== room.players.length) {
         io.to(code).emit("players_update", room.players);
      }
    }
  });
});

httpServer.listen(3000, "0.0.0.0", () => {
  console.log("✅ Serwer działa na http://localhost:3000");
});