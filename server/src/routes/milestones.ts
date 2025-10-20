import { Router } from 'express';
import prisma from '../prisma';
import { createTaskSchema } from '../validators/tasks';
import { HttpError } from '../utils/errors';

const router = Router();

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.milestone.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    next(new HttpError(404, 'Milestone not found'));
  }
});

router.post('/:id/tasks', async (req, res, next) => {
  try {
    const data = createTaskSchema.parse(req.body);
    const task = await prisma.task.create({
      data: {
        title: data.title,
        milestone: {
          connect: { id: req.params.id }
        }
      }
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

export default router;
