import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

export const addBrandSchema = z.object({
	name: z.string()
});

export type AddBrandSchema = typeof addBrandSchema;

export async function load() {
	return {
		addBrandForm: await superValidate(zod(addBrandSchema))
	};
}
