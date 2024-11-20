import { getDb } from '$lib/surrealdb/surreal';
import { fail, type Actions } from '@sveltejs/kit';
import { jsonify } from 'surrealdb';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { addBrandSchema } from './schema';

export const load: PageServerLoad = async () => {
	const db = await getDb();

	const addBrandForm = await superValidate(zod(addBrandSchema));

	if (!db) {
		return {
			brands: [],
			addBrandForm
		};
	}

	const brands = await db.query<SurrealQuery<Brand[]>>(`SELECT * FROM brand`, {});

	return {
		brands: jsonify(brands[0]),
		addBrandForm
	};
};

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

		await db.query(`CREATE ONLY brand:ulid() SET name=$name, total_laptops=0`, {
			...form.data
		});

		return message(form, 'Brand added successfully');
	}
};
