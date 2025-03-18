import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db';
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    
    await sequelize.sync();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();