<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { updateBrandSchema } from './schema';
	import { toast } from 'svelte-sonner';
	import { invalidate, invalidateAll } from '$app/navigation';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	// START: Load Data & Props

	let { data }: { data: PageData } = $props();

	// END: Load Data & Props

	// START: Update Brand Form

	// let updateBrandFormOpen = $state(false);

	const form = superForm(data.updateBrandForm, {
		validators: zodClient(updateBrandSchema),
		delayMs: 500,
		timeoutMs: 10000,
		onUpdate(event) {
			if (event.result.type === 'success') {
				toast.success(event.form.message);
				return;
			}

			if (event.result.type === 'failure') {
				toast.error(event.form.message);
				return;
			}
		}
	});

	const { form: formData, enhance, timeout, delayed } = form;

	// END: Add Brand Form
</script>

<!-- START: Update Brand Form UI -->

{#snippet updateBrandForm()}
	<form method="POST" action="?/update-brand" use:enhance>
		<Form.Field {form} name="name">
			<Form.Control let:attrs>
				<Form.Label>Name</Form.Label>
				<Input {...attrs} placeholder={data.brand.name} bind:value={$formData.name} />
			</Form.Control>
			<Form.Description>
				Enter the name of the Brand, you can afterwards add Laptops to this Brand.
			</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		{#if $delayed}
			<!-- TODO: add Better Loading  -->
			Processing...
		{:else if $timeout}
			<!-- TODO: add Better Loading  -->
			Loading...
		{/if}

		<Form.Button class="w-full" disabled={$delayed || $timeout}>Update</Form.Button>
	</form>
{/snippet}

<!-- END: Update Brand Form UI -->

<!-- START: Page UI -->

<section class="flex w-full flex-col justify-between border-b border-sidebar-border px-4 py-2">
	<div class="flex w-fit flex-col items-start gap-1">
		<h1 class="text-sm text-muted-foreground">
			Brand
			<span class="font-semibold text-foreground">{data.brand?.name}</span>
		</h1>

		<!-- <Dialog.Root open={updateBrandFormOpen} onOpenChange={(open) => (updateBrandFormOpen = open)}>
			<Dialog.Trigger class={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'w-32')}>
				Edit Brand
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Edit Brand</Dialog.Title>
				</Dialog.Header> -->

		{@render updateBrandForm()}

		<!-- <Dialog.Close>
					<Dialog.Trigger
						disabled={$timeout}
						class={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'w-full')}
					>
						Cancel
					</Dialog.Trigger>
				</Dialog.Close>
			</Dialog.Content>
		</Dialog.Root> -->
	</div>
</section>

<!-- END: Page UI -->
