// #region //imports
import express, { Request, Response } from "express";
import { createServer } from "http";
import { config } from "dotenv";
import userRoutes from "./routers/Users";
import productRoutes from "./routers/Product";
import cartRoutes from "./routers/Carts";
import ordersRoutes from "./routers/Orders";

// #endregion

// #region //config
config();

const app = express();
app.use(express.json());
const port = process.env.port || 3000;
const server = createServer(app);

// #endregion

app.use("/api/", userRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", ordersRoutes)


server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});