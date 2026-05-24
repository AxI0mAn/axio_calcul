<script>
	// src/routes/(home)/history/+page.svelte
	// @ts-ignore
	import { base } from '$app/paths';
	import { historyStore } from '$lib/store/historyStore.svelte';
	import { parseExpressionToHtml } from '$lib/utils/fractionVisualParser.js';
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
						<li>
							{#if typeof line === 'string' && line.includes('÷')}
								<div class="global-expression-line">
									{#each parseExpressionToHtml(line) as token}
										{#if token.type === 'text'}
											<span class="global-math-text">
												<!-- {token.value} -->
												{token.value.replace(/[\u2951\u294F]/g, '')}
											</span>
										{:else}
											<div class="global-fraction-block">
												{#if token.whole}<span class="global-whole-part">{token.whole}</span>{/if}
												<div class="global-fraction-container">
													<span class="global-num-part">{token.num}</span>
													<span class="global-fraction-line"></span>
													<span class="global-den-part">{token.den}</span>
												</div>
											</div>
										{/if}
									{/each}
								</div>
							{:else}
								{line}
							{/if}
						</li>
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
		border: 1px solid rgba($clr-mint-rgb, 0.3);
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
		border-bottom: 1px solid rgba($clr-slate-rgb, 0.1);
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

	.global-expression-line {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px;
		width: 100%;
		padding: 2px 0;
	}

	.global-math-text {
		font-size: 1.1rem;
		color: rgba(255, 255, 255, 0.9);
	}

	.global-fraction-block {
		display: inline-flex;
		align-items: center;
		vertical-align: middle;
	}

	.global-whole-part {
		font-size: 1.2rem;
		font-weight: bold;
		margin-right: 2px;
		color: #fff;
	}

	.global-fraction-container {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		line-height: 1;
		padding: 0 3px;
	}

	.global-num-part,
	.global-den-part {
		font-size: 0.85rem;
		color: #fff;
	}

	.global-fraction-line {
		display: block;
		width: 100%;
		height: 1px;
		background-color: rgba(255, 255, 255, 0.8);
		margin: 2px 0;
	}
</style>
