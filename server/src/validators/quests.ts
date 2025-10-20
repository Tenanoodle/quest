import { z } from 'zod';

export const createQuestSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.number().int().min(1).max(5),
  dueDate: z.string().datetime().optional()
});

export const updateQuestSchema = createQuestSchema.partial();
