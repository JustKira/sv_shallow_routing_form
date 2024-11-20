import { z } from 'zod';

export const addBrandSchema = z.object({
	name: z.string()
});

export type AddBrandSchema = typeof addBrandSchema;
