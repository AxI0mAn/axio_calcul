<script>
	// src/lib/components/Display/DisFraction/DisFraction.svelte
	// Компонент для отображения вычислений калькулятора дробей

	import { appState } from '$lib/store/appState.svelte.js';
	import {
		parseExpressionToTokens,
		stripMarkers
	} from '$lib/services/math/fractionVisualParser.js';
	import { btnMemo } from '$lib/utils/btnMemo.js';
	import { longpress } from '$lib/actions/longpress.js';

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

	// отображение истории из других режимов
	/**
	 * Возвращает строковое представление записи истории для отображения в дробном режиме,
	 * если это обычная строка (не объект fractionSteps).
	 * Для объектов fractionSteps используется существующая логика токенизации.
	 */
	function getStringEntry(entry) {
		if (typeof entry === 'string') return entry;
		if (entry && entry.type === 'fractionSteps' && Array.isArray(entry.steps)) {
			return entry.steps[entry.steps.length - 1] || '';
		}
		return String(entry);
	}
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
			{#if typeof entry === 'string'}
				<!-- ===== СТРОКОВЫЕ ЗАПИСИ (например, "значение → M1") ===== -->
				{@const hasArrow = entry.includes('→')}
				{@const leftPart = hasArrow ? entry.split('→')[0]?.trim() || '' : entry}
				{@const rightPart = hasArrow ? '→ ' + (entry.split('→')[1]?.trim() || '') : ''}
				{@const leftTokens =
					hasArrow && (leftPart.includes('÷') || leftPart.includes('⥑'))
						? parseExpressionToTokens(leftPart)
						: null}

				<div
					class="history-steps-block"
					use:longpress
					onlongpress={() => btnMemo(null, true, entry)}
				>
					<div class="step-line">
						{#if leftTokens && leftTokens.length > 0}
							<!-- Рендерим дробь через токены -->
							{#each leftTokens as token, tokenIdx (tokenIdx)}
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
						{:else}
							<!-- Если не удалось распарсить - показываем как есть -->
							<span class="math-text">{leftPart}</span>
						{/if}

						{#if rightPart}
							<span class="math-text memo-arrow">{rightPart}</span>
						{/if}
					</div>
				</div>
			{:else if typeof entry === 'object' && entry.type === 'fractionSteps'}
				<!-- ===== ЗАПИСИ С ПОШАГОВЫМ РЕШЕНИЕМ ===== -->
				{@const resultValue = entry.steps?.[entry.steps.length - 1] || ''}
				<div
					class="history-steps-block {entry.steps.length > 2 ? 'is-multistep' : ''}"
					use:longpress
					onlongpress={() => btnMemo(null, true, resultValue)}
				>
					{#if !appState.stepsFraction && entry.steps.length === 2}
						<!-- ===== РЕЖИМ БЕЗ ПОШАГОВОГО РЕШЕНИЯ: 2 шага в одной строке ===== -->
						<div class="step-line single-line">
							<!-- Первый шаг (выражение) -->
							{#each entry.tokenizedSteps[0] as token, tokenIdx (tokenIdx)}
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

							<!-- Второй шаг (результат) -->
							{#each entry.tokenizedSteps[1] as token, tokenIdx (tokenIdx)}
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
					{:else}
						<!-- ===== ПОШАГОВЫЙ РЕЖИМ ИЛИ БОЛЕЕ 2 ШАГОВ: каждый шаг на новой строке ===== -->
						{#each entry.steps as step, idx}
							<div class="step-line">
								{#if idx > 1}
									<span class="math-text equal-prefix"> = </span>
								{/if}

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
												class="fraction-block {entry.tokenizedSteps[idx][tokenIdx - 1]?.value ===
												'√'
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

								{#if idx >= 0 && idx < entry.steps.length - 1}
									<span class="math-text equal-prefix"> = </span>
								{/if}
							</div>
						{/each}
					{/if}
				</div>
			{/if}
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
	$fontSize: 1.1rem;

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
		font-size: $fontSize; //2.5rem;
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
		// ********************
		display: flex;
		flex-flow: row wrap;
		justify-content: flex-start;
		align-items: center;

		// padding-top: 0.4rem;
		// padding-bottom: 0.4rem;
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
		min-height: 4rem;
	}

	.history-section {
		flex: 1;
		min-height: 0;
		overflow-y: scroll;
		overflow-x: hidden;
		// уменьшить шрифт, чтоб больше помещалось в одну строку
		font-size: $fontSize; //1.25rem;
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

	.expression-line,
	.display-line {
		.math-text,
		.whole-part {
			font-size: calc(1.25 * $fontSize);
		}
		.num-part,
		.fraction-line,
		.den-part {
			font-size: calc(1 * $fontSize);
		}
	}

	// Контейнер для самой галочки корня
	.radical-wrapper {
		display: inline-flex;
		flex-flow: column;
		justify-content: center;
		align-items: flex-start;
		height: 100%;
		margin-right: -2px; // Прижимаем контент вплотную к галочке
	}
	.step-line {
		.radical-wrapper {
			height: 4rem; // чтоб отцентрировать по вертикали десятичные дроби
			line-height: 1;
		}
	}

	.radical-tick {
		font-size: calc($fontSize * 2.5); //3rem; // Делаем галочку чуть выше контента
		font-weight: 100;
		line-height: 100%; // 0.9;
		color: $clr-mint;
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

	.history-steps-block.is-multistep {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px; /* Отступ между шагами решения */
		padding: 10px 0;
	}

	.history-steps-block.is-multistep .step-line {
		display: flex;
		align-items: center;
		width: 100%;
	}

	/* Красивое выравнивание знака равенства на новой строке */
	.history-steps-block.is-multistep .equal-prefix {
		margin-right: 8px;
		color: #00ffca; /* Ваш неоновый цвет операторов, если применимо */
		font-weight: bold;
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
