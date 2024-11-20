import { z } from 'zod';

export const updateBrandSchema = z.object({
	name: z.string()
});

export type UpdateBrandSchema = typeof updateBrandSchema;
