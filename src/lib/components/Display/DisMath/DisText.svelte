<script>
	/**
	 *  src/lib/components/Display/DisText.svelte
	 * текстовый дисплей для группы математических страниц
	 */
	// @ts-ignore
	import { base } from '$app/paths';

	import { appState } from '$lib/store/appState.svelte.js';
	import { longpress } from '$lib/actions/longpress';
	import { btnMemo } from '$lib/utils/btnMemo';

	import { tick } from 'svelte';

	// history
	let historyContain = $state(); // В Svelte 5 ссылки на элементы тоже можно инициализировать через $state

	$effect(() => {
		// Явно указываем зависимость. Эффект сработает при каждом изменении длины.
		const historyLength = appState.historySession.length;

		// Если истории нет или элемент еще не привязан, ничего не делаем
		if (!historyContain || historyLength === 0) return;

		// Svelte 5 запускает эффекты после обновления DOM,
		// поэтому scrollHeight уже будет актуальным.
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
	<div bind:this={historyContain} class="history-section">
		<!-- {#each appState.historySession as entry}
			<p>{entry}</p>
		{/each} -->
		{#each appState.historySession as entry}
			<p use:longpress onlongpress={() => btnMemo(null, true, entry)}>
				{entry}
			</p>
		{/each}
	</div>
	<div class="currentAction">
		<!-- Текущее выражение -->
		<p class="current-expression">{appState.expression}</p>

		<!-- Текущий ввод/результат
		 -->

		<p
			class="main-display"
			class:long-text={appState.display.length > 15}
			class:extra-long-text={appState.display.length > 19}
		>
			{appState.display}
		</p>
	</div>
</div>

<style lang="scss">
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

		position: relative; // Контейнер для позиционирования меню
		bottom: 0;

		// Используем темно-синюю базу с прозрачностью
		background: rgba($clr-bg-darker-rgb, 0.3);

		box-shadow:
			$shadow-inset,
			// Наш готовый мятный инсет
			0px 0px 2px 4px rgba(0, 0, 0, 0.5);

		// Цвет рамки дисплея (был #99c3fd - это светлый серо-голубой)
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

		// Мятный акцент для режима
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

		// Второстепенный текст истории
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
			padding: 4px;
			padding-left: 4px;
			padding-right: 1rem;
			border-bottom: 1px solid rgba($clr-sky-rgb, 0.7);
			border-right: 1px solid rgba($clr-sky-rgb, 0.7);
			border-bottom-right-radius: 1rem;
			max-width: fit-content;
		}
	}

	// Стилизация скроллбара
	.history-section::-webkit-scrollbar {
		width: 4px;
	}
	.history-section::-webkit-scrollbar-thumb {
		// Темная деталь скролла
		background: $clr-blue-mid;
		border-radius: 10px;
	}

	.current-expression {
		flex-shrink: 0;
		padding: 0.25rem;
		font-size: 2rem;
		color: $clr-slate;
		margin: 0;
		min-height: 2.5rem;
		border-top: 1px solid $clr-slate;
	}

	.main-display {
		flex-shrink: 0;
		font-size: 3rem;
		margin: 0;

		// Основной результат (зеленоватый неон)
		color: $clr-mint;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
		transition: font-size 0.2s ease;
	}

	.long-text {
		font-size: 2.5rem;
	}

	.extra-long-text {
		font-size: 1.75rem;
	}

	// дроби
</style>
