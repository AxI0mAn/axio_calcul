<!-- 

ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ
В тексте инструкции:
<script>
  import FineFraction from '$lib/components/FineFraction/FineFraction.svelte';
</script>

<p>
  <strong>Смешанная дробь:</strong>
  <FineFraction whole="3" num="4" den="(5-2)" />
  = 3 + <FineFraction num="4" den="(5-2)" />
</p>

<p>
  <strong>Простая дробь:</strong>
  <FineFraction num="4" den="5" />
</p>

<p>
  <strong>Сложение дробей:</strong>
  <FineFraction num="1" den="4" /> + <FineFraction num="3" den="8" /> = <FineFraction num="5" den="8" />
</p>

<p>
  <strong>Выражение:</strong>
  <FineFraction expr="3+4÷5" />
</p>

-->

<!--
  Компонент для отображения красивых дробей в тексте инструкции.
  Принимает строку с дробью и рендерит её в виде двухэтажной или смешанной дроби.

  Использование:
  <FineFraction expr="3(4÷(5-2))" />  → смешанная дробь
  <FineFraction expr="4÷(5-2)" />     → двухэтажная дробь
  <FineFraction expr="3+4÷(5-2)" />   → сумма с дробью
-->
<!-- src/lib/components/FineFraction/FineFraction.svelte -->
<!--
  Компонент для отображения красивых дробей в тексте инструкции.
  Использует те же токены, что и DisFraction.
  Ничего не вычисляет, только отображает.
-->
<script>
	import {
		parseExpressionToTokens,
		stripMarkers
	} from '$lib/services/math/fractionVisualParser.js';

	let {
		expr = '', // полное выражение
		num = '', // числитель (если дробь отдельно)
		den = '', // знаменатель (если дробь отдельно)
		whole = '' // целая часть (если смешанная дробь)
	} = $props();

	// ===== ОПРЕДЕЛЯЕМ ТОКЕНЫ =====
	// Используем вложенную функцию, чтобы избежать проблем с $derived
	function getTokens() {
		// Если указаны num и den — показываем дробь
		if (num || den) {
			return [
				{
					type: 'fraction',
					whole: whole || undefined,
					num: num || '?',
					den: den || '?'
				}
			];
		}

		// Иначе парсим выражение
		return parseExpressionToTokens(expr);
	}

	// Правильное использование $derived — присваиваем результат функции
	let tokens = $derived(getTokens());
</script>

<div class="fine-fraction">
	{#each tokens as token, index}
		{#if token.type === 'text'}
			{#if token.value === '√'}
				<span class="radical-tick">√</span>
			{:else}
				<span class="math-text">{stripMarkers(token.value)}</span>
			{/if}
		{:else if token.type === 'superscript'}
			<span class="super-exponent">{token.value}</span>
		{:else if token.type === 'fraction'}
			<span class="fraction-block">
				{#if token.whole && token.whole !== '0'}
					<span class="whole-part">{token.whole}</span>
				{/if}
				<span class="fraction-container">
					<span class="num-part">{token.num}</span>
					<span class="fraction-line"></span>
					<span class="den-part">{token.den}</span>
				</span>
			</span>
		{/if}
	{/each}
</div>

<style lang="scss">
	.fine-fraction {
		display: inline-flex;
		align-items: center;
		flex-wrap: wrap;
		font-family: 'Times New Roman', serif;
		font-size: 1.2em;
		vertical-align: middle;
		gap: 1px;
	}

	.math-text {
		font-size: 1em;
		white-space: nowrap;
	}

	.fraction-block {
		display: inline-flex;
		align-items: center;
		vertical-align: middle;
		margin: 0 1px;
	}

	.whole-part {
		font-size: 1.1em;
		margin-right: 2px;
		font-weight: bold;
	}

	.fraction-container {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		vertical-align: middle;
		margin: 0 2px;
		min-width: 20px;
	}

	.num-part,
	.den-part {
		font-size: 0.8em;
		padding: 0 4px;
		text-align: center;
		white-space: nowrap;
	}

	.num-part {
		border-bottom: 2px solid #333;
		padding-bottom: 1px;
	}

	.den-part {
		padding-top: 1px;
	}

	.fraction-line {
		display: none;
	}

	.super-exponent {
		font-size: 0.65em;
		vertical-align: super;
		line-height: 1;
		margin-left: 1px;
	}

	.radical-tick {
		font-size: 1.1em;
		margin-right: 1px;
	}

	.whole-part {
		color: $clr-mint;
		padding-right: 0.5rem;
	}
	.num-part {
		color: rgb(65, 113, 2);
		text-align: center;
		white-space: nowrap;
	}
	.fraction-line {
		display: block;
		width: 100%;
		height: 2px;
		margin: 2px 0;

		background-color: rgb(153, 0, 255);
	}
	.den-part {
		color: $clr-coral;
		text-align: center;
		white-space: nowrap;
	}
</style>
