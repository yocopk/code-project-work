import express, { Request, Response } from 'express';
import { createClient } from '@vercel/postgres';
import { createServer } from 'http';
import { config } from 'dotenv';

config();

const app = express();
const PORT = process.env.PORT || 3000;
const server = createServer(app);
const client = createClient({
    connectionString: process.env.DATABASE_URL
});

(async () => {
  try {
      await client.connect();
      console.log("Connected to the database");
  } catch (error) {
      console.error("Failed to connect to the database", error);
  }
})();

app.use(express.json);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
})

server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});