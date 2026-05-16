<script>
	/**
	 * src/lib/components/Display/FractionDisplay.svelte
	 */
	// @ts-ignore
	import { base } from '$app/paths';

	import { appState } from '$lib/store/appState.svelte.js';
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
					<span class="expr-part">{item.rawExpr} = </span>

					<div class="pseudo-stack-fraction">
						<div class="num-floor">{item.resultNum}</div>
						<div class="fraction-line"></div>
						<div class="den-floor">{item.resultDen}</div>
					</div>
				</div>
			{:else}
				<div class="standard-log-item">{item}</div>
			{/if}
		{/each}
	</div>

	<div class="fraction-input-area">
		{#if appState.fractionData.focus !== 'main'}
			<div class="main-fraction-render">
				{#if appState.fractionData.whole !== '' || appState.fractionData.showWhole || appState.fractionData.focus === 'whole'}
					<button
						type="button"
						class="interactive-zone whole-zone"
						class:focused={appState.fractionData.focus === 'whole'}
						onclick={() => (appState.fractionData.focus = 'whole')}
					>
						{appState.fractionData.whole || '0'}
					</button>
				{/if}

				<div class="fraction-vertical-stack">
					<button
						type="button"
						class="interactive-zone num-zone"
						class:focused={appState.fractionData.focus === 'num'}
						class:error-blank={appState.fractionData.errors.num}
						onclick={() => (appState.fractionData.focus = 'num')}
					>
						{#if appState.fractionData.num === ''}
							<div class="placeholder-rectangle"></div>
						{:else}
							<span class="value-text">{appState.fractionData.num}</span>
						{/if}
					</button>

					<div class="math-line"></div>

					<button
						type="button"
						class="interactive-zone den-zone"
						class:focused={appState.fractionData.focus === 'den'}
						class:error-blank={appState.fractionData.errors.den}
						onclick={() => (appState.fractionData.focus = 'den')}
					>
						{#if appState.fractionData.den === ''}
							<div class="placeholder-rectangle"></div>
						{:else}
							<span class="value-text">{appState.fractionData.den}</span>
						{/if}
					</button>
				</div>
			</div>
		{/if}

		<div class="unified-bottom-line">
			<span class="current-expression">
				{appState.expression || '0'}
			</span>

			<span class="main-display">
				{appState.display}
			</span>
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
		padding: 1rem;
		margin-bottom: 1.5rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: relative;
		bottom: 0;
		background: rgba($clr-bg-darker, 0.3);
		box-shadow:
			$shadow-inset,
			0px 0px 2px 4px rgba($clr-black, 0.5);
		border: 1px solid $clr-slate;
		font-size: 2.5rem;
		text-align: left;
		color: rgba($clr-white, 0.8);
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
		padding-left: 5px;
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
		box-shadow: 0 0 4px rgba($clr-mint, 0.4);
	}

	.interactive-zone {
		// Сброс дефолтных стилей кнопки
		background: none;
		border: none;
		font: inherit;
		color: inherit;
		text-align: inherit;

		// Твои оригинальные стили
		padding: 2px 6px;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 2rem;

		// Убираем синюю обводку браузера при фокусе, так как у нас есть свой .focused
		&:focus-visible {
			outline: none;
		}

		&.focused {
			background: rgba($clr-blue-mid, 0.3);
			box-shadow: 0 0 0 1px $clr-mint-soft;
		}
	}

	// Прямоугольники-плейсхолдеры
	.placeholder-rectangle {
		width: 3.5rem;
		height: 1.5rem;
		border: 2px dashed $clr-slate;
		border-radius: 4px;
		background: rgba($clr-black, 0.2);
		transition: all 0.2s ease;

		.focused & {
			border: 2px solid $clr-mint;
			background: rgba($clr-mint-soft, 0.1);
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
			color: rgba($clr-white, 0.9);
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
		justify-content: space-between;
		align-items: center;
		font-size: 1.1rem;
		font-family: 'Inter', sans-serif;
		color: $clr-slate;
		padding: 0 0.25rem;
		padding-bottom: 1rem;
	}

	.current-expression {
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 60%;
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
</style>
