<!-- src/lib/components/testFraction/DevTestRunner.svelte -->
<!-- src/lib/components/testFraction/DevTestRunner.svelte -->
<script>
	import { onMount } from 'svelte';
	import { testMatrix } from './testMatrix.js';
	import { runAllTests, checkRegression } from './calculatorEngineTest.js';

	// ===== СОСТОЯНИЕ =====
	let results = $state([]);
	let isRunning = $state(false);
	let lastRunTime = $state(null);
	let previousResults = $state([]);
	let regressionReport = $state(null);
	let showOnlyFails = $state(false);
	let filterText = $state('');
	let isVisible = $state(false); // ← Управление видимостью

	// ===== ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ =====
	function getStats() {
		const total = results.length;
		const passed = results.filter((r) => r.passed).length;
		const failed = total - passed;
		const duration = results.reduce((sum, r) => sum + r.duration, 0);
		return { total, passed, failed, duration };
	}

	function getFilteredResults() {
		if (!filterText && !showOnlyFails) return results;

		return results.filter((r) => {
			const matchInput = r.input.toLowerCase().includes(filterText.toLowerCase());
			const matchId = String(r.id).includes(filterText);
			const match = matchInput || matchId;

			if (showOnlyFails) {
				return !r.passed && match;
			}
			return match;
		});
	}

	// ===== ДЕЙСТВИЯ =====
	async function runTests() {
		isRunning = true;
		results = [];
		regressionReport = null;

		// Сохраняем предыдущие результаты для проверки регрессии
		if (results.length > 0) {
			previousResults = [...results];
		}

		// Даем UI время обновиться
		await new Promise((resolve) => setTimeout(resolve, 100));

		const startTime = performance.now();
		results = runAllTests();
		const endTime = performance.now();

		lastRunTime = Math.round(endTime - startTime);
		isRunning = false;

		// Проверяем регрессию
		if (previousResults.length > 0) {
			regressionReport = checkRegression(previousResults, results);
		}

		// Логируем результаты в консоль
		const stats = getStats();
		console.log('📊 [TEST] Результаты тестирования:');
		console.log(`✅ Пройдено: ${stats.passed}/${stats.total}`);
		console.log(`❌ Провалено: ${stats.failed}/${stats.total}`);
		console.log(`⏱️ Время: ${lastRunTime}ms`);

		if (stats.failed > 0) {
			console.log('❌ Проваленные тесты:');
			results
				.filter((r) => !r.passed)
				.forEach((r) => {
					console.log(`  Тест ${r.id}: "${r.input}" → "${r.actual}" (ожидалось: "${r.expected}")`);
				});
		}

		if (regressionReport && regressionReport.newFails.length > 0) {
			console.warn('⚠️ [REGRESSION] Обнаружены новые падения!');
			regressionReport.newFails.forEach((r) => {
				console.warn(`  Тест ${r.id}: "${r.input}" → "${r.actual}" (было: "${r.expected}")`);
			});
		}
	}

	function clearResults() {
		results = [];
		regressionReport = null;
		previousResults = [];
	}

	function copyResultsToClipboard() {
		const text = results
			.map((r) => {
				const status = r.passed ? '✅' : '❌';
				return `${status} Тест ${r.id}: "${r.input}" → "${r.actual}" ${r.passed ? '' : '(ожидалось: "' + r.expected + '")'}`;
			})
			.join('\n');

		navigator.clipboard.writeText(text);
	}

	function toggleVisibility() {
		isVisible = !isVisible;
	}

	// ===== ВЫЧИСЛЯЕМЫЕ ПЕРЕМЕННЫЕ =====
	const stats = $derived(getStats());
	const filteredResults = $derived(getFilteredResults());
</script>

<div class="test-container">
	<!-- КНОПКА ТОГГЛА -->
	<button class="toggle-btn" onclick={toggleVisibility}>
		{isVisible ? '🔽 Скрыть тесты' : '🔼 Показать тесты'}
		<span class="badge"
			>{results.length > 0 ? `${getStats().passed}/${getStats().total}` : '🧪'}</span
		>
	</button>

	{#if isVisible}
		<div class="test-runner">
			<div class="header">
				<h3>🧪 Автоматический прогон ({testMatrix.length} тестов)</h3>
				<div class="controls">
					<button onclick={runTests} disabled={isRunning} class="run-btn">
						{isRunning ? '🔄 Запуск...' : '▶️ Запустить тесты'}
					</button>
					<button onclick={clearResults} disabled={results.length === 0} class="clear-btn">
						🗑️ Очистить
					</button>
					<button onclick={copyResultsToClipboard} disabled={results.length === 0} class="copy-btn">
						📋 Копировать
					</button>
				</div>
			</div>

			<div class="stats">
				<span class="total">📊 Всего: {stats.total}</span>
				<span class="passed">✅ Пройдено: {stats.passed}</span>
				<span class="failed">❌ Провалено: {stats.failed}</span>
				<span class="duration">⏱️ {lastRunTime ?? '—'}ms</span>
				<span class="passed-percent">
					{stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0}%
				</span>
			</div>

			{#if regressionReport && regressionReport.newFails.length > 0}
				<div class="regression-warning">
					⚠️ Обнаружена регрессия! {regressionReport.newFails.length} тестов перестали проходить.
				</div>
			{/if}

			<div class="filters">
				<label>
					<input type="checkbox" bind:checked={showOnlyFails} />
					Показать только проваленные
				</label>
				<input
					type="text"
					placeholder="Фильтр по ID или выражению..."
					bind:value={filterText}
					class="filter-input"
				/>
			</div>

			<div class="grid">
				{#each filteredResults as test}
					<div class="test-card {test.passed ? 'pass' : 'fail'}">
						<div class="test-header">
							<span class="test-id">#{test.id}</span>
							<span class="test-status">{test.passed ? '✅' : '❌'}</span>
							<span class="test-duration">{test.duration}ms</span>
						</div>
						<div class="test-input">
							<code>{test.input}</code>
						</div>
						<div class="test-result">
							➔ <span class="actual">{test.actual}</span>
							{#if !test.passed}
								<span class="expected">(ожидалось: {test.expected})</span>
							{/if}
						</div>
					</div>
				{:else}
					<div class="no-results">
						{#if results.length === 0}
							Нажмите "Запустить тесты" для начала
						{:else}
							Нет тестов, соответствующих фильтру
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.test-container {
		position: fixed;
		bottom: 20px;
		right: 20px;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.toggle-btn {
		background: #2a2a4a;
		color: #e0e0e0;
		border: 1px solid #444;
		padding: 8px 16px;
		border-radius: 8px;
		cursor: pointer;
		font-size: 14px;
		font-family: 'Courier New', monospace;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		gap: 8px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
	}

	.toggle-btn:hover {
		background: #3a3a5a;
		border-color: #666;
	}

	.badge {
		background: #1a1a2e;
		padding: 2px 8px;
		border-radius: 12px;
		font-size: 11px;
		color: #64b5f6;
	}

	.test-runner {
		background: #1a1a2e;
		color: #e0e0e0;
		padding: 20px;
		border-radius: 8px;
		font-family: 'Courier New', monospace;
		font-size: 13px;
		max-height: 500px;
		width: 600px;
		overflow-y: auto;
		border: 1px solid #333;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
		margin-top: 8px;
		transition: all 0.3s ease;
		resize: vertical;
	}

	.test-runner:hover {
		border-color: #555;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
		flex-wrap: wrap;
		gap: 8px;
	}

	.header h3 {
		margin: 0;
		font-size: 16px;
		color: #fff;
	}

	.controls {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.controls button {
		padding: 4px 12px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 12px;
		font-family: inherit;
		transition: all 0.2s;
		border: 1px solid #444;
	}

	.run-btn {
		background: #1a3a1a;
		color: #4caf50;
	}

	.run-btn:hover:not(:disabled) {
		background: #2a4a2a;
		border-color: #4caf50;
	}

	.clear-btn {
		background: #3a1a1a;
		color: #ef5350;
	}

	.clear-btn:hover:not(:disabled) {
		background: #4a2a2a;
		border-color: #ef5350;
	}

	.copy-btn {
		background: #1a1a3a;
		color: #64b5f6;
	}

	.copy-btn:hover:not(:disabled) {
		background: #2a2a4a;
		border-color: #64b5f6;
	}

	.controls button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.stats {
		display: flex;
		gap: 16px;
		margin-bottom: 12px;
		padding: 8px 12px;
		background: #0d0d1a;
		border-radius: 4px;
		flex-wrap: wrap;
	}

	.stats .passed {
		color: #4caf50;
	}
	.stats .failed {
		color: #f44336;
	}
	.stats .total {
		color: #64b5f6;
	}
	.stats .duration {
		color: #ffb74d;
	}
	.stats .passed-percent {
		color: #fff;
		font-weight: bold;
		margin-left: auto;
	}

	.regression-warning {
		background: #3a1e1e;
		border: 1px solid #f44336;
		padding: 8px 12px;
		border-radius: 4px;
		margin-bottom: 12px;
		color: #ff6b6b;
		font-weight: bold;
	}

	.filters {
		display: flex;
		gap: 16px;
		margin-bottom: 12px;
		align-items: center;
		flex-wrap: wrap;
	}

	.filters label {
		display: flex;
		align-items: center;
		gap: 6px;
		cursor: pointer;
		color: #aaa;
	}

	.filter-input {
		background: #0d0d1a;
		border: 1px solid #333;
		color: #e0e0e0;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 12px;
		font-family: inherit;
		flex: 1;
		min-width: 150px;
	}

	.filter-input:focus {
		outline: none;
		border-color: #64b5f6;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 6px;
		max-height: 300px;
		overflow-y: auto;
	}

	.test-card {
		padding: 8px 10px;
		border-radius: 4px;
		font-size: 12px;
		background: #0d0d1a;
		border-left: 4px solid #444;
		transition: all 0.2s;
	}

	.test-card:hover {
		background: #1a1a2e;
	}

	.test-card.pass {
		border-left-color: #4caf50;
		background: #0d1a0d;
	}

	.test-card.fail {
		border-left-color: #f44336;
		background: #1a0d0d;
	}

	.test-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 2px;
		font-size: 11px;
		color: #888;
	}

	.test-id {
		font-weight: bold;
		color: #64b5f6;
	}

	.test-input code {
		background: #0a0a0a;
		padding: 1px 4px;
		border-radius: 2px;
		font-size: 12px;
		color: #ffd54f;
		word-break: break-all;
	}

	.test-result {
		margin-top: 2px;
		font-size: 12px;
	}

	.test-result .actual {
		font-weight: bold;
		color: #81c784;
	}

	.test-card.fail .test-result .actual {
		color: #ef5350;
	}

	.test-result .expected {
		display: block;
		color: #ffb74d;
		font-size: 11px;
		margin-top: 2px;
	}

	.no-results {
		grid-column: 1 / -1;
		text-align: center;
		padding: 20px;
		color: #666;
	}

	/* Стили для скроллбара */
	.grid::-webkit-scrollbar,
	.test-runner::-webkit-scrollbar {
		width: 6px;
	}

	.grid::-webkit-scrollbar-track,
	.test-runner::-webkit-scrollbar-track {
		background: #0d0d1a;
	}

	.grid::-webkit-scrollbar-thumb,
	.test-runner::-webkit-scrollbar-thumb {
		background: #333;
		border-radius: 3px;
	}

	.grid::-webkit-scrollbar-thumb:hover,
	.test-runner::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
</style>
