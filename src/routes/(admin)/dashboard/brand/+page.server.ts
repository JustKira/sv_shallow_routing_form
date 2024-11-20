import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { addBrandSchema } from './schema';
import { getDb } from '$lib/surrealdb/surreal';

export const actions: Actions = {
	'add-brand': async (event) => {
		const form = await superValidate(event, zod(addBrandSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const db = await getDb();

		if (!db) {
			return message(form, 'Database connection failed', {
				status: 500
			});
		}

		// Check if brand already exists
		const brand = await db.query<Brand[]>(`SELECT * FROM ONLY brand WHERE name=$name LIMIT 1`, {
			...form.data
		});

		if (brand[0]) {
			return message(form, 'Brand already exists', {
				status: 409
			});
		}

		await db.query(`CREATE ONLY brand:ulid() SET name=$name`, {
			...form.data
		});

		return message(form, 'Brand added successfully');
	}
};
