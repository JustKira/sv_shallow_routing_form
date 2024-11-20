import { getDb } from '$lib/surrealdb/surreal';
import { error, type Actions } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { jsonify, RecordId } from 'surrealdb';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { updateBrandSchema } from './schema.js';

export const load = async ({ params }) => {
	const db = await getDb();

	if (!db) {
		return error(500, {
			message: 'Database connection failed'
		});
	}

	const brandRequest = await db.query<Brand[]>(`SELECT * FROM ONLY $brand_id LIMIT 1`, {
		brand_id: new RecordId('brand', params.brand_id)
	});

	const brand = jsonify(brandRequest[0]);

	if (!brand)
		return error(404, {
			message: 'Brand not	found'
		});

	const updateBrandForm = await superValidate(zod(updateBrandSchema));

	return {
		brand,
		updateBrandForm
	};
};

export const actions: Actions = {
	'update-brand': async (event) => {
		const form = await superValidate(event, zod(updateBrandSchema));
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
		const brand = await db.query<Brand[]>(`SELECT * FROM ONLY $brand_id LIMIT 1`, {
			brand_id: new RecordId('brand', event.params.brand_id as string)
		});

		if (!brand[0]) {
			return message(form, 'Brand does not exist', {
				status: 404
			});
		}

		await db.merge(new RecordId('brand', event.params.brand_id as string), form.data);

		return message(form, 'Brand Updated successfully');
	}
};
