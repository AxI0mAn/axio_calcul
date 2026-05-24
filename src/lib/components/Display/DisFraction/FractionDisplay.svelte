<script>
	/**
	 * src/lib/components/Display/FractionDisplay.svelte
	 */
	// @ts-ignore
	import { base } from '$app/paths';

	import { appState } from '$lib/store/appState.svelte.js';
	import { parseExpressionToHtml } from '$lib/utils/fractionVisualParser.js';
	import { longpress } from '$lib/actions/longpress';
	import { btnMemo } from '$lib/utils/btnMemo';

	import { tick } from 'svelte';

	// История вычислений и автоскролл
	let historyContain = $state();

	$effect(() => {
		const historyLength = appState.historySession.length;
		if (!historyContain || historyLength === 0) return;

		historyContain.scrollTo({
			top: historyContain.scrollHeight,
			behavior: 'smooth'
		});
	});

	// Логика QuickMenu на основе trailing slash
	// @ts-ignore
	import { page } from '$app/stores';
	import { menuMaps } from '$lib/config/menuMaps.js';
	import QuickMenu from '$lib/components/aBlock/QuickMenu.svelte';

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

	<div bind:this={historyContain} class="history-section">
		{#each appState.historySession as item}
			{#if typeof item === 'object' && item.type === 'fraction'}
				<div class="fraction-log-item">
					<span class="expression-line">
						{#each parseExpressionToHtml(item.rawExpr) as token}
							{#if token.type === 'text'}
								<span class="math-text">
									<!-- {token.value} -->
									{token.value.replace(/[\u2951\u294F]/g, '')}
								</span>
							{:else}
								<div class="fraction-block">
									{#if token.whole}<span class="whole-part">{token.whole}</span>{/if}
									<div class="fraction-container">
										<span class="num-part">{token.num}</span>
										<span class="fraction-line"></span>
										<span class="den-part">{token.den}</span>
									</div>
								</div>
							{/if}
						{/each}
						<span class="math-text"> = </span>
					</span>

					<div class="pseudo-stack-fraction">
						<div class="num-floor">{item.resultNum}</div>
						<div class="fraction-line"></div>
						<div class="den-floor">{item.resultDen}</div>
					</div>
				</div>
			{:else if typeof item === 'string' && item.includes('÷')}
				<div class="fraction-log-item expression-line">
					{#each parseExpressionToHtml(item) as token}
						{#if token.type === 'text'}
							<span class="math-text">{token.value}</span>
						{:else}
							<div class="fraction-block">
								{#if token.whole}<span class="whole-part">{token.whole}</span>{/if}
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
				<div class="standard-log-item">{item}</div>
			{/if}
		{/each}
	</div>

	<div class="fraction-input-area">
		<div class="unified-bottom-line">
			{#if appState.expression && appState.expression.trim() !== ''}
				<div class="expression-line">
					{#each parseExpressionToHtml(appState.expression) as token}
						{#if token.type === 'text'}
							<span class="math-text">{token.value}</span>
						{:else}
							<div class="fraction-block">
								{#if token.whole}<span class="whole-part">{token.whole}</span>{/if}
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
				{#each parseExpressionToHtml(appState.display) as token}
					{#if token.type === 'text'}
						<span class="math-text">{token.value}</span>
					{:else}
						<div class="fraction-block">
							{#if token.whole}<span class="whole-part">{token.whole}</span>{/if}
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

		p:first-child {
			margin-top: auto;
		}
		p {
			-webkit-tap-highlight-color: transparent;
			-webkit-touch-callout: none;
			user-select: none;
			touch-action: manipulation;
		}
		.fraction-log-item {
			display: flex;
			flex-flow: row wrap;
			justify-content: flex-start;
			align-items: center;
			gap: 0.2rem;
			padding-left: 5px;
			padding-right: 1rem;
			border-bottom: 1px solid rgba($clr-sky-rgb, 0.7);
			border-right: 1px solid rgba($clr-sky-rgb, 0.7);
			border-bottom-right-radius: 1rem;
			max-width: fit-content;

			.pseudo-stack-fraction {
				max-width: fit-content;
				.num-floor {
					// === -📝=TODO=📝- ===
					color: green;
				}
				.fraction-line {
					height: 2px;
					// === -📝=TODO=📝- ===
					background-color: rgb(153, 0, 255);
				}
				.den-floor {
					// === -📝=TODO=📝- ===
					color: rgb(255, 153, 0);
					text-align: center;
				}
			}
		}
	}

	.history-section::-webkit-scrollbar {
		width: 4px;
	}
	.history-section::-webkit-scrollbar-thumb {
		background: $clr-blue-mid;
		border-radius: 10px;
	}

	// Специфичный UI для интерактивного двухэтажного ввода дробей
	.fraction-input-area {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		gap: 0.5rem;
		border-top: 1px solid $clr-slate;
		padding-top: 0.5rem;
	}

	.main-fraction-render {
		display: flex;
		align-items: center;
		justify-content: flex-end; // Выравнивание калькулятора по правому краю
		gap: 1rem;
		min-height: 5rem;
		font-family: 'Lora', serif;
	}

	.fraction-vertical-stack {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 4.5rem;
	}

	.math-line {
		width: 100%;
		height: 3px;
		background-color: $clr-white;
		margin: 2px 0;
		box-shadow: 0 0 4px rgba($clr-mint-rgb, 0.4);
	}

	.interactive-zone {
		// Сброс дефолтных стилей кнопки
		background: none;
		border: none;
		font: inherit;
		color: inherit;
		text-align: inherit;

		// Oригинальные стили
		padding: 2px 6px;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 2rem;

		// Убираем синюю обводку браузера при фокусе.
		&:focus-visible {
			outline: none;
		}

		&.focused {
			background: rgba($clr-blue-mid-rgb, 0.3);
			box-shadow: 0 0 0 1px $clr-mint-soft;
		}
	}

	// Прямоугольники-плейсхолдеры
	.placeholder-rectangle {
		width: 3.5rem;
		height: 1.5rem;
		border: 2px dashed $clr-slate;
		border-radius: 4px;
		background: rgba(0, 0, 0, 0.2);
		transition: all 0.2s ease;

		.focused & {
			border: 2px solid $clr-mint;
			background: rgba($clr-mint-soft-rgb, 0.1);
		}
	}

	// Вариант 3: Ошибка пустого прямоугольника при операторе или [=]
	.interactive-zone.error-blank {
		.placeholder-rectangle {
			border: 2px solid #dc3545 !important;
			background: rgba(#dc3545, 0.2) !important;
			animation: pulse-error 0.4s infinite alternate;
		}
	}

	.value-text {
		font-size: 2.2rem;
		font-weight: bold;
		color: $clr-white;

		// Числитель и знаменатель делаем чуть компактнее целой части
		.num-zone &,
		.den-zone & {
			font-size: 1.65rem;
			color: rgba(255, 255, 255, 0.9);
		}
	}

	.whole-zone {
		font-size: 2.8rem;
		font-weight: bold;
		color: $clr-mint; // Целая часть выделена основным неоновым цветом
	}

	// Объединенная нижняя строка (Пункт 6)
	.unified-bottom-line {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 0.2rem;
		font-size: 2rem;
		font-family: 'Inter', sans-serif;
		color: $clr-slate;
		padding: 0 0.25rem;
		padding-bottom: 1rem;
		min-height: 5rem;
	}

	.current-expression {
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 60%;
		// === -📝=TODO=📝- ===
		color: orangered;
	}

	.fraction-compact-preview {
		font-weight: bold;
		color: $clr-mint-soft;
		text-align: right;
	}

	@keyframes pulse-error {
		0% {
			box-shadow: 0 0 2px #dc3545;
		}
		100% {
			box-shadow: 0 0 10px #dc3545;
		}
	}
	// ===================НОВЫЕ СТИЛИ

	// Контейнер строки, где всё выстроено в ряд
	.expression-line,
	.display-line {
		display: flex;
		flex-wrap: wrap;
		align-items: center; // Центрирует операторы (+, -, *, =) строго по центру дроби
		gap: 4px;
		font-family: inherit;
	}

	// Стили для обычных знаков (+, -, *, =, пробелы)
	.math-text {
		font-size: 2rem;
		padding: 0 4px;
		color: $clr-white;
	}

	// Общий блок дроби (целое число + сама дробь рядом)
	.fraction-block {
		display: inline-flex;
		align-items: center;
		vertical-align: middle;
	}

	.whole-part {
		font-size: 2.4rem;
		font-weight: bold;
		color: $clr-mint; // Выделяем целую часть смешанного числа твоим неоновым цветом
		margin-right: 2px;
	}

	// Вертикальный стек для числителя, черты и знаменателя
	.fraction-fraction {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0 4px;
		line-height: 1.1;
	}

	.num-part {
		font-size: 1.5rem;
		color: rgba(255, 255, 255, 0.9);
		padding-bottom: 2px;
	}

	// Горизонтальная дробная черта дроби
	.fraction-line {
		display: block;
		width: 100%;
		min-width: 12px;
		height: 2px; // Толщина этажной черты
		background-color: $clr-white;
		margin: 2px 0;
	}

	.den-part {
		font-size: 1.5rem;
		color: rgba(255, 255, 255, 0.9);
		padding-top: 2px;
	}

	//=====================================
</style>
