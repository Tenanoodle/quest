import { z } from 'zod';

export const createMilestoneSchema = z.object({
  title: z.string().min(1)
});
