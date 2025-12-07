import jwt from "jsonwebtoken";
import Room from "../models/Room.js";
import Game from "../models/Game.js";
import User from "../models/User.js";
import {
  createInitialGameState,
  rollDice,
  moveToken
} from "../utils/gameLogic.js";

const activeGames = new Map(); // roomCode -> gameState

export const registerGameSocket = (io) => {
  // Auth for sockets
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id, "user:", socket.userId);

    // CREATE ROOM
    socket.on("createRoom", async ({ isPublic = true, maxPlayers = 4 }, cb) => {
      try {
        const user = await User.findById(socket.userId);
        if (!user) return cb({ error: "User not found" });

        const code = Math.random().toString(36).substring(2, 7).toUpperCase();

        const room = await Room.create({
          code,
          host: user._id,
          players: [
            {
              user: user._id,
              username: user.username,
              color: "red",
              socketId: socket.id
            }
          ],
          isPublic,
          maxPlayers
        });

        socket.join(code);
        io.to(code).emit("roomUpdated", room);
        cb({ roomCode: code, room });
      } catch (err) {
        console.error("createRoom error:", err);
        cb({ error: "Could not create room" });
      }
    });

    // JOIN ROOM
    socket.on("joinRoom", async ({ roomCode }, cb) => {
      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) return cb({ error: "Room not found" });
        if (!room.isActive) return cb({ error: "Room not active" });
        if (room.players.length >= room.maxPlayers) {
          return cb({ error: "Room is full" });
        }

        const user = await User.findById(socket.userId);
        if (!user) return cb({ error: "User not found" });

        const usedColors = room.players.map((p) => p.color);
        const allColors = ["red", "green", "blue", "yellow"];
        const color = allColors.find((c) => !usedColors.includes(c)) || "red";

        room.players.push({
          user: user._id,
          username: user.username,
          color,
          socketId: socket.id
        });

        await room.save();

        socket.join(roomCode);
        io.to(roomCode).emit("roomUpdated", room);
        cb({ roomCode, room });
      } catch (err) {
        console.error("joinRoom error:", err);
        cb({ error: "Could not join room" });
      }
    });

    // START GAME
    socket.on("startGame", async ({ roomCode }, cb) => {
      try {
        const room = await Room.findOne({ code: roomCode }).populate(
          "players.user"
        );
        if (!room) return cb({ error: "Room not found" });

        const players = room.players.map((p) => ({
          userId: p.user._id.toString(),
          username: p.username,
          color: p.color
        }));

        const gameState = createInitialGameState(players);
        activeGames.set(roomCode, gameState);

        await Game.create({
          roomCode,
          players: players.map((p) => ({
            user: p.userId,
            username: p.username,
            color: p.color
          }))
        });

        io.to(roomCode).emit("gameStarted", { gameState });
        cb({ ok: true });
      } catch (err) {
        console.error("startGame error:", err);
        cb({ error: "Could not start game" });
      }
    });

    // ROLL DICE
    socket.on("rollDice", ({ roomCode }, cb) => {
      const gameState = activeGames.get(roomCode);
      if (!gameState) return cb?.({ error: "Game not found" });

      const dice = rollDice();
      gameState.diceValue = dice;
      activeGames.set(roomCode, gameState);

      io.to(roomCode).emit("diceRolled", {
        dice,
        currentTurn: gameState.currentTurn
      });

      cb?.({ dice });
    });

    // MOVE TOKEN
    socket.on(
      "moveToken",
      async ({ roomCode, color, tokenIndex }, cb) => {
        let gameState = activeGames.get(roomCode);
        if (!gameState) return cb?.({ error: "Game not found" });

        if (!gameState.diceValue) {
          return cb?.({ error: "Roll dice first" });
        }

        if (gameState.currentTurn !== color) {
          return cb?.({ error: "Not your turn" });
        }

        const dice = gameState.diceValue;
        gameState = moveToken(gameState, color, tokenIndex, dice);
        gameState.diceValue = null;

        // Next turn
        if (gameState.status !== "finished") {
          const order = gameState.players.map((p) => p.color);
          const idx = order.indexOf(color);
          const nextColor = order[(idx + 1) % order.length];
          gameState.currentTurn = nextColor;
        }

        activeGames.set(roomCode, gameState);

        io.to(roomCode).emit("gameStateUpdated", gameState);

        // If finished, update stats
        if (gameState.status === "finished") {
          const winner = gameState.players.find(
            (p) => p.color === gameState.winnerColor
          );
          if (winner) {
            try {
              await User.findByIdAndUpdate(winner.userId, {
                $inc: { wins: 1, xp: 50 }
              });

              const losers = gameState.players
                .filter((p) => p.color !== gameState.winnerColor)
                .map((p) => p.userId);

              await User.updateMany(
                { _id: { $in: losers } },
                { $inc: { losses: 1, xp: 10 } }
              );
            } catch (err) {
              console.error("Error updating stats:", err);
            }
          }

          io.to(roomCode).emit("gameFinished", {
            winnerColor: gameState.winnerColor
          });
        }

        cb?.({ ok: true });
      }
    );

    // CHAT
    socket.on("chatMessage", ({ roomCode, message }) => {
      io.to(roomCode).emit("chatMessage", {
        userId: socket.userId,
        message,
        at: new Date().toISOString()
      });
    });

    // DISCONNECT
    socket.on("disconnect", async () => {
      console.log("Socket disconnected:", socket.id);
      try {
        const room = await Room.findOne({ "players.socketId": socket.id });
        if (!room) return;

        room.players = room.players.filter((p) => p.socketId !== socket.id);

        if (room.players.length === 0) {
          room.isActive = false;
          await room.save();
          activeGames.delete(room.code);
        } else {
          await room.save();
          io.to(room.code).emit("roomUpdated", room);
        }
      } catch (err) {
        console.error("disconnect error:", err);
      }
    });
  });
};
