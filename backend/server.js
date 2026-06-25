import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check route to easily test if server is alive
app.get('/health', (req, res) => res.status(200).json({ status: 'Backend is Live!' }));

app.use('/api', apiRouter);

app.listen(PORT, () => console.log(`🚀 Node Backend running on http://localhost:${PORT}`));