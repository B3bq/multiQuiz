import { Server } from "socket.io";
import { questions } from "./questions.js";

const roomStates: Record<string, { 
  currentQuestion: number; 
  timer?: NodeJS.Timeout;
  correctAnswersCount: number;
  hasAnswered: Set<string>;
}> = {};

export function startQuestion(io: Server, roomCode: string, isFirstQuestion = false) {
  if (isFirstQuestion || !roomStates[roomCode]) {
    roomStates[roomCode] = { 
      currentQuestion: 0,
      correctAnswersCount: 0,
      hasAnswered: new Set()
    };
  }else{
    roomStates[roomCode].correctAnswersCount = 0;
    roomStates[roomCode].hasAnswered = new Set();
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

export function evaluateAnswer(roomCode: string, nickname: string, answer: string): number {
  const state = roomStates[roomCode];
  if (!state) return 0;

  // if player answered
  if (state.hasAnswered.has(nickname)) return 0;
  state.hasAnswered.add(nickname); // save answer

  const question = questions[state.currentQuestion];

  console.log(`Sprawdzam: Gracz ${nickname} wysłał: ${answer} (typ: ${typeof answer}), Poprawna: ${question.correct}`);
  
  // bad answer
  if (String(answer) !== String(question.correct)) {
    return 0; 
  }

  // counting points if good answer
  state.correctAnswersCount++;
  const order = state.correctAnswersCount;

  let points = 10; // Good answer

  // Bonus for speed
  if (order === 1) points += 15;
  else if (order === 2) points += 10; 
  else if (order === 3) points += 5;  

  return points;
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