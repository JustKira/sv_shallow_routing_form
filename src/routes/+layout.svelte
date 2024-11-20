<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner/index';
	import '../app.css';
	let { children } = $props();
</script>

<Toaster />
{@render children()}
