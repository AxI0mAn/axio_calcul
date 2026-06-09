<script>
	// src/lib/components/Display/DisFraction/DisFraction.svelte
	// Компонент для отображения вычислений калькулятора дробей

	import { appState } from '$lib/store/appState.svelte.js';
	import {
		parseExpressionToTokens,
		stripMarkers
	} from '$lib/services/math/fractionVisualParser.js';

	let expressionTokens = $derived(parseExpressionToTokens(appState.expression));
	let displayTokens = $derived(parseExpressionToTokens(appState.display));

	//  Ссылки на DOM-элементы в Svelte 5 НЕ должны быть $state()
	let historyContain;

	// Кешируем токенизированную историю, чтобы парсер не дергался на каждый чих в инпуте
	let tokenizedHistory = $derived(
		appState.historySession.map((entry) => {
			if (typeof entry === 'object' && entry.type === 'fractionSteps') {
				return {
					...entry,
					tokenizedSteps: entry.steps.map((step) => parseExpressionToTokens(step))
				};
			}
			return entry;
		})
	);

	$effect(() => {
		const historyLength = appState.historySession.length;
		if (!historyContain || historyLength === 0) return;

		historyContain.scrollTo({
			top: historyContain.scrollHeight,
			behavior: 'smooth'
		});
	});
	// QuickMenu
	// @ts-ignore
	import { page } from '$app/stores';
	import { menuMaps } from '$lib/config/mathMenuMaps.js';
	import QuickMenu from '$lib/components/aBlock/QuickMenu.svelte';

	// Реактивная переменная: проверяем, есть ли для текущего пути карта меню

	let pathPage = $page.url.pathname;

	if (pathPage.endsWith('/') && pathPage !== '/') {
		pathPage = pathPage.slice(0, -1);
	}

	let currentMap = $derived(
		Object.values(menuMaps)
			.flat()
			.some((item) => pathPage.endsWith(item.href))
			? Object.values(menuMaps).find((group) => group.some((item) => pathPage.endsWith(item.href)))
			: null
	);
</script>

<div class="display-box">
	{#if currentMap}
		<div class="quick-nav-container">
			<QuickMenu items={currentMap} />
		</div>
	{:else}
		<div class="now_mode">
			<p>{appState.now_mode}</p>
		</div>
	{/if}
	<!-- Блок истории вычислений -->
	<div class="history-section" bind:this={historyContain}>
		{#each tokenizedHistory as entry}
			{#if typeof entry === 'object' && entry.type === 'fractionSteps'}
				<div class="history-steps-block">
					{#each entry.steps as step, idx}
						<div class="step-line">
							{#if idx > 0}<span class="math-text"> = </span>{/if}

							{#if step === 'ERROR'}
								<span class="math-text notValid">ERROR</span>
							{:else}
								{#each entry.tokenizedSteps[idx] as token, tokenIdx (tokenIdx)}
									{#if token.type === 'text'}
										{#if token.value === '√'}
											<div class="radical-wrapper">
												<span class="radical-tick">√</span>
											</div>
										{:else}
											<span class="math-text">{stripMarkers(token.value)}</span>
										{/if}
									{:else if token.type === 'superscript'}
										<span class="super-exponent">{token.value}</span>
									{:else if token.type === 'fraction'}
										<div
											class="fraction-block {entry.tokenizedSteps[idx][tokenIdx - 1]?.value === '√'
												? 'under-radical'
												: ''}"
										>
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
							{/if}
						</div>
					{/each}
				</div>
			{:else}{/if}
		{/each}
	</div>
	<!-- Блок вычислений -->
	<div class="fraction-input-area">
		{#if appState.expression}
			<div class="expression-line">
				{#each expressionTokens as token, tokenIdx (tokenIdx)}
					{#if token.type === 'text'}
						{#if token.value === '√'}
							<div class="radical-wrapper">
								<span class="radical-tick">√</span>
							</div>
						{:else}
							<span class="math-text">{stripMarkers(token.value)}</span>
						{/if}
					{:else if token.type === 'superscript'}
						<span class="super-exponent">{token.value}</span>
					{:else if token.type === 'fraction'}
						<div
							class="fraction-block {expressionTokens[tokenIdx - 1]?.value === '√'
								? 'under-radical'
								: ''}"
						>
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
		{/if}

		<div class="display-line">
			{#each displayTokens as token, tokenIdx (tokenIdx)}
				{#if token.type === 'text'}
					{#if token.value === '√'}
						<div class="radical-wrapper">
							<span class="radical-tick">√</span>
						</div>
					{:else}
						<span class="math-text">{stripMarkers(token.value)}</span>
					{/if}
				{:else if token.type === 'superscript'}
					<span class="super-exponent">{token.value}</span>
				{:else if token.type === 'fraction'}
					<div
						class="fraction-block {displayTokens[tokenIdx - 1]?.value === '√'
							? 'under-radical'
							: ''}"
					>
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
</div>

<style lang="scss">
	// Полностью наследуем стили основного контейнера из DisText.svelte
	.display-box {
		min-height: 100%;
		max-height: 40vh;
		width: 100%;
		overflow: hidden;
		padding: calc(1rem - 5px);
		margin-bottom: 1.5rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: relative;
		bottom: 0;
		background: rgba($clr-bg-darker-rgb, 0.3);
		box-shadow:
			$shadow-inset,
			0px 0px 2px 4px rgba(0, 0, 0, 0.5);
		border: 1px solid $clr-slate;
		font-size: 2.5rem;
		text-align: left;
		color: rgba(255, 255, 255, 0.8);
	}

	.quick-nav-container {
		position: absolute;
		top: 1px;
		right: 1px;
		z-index: 50;
	}

	.now_mode {
		position: absolute;
		top: 1px;
		right: 1px;
		padding: 0.25rem;
		font-size: 1rem;
		font-weight: 800;
		letter-spacing: 0.2rem;
		color: $clr-mint-soft;
		text-transform: uppercase;
		border: 1px solid $clr-mint-soft;
		border-bottom-left-radius: 0.5rem;
	}

	// ===================НОВЫЕ СТИЛИ

	.fraction-input-area {
		display: flex;
		flex-flow: row wrap;
		justify-content: flex-start;
		align-items: center;

		padding-top: 0.4rem;
		padding-left: 1.2rem;
		border-top: 4px groove rgba($clr-mint-soft-rgb, 0.4);
	}

	// Контейнер строки, где всё выстроено в ряд
	.expression-line,
	.display-line {
		display: flex;
		flex-wrap: wrap;
		align-items: center; // Центрирует операторы (+, -, *, =) строго по центру дроби
		gap: 4px;
		font-family: inherit;
	}

	.history-section {
		flex: 1;
		min-height: 0;
		overflow-y: scroll;
		overflow-x: hidden;
		font-size: 1.25rem;
		line-height: 1.75rem;
		color: $clr-slate;
		margin-bottom: 0.5rem;
		// padding-left: 2px;
		display: flex;
		flex-direction: column;

		div:first-child {
			margin-top: auto;
		}
	}
	.history-steps-block {
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
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
	.math-text {
		font-size: 2rem;
		padding: 0 4px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 4rem; // чтоб отцентрировать по вертикали десятичные дроби
		line-height: 1;
	}
	.expression-line,
	.display-line,
	.step-line {
		// Контекстная корректировка для дробей, чтобы степень не падала на числитель!
		.fraction-block {
			display: inline-flex;
			align-items: center;
			vertical-align: middle;
			position: relative;
			margin: 0 4px;

			// Если степень идет сразу за блоком дроби без скобок (как 1/5 в квадрате)
			+ .super-exponent {
				// Опускаем чуть ниже по сравнению со скобочной степенью
				font-size: 0.75rem;
				transform: translateX(-0.4rem) translateY(0.7em);
				margin-left: 1px;
			}
		}
	}
	$fontSizeFractionPart: 1rem;

	.fraction-container {
		max-width: fit-content;
		display: flex;
		flex-direction: column;
	}
	.math-text,
	.whole-part {
		// === -📝=TODO=📝- ===
		color: $clr-mint;
		font-size: calc(1.5 * $fontSizeFractionPart);
		padding-right: 0.5rem;
	}
	.num-part {
		// === -📝=TODO=📝- ===
		color: rgb(192, 235, 3);
		font-size: $fontSizeFractionPart;
		text-align: center;
		white-space: nowrap; // <--- ЗАПРЕЩАЕМ ВЫВАЛИВАНИЕ СИМВОЛОВ НАВЕРХ
	}
	.fraction-line {
		display: block;
		width: 100%;
		height: 2px;
		margin: 2px 0;

		// === -📝=TODO=📝- ===
		background-color: rgb(153, 0, 255);
		font-size: $fontSizeFractionPart;
	}
	.den-part {
		// === -📝=TODO=📝- ===
		color: $clr-coral;
		font-size: $fontSizeFractionPart;
		text-align: center;
		white-space: nowrap; // <--- УДЕРЖИВАЕМ СИМВОЛЫ НА НИЖНЕМ УРОВНЕ
	}

	.expression-line,
	.display-line {
		.math-text,
		.whole-part {
			font-size: calc(1.75 * $fontSizeFractionPart);
		}
		.num-part,
		.fraction-line,
		.den-part {
			font-size: calc(1.5 * $fontSizeFractionPart);
		}
	}

	// Контейнер для самой галочки корня
	.radical-wrapper {
		display: inline-flex;
		align-items: flex-start;
		height: 100%;
		padding-top: 2px;
		margin-right: -2px; // Прижимаем контент вплотную к галочке
	}

	.radical-tick {
		font-size: 1.45em; // Делаем галочку чуть выше контента
		line-height: 0.9;
		color: $clr-white;
		user-select: none;
	}

	// Элемент (дробь или текст), который находится под корнем
	.under-radical {
		position: relative;
		display: inline-flex !important;
		padding-top: 6px; // Отступ сверху для линии крышки
		padding-left: 2px;
		padding-right: 4px;

		// Сама линия крышки корня
		&::before {
			content: '';
			position: absolute;
			top: 4px; // Выравниваем стык с верхним краем галочки √
			left: 0;
			width: 100%;
			height: 2px; // Толщина крышки корня
			background-color: $clr-white; // Цвет крышки (синхронно с галочкой)
		}
	}

	// Корректировка для дроби под корнем, чтобы убрать лишние смещения
	.fraction-block.under-radical {
		align-items: center;

		.whole-part {
			padding-top: 0; // Коррекция шрифта целой части под линией
		}
	}

	// указатель степени в надстрочном шрифте
	.super-exponent {
		display: inline-block;
		font-size: 0.95rem; /* Немного уменьшаем размер, чтобы выглядело как индекс */
		font-weight: bold;
		line-height: 1;
		color: $clr-mint-soft;
		// Базовый подъем для степени после скобок или обычных чисел
		transform: translateX(-0.4rem) translateY(-0.8em);
		margin-left: 2px; /* Отступ от скобки, чтобы не липла */
		margin-right: 2px; /* Отступ перед знаком равенства */
	}

	.history-section::-webkit-scrollbar {
		width: 4px;
	}
	.history-section::-webkit-scrollbar-thumb {
		background: $clr-blue-mid;
		border-radius: 10px;
	}

	//=====================================
</style>
