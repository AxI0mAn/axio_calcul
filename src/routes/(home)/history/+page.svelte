<script>
	// @ts-ignore
	import { base } from '$app/paths';
	import BtnBack from '$lib/components/Btn/BtnBack.svelte';
	import { historyStore } from '$lib/store/historyStore.svelte';
	import { appState } from '$lib/store/appState.svelte.js';
	import { longpress } from '$lib/actions/longpress.js';
	import {
		parseExpressionToTokens,
		stripMarkers
	} from '$lib/services/math/fractionVisualParser.js';

	/**
	 * Проверяет, является ли запись объектом fractionSteps
	 */
	function isFractionSteps(item) {
		return (
			typeof item === 'object' &&
			item !== null &&
			item.type === 'fractionSteps' &&
			Array.isArray(item.steps)
		);
	}

	/**
	 * Получает значение для сохранения в память (последний шаг)
	 */
	function getResultValue(item) {
		if (isFractionSteps(item)) {
			return item.steps[item.steps.length - 1] || '';
		}
		return String(item);
	}

	/**
	 * Получает отображаемое значение для обычных строк (не дробей)
	 */
	function getDisplayValue(item) {
		if (typeof item === 'string') return item;
		return String(item);
	}
</script>

<header class="header">
	<BtnBack />
	<h1 class="headerSlogan">history of calculated</h1>
</header>

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
						{#if isFractionSteps(line)}
							{@const steps = line.steps}
							{@const firstStep = steps[0] || ''}
							{@const lastStep = steps[steps.length - 1] || ''}
							{@const firstTokens = parseExpressionToTokens(firstStep)}
							{@const lastTokens = parseExpressionToTokens(lastStep)}
							{@const resultValue = getResultValue(line)}

							<li
								use:longpress
								onlongpress={() => {
									appState.pendingMemoryValue = resultValue;
									appState.isMemoModalOpen = true;
								}}
							>
								<div class="history-steps-block">
									<div class="step-line">
										<!-- Первый шаг (условие) -->
										{#each firstTokens as token, tokenIdx (tokenIdx)}
											{#if token.type === 'text'}
												{#if token.value === '√'}
													<span class="radical-tick">√</span>
												{:else}
													<span class="math-text">{stripMarkers(token.value)}</span>
												{/if}
											{:else if token.type === 'superscript'}
												<span class="super-exponent">{token.value}</span>
											{:else if token.type === 'fraction'}
												<div class="fraction-block">
													{#if token.whole && token.whole !== '0'}
														<span class="whole-part">{token.whole}</span>
													{/if}
													<div class="fraction-container">
														<span class="num-part">{token.num}</span>
														<span class="fraction-line"></span>
														<span class="den-part">{token.den}</span>
													</div>
												</div>
											{/if}
										{/each}

										<!-- Знак равенства -->
										<span class="math-text equal-prefix"> = </span>

										<!-- Последний шаг (результат) -->
										{#each lastTokens as token, tokenIdx (tokenIdx)}
											{#if token.type === 'text'}
												{#if token.value === '√'}
													<span class="radical-tick">√</span>
												{:else}
													<span class="math-text">{stripMarkers(token.value)}</span>
												{/if}
											{:else if token.type === 'superscript'}
												<span class="super-exponent">{token.value}</span>
											{:else if token.type === 'fraction'}
												<div class="fraction-block">
													{#if token.whole && token.whole !== '0'}
														<span class="whole-part">{token.whole}</span>
													{/if}
													<div class="fraction-container">
														<span class="num-part">{token.num}</span>
														<span class="fraction-line"></span>
														<span class="den-part">{token.den}</span>
													</div>
												</div>
											{/if}
										{/each}
									</div>
								</div>
							</li>
						{:else}
							<!-- Обычные строки (не дроби) -->
							<li>{getDisplayValue(line)}</li>
						{/if}
					{/each}
				</ul>
			</div>
		{/each}
	{/if}
</div>

<style lang="scss">
	$fontSize: 1rem;

	.history-container {
		margin: 0 auto;
		max-width: 100vmin;
		color: $clr-sky;
		padding: 20px;
		font-family: sans-serif;
		min-height: 100vh;
	}

	.header {
		display: flex;
		flex-flow: row wrap;
		justify-content: flex-start;
		align-items: center;
		padding: 2rem;
		gap: 2rem;

		.headerSlogan {
			color: $clr-coral;
			font-size: 3rem;
			display: inline-block;
		}
	}
	@media (max-height: 500px) and (orientation: landscape),
		(max-width: 500px) and (orientation: portrait) {
		.headerSlogan {
			font-size: 2rem;
		}
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
		border-bottom: 1px solid rgba($clr-slate, 0.1);
		&:last-child {
			border-bottom: none;
		}
	}

	.history-steps-block {
		display: flex;
		flex-flow: row wrap;
		justify-content: flex-start; //center;
		align-items: center;
		gap: 0.2rem;
		padding: 4px 8px 4px 4px;
		max-width: fit-content;
		-webkit-tap-highlight-color: transparent;
		-webkit-touch-callout: none;
		user-select: none;
		touch-action: manipulation;
		border-bottom: 1px solid $clr-mint-soft;
		border-right: 1px solid rgba($clr-mint-soft-rgb, 0.4);
		border-bottom-right-radius: 0.5rem;
	}
	.step-line {
		display: flex;
		flex-flow: row wrap;
		justify-content: flex-start;
		align-items: stretch;
		gap: 0.2rem;
		padding-left: 4px;
		max-width: fit-content;
		min-height: 100%;
	}

	// Стили для обычных знаков (+, -, *, =, пробелы) и десятичных дробей
	.math-text,
	.radical-wrapper {
		font-size: $fontSize; //2rem;
		padding: 0 4px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 4rem; // чтоб отцентрировать по вертикали десятичные дроби
		line-height: 1;
	}

	// Контекстная корректировка для дробей, чтобы степень не падала на числитель!
	.expression-line,
	.display-line,
	.step-line {
		.fraction-block {
			display: inline-flex;
			align-items: center;
			vertical-align: middle;
			position: relative;
			margin: 0 4px;
		}

		// указатель степени в надстрочном шрифте
		.super-exponent {
			display: inline-block;
			font-size: calc(
				$fontSize * 0.6
			); //0.8rem; /* Немного уменьшаем размер, чтобы выглядело как индекс */
			font-weight: 500;
			line-height: 1;
			color: $clr-white;
			// Базовый подъем для степени после скобок или обычных чисел
			// transform: translateX(-0.4rem) translateY(-0.8em);
			margin-left: 2px; /* Отступ от скобки, чтобы не липла */
			margin-right: 2px; /* Отступ перед знаком равенства */
		}

		// Если степень идет сразу за блоком дроби без скобок (как 1/5 , где 5 в квадрате)
		// .fraction-block + .super-exponent {
		// 	// Опускаем чуть ниже по сравнению со скобочной степенью
		// 	transform: translateX(-0.35rem) translateY(0.5rem);
		// 	margin-left: 1px;
		// }
	}

	// степень после скобки или целого числа в строке ввода
	.expression-line,
	.display-line {
		.math-text + .super-exponent {
			transform: translateX(-0.5rem) translateY(-0.95rem);
		}
	}

	// степень после скобки или целого числа в истории
	.step-line {
		.math-text + .super-exponent {
			transform: translateX(-0.5rem) translateY(0.95rem);
		}
	}

	// степень для знаменателя в истории
	.step-line {
		// Если степень идет сразу за блоком дроби без скобок (как 1/5 в квадрате)
		.fraction-block + .super-exponent {
			// Опускаем чуть ниже по сравнению со скобочной степенью
			transform: translateX(-0.35rem) translateY(2.25rem);
			margin-left: 1px;
		}
	}

	// стили к контейнеру .num-part и .den-part, для решения Проблема: юникодные символы верхнего индекса ¹²³ отображаются корректно, а ⁴⁵⁶⁷⁸⁹⁰ – ниже и менее жирно.

	.fraction-block {
		.num-part,
		.den-part {
			font-family: inherit; //system-ui, sans-serif; // или любой другой шрифт с хорошей поддержкой юникода
			font-weight: 300; // подберите под основной текст
		}
	}

	.fraction-container {
		max-width: fit-content;
		display: flex;
		flex-direction: column;
	}
	.math-text,
	.whole-part {
		color: $clr-mint;
		font-size: calc(1.25 * $fontSize);
		padding-right: 0.5rem;
	}
	.num-part {
		color: rgb(192, 235, 3);
		font-size: $fontSize;
		text-align: center;
		white-space: nowrap; // <--- ЗАПРЕЩАЕМ ВЫВАЛИВАНИЕ СИМВОЛОВ НАВЕРХ
	}
	.fraction-line {
		display: block;
		width: 100%;
		height: 2px;
		margin: 2px 0;

		background-color: rgb(153, 0, 255);
		font-size: $fontSize;
	}
	.den-part {
		color: $clr-coral;
		font-size: $fontSize;
		text-align: center;
		white-space: nowrap; // <--- УДЕРЖИВАЕМ СИМВОЛЫ НА НИЖНЕМ УРОВНЕ
	}
</style>
