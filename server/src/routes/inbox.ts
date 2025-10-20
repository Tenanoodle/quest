import { Router } from 'express';
import prisma from '../prisma';
import { createInboxItemSchema } from '../validators/inbox';
import { HttpError } from '../utils/errors';
import { z } from 'zod';

const router = Router();

const promoteSchema = z.object({
  questId: z.string().optional(),
  questTitle: z.string().optional()
});

router.get('/', async (_req, res) => {
  const items = await prisma.inboxItem.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.json(items);
});

router.post('/', async (req, res, next) => {
  try {
    const data = createInboxItemSchema.parse(req.body);
    const item = await prisma.inboxItem.create({
      data
    });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.inboxItem.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    next(new HttpError(404, 'Inbox item not found'));
  }
});

router.post('/:id/promote', async (req, res, next) => {
  try {
    const { questId, questTitle } = promoteSchema.parse(req.body ?? {});
    const inboxItem = await prisma.inboxItem.findUnique({ where: { id: req.params.id } });

    if (!inboxItem) {
      throw new HttpError(404, 'Inbox item not found');
    }

    let targetQuestId = questId;

    if (!targetQuestId) {
      const title = questTitle ?? inboxItem.text.slice(0, 48);
      const quest = await prisma.quest.create({
        data: {
          title: title || 'New Quest',
          priority: 3,
          description: inboxItem.text
        }
      });
      targetQuestId = quest.id;
    }

    const task = await prisma.task.create({
      data: {
        title: inboxItem.text,
        quest: {
          connect: { id: targetQuestId }
        }
      }
    });

    await prisma.inboxItem.delete({ where: { id: inboxItem.id } });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

export default router;
