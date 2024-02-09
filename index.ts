import express from "express";
import http from "http";
import { getPosts } from "./utils/vrite.ts";
import { getMessage } from "./utils/files.ts";
import { streamData } from "./utils/streaming.ts";

const app = express();
const port = 3000;

// Middleware to set Content-Type and enable streaming
app.use((req, res, next) => {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  next();
});

// Handle streaming
app.get("/", async (req, res) => {
  const message = await getMessage();
  streamData(req, res, message);
});

// create blog mirror
app.get("/blog", async (req, res) => {
  const posts = await getPosts();
  streamData(req, res, posts);
});

// Create HTTP server
const server = http.createServer(app);

// Start server
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
