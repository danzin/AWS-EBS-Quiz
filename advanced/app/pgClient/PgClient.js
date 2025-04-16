import pg from "pg";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class PgClient {
  constructor() {
    const { Pool } = pg;
    const poolConfig = {
      host: process.env.RDS_HOSTNAME || "localhost",
      port: parseInt(process.env.RDS_PORT || "5432", 10),
      user: process.env.RDS_USERNAME || "postgres",
      password: process.env.RDS_PASSWORD || "password",
      database: process.env.RDS_DB_NAME || "testdb",
      connectionTimeoutMillis: 6000, // 5 seconds
      statement_timeout: 10000, // 10 seconds per query
      ssl: {
        rejectUnauthorized: false, // Needs to be commented for local testing, unless you configure SSL for the local database
      },
    };

    this.pool = new Pool(poolConfig);
    this.pool.on("error", (err, client) => {
      console.error("Unexpected error on idle PostgreSQL client", err);
    });
    console.log(
      `PostgreSQL Pool configured for database: ${poolConfig.database} on ${poolConfig.host}:${poolConfig.port}`
    );
  }

  async initializeDatabase() {
    let client;
    try {
      client = await this.pool.connect();
      console.log(`Connected to PostgreSQL host: ${client.host}`);

      const checkTableQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'questions'
        );
      `;
      const res = await client.query(checkTableQuery);
      const tableExists = res.rows[0].exists;

      if (!tableExists) {
        console.log("'questions' table not found. Running seed script...");
        await this.runSeedScript(client);
      } else {
        console.log("'questions' table already exists. Skipping seeding.");
      }
    } catch (error) {
      console.error(
        `Error during database initialization or seeding: ${error}`
      );
      throw error;
    } finally {
      if (client) {
        client.release();
        console.log("Initialization client released back to pool.");
      }
    }
  }

  async runSeedScript(client) {
    try {
      const seedSqlPath = path.join(__dirname, "..", "seed.sql");
      console.log(`Reading seed script from: ${seedSqlPath}`);
      const sql = await fs.readFile(seedSqlPath, "utf8");

      await client.query(sql);
      console.log("Seed script executed successfully.");
    } catch (error) {
      console.error(`Error running seed script: ${error}`);
      throw error;
    }
  }

  async fetchQuestions() {
    let client;
    try {
      client = await this.pool.connect();

      const result = await client.query("SELECT * FROM questions");

      const questions = result.rows.map((row) => ({
        question: row.question,
        choices: [row.option_a, row.option_b, row.option_c, row.option_d],
        correctAnswer: ["A", "B", "C", "D"].indexOf(row.correct_option),
      }));
      return questions;
    } catch (error) {
      console.error(`Error fetching questions data: ${error}`);
      throw error;
    }
  }

  async closePool() {
    console.log("Closing PostgreSQL connection pool...");
    await this.pool.end();
    console.log("PostgreSQL pool closed.");
  }
}
