import { Router } from 'express';
import prisma from '../prisma';
import { createQuestSchema, updateQuestSchema } from '../validators/quests';
import { createMilestoneSchema } from '../validators/milestones';
import { createTaskSchema } from '../validators/tasks';
import { HttpError } from '../utils/errors';

const router = Router();

function computeProgress(quest: {
  tasks: { done: boolean }[];
  milestones: { tasks: { done: boolean }[] }[];
}) {
  const questTasks = quest.tasks;
  const milestoneTasks = quest.milestones.flatMap((m) => m.tasks);
  const allTasks = [...questTasks, ...milestoneTasks];
  const total = allTasks.length;
  const done = allTasks.filter((task) => task.done).length;
  return {
    done,
    total
  };
}

router.get('/', async (_req, res) => {
  const quests = await prisma.quest.findMany({
    include: {
      tasks: true,
      milestones: {
        include: {
          tasks: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const withProgress = quests.map((quest) => ({
    ...quest,
    progress: computeProgress(quest)
  }));

  res.json(withProgress);
});

router.post('/', async (req, res, next) => {
  try {
    const data = createQuestSchema.parse(req.body);
    const quest = await prisma.quest.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined
      }
    });
    res.status(201).json(quest);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/milestones', async (req, res, next) => {
  try {
    const data = createMilestoneSchema.parse(req.body);
    const milestone = await prisma.milestone.create({
      data: {
        title: data.title,
        quest: {
          connect: { id: req.params.id }
        }
      }
    });
    res.status(201).json(milestone);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/tasks', async (req, res, next) => {
  try {
    const data = createTaskSchema.parse(req.body);
    const task = await prisma.task.create({
      data: {
        title: data.title,
        quest: {
          connect: { id: req.params.id }
        }
      }
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const quest = await prisma.quest.findUnique({
      where: { id: req.params.id },
      include: {
        tasks: { orderBy: { createdAt: 'asc' } },
        milestones: {
          orderBy: { createdAt: 'asc' },
          include: {
            tasks: { orderBy: { createdAt: 'asc' } }
          }
        }
      }
    });

    if (!quest) {
      throw new HttpError(404, 'Quest not found');
    }

    res.json({
      ...quest,
      progress: computeProgress(quest)
    });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const data = updateQuestSchema.parse(req.body);
    const quest = await prisma.quest.update({
      where: { id: req.params.id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined
      }
    });

    res.json(quest);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.quest.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
