import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chatRoutes.js';
import dbConnect from './config/db.js';

dotenv.config();
dbConnect();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});