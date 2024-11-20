<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<Sidebar.Root>
		<Sidebar.Header />
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							{#snippet child({ props })}
								<a href="/dashboard/brand" {...props}>
									<span>Brands</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.Group>
		</Sidebar.Content>
		<Sidebar.Footer />
	</Sidebar.Root>

	{@render children()}
</Sidebar.Provider>
