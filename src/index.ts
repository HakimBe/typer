import express from "express";
import { connectDB } from "./config/database";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

/**
 * Routes
 */
app.get("/health", (_req, res) => {
  res.send("OK");
});
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

/**
 * Database operations
 */
connectDB();

/**
 * Server launch.
 */
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
