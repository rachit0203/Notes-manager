import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import noteRoutes from './routes/noteRoutes';
import webhookRoutes from './routes/webhookRoutes'; // Import webhook routes

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS must be handled before the webhook route
app.use(cors({ origin: process.env.CLIENT_URL }));

// Webhook route needs the raw body, so it comes before express.json()
app.use('/api/webhooks', webhookRoutes);

// Now use express.json() for all other routes
app.use(express.json());

// A simple health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy!' });
});

// Use the note routes
app.use('/api/notes', noteRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});