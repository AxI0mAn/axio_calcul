<script>
	import { appStore } from '$lib/store/appStore.svelte';

	// Константы для выбора
	const languages = ['RU', 'EN', 'UA', 'PT', 'ES'];
	const fontSizes = [
		{ label: 'Mini', value: 14 },
		{ label: 'Norm', value: 16 },
		{ label: 'Max', value: 18 }
	];
</script>

<h1 class="header">settings</h1>
<div class="settings-page">
	<section class="setting-group">
		<span class="label">Цветовая тема</span>
		<div class="radio-group">
			<label class="radio-item">
				<input type="radio" bind:group={appStore.theme} value="light" />
				<span class="btn-check">Light</span>
			</label>
			<label class="radio-item">
				<input type="radio" bind:group={appStore.theme} value="dark" />
				<span class="btn-check">Dark</span>
			</label>
		</div>
	</section>

	<section class="setting-group">
		<span class="label">Язык интерфейса</span>
		<select bind:value={appStore.lang} class="custom-select">
			{#each languages as l}
				<option value={l}>{l}</option>
			{/each}
		</select>
	</section>

	<section class="setting-group">
		<span class="label">Размер текста</span>
		<div class="radio-group">
			{#each fontSizes as fs}
				<label class="radio-item">
					<input type="radio" bind:group={appStore.fontSize} value={fs.value} />
					<span class="btn-check">{fs.label}</span>
				</label>
			{/each}
		</div>
	</section>

	<section class="setting-group">
		<div class="label-row">
			<span class="label">Точность знаков</span>
			<span class="value-badge">{appStore.toFix}</span>
		</div>
		<input type="range" min="0" max="12" bind:value={appStore.toFix} class="custom-range" />
	</section>

	<section class="setting-group">
		<div class="label-row">
			<span class="label">Лимит истории</span>
			<span class="value-badge">{appStore.historyLocal}</span>
		</div>
		<input type="range" min="1" max="20" bind:value={appStore.historyLocal} class="custom-range" />
	</section>
</div>

<style lang="scss">
	.settings-page {
		color: $clr-sky; // #00d1ff
		padding: 20px;
		font-family: sans-serif;
		min-height: 100vh;
	}

	.header {
		color: $clr-coral;
		font-size: 3rem;
		display: inline-block;
		padding: 1rem 2rem;
		margin-bottom: 2rem;
	}

	.setting-group {
		margin: 0 auto;
		max-width: 50vmin;
		margin-bottom: 25px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.label {
		color: $clr-slate; // вместо #aaa
		font-size: 0.85rem;
		text-transform: uppercase;
	}

	.label-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.value-badge {
		color: $clr-text-main;
		background: $clr-bg-darker; // вместо #1a202c
		padding: 2px 10px;
		border: 1px solid $clr-sky;
		border-radius: 4px;
		box-shadow: 0 0 10px rgba($clr-sky-rgb, 0.3);
	}

	/* Стилизация Radio как кнопок */
	.radio-group {
		display: flex;
		gap: 10px;
	}

	.radio-item input {
		display: none;
	}

	.btn-check {
		display: block;
		padding: 10px 20px;
		// Используем градиент из переменных или на его основе
		background: linear-gradient(180deg, $clr-blue-mid 0%, $clr-bg-darker 100%);
		border: 1px solid $clr-blue-hover; // вместо #3d4655
		border-radius: 6px;
		color: $clr-text-main;
		cursor: pointer;
		text-align: center;
		min-width: 70px;
		transition: 0.2s;
	}

	.radio-item input:checked + .btn-check {
		border-color: $clr-sky;
		box-shadow: inset 0 0 10px rgba($clr-sky-rgb, 0.5);
		color: $clr-sky;
	}

	/* Стилизация Range (Ползунок) */
	.custom-range {
		-webkit-appearance: none;
		margin: 0 auto;
		width: 50vmin;
		height: 6px;
		background: $clr-blue-mid; // вместо #2c3440
		border-radius: 3px;
		outline: none;
	}

	.custom-range::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 20px;
		height: 20px;
		background: $clr-sky;
		border-radius: 50%;
		cursor: pointer;
		box-shadow: 0 0 10px $clr-sky;
	}

	/* Стилизация Select */
	.custom-select {
		min-width: fit-content;
		max-width: 25vmin;
		background: $clr-blue-mid;
		color: $clr-text-main;
		border: 1px solid $clr-blue-hover;
		padding: 10px;
		border-radius: 6px;
		outline: none;

		&:focus {
			border-color: $clr-sky;
		}
	}

	@media (max-height: 500px) and (orientation: landscape),
		(max-width: 500px) and (orientation: portrait) {
		.header {
			font-size: 2rem;
		}
	}
</style>
