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
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(express.json());
  }

  setupRoutes() {
    this.app.get("/", this.handleHomePage.bind(this));

    this.app.get("/questions", this.handleQuestions.bind(this));

    this.app.post("/submit", this.handleSubmit.bind(this));

    this.app.get("/style.css", this.handleStaticFile.bind(this, "style.css"));

    this.app.get("/app.js", this.handleStaticFile.bind(this, "app.js"));
  }

  handleHomePage(req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
  }

  handleSubmit(req, res) {
    console.log("Received POST data:", req.body);
    res.status(200).json({ message: "Submitted successfully." });
  }

  handleStaticFile(filename, req, res) {
    res.sendFile(path.join(__dirname + `/${filename}`));
  }

  async handleQuestions(req, res) {
    try {
      const questions = await this.pgClient.fetchQuestions();
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error.message);
      res.status(500).json({ error: "Unable to fetch questions." });
    }
  }

  start() {
    this.app.listen(port, "0.0.0.0", () => {
      console.log(`Listening on port ${this.port}!`);
    });
  }
}

const port = process.env.PORT;
const appServer = new AppServer(port);
appServer.start();
