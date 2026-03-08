import { Server } from "socket.io";
import { questions } from "./questions.ts";

const roomStates: Record<string, { currentQuestion: number; timer?: NodeJS.Timeout }> = {};

export function startQuestion(io: Server, roomCode: string, isFirstQuestion = false) {
  if (isFirstQuestion || !roomStates[roomCode]) {
    roomStates[roomCode] = { currentQuestion: 0 };
  }

  const state = roomStates[roomCode];
  const question = questions[state.currentQuestion];

  if (!question) {
    io.to(roomCode).emit("gameEnd");
    return;
  }

  const endTime = Date.now() + 15000;

  const room = io.sockets.adapter.rooms.get(roomCode);
  console.log(`Podejście do wysłania pytania nr ${state.currentQuestion + 1} do pokoju: ${roomCode}`);
  console.log(`Liczba osób w tym pokoju: ${room ? room.size : 0}`);

  io.to(roomCode).emit("questionStart", {
    question,
    questionIndex: state.currentQuestion,
    total: questions.length,
    endTime
  });

  if (state.timer) {
    clearTimeout(state.timer);
  }

  state.timer = setTimeout(() => {
    io.to(roomCode).emit("questionEnd", {
      correctAnswer: question.correct
    });
  }, 15000);
}

export function nextQuestion(io: Server, roomCode: string) {
  const state = roomStates[roomCode];
  
  if (!state) return; 

  state.currentQuestion++;

  if (state.currentQuestion >= questions.length) {
    io.to(roomCode).emit("gameEnd");
    console.log(`🏁 Gra w pokoju ${roomCode} zakończona.`);
    
    if (state.timer) clearTimeout(state.timer);
    delete roomStates[roomCode];
    return;
  }

  startQuestion(io, roomCode, false);
}