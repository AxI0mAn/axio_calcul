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
  with POW <FineFraction whole="3" num="4 ²" den="(5-2) ²²" />
</p>

<p>
	Выражение <FineFraction expr="3⥑4÷(5-2)⥏" /> интерпритируется, как
	<strong>Смешанная дробь:</strong>
	<FineFraction whole="3" num="4" den="(5-2)" />
	= 3 + <FineFraction num="4" den="(5-2)" />, где между целой и дробной частью знак сложения. Просто
	дробь <FineFraction expr="4÷5" />
</p>

-->

<!--
  Компонент для отображения красивых дробей в тексте инструкции.
  Использует те же токены, что и DisFraction.
  Ничего не вычисляет, только отображает.

	(3÷5)² — степень всей дроби <FineFraction expr="(3÷5)^2" />
	Степень для знаменателя (например, 1 ÷ 5²) <FineFraction expr="1÷5^2" />
	Смешанная дробь со степенью <FineFraction expr="2(1÷3)^2" />

	√(16÷25) — корень из дроби <FineFraction expr="√(16÷25)" />
	Корень из смешанной дроби <FineFraction expr="√(3(1÷4))" />

	Полное выражение: (3÷5)² + √(16÷25) <FineFraction expr="(3÷5)^2 + √(16÷25)" />
			
-->
<script>
	// src/lib/components/FineFraction/FineFraction.svelte

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
		padding: 0 0.5rem;
		display: inline-flex;
		align-items: center;
		flex-wrap: wrap;
		font-family: 'Times New Roman', serif;
		font-size: 1.2em;
		vertical-align: middle;
		gap: 0.5rem;
		font-size: 1.6rem;
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
		color: $clr-text-main;
		padding-right: 0.5rem;
	}
	.num-part {
		color: $clr-mint-soft;
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
	.super-exponent {
		color: $clr-text-main;
	}
</style>
