import {
	PUBLIC_SURREALDB_DB,
	PUBLIC_SURREALDB_ENDPOINT,
	PUBLIC_SURREALDB_NS
} from '$env/static/public';
import Surreal from 'surrealdb';
// import { getAuthCookie, removeAuthCookie } from "./cookie";

type DbConfig = {
	url: string;
	namespace: string;
	database: string;
};

const DEFAULT_CONFIG: DbConfig = {
	url: PUBLIC_SURREALDB_ENDPOINT,
	namespace: PUBLIC_SURREALDB_NS,
	database: PUBLIC_SURREALDB_DB
};

let connectionPromise: Promise<Surreal> | null = null;

const connectToDatabase = async (config: DbConfig): Promise<Surreal> => {
	const db = new Surreal();

	try {
		await db.connect(config.url);
		await db.use({ namespace: config.namespace, database: config.database });

		// const token = getAuthCookie();
		// if (token) {
		// 	try {
		// 		await db.authenticate(token);
		// 	} catch {
		// 		removeAuthCookie();
		// 	}
		// }

		return db;
	} catch (err) {
		console.error(
			'Failed to connect to SurrealDB:',
			err instanceof Error ? err.message : String(err)
		);
		await db.close();
		throw err;
	}
};

export const getDb = async (config: DbConfig = DEFAULT_CONFIG): Promise<Surreal> => {
	if (!connectionPromise) {
		connectionPromise = connectToDatabase(config);
	}

	return connectionPromise;
};
