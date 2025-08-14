import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app: express.Express = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;

app.get("/health", (_req, res) => {
  res.json({ status: "healthy", ts: new Date().toISOString() });
});

import denialsRoutes from "./routes/denials";

app.get("/", (_req, res) => {
  res.json({
    message: "Billigent Backend API",
    version: "1.0.0",
  });
});

app.use("/api/denials", denialsRoutes);

// Only listen when invoked directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server on ${PORT}`);
  });
}

export default app;

