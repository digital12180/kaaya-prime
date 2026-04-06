import {fileURLToPath} from "url";
import { dirname } from "path";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";

//Routes 
import BaseRoutes from "./routes/index.js";

const app=express();

app.use(helmet({
    contentSecurityPolicy:false,
    crossOriginEmbedderPolicy:false,
}))
const allowedOrigins = [
  'https://kaaya-prime-realty-crm.vercel.app',
  'http://localhost:3000',
  '*'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / mobile apps

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Cookie parser
app.use(cookieParser());

//Logging 
if(process.env.NODE_ENV!=='production'){
    app.use(morgan('dev'));
}else{
    app.use(morgan('combined'));
}

app.use((req, res, next) => {
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Custom header
  res.setHeader('X-Service-Name', 'KAAYA-API');

  next();
});

// ==================== ROOT ROUTE ====================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'KAAYA API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

//======================BASE ROUTE=====================
app.use('/apis/v1', BaseRoutes);
// ==================== EXPORT APP ====================
export default app;