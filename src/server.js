import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import userRouter from "./routes/user.router.js";
import postRouter from "./routes/post.router.js";
import commentRouter from "./routes/comment.router.js";
import aiRouter from "./routes/askai.router.js";

import http from "http";
import { Server } from "socket.io";
import Post from "./models/post.model.js";
import User from "./models/user.model.js";
import { getDistance } from "./utils/functions.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

io.on("connection", (socket) => {
  // console.log("Hello from ", socket.handshake.query);
  socket.on("newPost", async ({ postId }) => {
    console.log("post", postId);

    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }
    if (post.criticality === "Severe" || post.status === "Verified") {
      io.sockets.sockets.forEach(async (socketInstance) => {
        const userId = socketInstance.handshake.query.userId;
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }
        const distance = getDistance(post.location, user.location);
        console.log("helo", distance);

        if (
          (post.criticality === "Severe" && distance <= 300) ||
          (post.criticality === "Moderate" && distance <= 750) ||
          (post.criticality === "Minor" && distance <= 2000)
        ) {
          socketInstance.emit("notification", post);
        }
      });
    }
  });
  io.on("disconnect", () => {
    console.log("User disconnected");
  });

  // console.log("User connected");
});

app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/ping", (req, res) => {
  res.send("Pong");
});

// Routes
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/ai", aiRouter);

const PORT = process.env.PORT || 8000;

console.log(process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
