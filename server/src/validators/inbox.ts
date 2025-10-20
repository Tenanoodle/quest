import { z } from 'zod';

export const createInboxItemSchema = z.object({
  text: z.string().min(1, 'Text is required').max(280)
});
