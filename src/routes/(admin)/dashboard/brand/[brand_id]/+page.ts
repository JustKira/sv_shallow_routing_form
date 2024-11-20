import { getDb } from '$lib/surrealdb/surreal';
import { fail } from '@sveltejs/kit';
import { jsonify } from 'surrealdb';

export const load = async ({ params }) => {
	const db = await getDb();

	if (!db) {
		return fail(500, {
			message: 'Database connection failed'
		});
	}

	const brands = await db.query<Brand[]>(`SELECT * FROM ONLY (type::record($brand_id)) LIMIT 1`, {
		brand_id: `brand:${params.brand_id}`
	});

	console.log(JSON.stringify(jsonify(brands[0]), null, '\t'));

	return {
		brand: jsonify(brands[0])
	};
};
