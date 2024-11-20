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
	import { getCoreRowModel, type ColumnDef } from '@tanstack/table-core';
	import * as Table from '$lib/components/ui/table/index';
	import {
		createSvelteTable,
		FlexRender,
		renderSnippet
	} from '$lib/components/ui/data-table/index';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';

	// START: Load Data & Props

	interface Props {
		addBrandForm: SuperValidated<Infer<AddBrandSchema>>;
		brands: Brand[];
	}

	let {
		data
	}: {
		data: Props;
	} = $props();

	// END: Load Data & Props

	// START: Add Brand Form

	let addBrandFormDialogOpen = $state(false);

	const form = superForm(data.addBrandForm, {
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

	// END: Add Brand Form

	// START: Brands Table
	const columns: ColumnDef<Brand>[] = [
		{
			accessorKey: 'name',
			header: 'Name',
			cell: ({ row }) => {
				const { name } = row.original;
				return renderSnippet(brandNameTable, { name });
			}
		},
		{
			accessorKey: 'total_laptops',
			header: 'Total Laptops',
			cell: ({ row }) => {
				const { total_laptops } = row.original;
				return renderSnippet(brandTotalLaptopsTable, { total_laptops });
			}
		}
	];

	const table = createSvelteTable({
		get data() {
			return data.brands;
		},
		columns,
		getCoreRowModel: getCoreRowModel()
	});

	// END: Brands Table
</script>

<!-- START: Brands Table UI -->
{#snippet brandsTable()}
	<Table.Root>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row>
					{#each headerGroup.headers as header (header.id)}
						<Table.Head>
							{#if !header.isPlaceholder}
								<FlexRender
									content={header.column.columnDef.header}
									context={header.getContext()}
								/>
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each table.getRowModel().rows as row (row.id)}
				<Table.Row data-state={row.getIsSelected() && 'selected'}>
					{#each row.getVisibleCells() as cell (cell.id)}
						<Table.Cell>
							<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
						</Table.Cell>
					{/each}
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{/snippet}

{#snippet brandNameTable({ name }: { name: string })}
	<h1 class="font-medium">
		{name}
	</h1>
{/snippet}

{#snippet brandTotalLaptopsTable({ total_laptops }: { total_laptops: number })}
	<div class="flex gap-2">
		<h1 class="font-medium">
			{total_laptops}
		</h1>
	</div>
{/snippet}

<!-- END: Brands Table UI -->

<!-- START: Add Brand Form UI -->

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
			<!-- TODO: add Better Loading  -->
			Processing...
		{:else if $timeout}
			<!-- TODO: add Better Loading  -->
			Loading...
		{/if}

		<Form.Button class="w-full" disabled={$timeout}>Submit</Form.Button>
	</form>
{/snippet}

<!-- END: Add Brand Form UI -->

<!-- START: Page UI -->

<main class="flex max-h-screen w-full flex-col gap-2 pb-2">
	<section class="flex w-full flex-col justify-between border-b border-sidebar-border px-4 py-2">
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

	<section class="mx-2 flex flex-col gap-2">
		<h1 class="text-lg font-medium">Brands</h1>
		<div>
			<h1>Search</h1>
			<Input disabled placeholder="( TODO: SUPPORT SEARCHING )" class="max-w-72 bg-sidebar" />
		</div>
	</section>

	<ScrollArea class="mx-2 h-full rounded-md border">
		<!-- TODO: Make Table header Sticky with scrolling  -->
		{@render brandsTable()}
	</ScrollArea>
</main>

<!-- END: Page UI -->
