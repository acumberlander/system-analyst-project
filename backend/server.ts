console.log("Starting server...");

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import studentRoutes from "./routes/studentRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://system-analyst-project-frontend.vercel.app',
  'https://system-analyst-project-frontend-qjcttgydj.vercel.app',
  'https://system-analyst-project-frontend-pxswj0jtb.vercel.app',
  'https://system-analyst-project-frontend-8ac5n2spx.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    console.log('Request origin:', origin);
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      console.log('CORS blocked:', origin);
      return callback(new Error(msg), false);
    }
    console.log('CORS allowed:', origin);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use("/students", studentRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

try {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Database URL:', process.env.SUPABASE_URL ? 'Set' : 'Not set');
  });
} catch (err) {
  console.error("[Server Error]", err);
}
