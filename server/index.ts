import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { db } from "./db";
import "dotenv/config";

import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// ✅ CORS Setup

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5051",
      "https://propertiespro.netlify.app",
    ];
    const netlifyPreviewRegex = /^https:\/\/[\w-]+--propertiespro\.netlify\.app$/;

    if (!origin || allowedOrigins.includes(origin) || netlifyPreviewRegex.test(origin)) {
      callback(null, true);
    } else {
      console.error(`❌ CORS blocked for origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ DB Test Route
app.get("/api/test-db", async (_req, res) => {
  try {
    const result = await db.execute(`SELECT NOW();`);
    res.json({ success: true, result });
  } catch (err) {
    console.error("DB connection error:", err);
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// ✅ API Logger (for /api only)
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJson: any;

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    capturedJson = body;
    return originalJson(body);
  };

  res.on("finish", () => {
    if (path.startsWith("/api")) {
      const duration = Date.now() - start;
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;

      if (capturedJson) {
        logLine += ` :: ${JSON.stringify(capturedJson)}`;
      }

      if (logLine.length > 120) {
        logLine = logLine.slice(0, 119) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // ✅ Global Error Handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    console.error("❌ Global error handler caught:", message);
    res.status(status).json({ message });
  });

  // ✅ Static/Vite setup
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ✅ Start server
  const port = parseInt(process.env.PORT || "5051", 10);
  server.listen(
    { port, host: "0.0.0.0", reusePort: true },
    () => log(`🚀 Server running at http://localhost:${port}`)
  );
})();

console.log("✅ Server entry is being built");

export default {};
