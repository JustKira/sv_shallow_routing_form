// See https://svelte.dev/docs/kit/types#app.d.ts

import type { UpdateBrandSchema } from './routes/(admin)/dashboard/brand/[brand_id]/schema';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			brand: Brand;
			updateBrandForm: SuperValidated<Infer<UpdateBrandSchema>>;
		}
		// interface Platform {}
	}
}

export {};
