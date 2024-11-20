<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { cn } from '$lib/utils';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { addBrandSchema, type AddBrandSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';

	let { data }: { data: SuperValidated<Infer<AddBrandSchema>> } = $props();

	let addBrandFormDialogOpen = $state(false);

	const form = superForm(data, {
		validators: zodClient(addBrandSchema),
		delayMs: 500,
		timeoutMs: 2000,
		onUpdate(event) {
			if (event.result.type === 'success') {
				toast.success(event.form.message);
				addBrandFormDialogOpen = false;
				return;
			}

			if (event.result.type === 'failure') {
				toast.error(event.form.message);
				return;
			}
		}
	});

	const { form: formData, enhance, timeout, delayed } = form;
</script>

{#snippet addBrandFrom()}
	<form method="POST" action="?/add-brand" use:enhance>
		<Form.Field {form} name="name">
			<Form.Control let:attrs>
				<Form.Label>Name</Form.Label>
				<Input {...attrs} bind:value={$formData.name} />
			</Form.Control>
			<Form.Description>
				Enter the name of the Brand, you can afterwards add Laptops to this Brand.
			</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		{#if $delayed}
			<!-- TODO add Better Loading  -->
			Processing...
		{/if}

		{#if $timeout}
			<!-- TODO add Better Loading  -->
			Loading...
		{/if}

		<Form.Button class="w-full" disabled={$timeout}>Submit</Form.Button>
	</form>
{/snippet}

<main class="min-h-screen w-full">
	<section
		class="sticky top-0 flex w-full flex-col justify-between border-b border-sidebar-border px-4 py-2"
	>
		<div class="flex w-fit flex-col items-start gap-1">
			<h1 class="text-xl font-medium">Brands</h1>

			<Dialog.Root
				open={addBrandFormDialogOpen}
				onOpenChange={(open) => (addBrandFormDialogOpen = open)}
			>
				<Dialog.Trigger class={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'w-32')}>
					Add Brand
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Add Brand</Dialog.Title>
					</Dialog.Header>

					{@render addBrandFrom()}

					<Dialog.Close>
						<Dialog.Trigger
							disabled={$timeout}
							class={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'w-full')}
						>
							Cancel
						</Dialog.Trigger>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</section>
</main>
