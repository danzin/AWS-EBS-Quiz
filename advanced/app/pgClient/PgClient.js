import pg from "pg";

export class PgClient {
  constructor() {
    const { Client } = pg;
    this.client = new Client({
      host: "localhost",
      port: 5432,
      user: "postgres",
      password: "password",
      database: "testdb",
    });

    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("Connected to PostgreSQL.");
    } catch (error) {
      console.error(`Error establishing connection to PostgreSQL: ${error}`);
    }
  }

  async fetchQuestions() {
    try {
      const result = await this.client.query("SELECT * FROM questions");

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
}
