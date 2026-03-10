import express from "express";
import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import userRoutes from "./routes/userRoutes";
import { clerkMiddleware } from "@clerk/express";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json()); //parsers incoming JSON request bodies and makes them available as req.body
// in your route handlers

app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

//error handling middleware should be the last middleware added to the stack, after all routes and other middleware, have been defined. This ensures that it can catch and handle any errors that occur during the processing of requests, regardless of where they originate in the application.
app.use(errorHandler);

export default app;
