import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import studentRoutes from "./routes/studentRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Basic CORS config
const allowedOrigins = [
  "http://localhost:3000", // for dev
  "https://system-analyst-project-frontend.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());
app.use(express.json());
app.use("/students", studentRoutes);

// Minimal error handler
//@ts-ignore
app.use((err, req, res, _next) => {
  console.error(err);
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
