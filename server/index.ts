import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

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

  socket.on("disconnect", () => {
    console.log("Gracz wyszedł:", socket.id);
  });
});

httpServer.listen(3000, "0.0.0.0", () => {
  console.log("Serwer działa na http://localhost:3000");
});