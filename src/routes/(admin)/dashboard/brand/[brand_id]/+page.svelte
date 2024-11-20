<script lang="ts">
	import type { PageData } from './$types';

	// START: Load Data & Props

	let { data }: { data: PageData } = $props();

	// END: Load Data & Props

	console.log(data);
</script>

<h1>
	{data.brand?.name}
</h1>
