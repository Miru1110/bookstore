import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import authRoute from './routes/auth.js';
import booksRoute from './routes/booksRoute.js';



dotenv.config();

const PORT = process.env.PORT || 3000;
const mongoDBURL = process.env.mongoDBURL;
const __dirname = path.resolve();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoute);    // Auth routes (/api/login, /api/register)
app.use('/books', booksRoute); // Books routes

// Serve frontend build if exists
app.use(express.static(path.join(__dirname, "frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Connect to MongoDB and start server
mongoose.connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
