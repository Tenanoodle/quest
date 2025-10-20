import { Router } from 'express';
import prisma from '../prisma';
import { HttpError } from '../utils/errors';

const router = Router();

router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const existing = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      throw new HttpError(404, 'Task not found');
    }
    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        done: !existing.done
      }
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
