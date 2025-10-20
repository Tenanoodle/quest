import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import inboxRouter from './routes/inbox';
import questsRouter from './routes/quests';
import milestonesRouter from './routes/milestones';
import tasksRouter from './routes/tasks';
import { errorHandler } from './utils/errors';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/inbox', inboxRouter);
app.use('/api/quests', questsRouter);
app.use('/api/milestones', milestonesRouter);
app.use('/api/tasks', tasksRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

export default app;
