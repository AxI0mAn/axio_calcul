<script>
	import { base } from '$app/paths';
	import { appStore } from '$lib/store/appStore.svelte';
	import { installPwaAction } from '$lib/utils/initPwaLogic';
	import Install from '$lib/assets/svgIcon/download.svg?raw';

	let { customClass = '' } = $props();
</script>

{#if appStore.canInstall && !appStore.installed}
	<a
		href="{base}/install"
		onclick={(e) => {
			e.preventDefault(); // ЗАПРЕЩАЕМ переход по ссылке, так как вызываем системное окно
			installPwaAction();
		}}
		class="btn btn__interface installLink {customClass}"
		aria-label="Install"
	>
		{@html Install}</a
	>
{:else if !appStore.installed}
	<a
		href="{base}/install"
		class="btn btn__interface installLink {customClass}"
		aria-label="Install"
	>
		{@html Install}</a
	>
{/if}

<style lang="scss">
	// --- SCSS Переменные ---
	$accent: coral;
	$main-color: rgb(1, 217, 195); // Цвет текста
	$bg-color: rgb(15, 23, 42); // Фоновый цвет
	$bg-gradient: linear-gradient(45deg, #02427e 0%, #000d37 50%, #02273e 100%);
	$bg-gradient__op: linear-gradient(45deg, #64748b 0%, #252c35 50%, #4b5768 100%);
	$border-color: rgba(120, 180, 255, 0.8); // Цвет основной рамки
	$shadow-color-light: rgba(100, 170, 255, 0.8); // Цвет тени (яркий)
	$shadow-color-dark: rgba(100, 170, 255, 0.5); // Цвет тени (тусклый)

	// --- Hover Переменные ---
	$hover-color-dark: rgb(52, 78, 102);
	$hover-shadow-color-light: rgba(140, 200, 255, 1);
	$hover-shadow-color-dark: #0f172a;
	$hover-shift: -0.5px;

	// --- Active Переменные ---
	$hover-color-light: rgb(182, 217, 255);
	$active-scale: 0.96;
	$active-shadow-color-light: rgba(100, 170, 255, 0.7);
	$active-shadow-color-dark: $main-color;

	.btn.btn__interface.installLink {
		color: $accent;
		&:hover {
			color: $main-color;
		}
		&:active {
			background-color: transparent;
		}
	}
	.btn.btn__interface.mainHeaderInstallLink {
		color: #fff;
		border: transparent;
		box-shadow: none;
		&:hover {
			color: $bg-color;
		}
		&:active {
			background-color: transparent;
		}
	}
	.btn__interface {
		// Сброс стилей ссылки
		text-decoration: none;
		color: $hover-color-light;

		// Центрирование контента
		display: flex;
		align-items: center;
		justify-content: center;

		// Оформление
		background-color: transparent;
		border-radius: 8px;
		border: 1px solid $main-color;

		aspect-ratio: 1 / 1;
		transition:
			transform 0.1s,
			background-color 0.2s;

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				// background-color: $hover-color-light;
				transition: all 0.15s;
				color: $main-color; //$hover-shadow-color-dark;
			}
		}

		// --- Active ---
		&:active {
			// Убираем стандартную синюю/серую рамку при тапе
			-webkit-tap-highlight-color: transparent;
			// Для некоторых старых Android-браузеров может понадобиться:
			outline: none;

			opacity: 0.8;
			color: $hover-shadow-color-dark;
			background-color: $hover-color-dark;
			transform: scale($active-scale) translateY(calc(-1 * $hover-shift));
			box-shadow:
				0 0 2px $active-shadow-color-light,
				0 0 8px $active-shadow-color-dark;
		}
	}

	@media screen and (max-width: 500px) and (orientation: portrait),
		screen and (max-height: 500px) and (orientation: landscape) {
		.btn__interface :global(svg) {
			transform: scale(0.8); // Уменьшаем до 80%
		}
	}
</style>
