<script>
	/**
	 *  src/lib/components/Display/DisText.svelte
	 */

	import { appState } from '$lib/store/appState.svelte.js';
	import { longpress } from '$lib/actions/longpress';
	import { btnMemo } from '$lib/utils/btnMemo';

	import { tick } from 'svelte';

	let historyContain; // Ссылка на div с историей
	$effect(() => {
		appState.historySession.length; // следим за добавлением новой строки в историю

		// Используем async, чтобы дождаться tick
		const scrollToBottom = async () => {
			await tick(); // Ждем, пока новый <div> добавится в DOM и высота обновится
			if (historyContain) {
				historyContain.scrollTo({
					top: historyContain.scrollHeight,
					behavior: 'smooth'
				});
			}
		};

		scrollToBottom();
	});
</script>

<div class="display-box">
	<div class="now_mode">
		<p>{appState.now_mode}</p>
	</div>
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

		<!-- Текущий ввод/результат -->
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
		min-height: 100%; // 180px;
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

		background: rgba(2, 17, 85, 0.3);
		box-shadow:
			inset 4px 4px 8px 4px rgba(1, 217, 195, 0.33),
			inset -4px -4px 8px 4px rgba(1, 217, 195, 0.33),
			0px 0px 2px 4px rgba(0, 0, 0, 0.5);

		// border-radius: 0.75rem;
		// margin-bottom: 1.5rem;
		border: 1px solid #99c3fd;

		font-size: 2.5rem;
		text-align: left;
		color: rgba(220, 224, 230, 0.8);
	}

	.now_mode {
		position: absolute;
		top: 1px;
		right: 1px;
		padding: 0.25rem;
		font-size: 1rem;
		font-weight: 800;
		letter-spacing: 0.2rem;
		color: #86edf2;
		text-transform: uppercase;
		border: 1px solid #86edf2;
		border-bottom-left-radius: 0.5rem;
	}

	.history-section {
		flex: 1;
		min-height: 0;
		overflow-y: scroll;
		overflow-x: hidden;

		font-size: 1.25rem;
		line-height: 1.75rem;
		color: #94a3b8;

		margin-bottom: 0.5rem;
		padding-left: 5px;

		display: flex;
		flex-direction: column;
		// justify-content: flex-end; // это ломает скролл

		p:first-child {
			margin-top: auto;
		}
	}
	// Стилизация для скроллбара в history-section

	.history-section::-webkit-scrollbar {
		width: 4px;
	}
	.history-section::-webkit-scrollbar-thumb {
		background: #334155;
		border-radius: 10px;
	}

	.current-expression {
		flex-shrink: 0; // ГАРАНТИРУЕТ, что эти блоки не будут сжиматься или уезжать
		padding: 0.25rem;
		font-size: 2rem;
		color: #94a3b8;
		margin: 0;
		min-height: 2.5rem;
		border-top: 1px solid #94a3b8;
		// border-bottom: 1px solid #94a3b8;
	}

	.main-display {
		flex-shrink: 0; // ГАРАНТИРУЕТ, что эти блоки не будут сжиматься или уезжать
		font-size: 3rem;
		margin: 0;
		color: #4ade80;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
		transition: font-size 0.2s ease; /* Плавное уменьшение если текст длинный*/
	}

	.long-text {
		font-size: 2.5rem; /* Уменьшаем шрифт для чисел > 10 знаков */
	}

	.extra-long-text {
		font-size: 1.75rem; /* Еще меньше для очень длинных чисел */
	}
</style>
