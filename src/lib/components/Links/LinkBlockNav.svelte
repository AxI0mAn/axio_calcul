<script>
	// @ts-ignore
	import { base } from '$app/paths';
	import { handleScroll } from '$lib/utils/handleScroll';

	import Catalog from '$lib/assets/svgIcon/catalog.svg?raw';
	import History from '$lib/assets/svgIcon/history.svg?raw';
	import Info from '$lib/assets/svgIcon/info.svg?raw';

	import InstallReady from '$lib/components/Links/LinkInstallReady.svelte';
</script>

<div class="rowLinks">
	<a href="{base}/#catalogAllFeatures" class="btn btn__interface" aria-label="Catalog"
		>{@html Catalog}</a
	>

	<a
		href="#instruction"
		onclick={(e) => handleScroll(e, '.instruction')}
		class="btn btn__interface"
		aria-label="Info"
	>
		{@html Info}
	</a>

	<a href="{base}/history" class="btn btn__interface" aria-label="History">{@html History}</a>
	<InstallReady />
</div>

<style lang="scss">
	.rowLinks {
		padding: 8px;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 4px;
	}

	.btn__interface {
		// Сброс стилей ссылки
		text-decoration: none;

		// БЫЛО: #b6d9ff (чистый цвет)
		// СТАЛО: переменная, отвечающая за второстепенный/приглушенный текст
		color: $clr-slate;

		display: flex;
		align-items: center;
		justify-content: center;

		background-color: transparent;
		border-radius: 8px;

		// Рамка в цвет неона
		border: 1px solid $clr-mint;

		aspect-ratio: 1 / 1;
		transition:
			transform 0.1s,
			background-color 0.2s;

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				transition: all 0.15s;
				color: $clr-mint;
			}
		}

		// --- Active ---
		&:active {
			-webkit-tap-highlight-color: transparent;
			outline: none;

			opacity: 0.8;

			// Инверсия цвета при нажатии
			color: $clr-bg-card;

			// БЫЛО: #344e66 (хардкод)
			// СТАЛО: наш синий из палитры кнопок (blue-mid или blue-light)
			background-color: $clr-blue-light;

			transform: scale(0.96) translateY(0.5px);

			// Тени через системные переменные
			box-shadow:
				0 0 2px $shd-blue-glow,
				0 0 8px $clr-mint;
		}
	}

	@media screen and (max-width: 500px) and (orientation: portrait),
		screen and (max-height: 500px) and (orientation: landscape) {
		.btn__interface :global(svg) {
			transform: scale(0.8);
		}
	}
</style>
