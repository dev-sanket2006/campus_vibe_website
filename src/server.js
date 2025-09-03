import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";

// Routes
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import pollsRoutes from "./routes/polls.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import friendsRoutes from "./routes/friends.routes.js";
import eventsRoutes from "./routes/events.routes.js";
import confessionRoutes from "./routes/confession.routes.js";
import birthdayRoutes from "./routes/birthday.routes.js";

dotenv.config();
const prisma = new PrismaClient();

const app = express();
const server = http.createServer(app);

// ✅ Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// ✅ API Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/polls", pollsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/confessions", confessionRoutes);
app.use("/api/birthdays", birthdayRoutes);

// ✅ Attach Socket.IO
export const io = new Server(server, {
  cors: {
    origin: "*", // ⚠️ Replace with frontend URL in production
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🔗 User connected:", socket.id);

  // ✅ Join group room
  socket.on("joinGroup", (groupId) => {
    socket.join(`group_${groupId}`);
    console.log(`📌 User ${socket.id} joined group ${groupId}`);
  });

  // ✅ Send message through socket
  socket.on("sendMessage", async ({ groupId, senderId, message, isAnonymous }) => {
    try {
      const newMessage = await prisma.message.create({
        data: {
          groupId,
          senderId,
          message,
          isAnonymous: isAnonymous || false,
        },
        include: { sender: true },
      });

      // Broadcast to all users in the group
      io.to(`group_${groupId}`).emit("newMessage", newMessage);
    } catch (err) {
      console.error("❌ Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

server.listen(PORT, () => {
  console.log(`🚀 Server running in ${NODE_ENV} mode on http://localhost:${PORT}`);
});
