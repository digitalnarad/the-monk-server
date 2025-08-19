import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
// import router from "./routes.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: false,
  })
);
app.use(morgan("dev"));

app.get("/api/v1/health", (req, res) => res.json({ ok: true }));
// app.use("/api/v1", router);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(env.PORT, () =>
    console.log(`API running at http://localhost:${env.PORT}`)
  );
};
start();
