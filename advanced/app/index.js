import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { PgClient } from "./pgClient/PgClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AppServer {
  constructor(port) {
    this.app = express();
    this.port = port || 4567;
    this.pgClient = new PgClient();
  }

  async initialize() {
    console.log("Initializing server...");
    await this.pgClient.initializeDatabase();
    console.log("Database initialized successfully.");
    this.setupMiddleware();
    this.setupRoutes();
    console.log("Server initialization complete.");
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname)));
  }

  setupRoutes() {
    this.app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "index.html"));
    });

    this.app.get("/questions", this.handleQuestions.bind(this));
    this.app.post("/submit", this.handleSubmit.bind(this));
  }

  handleSubmit(req, res) {
    console.log("Received POST data:", req.body);
    res.status(200).json({ message: "Submitted successfully." });
  }

  async handleQuestions(req, res) {
    try {
      const questions = await this.pgClient.fetchQuestions();
      res.json(questions);
    } catch (error) {
      console.error("Error in /questions handler:", error);
      res.status(500).json({ error: "Unable to fetch questions." });
    }
  }

  start() {
    this.app.listen(this.port, "0.0.0.0", () => {
      console.log(`Listening on port ${this.port}!`);
    });
  }

  async stop() {
    console.log("Stopping server...");
    await this.pgClient.closePool();
    // You might need server.close() here if you keep track of the http server instance
    console.log("Server stopped.");
  }
}

const port = process.env.PORT || 4567;
const appServer = new AppServer(port);

async function main() {
  try {
    await appServer.initialize();
    appServer.start();

    process.on("SIGINT", async () => {
      console.log("SIGINT signal received.");
      await appServer.stop();
      process.exit(0);
    });
    process.on("SIGTERM", async () => {
      console.log("SIGTERM signal received.");
      await appServer.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to initialize or start the server:", error);
    process.exit(1);
  }
}

main();
