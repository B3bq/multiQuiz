import { io, Socket } from "socket.io-client";

const URL = `http://${window.location.hostname}:3000`;

export const socket: Socket = io(URL);