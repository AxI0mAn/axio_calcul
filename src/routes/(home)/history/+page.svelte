<script>
	// @ts-ignore
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
		color: $clr-sky;
		padding: 20px;
		font-family: sans-serif;
		min-height: 100vh;
	}

	.header {
		color: $clr-coral;
		font-size: 5rem;
		display: inline-block;
		padding: 1rem 2rem;
		margin-bottom: 2rem;
	}

	.history-item {
		background-color: $clr-bg-card;
		border: 1px solid rgba($clr-mint, 0.3);
		margin-bottom: 1rem;
		padding: 10px;
		border-radius: 8px;
		box-shadow: $shadow-neon-mint;
	}

	.type-badge {
		font-weight: bold;
		text-transform: uppercase;
		// БЫЛО: #ccc
		border: 1px solid $clr-slate;
		color: $clr-mint;
		padding: 2px 6px;
		font-size: 0.8rem;
		border-radius: 4px;
	}

	.date {
		// БЫЛО: #00d1ff
		color: $clr-sky;
		font-size: 0.8rem;
		float: right;
	}

	ul {
		// БЫЛО: #fff
		color: $clr-text-main;
		margin-top: 10px;
		list-style: none;
		padding-left: 0;
	}

	ul li {
		line-height: 1.5rem;
		// Можно добавить разделитель между строками истории
		border-bottom: 1px solid rgba($clr-slate, 0.1);
		&:last-child {
			border-bottom: none;
		}
	}

	@media (max-height: 500px) and (orientation: landscape),
		(max-width: 500px) and (orientation: portrait) {
		.header {
			font-size: 2rem;
		}
	}
</style>
