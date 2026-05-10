<script>
	import { base } from '$app/paths';
	import Catalog from '$lib/assets/svgIcon/catalog.svg?raw';
	import { historyStore } from '$lib/store/historyStore.svelte';
</script>

<h1 class="header">history of calculated</h1>

<div class="history-container">
	{#if Object.keys(historyStore.all).length === 0}
		<p>История пуста или еще не загружена.</p>
	{:else}
		{#each Object.entries(historyStore.all).sort((a, b) => new Date(b[1].updatedAt).getTime() - new Date(a[1].updatedAt).getTime()) as [id, record]}
			<div class="history-item {record.type}">
				<div class="history-header">
					<span class="type-badge">{record.type}</span>
					<span class="date">{new Date(record.updatedAt).toLocaleString()}</span>
				</div>

				<ul class="history-lines">
					{#each record.items as line}
						<li>{line}</li>
					{/each}
				</ul>
			</div>
		{/each}
	{/if}
</div>

<style lang="scss">
	.history-container {
		margin: 0 auto;
		max-width: 100vmin;
		color: #00d1ff; /* Неоновый голубой */
		padding: 20px;
		font-family: sans-serif;
		min-height: 100vh;
	}

	.header {
		color: coral;
		font-size: 5rem;
		display: inline-block;
		padding: 1rem 2rem;
		margin-bottom: 2rem;
	}
	.history-item {
		border: 1px solid #ccc;
		margin-bottom: 1rem;
		padding: 10px;
		border-radius: 8px;
	}
	.type-badge {
		font-weight: bold;
		text-transform: uppercase;
		border: 1px solid #ccc;
		padding: 2px 6px;
		font-size: 0.8rem;
	}
	.date {
		color: #00d1ff; /* Неоновый голубой */
		font-size: 0.8rem;
		float: right;
	}
	ul {
		color: #fff;
		margin-top: 10px;
		list-style: none;
		padding-left: 0;
	}
	ul li {
		line-height: 1.5rem;
	}
</style>
