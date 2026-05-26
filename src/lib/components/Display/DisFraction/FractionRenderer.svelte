<script>
	// Принимаем пропсы через руну $props
	let { rawString = '' } = $props();

	// Вспомогательная функция для парсинга (остается без изменений)
	function parse(str) {
		if (!str) return [];
		// Регулярка для смешанных дробей 8(1÷3)
		const mixedMatch = str.match(/(\d+)\((\d+)÷(\d+)\)/);
		if (mixedMatch) {
			return { type: 'mixed', whole: mixedMatch[1], num: mixedMatch[2], den: mixedMatch[3] };
		}
		// Регулярка для простых дробей 1÷2
		const simpleMatch = str.match(/(\d+)÷(\d+)/);
		if (simpleMatch) {
			return { type: 'simple', num: simpleMatch[1], den: simpleMatch[2] };
		}
		return { type: 'text', val: str };
	}

	// Реактивное производное состояние через $derived
	let parts = $derived(
		rawString
			.split(' ')
			.filter((s) => s.trim())
			.map(parse)
	);
</script>

<div class="render-container">
	{#each parts as p}
		{#if p.type === 'mixed'}
			<div class="fraction-mixed">
				<span class="integer">{p.whole}</span>
				<div class="fractional-stack">
					<span class="num">{p.num}</span>
					<div class="line"></div>
					<span class="den">{p.den}</span>
				</div>
			</div>
		{:else if p.type === 'simple'}
			<div class="fractional-stack">
				<span class="num">{p.num}</span>
				<div class="line"></div>
				<span class="den">{p.den}</span>
			</div>
		{:else}
			<span class="pure-text">{p.val}</span>
		{/if}
	{/each}
</div>

<style>
	.render-container {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}
	.fraction-mixed {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}
	.fractional-stack {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		vertical-align: middle;
		line-height: 1;
	}
	.line {
		width: 100%;
		border-bottom: 2px solid currentColor;
		margin: 2px 0;
	}
	.num,
	.den {
		font-size: 0.85em;
	}
	.integer {
		font-size: 1.2em;
		font-weight: bold;
	}
</style>
