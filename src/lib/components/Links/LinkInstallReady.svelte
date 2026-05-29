<script>
	/**
	 * src/lib/components/Links/LinkInstallReady.svelte
	 * установить приложение, если установлено - то поделиться приложением
	 */
	// @ts-ignore
	import { base } from '$app/paths';
	import { appStore } from '$lib/store/appStore.svelte';
	import { installPwaAction } from '$lib/utils/initPwaLogic';
	import Install from '$lib/assets/svgIcon/download.svg?raw';
	// import Settings from '$lib/assets/svgIcon/settings.svg?raw';

	let { customClass = '' } = $props();
</script>

{#if appStore.canInstall && !appStore.installed}
	<a
		href="{base}/install"
		onclick={(e) => {
			e.preventDefault(); // ЗАПРЕЩАЕМ переход по ссылке, так как вызываем системное окно установки приложения
			installPwaAction();
		}}
		class="btn btn__interface installLink {customClass}"
		aria-label="Install"
	>
		{@html Install}</a
	>
{:else}
	<a
		href="{base}/install"
		class="btn btn__interface installLink {customClass}"
		aria-label="Install"
	>
		{@html Install}</a
	>
	<!-- <a href="{base}/settings" class="btn btn__interface" aria-label="Settings">{@html Settings}</a> -->
{/if}

<style lang="scss">
	// Базовый класс интерфейсной кнопки-ссылки
	.btn__interface {
		text-decoration: none;
		color: $clr-slate; // #b6d9ff;

		display: flex;
		align-items: center;
		justify-content: center;

		background-color: transparent;
		border-radius: 8px;
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

		&:active {
			-webkit-tap-highlight-color: transparent;
			outline: none;
			opacity: 0.8;
			color: $clr-bg-card;
			background-color: $shd-blue-glow;
			transform: scale(0.96) translateY(0.5px);
			box-shadow:
				0 0 2px $shd-blue-glow,
				0 0 8px $clr-mint;
		}

		// --- МОДИФИКАТОР: Ссылка установки (Coral) ---
		&.installLink {
			color: $clr-coral;

			&:hover {
				color: $clr-mint;
			}
			&:active {
				background-color: transparent; // Сохраняем твою логику прозрачности
			}
		}

		// --- МОДИФИКАТОР: Ссылка в шапке (Белая) ---
		&.mainHeaderInstallLink {
			color: $clr-text-main;
			border-color: transparent;
			box-shadow: none;

			&:hover {
				color: $clr-bg-card;
			}
			&:active {
				background-color: transparent;
			}
		}
	}

	// Адаптив для SVG внутри
	@media screen and (max-width: 500px) and (orientation: portrait),
		screen and (max-height: 500px) and (orientation: landscape) {
		.btn__interface :global(svg) {
			transform: scale(0.8);
		}
	}
</style>
